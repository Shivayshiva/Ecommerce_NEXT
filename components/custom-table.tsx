"use client"

import * as React from "react"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Download,
  MoreHorizontal,
  Search,
  Settings2,
  Filter,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export interface Column<TData> {
  id: string
  header: string | React.ReactNode
  accessorKey?: keyof TData
  cell?: (row: TData, index: number) => React.ReactNode
  enableSorting?: boolean
  enableHiding?: boolean
  enableFiltering?: boolean
}

export interface DataTableProps<TData> {
  columns: Column<TData>[]
  data: TData[]
  // Optional props for customization
  searchPlaceholder?: string
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  enablePagination?: boolean
  enableSorting?: boolean
  enableColumnVisibility?: boolean
  enableGlobalFilter?: boolean
  enableExport?: boolean
  pageSize?: number
  onRowClick?: (row: TData, index: number) => void
  onRowSelectionChange?: (selectedRows: TData[]) => void
  isLoading?: boolean
  emptyMessage?: string
  stickyHeader?: boolean
  maxHeight?: string
  getRowId?: (row: TData, index: number) => string
}

type SortDirection = "asc" | "desc" | null

export function CustomTable<TData extends Record<string, unknown>>({
  columns,
  data,
  searchPlaceholder = "Search...",
  enableRowSelection = false,
  enableMultiRowSelection = true,
  enablePagination = true,
  enableSorting = true,
  enableColumnVisibility = true,
  enableGlobalFilter = true,
  enableExport = false,
  pageSize: initialPageSize = 10,
  onRowClick,
  onRowSelectionChange,
  isLoading = false,
  emptyMessage = "No results found.",
  stickyHeader = false,
  maxHeight = "600px",
  getRowId = (_, index) => index.toString(),
}: DataTableProps<TData>) {
  // State management
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<Record<string, string>>({})
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(null)
  const [selectedRows, setSelectedRows] = React.useState<Set<string>>(new Set())
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(initialPageSize)
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false)

  // Get visible columns
  const visibleColumns = React.useMemo(
    () => columns.filter((col) => !hiddenColumns.has(col.id)),
    [columns, hiddenColumns],
  )

  // Filter data
  const filteredData = React.useMemo(() => {
    let filtered = [...data]

    // Apply global filter
    if (globalFilter && enableGlobalFilter) {
      filtered = filtered.filter((row) => {
        return columns.some((col) => {
          if (!col.accessorKey) return false
          const value = row[col.accessorKey]
          return String(value).toLowerCase().includes(globalFilter.toLowerCase())
        })
      })
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
      if (filterValue) {
        const column = columns.find((col) => col.id === columnId)
        if (column?.accessorKey) {
          filtered = filtered.filter((row) => {
            const value = row[column.accessorKey!]
            return String(value).toLowerCase().includes(filterValue.toLowerCase())
          })
        }
      }
    })

    return filtered
  }, [data, globalFilter, columnFilters, columns, enableGlobalFilter])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!enableSorting || !sortColumn || !sortDirection) {
      return filteredData
    }

    const column = columns.find((col) => col.id === sortColumn)
    if (!column?.accessorKey) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[column.accessorKey!]
      const bValue = b[column.accessorKey!]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [filteredData, sortColumn, sortDirection, columns, enableSorting])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!enablePagination) return sortedData
    const start = currentPage * pageSize
    const end = start + pageSize
    return sortedData.slice(start, end)
  }, [sortedData, currentPage, pageSize, enablePagination])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!enableSorting) return

    if (sortColumn === columnId) {
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortColumn(null)
      }
    } else {
      setSortColumn(columnId)
      setSortDirection("asc")
    }
  }

  // Handle row selection
  const toggleRowSelection = (rowId: string) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId)
    } else {
      if (!enableMultiRowSelection) {
        newSelected.clear()
      }
      newSelected.add(rowId)
    }
    setSelectedRows(newSelected)

    if (onRowSelectionChange) {
      const selected = data.filter((row, index) => {
        const id = getRowId(row, index)
        return newSelected.has(id)
      })
      onRowSelectionChange(selected)
    }
  }

  const toggleAllRows = () => {
    let newSelected: Set<string>
    if (selectedRows.size === paginatedData.length) {
      newSelected = new Set()
    } else {
      const allIds = paginatedData.map((row, index) => getRowId(row, index))
      newSelected = new Set(allIds)
    }
    setSelectedRows(newSelected)

    if (onRowSelectionChange) {
      const selected = data.filter((row, index) => {
        const id = getRowId(row, index)
        return newSelected.has(id)
      })
      onRowSelectionChange(selected)
    }
  }

  const exportToCSV = () => {
    const headers = visibleColumns.map((col) => col.id)
    const rows = sortedData.map((row) =>
      visibleColumns.map((col) => {
        if (!col.accessorKey) return ""
        const value = row[col.accessorKey]
        return typeof value === "object" ? JSON.stringify(value) : value
      }),
    )

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `export_${new Date().getTime()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearAllFilters = () => {
    setColumnFilters({})
    setFilterDialogOpen(false)
  }

  const filterableColumns = columns.filter((col) => col.enableFiltering !== false && col.accessorKey)
  const activeFiltersCount = Object.values(columnFilters).filter((v) => v).length

  const allSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length
  const someSelected = selectedRows.size > 0 && !allSelected

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          {enableGlobalFilter && (
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-8"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Filter Columns</DialogTitle>
                <DialogDescription>
                  Apply filters to specific columns. Active filters: {activeFiltersCount}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {filterableColumns.length > 0 ? (
                  filterableColumns.map((column) => (
                    <div key={column.id} className="space-y-2">
                      <label className="text-sm font-medium capitalize">{column.id}</label>
                      <Input
                        placeholder={`Filter ${column.id}...`}
                        value={columnFilters[column.id] || ""}
                        onChange={(e) =>
                          setColumnFilters((prev) => ({
                            ...prev,
                            [column.id]: e.target.value,
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No filterable columns available</p>
                )}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button onClick={() => setFilterDialogOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {enableExport && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Columns
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns
                  .filter((col) => col.enableHiding !== false)
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={!hiddenColumns.has(column.id)}
                      onCheckedChange={(checked) => {
                        const newHidden = new Set(hiddenColumns)
                        if (checked) {
                          newHidden.delete(column.id)
                        } else {
                          newHidden.add(column.id)
                        }
                        setHiddenColumns(newHidden)
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Table Container with horizontal scroll */}
      <div
        className={cn("relative w-full overflow-auto rounded-md border", stickyHeader && "max-h-[var(--max-height)]")}
        style={{ "--max-height": maxHeight } as React.CSSProperties}
      >
        <Table className="bg-white">
          <TableHeader className={cn("bg-muted border-b-2", stickyHeader && "sticky top-0 z-10 bg-background")}>
            <TableRow className="hover:bg-muted/30">
              {enableRowSelection && (
                <TableHead className="w-12 px-4 py-3">
                  <Checkbox
                    checked={allSelected || (someSelected && "indeterminate")}
                    onCheckedChange={toggleAllRows}
                    aria-label="Select all"
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </TableHead>
              )}
              {visibleColumns.map((column) => (
                <TableHead key={column.id} className="px-4 py-3 whitespace-nowrap font-semibold">
                  {column.enableSorting !== false && enableSorting && column.accessorKey ? (
                    <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => handleSort(column.id)}>
                      {typeof column.header === "string" ? column.header : column.header}
                      {sortColumn === column.id ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ArrowDown className="ml-2 h-4 w-4" />
                        )
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                      )}
                    </Button>
                  ) : typeof column.header === "string" ? (
                    column.header
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + (enableRowSelection ? 1 : 0)} className="h-24 text-center px-4 py-8">
                  <div className="flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData.length ? (
              paginatedData.map((row, rowIndex) => {
                const rowId = getRowId(row, rowIndex)
                const isSelected = selectedRows.has(rowId)

                return (
                  <TableRow
                    key={rowId}
                    data-state={isSelected && "selected"}
                    onClick={() => onRowClick?.(row, rowIndex)}
                    className={cn("hover:bg-muted/50 transition-colors", onRowClick && "cursor-pointer")}
                  >
                    {enableRowSelection && (
                      <TableCell onClick={(e) => e.stopPropagation()} className="px-4 py-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleRowSelection(rowId)}
                          aria-label="Select row"
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </TableCell>
                    )}
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className="px-4 py-3 whitespace-nowrap">
                        {column.cell
                          ? column.cell(row, rowIndex)
                          : column.accessorKey
                            ? String(row[column.accessorKey])
                            : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + (enableRowSelection ? 1 : 0)} className="h-24 text-center px-4 py-8">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {enableRowSelection && (
              <>
                {selectedRows.size} of {sortedData.length} row(s) selected.
              </>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value))
                  setCurrentPage(0)
                }}
                className="h-8 w-[70px] rounded-md border border-input bg-background px-2 py-1 text-sm"
              >
                {[10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {currentPage + 1} of {totalPages || 1}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to create row actions dropdown
export function RowActions({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}
