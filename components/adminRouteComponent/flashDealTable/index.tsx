import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, Edit, Pause, Square, Copy, Trash2, Tag, Package, Calendar, DollarSign, Users, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { DataTable, type Column, type BulkAction } from "@/components/ui/data-table";

type FlashDealStatus = "scheduled" | "active" | "ended" | "paused";

type FlashDeal = {
  _id: string;
  title: string;
  dealType: "flash-deal" | "lightning-deal";
  products: Array<{
    productId: {
      _id: string;
      name: string;
      sku: string;
    };
  }>;
  status: FlashDealStatus;
  startDate: string | Date;
  endDate: string | Date;
  totalUnitsSold: number;
  totalRevenue: number;
  createdBy: {
    name?: string;
    email?: string;
  };
  createdAt: string | Date;
};

const DEFAULT_PAGE_SIZE = 25;
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

type ParsedParams = {
  q: string;
  status: string;
  dealType: string;
  sort: string;
  page: number;
  pageSize: PageSize;
};

function buildQuery(next: Partial<ParsedParams>, current: ParsedParams) {
  const merged = { ...current, ...next };

  const query = new URLSearchParams();
  if (merged.q) query.set("q", merged.q);
  if (merged.status !== "all") query.set("status", merged.status);
  if (merged.dealType !== "all") query.set("dealType", merged.dealType);
  if (merged.sort !== "recently-created") query.set("sort", merged.sort);

  if (merged.page !== 1) query.set("page", String(merged.page));
  if (merged.pageSize !== DEFAULT_PAGE_SIZE)
    query.set("pageSize", String(merged.pageSize));

  const search = query.toString();
  return search ? `?${search}` : "";
}

