"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, Trash2, Plus, GripVertical, Eye, View } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SearchInput from "../search-input/search-input";
import Pagination from "../pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Pagination as PaginationType } from "@/types/types";

interface Column {
  id: string;
  title?: string;
  accessorKey?: string;
  visible?: boolean;
  render?: (value: any) => React.ReactNode;
}

interface DataTableProps<
  TData extends { id: string; order_number: number },
  TValue
> {
  columns: Column[];
  data: TData[];
  loading?: boolean;
  title?: string;
  subtitle?: string;
  searchable?: boolean;
  onAdd?: () => void;
  handleClear?: () => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  onView?: (row: TData) => void;
  onReorder?: (id: string, targetRowIndex: number) => void;
  allowReordering?: boolean;
  onSearch?: (query: string) => void;
  totalPages: number;
  pageNumber: number;
  basePath?: string;
  renderViewContent?: (data: TData) => React.ReactNode;
  pagination?: PaginationType;
}

export function DataTable<
  TData extends { id: string; order_number: number },
  TValue
>({
  columns,
  data,
  loading = false,
  title,
  subtitle,
  onAdd,
  onEdit,
  onDelete,
  onView,
  onReorder,
  handleClear,
  searchable,
  onSearch,
  totalPages,
  pageNumber,
  allowReordering,
  basePath,
  renderViewContent,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [targetRowIndex, setTargetRowIndex] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const table = useReactTable({
    data,
    columns: columns.map((column) => ({
      ...column,
      columnDef: {
        header: column.title,
        cell: (info: any) =>
          column.render ? column.render(info.value) : info.value,
      },
    })),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setTargetRowIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedItemId && onReorder) {
      // Find the dragged item's current position
      const draggedItem = data.find(item => item.id === draggedItemId);
      if (draggedItem) {
        const currentPosition = draggedItem.order_number;
        const newPosition = targetIndex + 1; // +1 because order_number is 1-based
        
        // Only reorder if position actually changed
        if (currentPosition !== newPosition) {
          onReorder(draggedItemId, newPosition);
        }
      }
    }
    
    // Reset drag state
    setDraggedItemId(null);
    setTargetRowIndex(null);
  };

  const handleDragEnd = () => {
    // Clean up drag state
    setDraggedItemId(null);
    setTargetRowIndex(null);
  };

  const handleView = (row: TData) => {
    setSelectedRow(row.id);
    setIsViewModalOpen(true);
  };

  const getTotalColumns = () => {
    let total = columns.length;
    if (allowReordering) total += 1;
    if (onEdit || onDelete || onView) total += 1;
    return total;
  };

  return (
    <>
        <Card className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Add New
            </Button>
          )}
        </div>

        {searchable && (
          <div className="flex items-center py-4">
            <SearchInput handleClear={handleClear} onSearch={onSearch} />
          </div>
        )}

        <div className="rounded-md border w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {allowReordering && <TableHead className="w-[50px]" />}
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <TableHead className="w-[150px]">Actions</TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: getTotalColumns() }).map(
                      (_, colIndex) => (
                        <TableCell key={colIndex}>
                          <Skeleton className="h-6 w-full bg-slate-200" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    draggable={allowReordering}
                    onDragStart={(e) => handleDragStart(e, row.original.id)}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      targetRowIndex === index && draggedItemId && "border-t-2 border-primary",
                      draggedItemId === row.original.id && "opacity-50",
                      "transition-colors hover:bg-muted/50"
                    )}
                  >
                    {allowReordering && (
                      <TableCell>
                        <div className="cursor-grab active:cursor-grabbing">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {(onEdit || onDelete || onView) && (
                      <TableCell>
                        <div className="flex gap-2">
                          {onView && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(row.original)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          {onEdit && (
                            <Button
                              className="text-blue-500"
                              variant="outline"
                              size="sm"
                              onClick={() => onEdit(row.original)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              className="text-red-500"
                              variant="outline"
                              size="sm"
                              onClick={() => onDelete(row.original)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (allowReordering ? 1 : 0) +
                      (onEdit || onDelete || onView ? 1 : 0)
                    }
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {
          pagination && (
            <Pagination
          currentPage={pageNumber}
          totalPages={totalPages}
          basePath={basePath}
          hasNext={pagination.has_next}
          hasPrevious={pagination.has_previous}
          />
          )
        }

        
      </Card>

    </>
  );
}