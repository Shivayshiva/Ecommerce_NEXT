import { ReactNode } from "react";

interface GlobalTitleProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function GlobalTitle({ title, description, children }: GlobalTitleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}