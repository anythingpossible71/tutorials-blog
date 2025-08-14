"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function HeaderActions() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  const handlePublish = () => {
    // Find the hidden submit button and click it
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      setIsLoading(true);
      submitButton.click();
      // Reset loading state after a delay
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  // Show Publish button on create page
  if (pathname === "/blog/create") {
    return (
      <Button 
        onClick={handlePublish} 
        disabled={isLoading}
        size="sm" 
        variant="outline" 
        className="flex items-center space-x-2"
      >
        {isLoading ? "Publishing..." : "Publish"}
      </Button>
    );
  }

  // Show Create button on other pages
  return (
    <Link href="/blog/create">
      <Button size="sm" variant="outline" className="flex items-center space-x-2">
        <Plus className="h-4 w-4" />
        <span>Create Post</span>
      </Button>
    </Link>
  );
}

