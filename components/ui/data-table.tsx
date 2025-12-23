"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
  Upload,
  Filter,
  X,
  Eye,
  GripVertical,
  Columns3,
  Search,
  Check,
  Radio,
  ChevronRight as ChevronRightIcon,
  Minus,
  Plus,
  Trash2,
  Edit,
  Copy,
  FileDown,
  FileSpreadsheet,
  FileText,
  Settings2,
  ArrowUp,
  ArrowDown,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Types
export type SortDirection = "asc" | "desc" | null;
export type SelectionMode = "single" | "multiple" | "none";
export type FilterOperator = "equals" | "contains" | "startsWith" | "endsWith" | "greaterThan" | "lessThan" | "between" | "in";

export interface ColumnFilter {
  id: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For between operator
}

export interface Column<T = any> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: string;
  accessorFn?: (row: T) => any;
  cell?: (props: { row: T; value: any; column: Column<T> }) => React.ReactNode;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enableResizing?: boolean;
  enableReordering?: boolean;
  enableGrouping?: boolean;
  enableHiding?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  groupable?: boolean;
  hideable?: boolean;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  sticky?: "left" | "right" | false;
  tooltip?: string;
  icon?: React.ReactNode;
  filterComponent?: React.ComponentType<{
    value: any;
    onChange: (value: any) => void;
    column: Column<T>;
  }>;
  cellClassName?: string | ((row: T) => string);
  headerClassName?: string;
  meta?: Record<string, any>;
}

export interface FilterConfig {
  id: string;
  label: string;
  type: "text" | "select" | "date" | "number" | "boolean" | "multi-select";
  options?: Array<{ label: string; value: any }>;
  placeholder?: string;
}

export interface BulkAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  action: (selectedRows: T[]) => void | Promise<void>;
  variant?: "default" | "destructive" | "secondary";
  disabled?: (selectedRows: T[]) => boolean;
}

export interface ExportOption {
  format: "csv" | "excel" | "pdf" | "json";
  label: string;
  icon?: React.ReactNode;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: string | null;
  
  // Selection
  selectionMode?: SelectionMode;
  onSelectionChange?: (selectedRows: T[]) => void;
  getRowId?: (row: T) => string | number;
  
  // Sorting
  enableSorting?: boolean;
  defaultSorting?: { id: string; direction: SortDirection };
  onSortingChange?: (sorting: { id: string; direction: SortDirection } | null) => void;
  manualSorting?: boolean;
  
  // Filtering
  enableFiltering?: boolean;
  filters?: FilterConfig[];
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  onFiltersChange?: (filters: ColumnFilter[]) => void;
  manualFiltering?: boolean;
  debounceMs?: number;
  
  // Pagination
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  totalCount?: number;
  manualPagination?: boolean;
  
  // Infinite scroll
  enableInfiniteScroll?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  
  // Virtual scrolling
  enableVirtualScrolling?: boolean;
  virtualRowHeight?: number;
  
  // Grouping
  enableGrouping?: boolean;
  groupBy?: string;
  onGroupByChange?: (columnId: string | null) => void;
  
  // Expandable rows
  enableExpanding?: boolean;
  expandedRows?: Set<string | number>;
  onExpandedChange?: (rowId: string | number, expanded: boolean) => void;
  renderExpandedContent?: (row: T) => React.ReactNode;
  
  // Bulk actions
  bulkActions?: BulkAction<T>[];
  
  // Export
  enableExport?: boolean;
  exportOptions?: ExportOption[];
  onExport?: (format: string, data: T[]) => void;
  
  // Column visibility
  enableColumnVisibility?: boolean;
  hiddenColumns?: Set<string>;
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  
  // Column resizing
  enableColumnResizing?: boolean;
  columnWidths?: Record<string, number>;
  onColumnWidthChange?: (columnId: string, width: number) => void;
  
  // Column reordering
  enableColumnReordering?: boolean;
  columnOrder?: string[];
  onColumnOrderChange?: (order: string[]) => void;
  
