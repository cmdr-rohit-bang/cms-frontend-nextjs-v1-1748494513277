// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Edit,
//   Trash2,
//   Plus,
//   GripVertical,
//   Eye,
//   View,
//   Upload,
//   Download,
//   Trash,
// } from "lucide-react";
// import { useState } from "react";
// import { cn } from "@/lib/utils";
// import SearchInput from "../search-input/search-input";
// import Pagination from "../pagination/pagination";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Card } from "@/components/ui/card";
// import { Pagination as PaginationType } from "@/types/types";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectValue,
//   SelectTrigger,
//   SelectItem,
//   SelectContent,
// } from "@/components/ui/select";

// interface Column {
//   id: string;
//   header?: string;
//   accessorKey?: string;
//   visible?: boolean;
//   render?: (value: any, row: any) => React.ReactNode;
// }

// interface DataTableProps<
//   TData extends { id: string; order_number: number },
//   TValue
// > {
//   columns: Column[];
//   data: TData[];
//   loading?: boolean;
//   title?: string;
//   subtitle?: string;
//   searchable?: boolean;
//   onAdd?: () => void;
//   handleClear?: () => void;
//   onEdit?: (row: TData) => void;
//   onDelete?: (row: TData) => void;

//   onDeleteMultiple?: (ids: string[]) => void;
//   onView?: (row: TData) => void;
//   onReorder?: (id: string, targetRowIndex: number) => void;
//   allowReordering?: boolean;
//   onSearch?: (query: string) => void;
//   totalPages: number;
//   pageNumber: number;
//   basePath?: string;
//   renderViewContent?: (data: TData) => React.ReactNode;
//   pagination?: PaginationType;
//   onImport?: () => void;
//   onExport?: () => void;
//   pageSize?: number;
//   onPageChange?: (page: number) => void;
//   onPageSizeChange?: (pageSize: number) => void;
//   allowSelection?: boolean;
//   onAddTags?: (ids: string[]) => void;
//   onRemoveTags?: (ids: string[]) => void;
//   onAddCustomField?: (ids: string[]) => void;
// }

// export function DataTable<
//   TData extends { id: string; order_number: number },
//   TValue
// >({
//   columns,
//   data,
//   loading = false,
//   title,
//   subtitle,
//   onAdd,
//   onEdit,
//   onView,
//   onReorder,
//   handleClear,
//   searchable,
//   onSearch,
//   totalPages,
//   pageNumber,
//   allowReordering,
//   pageSize,
//   onPageChange,
//   onPageSizeChange,
//   allowSelection = false,
//   onDelete,
//   onDeleteMultiple,
//   onImport,
//   onExport,
//   renderViewContent,
//   pagination,
//   onAddTags,
//   onRemoveTags,
//   onAddCustomField,
// }: DataTableProps<TData, TValue>) {
//   const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
//   const [targetRowIndex, setTargetRowIndex] = useState<number | null>(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<string | null>(null);
//   const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

//   const buildTableColumns = () => {
//     const tableColumns: any[] = [];

//     // Add selection column if enabled
//     if (allowSelection) {
//       tableColumns.push({
//         id: "select",
//         header: () => (
//           <Checkbox
//             checked={isAllSelected}
//             ref={(el) => {
//               if (el) (el as HTMLInputElement).indeterminate = isIndeterminate;
//             }}
//             onCheckedChange={handleSelectAll}
//             aria-label="Select all"
//           />
//         ),
//         cell: ({ row }: { row: any }) => (
//           <Checkbox
//             checked={selectedRows.has(row.original.id)}
//             onCheckedChange={(checked) =>
//               handleSelectRow(row.original.id, checked as boolean)
//             }
//             aria-label={`Select row ${row.original.id}`}
//           />
//         ),
//         enableSorting: false,
//         enableHiding: false,
//       });
//     }

//     // Add reordering column if enabled
//     if (allowReordering) {
//       tableColumns.push({
//         id: "reorder",
//         header: "",
//         cell: () => (
//           <div className="cursor-grab active:cursor-grabbing">
//             <GripVertical className="h-4 w-4 text-muted-foreground" />
//           </div>
//         ),
//         enableSorting: false,
//         enableHiding: false,
//       });
//     }

//     // Add data columns
//     columns.forEach((column) => {
//       tableColumns.push({
//         id: column.id,
//         accessorKey: column.accessorKey,
//         header: column.header,
//         cell: (info: any) => {
//           const value = info.getValue();
//           const row = info.row.original;
//           return column.render ? column.render(value, row) : value;
//         },
//       });
//     });

