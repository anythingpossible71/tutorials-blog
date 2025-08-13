"use client";

import { useCreatePost } from "./CreatePostContext";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function CreatePostHeader() {
  const { isSubmitting, submitForm } = useCreatePost();

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={submitForm}
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? "Publishing..." : "Save Draft"}</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            onClick={submitForm}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}