  // Row actions
  rowActions?: (row: T) => Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
  
  // Context menu
  enableContextMenu?: boolean;
  contextMenuItems?: (row: T) => Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: "default" | "destructive";
    submenu?: Array<{ label: string; onClick: () => void }>;
  }>;
  
  // Styling
  className?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  
  // Callbacks
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  onRowHover?: (row: T | null) => void;
  
  // Search
  enableSearch?: boolean;
  searchPlaceholder?: string;
  searchDebounceMs?: number;
  
  // Sticky header
  stickyHeader?: boolean;
  
  // Responsive
  responsive?: boolean;
  mobileView?: "table" | "cards";
  
  // Tree/hierarchical
  enableTree?: boolean;
  getChildren?: (row: T) => T[];
  getParentId?: (row: T) => string | number | null;
  
  // Conditional formatting
  getRowClassName?: (row: T) => string;
  getCellClassName?: (row: T, columnId: string) => string;
  
  // Real-time updates
  enableRealTime?: boolean;
  
  // Custom renderers
  renderEmptyState?: () => React.ReactNode;
  renderLoadingState?: () => React.ReactNode;
  renderErrorState?: (error: string) => React.ReactNode;
  
  // Toolbar
  renderToolbar?: () => React.ReactNode;
  showToolbar?: boolean;
  
  // Footer
  renderFooter?: () => React.ReactNode;
}

// Utility functions
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, prop) => current?.[prop], obj);
}

