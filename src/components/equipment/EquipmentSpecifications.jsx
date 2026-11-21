import { Layers, MapPin, PackageCheck, Tag } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function EquipmentSpecifications({ equipment }) {
  const baseSpecs = [
    { label: "Category", value: equipment.category, Icon: Tag },
    { label: "Rental Type", value: equipment.rentalType, Icon: Layers },
    {
      label: "Available Quantity",
      value: `${equipment.availableQuantity} ${
        equipment.availableQuantity === 1 ? "unit" : "units"
      }`,
      Icon: PackageCheck,
    },
    { label: "Location", value: equipment.location, Icon: MapPin },
  ];

  if (equipment.brand) {
    baseSpecs.push({ label: "Brand", value: equipment.brand, Icon: Tag });
  }
  if (equipment.model) {
    baseSpecs.push({ label: "Model", value: equipment.model, Icon: Layers });
  }
  if (equipment.condition) {
    baseSpecs.push({
      label: "Condition",
      value: equipment.condition,
      Icon: PackageCheck,
    });
  }

  const extraSpecs = Array.isArray(equipment.specifications)
    ? equipment.specifications
    : [];

  return (
    <Card className="rounded-2xl">
      <h2 className="type-card-title text-foreground">
        Equipment Specifications
      </h2>
      <p className="mt-1 text-sm text-text-secondary">
        Key technical details and rental unit specifications.
      </p>

      <dl className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {baseSpecs.map((spec) => {
          const Icon = spec.Icon;
          return (
            <div
              key={spec.label}
              className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary"
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <dt className="text-xs font-medium text-text-secondary">
                  {spec.label}
                </dt>
                <dd className="mt-0.5 font-heading text-sm font-semibold text-foreground">
                  {spec.value}
                </dd>
              </div>
            </div>
          );
        })}

        {extraSpecs.map((spec) => (
          <div
            key={spec.label}
            className="rounded-xl border border-border bg-background px-4 py-3"
          >
            <dt className="text-xs font-medium text-text-secondary">
              {spec.label}
            </dt>
            <dd className="mt-0.5 font-heading text-sm font-semibold text-foreground">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
