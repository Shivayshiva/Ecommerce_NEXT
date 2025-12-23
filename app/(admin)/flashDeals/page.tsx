"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tag, Package, DollarSign, Users, User } from "lucide-react";

import { GlobalTitle } from "@/components/ui/global-title";
import { GlobalButton } from "@/components/ui/global-button";
import { CustomTable, type Column } from "@/components/custom-table";
import { Badge } from "@/components/ui/badge";

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

type ApiFlashDeal = {
  _id: string;
  title: string;
  dealType: "flash-deal" | "lightning-deal";
  products: Array<{
    productId: {
      _id: string;
      name: string;
      sku: string;
    };
    initialStock: number;
    soldQuantity: number;
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

export default function FlashDealsPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-muted-foreground">Loading flash deals…</div>
      }
    >
      <FlashDealsPageContent />
    </Suspense>
  );
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

function parseSearchParams(searchParams: Record<string, string | string[] | undefined>) {
  const q = (searchParams.q as string) ?? "";
  const status = (searchParams.status as string) ?? "all";
  const dealType = (searchParams.dealType as string) ?? "all";
  const sort = (searchParams.sort as string) ?? "recently-created";

  const page = Math.max(1, Number(searchParams.page ?? "1") || 1);
  const pageSizeRaw = Number(searchParams.pageSize ?? DEFAULT_PAGE_SIZE);
  const pageSize: PageSize =
    (PAGE_SIZE_OPTIONS.find((opt) => opt === pageSizeRaw) ??
      DEFAULT_PAGE_SIZE) as PageSize;

  return {
    q,
    status,
    dealType,
    sort,
    page,
    pageSize,
  };
}



function filterAndSortDeals(allDeals: FlashDeal[], params: ReturnType<typeof parseSearchParams>) {
  let items = [...allDeals];

  if (params.q) {
    const q = params.q.toLowerCase();
    items = items.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.products.some((p) =>
          p.productId.name.toLowerCase().includes(q) ||
          p.productId.sku.toLowerCase().includes(q)
        )
    );
  }

  if (params.status !== "all") {
    items = items.filter((d) => d.status === params.status);
  }

  if (params.dealType !== "all") {
    items = items.filter((d) => d.dealType === params.dealType);
  }

  items.sort((a, b) => {
    switch (params.sort) {
      case "recently-created":
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest-created":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "start-date-asc":
        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      case "start-date-desc":
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      case "revenue-desc":
        return b.totalRevenue - a.totalRevenue;
      case "units-sold-desc":
        return b.totalUnitsSold - a.totalUnitsSold;
    }
  });

  return items;
}

type ParsedParams = ReturnType<typeof parseSearchParams>;




function FlashDealsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = parseSearchParams(Object.fromEntries(searchParams.entries()));

  const [allDeals, setAllDeals] = useState<FlashDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);



  const columns: Column<FlashDeal>[] = [
    {
      id: "title",
      header: "Deal Title",
      accessorKey: "title",
      cell: (row) => <span className="font-medium">{row.title}</span>,
      enableSorting: true,
      enableFiltering: true,
    },
    {
      id: "createdAt",
      header: "Created",
      accessorKey: "createdAt",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "dealType",
      header: "Type",
      accessorKey: "dealType",
      cell: (row) => (
        <Badge variant="outline">
          {row.dealType === "flash-deal" ? "Flash Deal" : "Lightning Deal"}
        </Badge>
      ),
      enableSorting: true,
      enableFiltering: true,
    },
    {
      id: "products",
      header: "Products",
      cell: (row) => (
        <span className="flex items-center gap-1">
          <Package className="h-4 w-4 text-muted-foreground" />
          {row.products.length} {row.products.length === 1 ? "product" : "products"}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (row) => statusBadge(row.status),
      enableSorting: true,
      enableFiltering: true,
    },
    {
      id: "startDate",
      header: "Start Time",
      accessorKey: "startDate",
      cell: (row) => new Date(row.startDate).toLocaleString(),
      enableSorting: true,
    },
    {
      id: "endDate",
      header: "End Time",
      accessorKey: "endDate",
      cell: (row) => new Date(row.endDate).toLocaleString(),
      enableSorting: true,
    },
    {
      id: "totalUnitsSold",
      header: "Units Sold",
      accessorKey: "totalUnitsSold",
      cell: (row) => (
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          {row.totalUnitsSold}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "totalRevenue",
      header: "Revenue",
      accessorKey: "totalRevenue",
      cell: (row) => (
        <span className="flex items-center gap-1 font-medium">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          ₹{Number(row.totalRevenue).toFixed(2)}
        </span>
      ),
      enableSorting: true,
    },
    {
      id: "createdBy",
      header: "Created By",
      cell: (row) => (
        <span className="flex items-center gap-1">
          <User className="h-4 w-4 text-muted-foreground" />
          {row.createdBy?.name || row.createdBy?.email || "System"}
        </span>
      ),
      enableSorting: true,
    },
  ];



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
        return undefined;
    }
  };

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // setIsLoading(true);
        // setError(null);

        // const queryParams = new URLSearchParams();
        // if (params.status !== "all") queryParams.set("status", params.status);
        // if (params.dealType !== "all") queryParams.set("dealType", params.dealType);

        // const response = await fetch(`/api/admin/flash-deals?${queryParams.toString()}`);
        // if (!response.ok) {
        //   throw new Error("Failed to fetch flash deals");
        // }

        // const data = await response.json();
        // const apiDeals: ApiFlashDeal[] = data.flashDeals ?? [];
        // const mapped = apiDeals.map(mapApiFlashDealToFlashDeal);

        // Dummy data for testing
        const dummyDeals: FlashDeal[] = [
          {
            _id: "1",
            title: "Summer Sale Flash Deal",
            dealType: "flash-deal",
            products: [
              {
                productId: {
                  _id: "p1",
                  name: "Wireless Headphones",
                  sku: "WH-001"
                }
              },
              {
                productId: {
                  _id: "p2",
                  name: "Bluetooth Speaker",
                  sku: "BS-002"
                }
              }
            ],
            status: "active",
            startDate: new Date("2025-12-15T10:00:00"),
            endDate: new Date("2025-12-20T23:59:59"),
            totalUnitsSold: 150,
            totalRevenue: 22500,
            createdBy: {
              name: "John Admin",
              email: "john@admin.com"
            },
            createdAt: new Date("2025-12-10T09:00:00")
          },
          {
            _id: "2",
            title: "Lightning Deal - Smart Watch",
            dealType: "lightning-deal",
            products: [
              {
                productId: {
                  _id: "p3",
                  name: "Smart Watch Pro",
                  sku: "SW-003"
                }
              }
            ],
            status: "scheduled",
            startDate: new Date("2025-12-25T00:00:00"),
            endDate: new Date("2025-12-25T02:00:00"),
            totalUnitsSold: 0,
            totalRevenue: 0,
            createdBy: {
              name: "Jane Manager",
              email: "jane@manager.com"
            },
            createdAt: new Date("2025-12-12T14:30:00")
          },
          {
            _id: "3",
            title: "Weekend Special",
            dealType: "flash-deal",
            products: [
              {
                productId: {
                  _id: "p4",
                  name: "Gaming Mouse",
                  sku: "GM-004"
                }
              },
              {
                productId: {
                  _id: "p5",
                  name: "Mechanical Keyboard",
                  sku: "MK-005"
                }
              },
              {
                productId: {
                  _id: "p6",
                  name: "Gaming Headset",
                  sku: "GH-006"
                }
              }
            ],
            status: "ended",
            startDate: new Date("2025-12-13T18:00:00"),
            endDate: new Date("2025-12-15T18:00:00"),
            totalUnitsSold: 89,
            totalRevenue: 15675,
            createdBy: {
              name: "Mike Sales",
              email: "mike@sales.com"
            },
            createdAt: new Date("2025-12-11T11:15:00")
          },
          {
            _id: "4",
            title: "Black Friday Deal",
            dealType: "flash-deal",
            products: [
              {
                productId: {
                  _id: "p7",
                  name: "4K Monitor",
                  sku: "4KM-007"
                }
              }
            ],
            status: "paused",
            startDate: new Date("2025-11-29T00:00:00"),
            endDate: new Date("2025-11-30T23:59:59"),
            totalUnitsSold: 45,
            totalRevenue: 22500,
            createdBy: {
              name: "Sarah Marketing",
              email: "sarah@marketing.com"
            },
            createdAt: new Date("2025-11-25T16:45:00")
          },
          {
            _id: "5",
            title: "New Year Lightning Sale",
            dealType: "lightning-deal",
            products: [
              {
                productId: {
                  _id: "p8",
                  name: "Wireless Earbuds",
                  sku: "WE-008"
                }
              },
              {
                productId: {
                  _id: "p9",
                  name: "Phone Case",
                  sku: "PC-009"
                }
              }
            ],
            status: "scheduled",
            startDate: new Date("2025-12-31T23:00:00"),
            endDate: new Date("2026-01-01T01:00:00"),
            totalUnitsSold: 0,
            totalRevenue: 0,
            createdBy: {
              name: "Tom Operations",
              email: "tom@operations.com"
            },
            createdAt: new Date("2025-12-14T10:20:00")
          }
        ];

        setAllDeals(dummyDeals);
      } catch (err) {
        console.error("Error fetching flash deals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [params.status, params.dealType]);

  const filtered = filterAndSortDeals(allDeals, params);

  return (
    <div className="space-y-6 w-full max-w-full">
      <GlobalTitle
        title="Flash Deals Management"
        description="View, filter, and manage all flash deals."
      >
        <Link href="/flashDeals/createDeal">
          <GlobalButton title="+ Create Flash Deal" size="sm" />
        </Link>
      </GlobalTitle>
      <CustomTable
        data={filtered}
        columns={columns}
        enableRowSelection={true}
        enableMultiRowSelection={true}
        enablePagination={true}
        enableSorting={true}
        enableColumnVisibility={true}
        enableGlobalFilter={true}
        enableExport={true}
        pageSize={params.pageSize}
        isLoading={isLoading}
        emptyMessage="No flash deals found."
        stickyHeader={true}
        maxHeight="600px"
        onRowClick={(row) => {
          router.push(`/flashDeals/${row._id}`);
        }}
      />


    </div>
  );
}

 