//     if (onEdit || onDelete || onView) {
//       tableColumns.push({
//         id: "actions",
//         header: "Actions",
//         cell: ({ row }: { row: any }) => (
//           <div className="flex gap-2">
//             {onView && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleView(row.original)}
//               >
//                 <Eye className="h-4 w-4" />
//               </Button>
//             )}
//             {onEdit && (
//               <Button
//                 className="text-blue-500"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onEdit(row.original)}
//               >
//                 <Edit className="h-4 w-4" />
//               </Button>
//             )}
//             {onDelete && (
//               <Button
//                 className="text-red-500"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => onDelete(row.original)}
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             )}
//           </div>
//         ),
//         enableSorting: false,
//         enableHiding: false,
//       });
//     }

//     return tableColumns;
//   };

//   const table = useReactTable({
//     data,
//     columns: buildTableColumns(),
//     getCoreRowModel: getCoreRowModel(),
//   });

//   const handleDragStart = (e: React.DragEvent, id: string) => {
//     setDraggedItemId(id);
//     e.dataTransfer.effectAllowed = "move";
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.dataTransfer.dropEffect = "move";
//   };

//   const handleDragEnter = (e: React.DragEvent, index: number) => {
//     e.preventDefault();
//     setTargetRowIndex(index);
//   };

//   const handleDrop = (e: React.DragEvent, targetIndex: number) => {
//     e.preventDefault();

//     if (draggedItemId && onReorder) {
//       // Find the dragged item's current position
//       const draggedItem = data.find((item) => item.id === draggedItemId);
//       if (draggedItem) {
//         const currentPosition = draggedItem.order_number;
//         const newPosition = targetIndex + 1; // +1 because order_number is 1-based

//         // Only reorder if position actually changed
//         if (currentPosition !== newPosition) {
//           onReorder(draggedItemId, newPosition);
//         }
//       }
//     }

//     // Reset drag state
//     setDraggedItemId(null);
//     setTargetRowIndex(null);
//   };

//   const handleDragEnd = () => {
//     // Clean up drag state
//     setDraggedItemId(null);
//     setTargetRowIndex(null);
//   };

//   const handleView = (row: TData) => {
//     setSelectedRow(row.id);
//     setIsViewModalOpen(true);
//   };

//   const getTotalColumns = () => {
//     let total = columns.length;
//     if (allowReordering) total += 1;
//     if (onEdit || onDelete || onView) total += 1;
//     return total;
//   };

//   const handleSelectRow = (rowId: string, isSelected: boolean) => {
//     const newSelectedRows = new Set(selectedRows);
//     if (isSelected) {
//       newSelectedRows.add(rowId);
//     } else {
//       newSelectedRows.delete(rowId);
//     }
//     setSelectedRows(newSelectedRows);
//   };

//   const handleSelectAll = (isSelected: boolean) => {
//     if (isSelected) {
//       setSelectedRows(new Set(data.map((row) => row.id)));
//     } else {
//       setSelectedRows(new Set());
//     }
//   };

//   const handleAddTags = () => {
//     if (onAddTags && selectedRows.size > 0) {
//       onAddTags(Array.from(selectedRows));
//       setSelectedRows(new Set());
//     }
//   };

//   const handleRemoveTags = () => {
//     if (onRemoveTags && selectedRows.size > 0) {
//       onRemoveTags(Array.from(selectedRows));
//       setSelectedRows(new Set());
//     }
//   };

//   const handleAddCustomField = () => {
//     if (onAddCustomField && selectedRows.size > 0) {
//       onAddCustomField(Array.from(selectedRows));
//       setSelectedRows(new Set());
//     }
//   };

//   const handleDeleteSelected = () => {
//     if (onDeleteMultiple && selectedRows.size > 0) {
//       onDeleteMultiple(Array.from(selectedRows));
//       setSelectedRows(new Set());
//     }
//   };

//   const isAllSelected = data.length > 0 && selectedRows.size === data.length;
//   const isIndeterminate =
//     selectedRows.size > 0 && selectedRows.size < data.length;

//   const handleAction = (value: string) => {
//     switch (value) {
//       case "delete-selected":
//         handleDeleteSelected();
//         break;
//       case "add-tags":
//         handleAddTags();
//         break;
//       case "remove-tags":
//         handleRemoveTags();
//         break;
//       case "add-custom-field":
//         handleAddCustomField();
//         break;
//     }
//   };