function exportToCSV<T>(data: T[], columns: Column<T>[]): string {
  const headers = columns
    .filter((col) => !col.hideable || col.hideable === false)
    .map((col) => col.header?.toString() || col.id);
  
  const rows = data.map((row) =>
    columns
      .filter((col) => !col.hideable || col.hideable === false)
      .map((col) => {
        const value = col.accessorFn
          ? col.accessorFn(row)
          : col.accessorKey
          ? getNestedValue(row, col.accessorKey)
          : "";
        return String(value ?? "").replace(/"/g, '""');
      })
      .map((val) => `"${val}"`)
      .join(",")
  );
  
  return [headers.join(","), ...rows].join("\n");
}

function exportToJSON<T>(data: T[]): string {
  return JSON.stringify(data, null, 2);
}

// Main DataTable Component
export function DataTable<T extends Record<string, any> = any>({
  data,
  columns,
  isLoading = false,
  error = null,
  selectionMode = "none",
  onSelectionChange,
  getRowId = (row: T) => (row as any).id || (row as any)._id || JSON.stringify(row),
  enableSorting = true,
  defaultSorting,
  onSortingChange,
  manualSorting = false,
  enableFiltering = true,
  filters,
  globalFilter: controlledGlobalFilter,
  onGlobalFilterChange,
  onFiltersChange,
  manualFiltering = false,
  debounceMs = 300,
  enablePagination = true,
  pageSize: controlledPageSize = 25,
  pageSizeOptions = [10, 25, 50, 100],
  currentPage: controlledCurrentPage,
  onPageChange,
  onPageSizeChange,
  totalCount,
  manualPagination = false,
  enableInfiniteScroll = false,
  hasNextPage = false,
  onLoadMore,
  enableVirtualScrolling = false,
  virtualRowHeight = 50,
  enableGrouping = false,
  groupBy: controlledGroupBy,
  onGroupByChange,
  enableExpanding = false,
  expandedRows: controlledExpandedRows,
  onExpandedChange,
  renderExpandedContent,
  bulkActions = [],
  enableExport = false,
  exportOptions = [
    { format: "csv", label: "Export as CSV", icon: <FileSpreadsheet className="h-4 w-4" /> },
    { format: "json", label: "Export as JSON", icon: <FileText className="h-4 w-4" /> },
  ],
  onExport,
  enableColumnVisibility = true,
  hiddenColumns: controlledHiddenColumns,
  onColumnVisibilityChange,
  enableColumnResizing = false,
  columnWidths: controlledColumnWidths,
  onColumnWidthChange,
  enableColumnReordering = false,
  columnOrder: controlledColumnOrder,
  onColumnOrderChange,
  rowActions,
  enableContextMenu = false,
  contextMenuItems,
  className,
  emptyMessage = "No data available",
  loadingMessage = "Loading...",
  onRowClick,
  onRowDoubleClick,
  onRowHover,
  enableSearch = true,
  searchPlaceholder = "Search...",
  searchDebounceMs = 300,
  stickyHeader = true,
  responsive = true,
  mobileView = "table",
  enableTree = false,
  getChildren,
  getParentId,
  getRowClassName,
  getCellClassName,
  enableRealTime = false,
  renderEmptyState,
  renderLoadingState,
  renderErrorState,
  renderToolbar,
  showToolbar = true,
  renderFooter,
}: DataTableProps<T>) {
  // Internal state
  const [internalGlobalFilter, setInternalGlobalFilter] = React.useState("");
  const [internalSorting, setInternalSorting] = React.useState<{
    id: string;
    direction: SortDirection;
  } | null>(defaultSorting || null);
  const [internalFilters, setInternalFilters] = React.useState<ColumnFilter[]>([]);
  const [internalPage, setInternalPage] = React.useState(1);
  const [internalPageSize, setInternalPageSize] = React.useState(controlledPageSize);
  const [selectedRows, setSelectedRows] = React.useState<Set<string | number>>(new Set());
  const [internalExpandedRows, setInternalExpandedRows] = React.useState<Set<string | number>>(new Set());
  const [internalHiddenColumns, setInternalHiddenColumns] = React.useState<Set<string>>(new Set());
  const [internalColumnWidths, setInternalColumnWidths] = React.useState<Record<string, number>>({});
  const [internalColumnOrder, setInternalColumnOrder] = React.useState<string[]>(columns.map((c) => c.id));
  const [internalGroupBy, setInternalGroupBy] = React.useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = React.useState<T | null>(null);
  const [columnVisibilityOpen, setColumnVisibilityOpen] = React.useState(false);
  const [filterPopoverOpen, setFilterPopoverOpen] = React.useState<Record<string, boolean>>({});
  
  // Controlled vs uncontrolled
  const globalFilter = controlledGlobalFilter !== undefined ? controlledGlobalFilter : internalGlobalFilter;
  const setGlobalFilter = onGlobalFilterChange || setInternalGlobalFilter;
  const sorting = onSortingChange ? (defaultSorting || null) : internalSorting;
  const setSorting = onSortingChange
    ? (s: { id: string; direction: SortDirection } | null) => {
        if (s) onSortingChange(s);
        else onSortingChange({ id: "", direction: null });
      }
    : setInternalSorting;
  const page = controlledCurrentPage !== undefined ? controlledCurrentPage : internalPage;
  const setPage = onPageChange || setInternalPage;
  const pageSize = controlledPageSize !== undefined ? controlledPageSize : internalPageSize;
  const setPageSize = onPageSizeChange || setInternalPageSize;
  const expandedRows = controlledExpandedRows !== undefined ? controlledExpandedRows : internalExpandedRows;
  const setExpandedRows = onExpandedChange
    ? (id: string | number, expanded: boolean) => {
        const newSet = new Set(expandedRows);
        if (expanded) newSet.add(id);
        else newSet.delete(id);
        // Call for each row
        onExpandedChange(id, expanded);
      }
    : (id: string | number, expanded: boolean) => {
        setInternalExpandedRows((prev) => {
          const newSet = new Set(prev);
          if (expanded) newSet.add(id);
          else newSet.delete(id);
          return newSet;
        });
      };
  const hiddenColumns = controlledHiddenColumns !== undefined ? controlledHiddenColumns : internalHiddenColumns;
  const setHiddenColumns = onColumnVisibilityChange
    ? (id: string, visible: boolean) => {
        const newSet = new Set(hiddenColumns);
        if (!visible) newSet.add(id);
        else newSet.delete(id);
        onColumnVisibilityChange(id, visible);
      }
    : (id: string, visible: boolean) => {
        setInternalHiddenColumns((prev) => {
          const newSet = new Set(prev);
          if (!visible) newSet.add(id);
          else newSet.delete(id);
          return newSet;
        });
      };
  const columnWidths = controlledColumnWidths !== undefined ? controlledColumnWidths : internalColumnWidths;
  const setColumnWidths = onColumnWidthChange
    ? (id: string, width: number) => {
        setInternalColumnWidths((prev) => ({ ...prev, [id]: width }));
        onColumnWidthChange(id, width);
      }
    : (id: string, width: number) => {
        setInternalColumnWidths((prev) => ({ ...prev, [id]: width }));
      };
  const columnOrder = controlledColumnOrder !== undefined ? controlledColumnOrder : internalColumnOrder;
  const setColumnOrder = onColumnOrderChange || setInternalColumnOrder;
  const groupBy = controlledGroupBy !== undefined ? controlledGroupBy : internalGroupBy;
  const setGroupBy = onGroupByChange || setInternalGroupBy;
  
  // Debounced search
  const debouncedGlobalFilter = useDebounce(globalFilter, searchDebounceMs || debounceMs);
  
  // Filter and sort data
  let filteredData = [...data];
  
  if (!manualFiltering) {
    // Apply global filter
    if (debouncedGlobalFilter) {
      filteredData = filteredData.filter((row) => {
        return columns.some((col) => {
          const value = col.accessorFn
            ? col.accessorFn(row)
            : col.accessorKey
            ? getNestedValue(row, col.accessorKey)
            : "";
          return String(value ?? "").toLowerCase().includes(debouncedGlobalFilter.toLowerCase());
        });
      });
    }
    
    // Apply column filters
    if (internalFilters.length > 0) {
      filteredData = filteredData.filter((row) => {
        return internalFilters.every((filter) => {
          const col = columns.find((c) => c.id === filter.id);
          if (!col) return true;
          
          const value = col.accessorFn
            ? col.accessorFn(row)
            : col.accessorKey
            ? getNestedValue(row, col.accessorKey)
            : "";
          
          switch (filter.operator) {
            case "equals":
              return value === filter.value;
            case "contains":
              return String(value ?? "").toLowerCase().includes(String(filter.value ?? "").toLowerCase());
            case "startsWith":
              return String(value ?? "").toLowerCase().startsWith(String(filter.value ?? "").toLowerCase());
            case "endsWith":
              return String(value ?? "").toLowerCase().endsWith(String(filter.value ?? "").toLowerCase());
            case "greaterThan":
              return Number(value) > Number(filter.value);
            case "lessThan":
              return Number(value) < Number(filter.value);
            case "between":
              return Number(value) >= Number(filter.value) && Number(value) <= Number(filter.value2);
            case "in":
              return Array.isArray(filter.value) && filter.value.includes(value);
            default:
              return true;
          }
        });
      });
    }
  }
  
  // Sort data
  if (!manualSorting && sorting) {
    filteredData.sort((a, b) => {
      const col = columns.find((c) => c.id === sorting.id);
      if (!col) return 0;
      
      const aValue = col.accessorFn ? col.accessorFn(a) : col.accessorKey ? getNestedValue(a, col.accessorKey) : "";
      const bValue = col.accessorFn ? col.accessorFn(b) : col.accessorKey ? getNestedValue(b, col.accessorKey) : "";
      
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sorting.direction === "asc" ? comparison : -comparison;
    });
  }
  
  // Group data
  let groupedData: Array<{ group: string; rows: T[] }> = [];
  if (enableGrouping && groupBy) {
    const groups = new Map<string, T[]>();
    filteredData.forEach((row) => {
      const col = columns.find((c) => c.id === groupBy);
      if (col) {
        const groupValue = col.accessorFn
          ? col.accessorFn(row)
          : col.accessorKey
          ? getNestedValue(row, col.accessorKey)
          : "";
        const groupKey = String(groupValue ?? "Unknown");
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(row);
      }
    });
    groupedData = Array.from(groups.entries()).map(([group, rows]) => ({ group, rows }));
  } else {
    groupedData = [{ group: "", rows: filteredData }];
  }
  
  // Paginate data
  const totalFilteredCount = manualPagination ? (totalCount ?? filteredData.length) : filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  let paginatedData = filteredData;
  if (!manualPagination && enablePagination && !enableInfiniteScroll) {
    paginatedData = filteredData.slice(startIndex, endIndex);
  } else if (enableInfiniteScroll) {
    paginatedData = filteredData.slice(0, endIndex);
  }
  
  // Visible columns
  const visibleColumns = columnOrder
    .map((id) => columns.find((c) => c.id === id))
    .filter((col): col is Column<T> => col !== undefined && !hiddenColumns.has(col.id) && col.width !== undefined);
  
  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (selectionMode === "multiple") {
      const newSelection = checked
        ? new Set(paginatedData.map((row) => getRowId(row)))
        : new Set<string | number>();
      setSelectedRows(newSelection);
      onSelectionChange?.(paginatedData.filter((row) => newSelection.has(getRowId(row))));
    }
  };
  
  const handleSelectRow = (row: T, checked: boolean) => {
    const rowId = getRowId(row);
    if (selectionMode === "multiple") {
      const newSelection = new Set(selectedRows);
      if (checked) {
        newSelection.add(rowId);
      } else {
        newSelection.delete(rowId);
      }
      setSelectedRows(newSelection);
      onSelectionChange?.(data.filter((r) => newSelection.has(getRowId(r))));
    } else if (selectionMode === "single") {
      const newSelection = checked ? new Set([rowId]) : new Set<string | number>();
      setSelectedRows(newSelection);
      onSelectionChange?.(checked ? [row] : []);
    }
  };
  
  const isRowSelected = (row: T) => {
    return selectedRows.has(getRowId(row));
  };
  
  const isAllSelected = paginatedData.length > 0 && paginatedData.every((row) => isRowSelected(row));
  const isSomeSelected = paginatedData.some((row) => isRowSelected(row));
  
  // Export handlers
  const handleExport = (format: string) => {
    const selectedData = selectedRows.size > 0
      ? data.filter((row) => selectedRows.has(getRowId(row)))
      : filteredData;
    
    if (onExport) {
      onExport(format, selectedData);
      return;
    }
    
    let content = "";
    let mimeType = "";
    let filename = "";
    
    switch (format) {
      case "csv":
        content = exportToCSV(selectedData, columns);
        mimeType = "text/csv";
        filename = "export.csv";
        break;
      case "json":
        content = exportToJSON(selectedData);
        mimeType = "application/json";
        filename = "export.json";
        break;
      default:
        return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Sort handler
  const handleSort = (columnId: string) => {
    const col = columns.find((c) => c.id === columnId);
    if (!col || (col.enableSorting === false && col.sortable === false)) return;
    
    if (sorting?.id === columnId) {
      if (sorting.direction === "asc") {
        setSorting({ id: columnId, direction: "desc" });
      } else {
        setSorting(null);
      }
    } else {
      setSorting({ id: columnId, direction: "asc" });
    }
  };
  
  // Render cell content
  const renderCell = (row: T, column: Column<T>) => {
    const value = column.accessorFn
      ? column.accessorFn(row)
      : column.accessorKey
      ? getNestedValue(row, column.accessorKey)
      : null;
    
    if (column.cell) {
      return column.cell({ row, value, column });
    }
    
    return value ?? "";
  };
  
  // Render loading skeleton
  if (isLoading && !renderLoadingState) {
    return (
      <div className={cn("space-y-4 max-w-full ", className)}>
        <div className="rounded-md border overflow-x-auto max-w-full">
          <Table style={{ width: 'max-content' }}>
            <TableHeader>
              <TableRow>
                {selectionMode !== "none" && <TableHead className="w-12" />}
                {enableExpanding && <TableHead className="w-12" />}
                {visibleColumns.map((col) => (
                  <TableHead key={col.id} className={col.headerClassName}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))}
                {rowActions && <TableHead className="w-12" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {selectionMode !== "none" && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {enableExpanding && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {visibleColumns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
  
  if (isLoading && renderLoadingState) {
    return <>{renderLoadingState()}</>;
  }
  
  if (error && renderErrorState) {
    return <>{renderErrorState(error)}</>;
  }
  
  if (error) {
    return (
      <div className={cn("rounded-md border border-destructive bg-destructive/10 p-4", className)}>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }
  
  const selectedRowsData = data.filter((row) => selectedRows.has(getRowId(row)));
  
  return (
    <div className={cn("space-y-6 max-w-[80%]", className)}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {enableSearch && (
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            
            {enableFiltering && filters && filters.length > 0 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {internalFilters.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {internalFilters.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Filters</h4>
                      {internalFilters.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setInternalFilters([])}
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      {filters.map((filter) => {
                        const filterValue = internalFilters.find((f) => f.id === filter.id);
                        return (
                          <div key={filter.id} className="space-y-2">
                            <Label className="text-sm">{filter.label}</Label>
                            {filter.type === "text" && (
                              <Input
                                placeholder={filter.placeholder}
                                value={filterValue?.value || ""}
                                onChange={(e) => {
                                  const newFilters = internalFilters.filter((f) => f.id !== filter.id);
                                  if (e.target.value) {
                                    newFilters.push({
                                      id: filter.id,
                                      operator: "contains",
                                      value: e.target.value,
                                    });
                                  }
                                  setInternalFilters(newFilters);
                                  onFiltersChange?.(newFilters);
                                }}
                              />
                            )}
                            {filter.type === "select" && filter.options && (
                              <Select
                                value={filterValue?.value || ""}
                                onValueChange={(value) => {
                                  const newFilters = internalFilters.filter((f) => f.id !== filter.id);
                                  if (value) {
                                    newFilters.push({
                                      id: filter.id,
                                      operator: "equals",
                                      value,
                                    });
                                  }
                                  setInternalFilters(newFilters);
                                  onFiltersChange?.(newFilters);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder={filter.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                  {filter.options.map((opt) => (
                                    <SelectItem key={String(opt.value)} value={String(opt.value)}>
                                      {opt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
            
            {renderToolbar && renderToolbar()}
          </div>
          
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && bulkActions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions ({selectedRows.size})
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {bulkActions.map((action, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => action.action(selectedRowsData)}
                      disabled={action.disabled?.(selectedRowsData)}
                    >
                      {action.icon && <span className="mr-2">{action.icon}</span>}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {enableExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {exportOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.format}
                      onClick={() => handleExport(option.format)}
                    >
                      {option.icon && <span className="mr-2">{option.icon}</span>}
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {enableColumnVisibility && (
              <DropdownMenu open={columnVisibilityOpen} onOpenChange={setColumnVisibilityOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Columns3 className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns
                    .filter((col) => col.enableHiding !== false && col.hideable !== false)
                    .map((col) => {
                      const isHidden = hiddenColumns.has(col.id);
                      return (
                        <DropdownMenuCheckboxItem
                          key={col.id}
                          checked={!isHidden}
                          onCheckedChange={(checked) => setHiddenColumns(col.id, checked)}
                        >
                          {typeof col.header === "string" ? col.header : col.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="rounded-md border max-w-full">
        <Table className="table-fixed" style={{ width: 'max-content' }}>
            <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-background")}>
              <TableRow>
                {selectionMode !== "none" && (
                  <TableHead className="w-12">
                    {selectionMode === "multiple" && (
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    )}
                  </TableHead>
                )}
                {enableExpanding && <TableHead className="w-12" />}
                {visibleColumns.map((col) => {
                  const isSorted = sorting?.id === col.id;
                  const canSort = col.enableSorting !== false && col.sortable !== false && enableSorting;

                  return (
                    <TableHead
                      key={col.id}
                      className={cn(
                        "overflow-hidden",
                        col.headerAlign === "center" && "text-center",
                        col.headerAlign === "right" && "text-right",
                        col.sticky === "left" && "sticky left-0 z-20 bg-background",
                        col.sticky === "right" && "sticky right-0 z-20 bg-background",
                        col.headerClassName
                      )}
                      style={{
                        width: columnWidths[col.id] || col.width,
                        minWidth: col.minWidth || '120px',
                        maxWidth: col.maxWidth || '300px',
                      }}
                    >
                      <div className={cn("flex items-center gap-2 truncate", col.headerAlign === "right" && "justify-end", col.headerAlign === "center" && "justify-center")}>
                        {col.icon && <span className="text-muted-foreground">{col.icon}</span>}
                        {col.tooltip ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-medium">
                                {typeof col.header === "string" ? col.header : col.header}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>{col.tooltip}</TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="font-medium">
                            {typeof col.header === "string" ? col.header : col.header}
                          </span>
                        )}
                        {canSort && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleSort(col.id)}
                          >
                            {isSorted ? (
                              sorting?.direction === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : (
                                <ArrowDown className="h-4 w-4" />
                              )
                            ) : (
                              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
                {rowActions && <TableHead className="w-12 text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      visibleColumns.length +
                      (selectionMode !== "none" ? 1 : 0) +
                      (enableExpanding ? 1 : 0) +
                      (rowActions ? 1 : 0)
                    }
                    className="h-24 text-center"
                  >
                    {renderEmptyState ? (
                      renderEmptyState()
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                groupedData.map((group) => (
                  <React.Fragment key={group.group}>
                    {enableGrouping && group.group && (
                      <TableRow className="bg-muted/50">
                        <TableCell
                          colSpan={
                            visibleColumns.length +
                            (selectionMode !== "none" ? 1 : 0) +
                            (enableExpanding ? 1 : 0) +
                            (rowActions ? 1 : 0)
                          }
                          className="font-medium"
                        >
                          {group.group} ({group.rows.length})
                        </TableCell>
                      </TableRow>
                    )}
                    {group.rows.map((row) => {
                      const rowId = getRowId(row);
                      const isExpanded = expandedRows.has(rowId);
                      const isSelected = isRowSelected(row);
                      const rowClassName = getRowClassName?.(row) || "";
                      
                      const rowElement = (
                        <TableRow
                          key={rowId}
                          data-selected={isSelected}
                          className={cn(
                            isSelected && "bg-muted/50",
                            hoveredRow === row && "bg-muted/30",
                            onRowClick && "cursor-pointer",
                            rowClassName
                          )}
                          onClick={() => onRowClick?.(row)}
                          onDoubleClick={() => onRowDoubleClick?.(row)}
                          onMouseEnter={() => {
                            setHoveredRow(row);
                            onRowHover?.(row);
                          }}
                          onMouseLeave={() => {
                            setHoveredRow(null);
                            onRowHover?.(null);
                          }}
                        >
                          {selectionMode !== "none" && (
                            <TableCell>
                              {selectionMode === "multiple" ? (
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => handleSelectRow(row, checked as boolean)}
                                  aria-label="Select row"
                                />
                              ) : (
                                <RadioGroup value={isSelected ? String(rowId) : ""}>
                                  <RadioGroupItem
                                    value={String(rowId)}
                                    onClick={() => handleSelectRow(row, !isSelected)}
                                  />
                                </RadioGroup>
                              )}
                            </TableCell>
                          )}
                          {enableExpanding && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => setExpandedRows(rowId, !isExpanded)}
                              >
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRightIcon className="h-4 w-4" />
                                )}
                              </Button>
                            </TableCell>
                          )}
                          {visibleColumns.map((col) => {
                            const cellClassName = getCellClassName?.(row, col.id) || col.cellClassName;
                            const cellValue = typeof cellClassName === "function" ? cellClassName(row) : cellClassName;
                            
                            return (
                              <TableCell
                                key={col.id}
                                className={cn(
                                  "overflow-hidden",
                                  col.align === "center" && "text-center",
                                  col.align === "right" && "text-right",
                                  col.sticky === "left" && "sticky left-0 z-10 bg-background",
                                  col.sticky === "right" && "sticky right-0 z-10 bg-background",
                                  cellValue
                                )}
                                style={{
                                  width: columnWidths[col.id] || col.width,
                                  minWidth: col.minWidth || '120px',
                                  maxWidth: col.maxWidth || '300px',
                                }}
                              >
                                <div className="truncate">
                                  {renderCell(row, col)}
                                </div>
                              </TableCell>
                            );
                          })}
                          {rowActions && (
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {rowActions(row).map((action, idx) => (
                                    <DropdownMenuItem
                                      key={idx}
                                      onClick={action.onClick}
                                      className={action.variant === "destructive" ? "text-destructive" : ""}
                                    >
                                      {action.icon && <span className="mr-2">{action.icon}</span>}
                                      {action.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                      
                      if (enableContextMenu && contextMenuItems) {
                        const menuItems = contextMenuItems(row);
                        return (
                          <ContextMenu key={rowId}>
                            <ContextMenuTrigger asChild>{rowElement}</ContextMenuTrigger>
                            <ContextMenuContent>
                              {menuItems.map((item, idx) => {
                                if (item.submenu) {
                                  return (
                                    <ContextMenuSub key={idx}>
                                      <ContextMenuSubTrigger>
                                        {item.icon && <span className="mr-2">{item.icon}</span>}
                                        {item.label}
                                      </ContextMenuSubTrigger>
                                      <ContextMenuSubContent>
                                        {item.submenu.map((subItem, subIdx) => (
                                          <ContextMenuItem key={subIdx} onClick={subItem.onClick}>
                                            {subItem.label}
                                          </ContextMenuItem>
                                        ))}
                                      </ContextMenuSubContent>
                                    </ContextMenuSub>
                                  );
                                }
                                return (
                                  <ContextMenuItem
                                    key={idx}
                                    onClick={item.onClick}
                                    variant={item.variant}
                                  >
                                    {item.icon && <span className="mr-2">{item.icon}</span>}
                                    {item.label}
                                  </ContextMenuItem>
                                );
                              })}
                            </ContextMenuContent>
                          </ContextMenu>
                        );
                      }
                      
                      return (
                        <React.Fragment key={rowId}>
                          {rowElement}
                          {enableExpanding && isExpanded && renderExpandedContent && (
                            <TableRow>
                              <TableCell
                                colSpan={
                                  visibleColumns.length +
                                  (selectionMode !== "none" ? 1 : 0) +
                                  (enableExpanding ? 1 : 0) +
                                  (rowActions ? 1 : 0)
                                }
                                className="bg-muted/30"
                              >
                                {renderExpandedContent(row)}
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
      </div>
      
      {/* Pagination */}
      {enablePagination && !enableInfiniteScroll && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {totalFilteredCount === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, totalFilteredCount)}
            </span>{" "}
            of <span className="font-medium text-foreground">{totalFilteredCount}</span>{" "}
            {totalFilteredCount === 1 ? "row" : "rows"}
          </div>
          <div className="flex items-center gap-2">
            {pageSizeOptions.length > 0 && (
              <div className="flex items-center gap-2">
                <Label className="text-sm">Rows per page:</Label>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Infinite scroll */}
      {enableInfiniteScroll && hasNextPage && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
      
      {/* Footer */}
      {renderFooter && renderFooter()}
    </div>
  );
}

