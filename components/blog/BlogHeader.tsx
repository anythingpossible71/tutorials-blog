"use client";

import { usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/permissions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Plus } from "lucide-react";
import Link from "next/link";
import { SignOutButton } from "@/components/blog/SignOutButton";
import Image from "next/image";

export function BlogHeader() {
  const pathname = usePathname();
  
  // Hide header on create post page
  if (pathname === "/blog/create") {
    return null;
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/blog" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="A4txt Logo"
            width={103}
            height={40}
            className="h-8 w-auto"
          />
        </Link>

        {/* User Menu and Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/blog/create">
            <Button size="sm" variant="outline" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Post</span>
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>user@example.com</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <SignOutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
