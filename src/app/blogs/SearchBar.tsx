"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { TbSearch } from "react-icons/tb";
import { useDebounceCallback } from "usehooks-ts";

const SORT_OPTIONS = [
  { label: "Creation date", value: "createdAt" },
  { label: "Occurrence date", value: "date" },
] as const;

export type BlogSortField = (typeof SORT_OPTIONS)[number]["value"];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") ?? "";
  const currentSort = (searchParams.get("sort") ??
    "createdAt") as BlogSortField;

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const debouncedSearch = useDebounceCallback(
    (value: string) => updateParams({ search: value }),
    300,
  );

  return (
    <div className="flex gap-2 mb-4">
      <label className="input input-bordered flex items-center gap-2 flex-1 invisible">
        <TbSearch />
        <input
          type="text"
          className="grow"
          placeholder="Search blogs..."
          defaultValue={currentSearch}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </label>
      <select
        className="select select-bordered"
        value={currentSort}
        onChange={(e) => updateParams({ sort: e.target.value })}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