//   return (
//     <>
//       <Card className="space-y-4 p-4">
//         <div className="flex items-center justify-between">
//           <div>
//             {title && (
//               <h2 className="text-2xl font-bold text-foreground">{title}</h2>
//             )}
//             {subtitle && (
//               <p className="text-sm text-muted-foreground">{subtitle}</p>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             {allowSelection && selectedRows.size > 0 && onDeleteMultiple && (
//               <Select onValueChange={handleAction}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Please select an action" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem disabled defaultChecked={true} value="none">
//                     Please select an action
//                   </SelectItem>
//                   <SelectItem value="delete-selected">
//                     Delete Selected ({selectedRows.size})
//                   </SelectItem>
//                   <SelectItem value="add-tags">Add Tags</SelectItem>
//                   <SelectItem value="remove-tags">Remove Tags</SelectItem>
//                   <SelectItem value="add-custom-field">
//                     Add Custom Field
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             )}
//             {onImport && (
//               <Button onClick={onImport} variant="outline">
//                 <Upload className="mr-2 h-4 w-4" />
//                 Import
//               </Button>
//             )}
//             {onExport && (
//               <Button onClick={onExport} variant="outline">
//                 <Download className="mr-2 h-4 w-4" />
//                 Export
//               </Button>
//             )}
//             {onAdd && (
//               <Button onClick={onAdd}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add New
//               </Button>
//             )}
//           </div>
//         </div>

//         {searchable && (
//           <div className="flex items-center py-4">
//             <SearchInput handleClear={handleClear} onSearch={onSearch} />
//           </div>
//         )}

