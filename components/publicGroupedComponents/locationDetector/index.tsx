import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { MapPin } from 'lucide-react'
import { ChevronDown } from 'lucide-react'

const locations = [
    "New York 10001",
    "Los Angeles 90001",
    "Chicago 60601",
    "Houston 77001",
    "Phoenix 85001",
    "Philadelphia 19101",
    "San Antonio 78201",
    "San Diego 92101",
    "Dallas 75201",
    "San Jose 95101",
  ]

export default function LocationDetector() {
  const [selectedLocation, setSelectedLocation] = useState("New York 10001")

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="hidden lg:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <MapPin className="h-4 w-4" />
        <div className="text-left">
          <p className="text-xs">Deliver to</p>
          <p className="font-medium text-foreground">{selectedLocation}</p>
        </div>
        <ChevronDown className="h-3 w-3 ml-1" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" className="w-56">
      <DropdownMenuLabel>Select Delivery Location</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {locations.map((location) => (
        <DropdownMenuItem
          key={location}
          onClick={() => setSelectedLocation(location)}
          className={selectedLocation === location ? "bg-primary/10" : ""}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {location}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
  )
}
