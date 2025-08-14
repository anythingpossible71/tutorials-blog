"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function PublishButton() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  // Only show on create page
  if (pathname !== "/blog/create") {
    return null;
  }

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