//         <div className="rounded-md border w-full">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id} className="text-foreground">
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 Array.from({ length: 5 }).map((_, rowIndex) => (
//                   <TableRow key={rowIndex}>
//                     {Array.from({ length: table.getAllColumns().length }).map(
//                       (_, colIndex) => (
//                         <TableCell key={colIndex}>
//                           <Skeleton className="h-6 w-full bg-slate-200" />
//                         </TableCell>
//                       )
//                     )}
//                   </TableRow>
//                 ))
//               ) : table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row, index) => (
//                   <TableRow
//                     key={row.id}
//                     draggable={allowReordering}
//                     onDragStart={(e) => handleDragStart(e, row.original.id)}
//                     onDragOver={handleDragOver}
//                     onDragEnter={(e) => handleDragEnter(e, index)}
//                     onDrop={(e) => handleDrop(e, index)}
//                     onDragEnd={handleDragEnd}
//                     className={cn(
//                       targetRowIndex === index &&
//                         draggedItemId &&
//                         "border-t-2 border-primary",
//                       draggedItemId === row.original.id && "opacity-50",
//                       selectedRows.has(row.original.id) && "bg-muted/50",
//                       "transition-colors hover:bg-muted/50"
//                     )}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext()
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={table.getAllColumns().length}
//                     className="h-24 text-center text-muted-foreground"
//                   >
//                     No results.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//         {pagination && (
//           <Pagination
//             currentPage={pageNumber}
//             totalPages={totalPages}
//             hasNext={pagination.has_next}
//             hasPrevious={pagination.has_previous}
//             onPageChange={onPageChange}
//             onPageSizeChange={onPageSizeChange}
//             pageSize={pageSize}
//           />
//         )}
//       </Card>
//     </>
//   );
// }


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
import {
  Edit,
  Trash2,
  Plus,
  GripVertical,
  Eye,
  Upload,
  Download,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import SearchInput from "../search-input/search-input";
import Pagination from "../pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Pagination as PaginationType } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

interface Column {
  id: string;
  header?: string;
  accessorKey?: string;
  visible?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

// Simple Selection Action Interface
interface SelectionAction {
  id: string;
  label: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  showCount?: boolean;
  action: (selectedIds: string[]) => void;
}

// Selection Configuration - Two clear options
interface SelectionConfig {
  enabled: boolean;
  
  // Option 1: Simple Selection with dropdown actions
  actions?: SelectionAction[];
  
  // Option 2: Custom Bulk Actions Component
  customBulkActionsComponent?: (
    selectedIds: string[], 
    clearSelection: () => void
  ) => React.ReactNode;
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
  onImport?: () => void;
  onExport?: () => void;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  
  // Clean Selection Configuration
  selection?: SelectionConfig;
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
  onView,
  onReorder,
  handleClear,
  searchable,
  onSearch,
  totalPages,
  pageNumber,
  allowReordering,
  pageSize,
  onPageChange,
  onPageSizeChange,
  selection,
  onDelete,
  onImport,
  onExport,
  renderViewContent,
  pagination,
}: DataTableProps<TData, TValue>) {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [targetRowIndex, setTargetRowIndex] = useState<number | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const buildTableColumns = () => {
    const tableColumns: any[] = [];

    // Add selection column if enabled
    if (selection?.enabled) {
      tableColumns.push({
        id: "select",
        header: () => (
          <Checkbox
            checked={isAllSelected}
            ref={(el) => {
              if (el) (el as HTMLInputElement).indeterminate = isIndeterminate;
            }}
            onCheckedChange={handleSelectAll}
            aria-label="Select all"
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox
            checked={selectedRows.has(row.original.id)}
            onCheckedChange={(checked) =>
              handleSelectRow(row.original.id, checked as boolean)
            }
            aria-label={`Select row ${row.original.id}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Add reordering column if enabled
    if (allowReordering) {
      tableColumns.push({
        id: "reorder",
        header: "",
        cell: () => (
          <div className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    // Add data columns
    columns.forEach((column) => {
      tableColumns.push({
        id: column.id,
        accessorKey: column.accessorKey,
        header: column.header,
        cell: (info: any) => {
          const value = info.getValue();
          const row = info.row.original;
          return column.render ? column.render(value, row) : value;
        },
      });
    });

    // Add actions column
    if (onEdit || onDelete || onView) {
      tableColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => (
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
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return tableColumns;
  };

  const table = useReactTable({
    data,
    columns: buildTableColumns(),
    getCoreRowModel: getCoreRowModel(),
  });

  // Drag and Drop handlers
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
      const draggedItem = data.find((item) => item.id === draggedItemId);
      if (draggedItem) {
        const currentPosition = draggedItem.order_number;
        const newPosition = targetIndex + 1;

        if (currentPosition !== newPosition) {
          onReorder(draggedItemId, newPosition);
        }
      }
    }

    setDraggedItemId(null);
    setTargetRowIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setTargetRowIndex(null);
  };

  // View handler
  const handleView = (row: TData) => {
    setSelectedRow(row.id);
    setIsViewModalOpen(true);
  };

  // Selection handlers
  const handleSelectRow = (rowId: string, isSelected: boolean) => {
    const newSelectedRows = new Set(selectedRows);
    if (isSelected) {
      newSelectedRows.add(rowId);
    } else {
      newSelectedRows.delete(rowId);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedRows(new Set(data.map((row) => row.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const clearSelection = () => {
    setSelectedRows(new Set());
  };

  const isAllSelected = data.length > 0 && selectedRows.size === data.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length;

  // Handle Simple Selection Actions
  const handleActionSelect = (actionId: string) => {
    const action = selection?.actions?.find(a => a.id === actionId);
    if (action && selectedRows.size > 0) {
      action.action(Array.from(selectedRows));
      
    }
  };

  // Render Bulk Actions Section
  const renderBulkActions = () => {
    if (!selection?.enabled || selectedRows.size === 0) return null;

    // Option 2: Custom Bulk Actions Component
    if (selection.customBulkActionsComponent) {
      return selection.customBulkActionsComponent(Array.from(selectedRows), clearSelection);
    }

    // Option 1: Simple Selection with dropdown
    if (selection.actions && selection.actions.length > 0) {
      return (
        <Select onValueChange={handleActionSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={`Select Action`} />
          </SelectTrigger>
          <SelectContent>
            {selection.actions.map((action) => (
              <SelectItem key={action.id} value={action.id}>
                {action.showCount 
                  ? `${action.label} (${selectedRows.size})`
                  : action.label
                }
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return null;
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
          <div className="flex items-center gap-2">
            {renderBulkActions()}
            {onImport && (
              <Button onClick={onImport} variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            )}
            {onExport && (
              <Button onClick={onExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            )}
            {onAdd && (
              <Button onClick={onAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add New
              </Button>
            )}
          </div>
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
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: table.getAllColumns().length }).map(
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
                      targetRowIndex === index &&
                        draggedItemId &&
                        "border-t-2 border-primary",
                      draggedItemId === row.original.id && "opacity-50",
                      selectedRows.has(row.original.id) && "bg-muted/50",
                      "transition-colors hover:bg-muted/50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getAllColumns().length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {pagination && (
          <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            hasNext={pagination.has_next}
            hasPrevious={pagination.has_previous}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            pageSize={pageSize}
          />
        )}
      </Card>
    </>
  );
}