import * as React from 'react'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

// GlobalCard - Wrapper around Card with consistent styling
function GlobalCard({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <Card
      className={cn(
        // Add any global card-specific styles here if needed
        className,
      )}
      {...props}
    />
  )
}

// GlobalCardHeader - Wrapper around CardHeader
function GlobalCardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <CardHeader
      className={cn(
        // Add any global header-specific styles here if needed
        className,
      )}
      {...props}
    />
  )
}

// GlobalCardTitle - Wrapper around CardTitle
function GlobalCardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <CardTitle
      className={cn(
        // Add any global title-specific styles here if needed
        className,
      )}
      {...props}
    />
  )
}

// GlobalCardDescription - Wrapper around CardDescription
function GlobalCardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <CardDescription
      className={cn(
        // Add any global description-specific styles here if needed
        className,
      )}
      {...props}
    />
  )
}

// GlobalCardContent - Wrapper around CardContent
function GlobalCardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <CardContent
      className={cn(
        // Add any global content-specific styles here if needed
        className,
      )}
      {...props}
    />
  )
}

// GlobalCardFooter - Wrapper around CardFooter
function GlobalCardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <CardFooter
      className={cn(
        // Add any global footer-specific styles here if needed
        className,
      )}
      {...props}
    />
  )
}

// GlobalCardAction - Wrapper around CardAction
function GlobalCardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <CardAction
      className={cn(
        // Add any global action-specific styles here if needed
        className,
      )}
      {...props}
    />
  )
}

export {
  GlobalCard,
  GlobalCardHeader,
  GlobalCardFooter,
  GlobalCardTitle,
  GlobalCardAction,
  GlobalCardDescription,
  GlobalCardContent,
}