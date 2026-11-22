"use client";

import * as React from "react";
import {
  AlertCircle,
  Download,
  Eye,
  Pencil,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
  Users,
} from "lucide-react";

import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/hooks/useAuth";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import {
  ADMIN_ASSIGNABLE_ROLES,
  formatDisplayDate,
  getAccountStatusBadge,
  getRoleBadgeVariant,
} from "@/lib/adminUtils";
import { downloadCsv } from "@/lib/csvExport";
import {
  deleteAdminUser,
  updateAdminUserDetails,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "@/services/adminUserService";
import { UserDeleteDialog } from "@/components/admin/users/UserDeleteDialog";
import { UserDetailsModal } from "@/components/admin/users/UserDetailsModal";
import { UserEditModal } from "@/components/admin/users/UserEditModal";
import { UserFilters } from "@/components/admin/users/UserFilters";
import { UserRoleDialog } from "@/components/admin/users/UserRoleDialog";
import { UserStatusDialog } from "@/components/admin/users/UserStatusDialog";
import { EquipmentPagination } from "@/components/equipment/EquipmentPagination";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

function UsersTableSkeleton() {
  return (
    <Card padding="none" className="overflow-hidden rounded-2xl">
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="flex items-center gap-4 p-4 sm:px-6">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export function AdminUsersTable() {
  const { showToast } = useToast();
  const { user: currentAdmin, token, getToken } = useAuth();
  const {
    filters,
    items,
    pagination,
    error,
    errorStatus,
    loading,
    hasActiveFilters,
    updateFilters,
    clearFilters,
    setPage,
    retry,
    applyUpdatedUserRole,
    applyUpdatedUser,
    removeUserFromList,
  } = useAdminUsers();

  const [detailsTarget, setDetailsTarget] = React.useState(null);
  const [pendingRoleChange, setPendingRoleChange] = React.useState(null);
  const [statusTarget, setStatusTarget] = React.useState(null);
  const [editTarget, setEditTarget] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);
  const [isUpdatingRole, setIsUpdatingRole] = React.useState(false);
  const [isMutatingUser, setIsMutatingUser] = React.useState(false);

  const isAuthError = errorStatus === 401 || errorStatus === 403;

  const resolveToken = async () =>
    token || (typeof getToken === "function" ? await getToken() : null);

  const handleExportCsv = () => {
    downloadCsv(
      `gearnest-users-${new Date().toISOString().slice(0, 10)}.csv`,
      [
        { header: "User ID", key: "_id" },
        { header: "Name", key: "name" },
        { header: "Email", key: "email" },
        { header: "Role", key: "role" },
        {
          header: "Status",
          accessor: (row) => row.accountStatus || "Active",
        },
        { header: "Phone", key: "phone" },
        {
          header: "Registered At",
          accessor: (row) => formatDisplayDate(row.createdAt),
        },
      ],
      items
    );
  };

  const handleSelectNewRole = (targetUser, selectedRole) => {
    if (!targetUser || !selectedRole || selectedRole === targetUser.role) {
      return;
    }
    setPendingRoleChange({
      user: targetUser,
      currentRole: targetUser.role,
      nextRole: selectedRole,
    });
  };

  const handleConfirmRoleChange = async () => {
    if (!pendingRoleChange?.user || isUpdatingRole) return;

    const { user: targetUser, nextRole } = pendingRoleChange;
    setIsUpdatingRole(true);

    try {
      const activeToken =
        token || (typeof getToken === "function" ? await getToken() : null);

      const response = await updateAdminUserRole(targetUser._id, nextRole, {
        token: activeToken,
      });

      const resolvedRole = response?.data?.role || nextRole;
      applyUpdatedUserRole(targetUser._id, resolvedRole);
      setPendingRoleChange(null);

      showToast({
        title: "User role updated",
        description:
          typeof response?.message === "string" && response.message.trim()
            ? response.message.trim()
            : `${targetUser.name} is now assigned the ${resolvedRole} role.`,
        variant: "success",
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to update user role on the backend.";
      showToast({
        title: "Role update failed",
        description: message,
        variant: "error",
      });
      setPendingRoleChange(null);
    } finally {
      setIsUpdatingRole(false);
    }
  };

  const handleConfirmStatusUpdate = async ({ status, reason }) => {
    if (!statusTarget?._id || isMutatingUser) return;
    setIsMutatingUser(true);
    try {
      const activeToken = await resolveToken();
      const response = await updateAdminUserStatus(
        statusTarget._id,
        { status, reason },
        { token: activeToken }
      );
      if (response?.data) {
        applyUpdatedUser({
          ...statusTarget,
          ...response.data,
          _id: response.data.id || statusTarget._id,
        });
      } else {
        retry();
      }
      setStatusTarget(null);
      showToast({
        title: "Account access updated",
        description: `${statusTarget.name} is now marked as ${status}.`,
        variant: status === "Active" ? "success" : "neutral",
      });
    } catch (err) {
      showToast({
        title: "Status update failed",
        description:
          err instanceof Error
            ? err.message
            : "Unable to update user account status.",
        variant: "error",
      });
    } finally {
      setIsMutatingUser(false);
    }
  };

  const handleConfirmUserEdit = async (fields) => {
    if (!editTarget?._id || isMutatingUser) return;
    setIsMutatingUser(true);
    try {
      const activeToken = await resolveToken();
      const response = await updateAdminUserDetails(editTarget._id, fields, {
        token: activeToken,
      });
      if (response?.data) {
        applyUpdatedUser({
          ...editTarget,
          ...response.data,
          _id: response.data.id || editTarget._id,
        });
      } else {
        retry();
      }
      setEditTarget(null);
      showToast({
        title: "User details updated",
        description: `Saved profile updates for ${fields.name}.`,
        variant: "success",
      });
    } catch (err) {
      showToast({
        title: "Update failed",
        description:
          err instanceof Error ? err.message : "Unable to update user profile.",
        variant: "error",
      });
    } finally {
      setIsMutatingUser(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteTarget?._id || isMutatingUser) return;
    setIsMutatingUser(true);
    try {
      const activeToken = await resolveToken();
      await deleteAdminUser(deleteTarget._id, { token: activeToken });
      removeUserFromList(deleteTarget._id);
      setDeleteTarget(null);
      retry();
      showToast({
        title: "User account removed",
        description: `${deleteTarget.name} was archived and active sessions revoked.`,
        variant: "success",
      });
    } catch (err) {
      showToast({
        title: "Removal failed",
        description:
          err instanceof Error ? err.message : "Unable to remove user account.",
        variant: "error",
      });
    } finally {
      setIsMutatingUser(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="type-page-title text-foreground">User Management</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
            Manage registered users, monitor account information and control platform access.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!loading && !error ? (
            <span
              role="status"
              aria-atomic="true"
              className="inline-flex items-center rounded-full border border-primary/20 bg-secondary px-3 py-1 text-xs font-semibold text-primary tabular-nums"
            >
              {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "user" : "users"}
            </span>
          ) : null}

          <Button
            variant="outline"
            size="md"
            disabled={loading || items.length === 0}
            onClick={handleExportCsv}
          >
            <Download aria-hidden="true" className="size-4" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            disabled={loading}
            onClick={retry}
          >
            <RefreshCw
              aria-hidden="true"
              className={`size-4 ${loading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </Button>
        </div>
      </header>

      <UserFilters
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        disabled={loading}
      />

      {error && !loading ? (
        <div
          role="alert"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
            isAuthError
              ? "border-danger-border bg-danger-bg text-danger"
              : "border-warning-border bg-warning-bg text-warning"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isAuthError ? (
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            ) : (
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
            )}
            <span>{error}</span>
          </div>

          <div className="flex items-center gap-2">
            {errorStatus === 401 ? (
              <Button
                href="/login?callbackURL=%2Fdashboard%2Fadmin%2Fusers"
                variant="outline"
                size="sm"
              >
                Sign In
              </Button>
            ) : null}
            <Button variant="outline" size="sm" onClick={retry}>
              <RefreshCw aria-hidden="true" className="size-3.5" />
              <span>Retry</span>
            </Button>
          </div>
        </div>
      ) : null}

      {loading ? (
        <UsersTableSkeleton />
      ) : items.length === 0 ? (
        <Card padding="lg" className="rounded-2xl text-center">
          <span
            aria-hidden="true"
            className="mx-auto flex size-14 items-center justify-center rounded-xl bg-secondary text-primary"
          >
            <Users className="size-7" />
          </span>

          <h2 className="mt-4 font-heading text-xl font-bold text-foreground">
            {hasActiveFilters
              ? "No users match your selected filters."
              : "No users found"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
            {hasActiveFilters
              ? "Adjust your search query or selected role filter to locate other accounts."
              : "Registered user accounts returned by the backend directory will display here."}
          </p>

          {hasActiveFilters ? (
            <div className="mt-6">
              <Button variant="outline" size="md" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : null}
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Desktop & Tablet Table */}
          <Card
            padding="none"
            className="hidden overflow-hidden rounded-2xl md:block"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-background text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th scope="col" className="px-5 py-3.5">
                      User Name
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Email
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3.5">
                      Registered
                    </th>
                    <th scope="col" className="px-5 py-3.5 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border bg-surface">
                  {items.map((account) => {
                    const isCurrentSessionUser = Boolean(
                      currentAdmin?.email &&
                        account.email &&
                        currentAdmin.email.toLowerCase() ===
                          account.email.toLowerCase()
                    );

                    return (
                      <tr
                        key={account._id || account.email}
                        className="transition-colors hover:bg-surface-subtle/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {account.photoURL ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={account.photoURL}
                                alt={`${account.name} avatar`}
                                className="size-10 shrink-0 rounded-full border border-border bg-surface-subtle object-cover"
                              />
                            ) : (
                              <span
                                aria-hidden="true"
                                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                              >
                                <User className="size-4" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="truncate font-heading font-semibold text-foreground">
                                {account.name}
                              </p>
                              {isCurrentSessionUser ? (
                                <span className="text-[11px] font-medium text-primary">
                                  Current session
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-text-secondary">
                          {account.email || "—"}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <Badge
                            variant={getRoleBadgeVariant(account.role)}
                            dot
                            size="sm"
                          >
                            {account.role}
                          </Badge>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          {(() => {
                            const statusBadge = getAccountStatusBadge(
                              account.accountStatus
                            );
                            return (
                              <Badge
                                variant={statusBadge.variant}
                                dot
                                size="sm"
                              >
                                {statusBadge.label}
                              </Badge>
                            );
                          })()}
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap text-text-secondary">
                          {formatDisplayDate(account.createdAt)}
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            <label
                              htmlFor={`role-select-${account._id}`}
                              className="sr-only"
                            >
                              Change role for {account.name}
                            </label>
                            <select
                              id={`role-select-${account._id}`}
                              value={account.role}
                              disabled={isUpdatingRole || isCurrentSessionUser}
                              onChange={(e) =>
                                handleSelectNewRole(account, e.target.value)
                              }
                              className="min-h-9 cursor-pointer rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {ADMIN_ASSIGNABLE_ROLES.map((roleOption) => (
                                <option key={roleOption} value={roleOption}>
                                  {roleOption}
                                </option>
                              ))}
                            </select>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDetailsTarget(account)}
                              aria-label={`View details for ${account.name}`}
                            >
                              <Eye aria-hidden="true" className="size-3.5" />
                              <span>View</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditTarget(account)}
                              aria-label={`Edit details for ${account.name}`}
                            >
                              <Pencil aria-hidden="true" className="size-3.5" />
                              <span>Edit</span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isCurrentSessionUser || isMutatingUser}
                              onClick={() => setStatusTarget(account)}
                              aria-label={`Manage access status for ${account.name}`}
                              className={
                                String(account.accountStatus || "Active") !==
                                "Active"
                                  ? "border-primary/40 text-primary hover:bg-secondary"
                                  : "border-warning-border text-warning hover:bg-warning-bg"
                              }
                            >
                              {String(account.accountStatus || "Active") !==
                              "Active" ? (
                                <ShieldCheck
                                  aria-hidden="true"
                                  className="size-3.5"
                                />
                              ) : (
                                <ShieldAlert
                                  aria-hidden="true"
                                  className="size-3.5"
                                />
                              )}
                              <span>
                                {String(account.accountStatus || "Active") !==
                                "Active"
                                  ? "Activate"
                                  : "Suspend"}
                              </span>
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isCurrentSessionUser || isMutatingUser}
                              onClick={() => setDeleteTarget(account)}
                              aria-label={`Remove ${account.name}`}
                              className="border-danger-border text-danger hover:border-danger hover:bg-danger-bg"
                            >
                              <Trash2 aria-hidden="true" className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <EquipmentPagination
              pagination={pagination}
              onPageChange={setPage}
              itemLabel="users"
              ariaLabel="User directory pagination"
              className="border-t border-border bg-background px-5 py-4"
            />
          </Card>

          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {items.map((account) => {
              const isCurrentSessionUser = Boolean(
                currentAdmin?.email &&
                  account.email &&
                  currentAdmin.email.toLowerCase() ===
                    account.email.toLowerCase()
              );
              const statusBadge = getAccountStatusBadge(account.accountStatus);
              return (
                <Card
                  key={account._id || `${account.email}-mobile`}
                  padding="md"
                  className="space-y-3 rounded-2xl"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {account.photoURL ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={account.photoURL}
                          alt={`${account.name} avatar`}
                          className="size-11 shrink-0 rounded-full border border-border bg-surface-subtle object-cover"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"
                        >
                          <User className="size-5" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-heading text-sm font-bold text-foreground">
                          {account.name}
                        </p>
                        <p className="truncate text-xs text-text-secondary">
                          {account.email || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={getRoleBadgeVariant(account.role)}
                        dot
                        size="sm"
                      >
                        {account.role}
                      </Badge>
                      <Badge variant={statusBadge.variant} size="sm">
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs text-text-secondary">
                    <span>Registered: {formatDisplayDate(account.createdAt)}</span>
                    {isCurrentSessionUser ? (
                      <span className="font-semibold text-primary">
                        Current session
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                    <select
                      aria-label={`Change role for ${account.name}`}
                      value={account.role}
                      disabled={isUpdatingRole || isCurrentSessionUser}
                      onChange={(e) =>
                        handleSelectNewRole(account, e.target.value)
                      }
                      className="min-h-9 cursor-pointer rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
                    >
                      {ADMIN_ASSIGNABLE_ROLES.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleOption}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailsTarget(account)}
                      >
                        <Eye aria-hidden="true" className="size-3.5" />
                        <span>View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditTarget(account)}
                      >
                        <Pencil aria-hidden="true" className="size-3.5" />
                        <span>Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isCurrentSessionUser || isMutatingUser}
                        onClick={() => setStatusTarget(account)}
                      >
                        <ShieldAlert aria-hidden="true" className="size-3.5" />
                        <span>
                          {String(account.accountStatus || "Active") !==
                          "Active"
                            ? "Activate"
                            : "Suspend"}
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isCurrentSessionUser || isMutatingUser}
                        onClick={() => setDeleteTarget(account)}
                        aria-label={`Remove ${account.name}`}
                        className="border-danger-border text-danger hover:bg-danger-bg"
                      >
                        <Trash2 aria-hidden="true" className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {pagination.totalPages > 1 ? (
              <Card padding="none" className="overflow-hidden rounded-2xl">
                <EquipmentPagination
                  pagination={pagination}
                  onPageChange={setPage}
                  itemLabel="users"
                  ariaLabel="User directory pagination"
                  className="px-4 py-4"
                />
              </Card>
            ) : null}
          </div>
        </div>
      )}

      <UserRoleDialog
        pendingChange={pendingRoleChange}
        onClose={() => {
          if (!isUpdatingRole) setPendingRoleChange(null);
        }}
        onConfirm={handleConfirmRoleChange}
        isUpdating={isUpdatingRole}
      />

      <UserDetailsModal
        userRecord={detailsTarget}
        isSelf={Boolean(
          detailsTarget?.email &&
            currentAdmin?.email &&
            detailsTarget.email.toLowerCase() === currentAdmin.email.toLowerCase()
        )}
        onEdit={(u) => setEditTarget(u)}
        onStatusAction={(u) => setStatusTarget(u)}
        onDelete={(u) => setDeleteTarget(u)}
        onClose={() => setDetailsTarget(null)}
      />

      <UserStatusDialog
        targetUser={statusTarget}
        isUpdating={isMutatingUser}
        onClose={() => !isMutatingUser && setStatusTarget(null)}
        onConfirm={handleConfirmStatusUpdate}
      />

      <UserEditModal
        targetUser={editTarget}
        isSaving={isMutatingUser}
        onClose={() => !isMutatingUser && setEditTarget(null)}
        onConfirm={handleConfirmUserEdit}
      />

      <UserDeleteDialog
        targetUser={deleteTarget}
        isDeleting={isMutatingUser}
        onClose={() => !isMutatingUser && setDeleteTarget(null)}
        onConfirm={handleConfirmDeleteUser}
      />
    </div>
  );
}
