import React from 'react'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'

export default function Notification() {
  return (
    <div>
    <Button variant="ghost" size="icon" className="relative hidden md:flex">
    <Bell className="h-5 w-5" />
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
      3
    </span>
  </Button>
  </div>
  )
}