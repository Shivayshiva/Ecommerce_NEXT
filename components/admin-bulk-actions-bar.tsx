"use client";

import { GlobalButton } from "@/components/ui/global-button";

export default function BulkActionsBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span className="font-medium">Bulk actions</span>
        <span className="text-muted-foreground">
          Select products below to enable
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <GlobalButton variant="outline" size="sm" title="Activate" />
        <GlobalButton variant="outline" size="sm" title="Deactivate" />
        <GlobalButton variant="outline" size="sm" title="Apply discount" />
        <GlobalButton variant="outline" size="sm" title="Update stock" />
        <GlobalButton variant="outline" size="sm" title="Change category" />
        <GlobalButton variant="outline" size="sm" title="Mark featured" />
        <GlobalButton variant="destructive" size="sm" title="Delete" />
      </div>
    </div>
  );
}