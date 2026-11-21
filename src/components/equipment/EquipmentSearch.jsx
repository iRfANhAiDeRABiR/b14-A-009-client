"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

export function EquipmentSearch({ value = "", onSearchChange }) {
  const [draftValue, setDraftValue] = React.useState(null);
  const timerRef = React.useRef(null);

  const displayValue = draftValue !== null ? draftValue : value;

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const flushSearch = React.useCallback(
    (nextValue) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      onSearchChange(nextValue);
      setDraftValue(null);
    },
    [onSearchChange]
  );

  const handleChange = (event) => {
    const next = event.target.value;
    setDraftValue(next);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearchChange(next);
      setDraftValue(null);
    }, 350);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    flushSearch(displayValue);
  };

  const handleClear = () => {
    flushSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search equipment"
      className="relative flex-1"
    >
      <label htmlFor="equipment-search-input" className="sr-only">
        Search equipment by name, category, or location
      </label>

      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
      />

      <input
        id="equipment-search-input"
        name="search"
        type="search"
        value={displayValue}
        onChange={handleChange}
        placeholder="Search equipment by name or location..."
        className="min-h-11 w-full rounded-lg border border-border bg-surface pr-10 pl-10 text-base text-foreground shadow-xs transition-colors duration-150 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
      />

      {displayValue ? (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </form>
  );
}
