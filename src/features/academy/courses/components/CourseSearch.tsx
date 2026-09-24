"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Loader2 } from "lucide-react";

export function CourseSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") ?? "";
  const currentStatus = searchParams.get("status") ?? "all";

  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const [status, setStatus] = useState(currentStatus);

  const applyFilters = (newSearch?: string, newStatus?: string) => {
    const s = newSearch !== undefined ? newSearch : searchTerm;
    const st = newStatus !== undefined ? newStatus : status;

    const params = new URLSearchParams(searchParams.toString());
    if (s && s.trim()) {
      params.set("search", s.trim());
    } else {
      params.delete("search");
    }

    if (st && st !== "all") {
      params.set("status", st);
    } else {
      params.delete("status");
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setStatus("all");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(currentSearch || (currentStatus && currentStatus !== "all"));

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by course name, duration, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyFilters();
            }
          }}
          className="pl-9 pr-8"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              applyFilters("");
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            title="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <Select
        value={status}
        onValueChange={(val) => {
          setStatus(val);
          applyFilters(undefined, val);
        }}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="ACTIVE">Active</SelectItem>
          <SelectItem value="INACTIVE">Inactive</SelectItem>
          <SelectItem value="ARCHIVED">Archived</SelectItem>
        </SelectContent>
      </Select>

      {/* Explicit Search Button */}
      <Button
        onClick={() => applyFilters()}
        disabled={isPending}
        className="shrink-0"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
        ) : (
          <Search className="h-4 w-4 mr-1.5" />
        )}
        Search
      </Button>

      {/* Reset/Clear All Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="default"
          onClick={handleClear}
          disabled={isPending}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Reset
        </Button>
      )}
    </div>
  );
}
