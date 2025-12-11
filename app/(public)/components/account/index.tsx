import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { User } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { signIn, signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'

function Account() {
  const { data: session } = useSession()
  const userName = session?.user?.name || session?.user?.email || "User"
  return (
    <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="hidden md:flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <div className="text-left hidden lg:block">
                      <p className="text-xs text-muted-foreground">
                        {session ? `Hello, ${userName}` : "Hello, Sign in"}
                      </p>
                      <p className="text-sm font-medium">Account</p>
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {session ? (
                    <>
                      <DropdownMenuLabel>{userName}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Account</DropdownMenuItem>
                      <DropdownMenuItem>Profile</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => signIn()}>Sign in</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
  )
}

export default Account