"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { SimpleRichTextEditor } from "./SimpleRichTextEditor";
import { GrowingTitleInput } from "./GrowingTitleInput";
import { useCreatePost } from "./CreatePostContext";
import { SerializedEditorState } from "lexical";

const createPostSchema = z.object({
  title: z.string().min(1, { error: "Title is required" }),
  content: z.any(), // Rich text editor state
  categoryId: z.string().min(1, { error: "Please select a category" }),
});

type CreatePostData = z.infer<typeof createPostSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CreatePostFormProps {
  categories: Category[];
}

export function CreatePostForm({ categories }: CreatePostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { setIsSubmitting, setSubmitForm } = useCreatePost();

  console.log("CreatePostForm received categories:", categories);

  const form = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: null,
      categoryId: "",
    },
  });

  async function onSubmit(data: CreatePostData) {
    try {
      setIsLoading(true);
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/blog/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          status: "published",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create post");
      }

      setSuccess("Post published successfully!");
      
      // Redirect to the new post after a short delay
      setTimeout(() => {
        router.push(`/blog/${result.slug}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }

  // Expose the submit function to the context
  useEffect(() => {
    setSubmitForm(() => () => form.handleSubmit(onSubmit)());
  }, [form, setSubmitForm]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <GrowingTitleInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Add your title here"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories && categories.length > 0 ? (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id || "default"}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="min-h-[1.5rem] border-none">
                      <SimpleRichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Write your post content..."
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </form>
        </Form>
  );
}
