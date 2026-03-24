"use client";

/* eslint-disable react-hooks/incompatible-library */

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable<TData, TValue>({
  columns,
  data,
  variant = "light",
}: {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  variant?: "light" | "dark";
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const isDark = variant === "dark";

  return (
    <div
      className={
        isDark
          ? "space-y-4 rounded-[28px] border border-white/10 bg-white/5 p-4 text-white"
          : "space-y-4 rounded-[28px] border border-border bg-white/90 p-4"
      }
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={isDark ? "border-white/10 hover:bg-transparent" : undefined}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={isDark ? "text-white/70" : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={isDark ? "border-white/10 hover:bg-white/5" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={isDark ? "text-white/90" : undefined}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className={isDark ? "border-white/10" : undefined}>
                <TableCell
                  colSpan={columns.length}
                  className={`h-24 text-center ${isDark ? "text-white/65" : ""}`}
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className={isDark ? "text-sm text-white/60" : "text-sm text-muted-foreground"}>
          Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={
              isDark
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                : undefined
            }
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={
              isDark
                ? "border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                : undefined
            }
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