function statusBadge(status: FlashDealStatus) {
  if (status === "active") {
    return (
      <Badge
        variant="secondary"
        className="border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
      >
        <span className="mr-1.5 inline-block size-2 rounded-full bg-emerald-400" />
        Active
      </Badge>
    );
  }
  if (status === "scheduled") {
    return (
      <Badge
        variant="secondary"
        className="border-blue-500/40 bg-blue-500/15 text-blue-300"
      >
        <span className="mr-1.5 inline-block size-2 rounded-full bg-blue-400" />
        Scheduled
      </Badge>
    );
  }
  if (status === "paused") {
    return (
      <Badge
        variant="secondary"
        className="border-amber-500/40 bg-amber-500/15 text-amber-200"
      >
        <span className="mr-1.5 inline-block size-2 rounded-full bg-amber-300" />
        Paused
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="border-gray-500/40 bg-gray-500/15 text-gray-300"
    >
      <span className="mr-1.5 inline-block size-2 rounded-full bg-gray-400" />
      Ended
    </Badge>
  );
}

export default function FlashDealsTable({
  data,
  isLoading,
  error,
  params,
  total,
}: {
  data: FlashDeal[];
  isLoading: boolean;
  error: string | null;
  params: ParsedParams;
  total: number;
}) {
  const router = useRouter();
  const [isPausing, setIsPausing] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState<string | null>(null);

  const handlePause = async (dealId: string) => {
    if (!confirm("Are you sure you want to pause this deal?")) return;
    setIsPausing(dealId);
    try {
      const response = await fetch(`/api/admin/flash-deals/${dealId}/pause`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to pause deal");
      }
    } catch (error) {
      console.error("Error pausing deal:", error);
      alert("Failed to pause deal");
    } finally {
      setIsPausing(null);
    }
  };

  const handleEnd = async (dealId: string) => {
    if (!confirm("Are you sure you want to end this deal now?")) return;
    setIsEnding(dealId);
    try {
      const response = await fetch(`/api/admin/flash-deals/${dealId}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Failed to end deal");
      }
    } catch (error) {
      console.error("Error ending deal:", error);
      alert("Failed to end deal");
    } finally {
      setIsEnding(null);
    }
  };

  const columns: Column<FlashDeal>[] = [
    {
      id: "title",
      header: "Deal Title",
      accessorKey: "title",
      cell: ({ value }) => <span className="font-medium ">{value}</span>,
      enableSorting: true,
      enableFiltering: true,
      width: 250,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: ({ value }) => new Date(value).toLocaleDateString(),
      enableSorting: true,
      enableHiding: true,
      width: 120,
    },
    {
      id: "dealType",
      header: "Type",
      accessorKey: "dealType",
      cell: ({ value }) => (
        <Badge variant="outline">
          {value === "flash-deal" ? "Flash Deal" : "Lightning Deal"}
        </Badge>
      ),
      enableSorting: true,
      enableFiltering: true,
      icon: <Tag className="h-4 w-4" />,
      width: 140,
    },
    {
      id: "products",
      header: "Products",
      accessorFn: (row) => row.products.length,
      cell: ({ value }) => (
        <span className="flex items-center gap-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          {value} {value === 1 ? "product" : "products"}
        </span>
      ),
      enableSorting: true,
      icon: <Package className="h-4 w-4" />,
      width: 120,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ value }) => statusBadge(value as FlashDealStatus),
      enableSorting: true,
      enableFiltering: true,
      width: 100,
    },
    {
      id: "startDate",
      header: "Start Time",
      accessorKey: "startDate",
      cell: ({ value }) => new Date(value).toLocaleString(),
      enableSorting: true,
      icon: <Calendar className="h-4 w-4" />,
      width: 180,
    },
    {
      id: "endDate",
      header: "End Time",
      accessorKey: "endDate",
      cell: ({ value }) => new Date(value).toLocaleString(),
      enableSorting: true,
      icon: <Calendar className="h-4 w-4" />,
      width: 180,
    },
    {
      id: "totalUnitsSold",
      header: "Units Sold",
      accessorKey: "totalUnitsSold",
      cell: ({ value }) => (
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          {value}
        </span>
      ),
      enableSorting: true,
      align: "right",
      icon: <Users className="h-4 w-4" />,
      width: 120,
    },
    {
      id: "totalRevenue",
      header: "Revenue",
      accessorKey: "totalRevenue",
      cell: ({ value }) => (
        <span className="flex items-center gap-1 font-medium">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          ₹{Number(value).toFixed(2)}
        </span>
      ),
      enableSorting: true,
      align: "right",
      icon: <DollarSign className="h-4 w-4" />,
      width: 140,
    },
    {
      id: "createdBy",
      header: "Created By",
      accessorFn: (row) => row.createdBy?.name || row.createdBy?.email || "System",
      cell: ({ value }) => (
        <span className="flex items-center gap-1">
          <User className="h-4 w-4 text-muted-foreground" />
          {value}
        </span>
      ),
      enableSorting: true,
      icon: <User className="h-4 w-4" />,
      width: 160,
    },
  ];

  const filters = [
    {
      id: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "All status", value: "all" },
        { label: "Scheduled", value: "scheduled" },
        { label: "Active", value: "active" },
        { label: "Paused", value: "paused" },
        { label: "Ended", value: "ended" },
      ],
    },
    {
      id: "dealType",
      label: "Deal Type",
      type: "select" as const,
      options: [
        { label: "All types", value: "all" },
        { label: "Flash Deal", value: "flash-deal" },
        { label: "Lightning Deal", value: "lightning-deal" },
      ],
    },
  ];

  const bulkActions: BulkAction<FlashDeal>[] = [
    {
      label: "Delete Selected",
      icon: <Trash2 className="h-4 w-4" />,
      variant: "destructive",
      action: async (selectedRows) => {
        if (confirm(`Are you sure you want to delete ${selectedRows.length} deal(s)?`)) {
          // Implement bulk delete
          console.log("Deleting deals:", selectedRows.map((r) => r._id));
        }
      },
    },
    {
      label: "Export Selected",
      icon: <Copy className="h-4 w-4" />,
      action: (selectedRows) => {
        console.log("Exporting deals:", selectedRows);
      },
    },
  ];

  const getRowActions = (deal: FlashDeal) => {
    const actions = [
      {
        label: "View Details",
        icon: <Eye className="h-4 w-4" />,
        onClick: () => router.push(`/(admin)/flashDeals/${deal._id}`),
      },
    ];

    if (deal.status === "scheduled") {
      actions.push({
        label: "Edit",
        icon: <Edit className="h-4 w-4" />,
        onClick: () => router.push(`/(admin)/flashDeals/${deal._id}/edit`),
      });
    }

    if (deal.status === "active") {
      actions.push({
        label: isPausing === deal._id ? "Pausing..." : "Pause",
        icon: <Pause className="h-4 w-4" />,
        onClick: () => handlePause(deal._id),
      });
    }

    if (deal.status === "active" || deal.status === "paused") {
      actions.push({
        label: isEnding === deal._id ? "Ending..." : "End Now",
        icon: <Square className="h-4 w-4" />,
        onClick: () => handleEnd(deal._id),
      });
    }

    actions.push({
      label: "Duplicate Deal",
      icon: <Copy className="h-4 w-4" />,
      onClick: () => {
        // Implement duplicate
        console.log("Duplicating deal:", deal._id);
      },
    });

    if (deal.status === "scheduled") {
      actions.push({
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: () => {
          if (confirm("Are you sure you want to delete this deal?")) {
            // Implement delete
            console.log("Deleting deal:", deal._id);
          }
        },
      });
    }

    return actions;
  };

  const getSortingFromParams = () => {
    switch (params.sort) {
      case "recently-created":
        return { id: "createdAt", direction: "desc" as const };
      case "oldest-created":
        return { id: "createdAt", direction: "asc" as const };
      case "start-date-asc":
        return { id: "startDate", direction: "asc" as const };
      case "start-date-desc":
        return { id: "startDate", direction: "desc" as const };
      case "revenue-desc":
        return { id: "totalRevenue", direction: "desc" as const };
      case "units-sold-desc":
        return { id: "totalUnitsSold", direction: "desc" as const };
      default:
        return { id: "createdAt", direction: "desc" as const };
    }
  };

  let filteredData = [...data];
  if (params.status !== "all") {
    filteredData = filteredData.filter((d) => d.status === params.status);
  }
  if (params.dealType !== "all") {
    filteredData = filteredData.filter((d) => d.dealType === params.dealType);
  }
  if (params.q) {
    const q = params.q.toLowerCase();
    filteredData = filteredData.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.products.some((p) =>
          p.productId.name.toLowerCase().includes(q) ||
          p.productId.sku.toLowerCase().includes(q)
        )
    );
  }

  const sorting = getSortingFromParams();
  filteredData.sort((a, b) => {
    const col = columns.find((c) => c.id === sorting.id);
    if (!col) return 0;

    const aValue = col.accessorFn ? col.accessorFn(a) : col.accessorKey ? (a as Record<string, unknown>)[col.accessorKey] : "";
    const bValue = col.accessorFn ? col.accessorFn(b) : col.accessorKey ? (b as Record<string, unknown>)[col.accessorKey] : "";

    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sorting.direction === "asc" ? comparison : -comparison;
  });

  return (
    <DataTable
      data={filteredData}
      columns={columns}
      isLoading={isLoading}
      error={error}
      enableSearch={true}
      searchPlaceholder="Search by title, product name, SKU…"
      globalFilter={params.q}
      onGlobalFilterChange={(value) => {
        const newParams = buildQuery({ q: value, page: 1 }, params);
        router.push(`/flashDeals${newParams}`);
      }}
      enableSorting={true}
      defaultSorting={getSortingFromParams()}
      onSortingChange={(sorting) => {
        if (!sorting) return;
        let sortParam = "recently-created";
        if (sorting.id === "createdAt" && sorting.direction === "desc") sortParam = "recently-created";
        else if (sorting.id === "createdAt" && sorting.direction === "asc") sortParam = "oldest-created";
        else if (sorting.id === "startDate" && sorting.direction === "asc") sortParam = "start-date-asc";
        else if (sorting.id === "startDate" && sorting.direction === "desc") sortParam = "start-date-desc";
        else if (sorting.id === "totalRevenue" && sorting.direction === "desc") sortParam = "revenue-desc";
        else if (sorting.id === "totalUnitsSold" && sorting.direction === "desc") sortParam = "units-sold-desc";
        const newParams = buildQuery({ sort: sortParam, page: 1 }, params);
        router.push(`/flashDeals${newParams}`);
      }}
      enableFiltering={true}
      filters={filters}
      enablePagination={true}
      pageSize={params.pageSize as number}
      pageSizeOptions={[10, 25, 50, 100]}
      currentPage={params.page}
      onPageChange={(page) => {
        const newParams = buildQuery({ page }, params);
        router.push(`/flashDeals${newParams}`);
      }}
      onPageSizeChange={(size) => {
        const validSize = PAGE_SIZE_OPTIONS.find((opt) => opt === size) ?? DEFAULT_PAGE_SIZE;
        const newParams = buildQuery({ pageSize: validSize, page: 1 }, params);
        router.push(`/flashDeals${newParams}`);
      }}
      totalCount={total}
      manualPagination={false}
      enableExport={true}
      bulkActions={bulkActions}
      rowActions={getRowActions}
      enableColumnVisibility={true}
      enableExpanding={false}
      emptyMessage="No flash deals found."
      loadingMessage="Loading flash deals from database..."
      stickyHeader={true}
      responsive={true}
      getRowClassName={(row) => {
        if (row.status === "active") return "hover:bg-emerald-500/5";
        if (row.status === "paused") return "hover:bg-amber-500/5";
        return "";
      }}
    />
  );
}
