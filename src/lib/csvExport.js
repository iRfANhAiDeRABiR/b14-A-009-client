/**
 * Escapes and triggers a browser CSV download cleanly using UTF-8 BOM
 * so spreadsheets display international symbols and BDT currency text accurately.
 */
export function downloadCsv(filename, columns = [], rows = []) {
  if (typeof window === "undefined" || !Array.isArray(columns) || columns.length === 0) {
    return;
  }

  const escapeCell = (raw) => {
    const str = raw === undefined || raw === null ? "" : String(raw);
    const neutralized = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
    const escaped = neutralized.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const headerLine = columns.map((col) => escapeCell(col.header)).join(",");
  const dataLines = (Array.isArray(rows) ? rows : []).map((row) =>
    columns
      .map((col) => {
        const val =
          typeof col.accessor === "function" ? col.accessor(row) : row?.[col.key];
        return escapeCell(val);
      })
      .join(",")
  );

  const csvContent = `\uFEFF${[headerLine, ...dataLines].join("\r\n")}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
