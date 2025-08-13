import { getCurrentUser } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CreatePostForm } from "@/components/blog/CreatePostForm";
import { CreatePostProvider } from "@/components/blog/CreatePostContext";
import { CreatePostHeader } from "@/components/blog/CreatePostHeader";

export default async function CreatePostPage() {
  const user = await getCurrentUser();
  
  // Redirect to sign in if not authenticated
  if (!user) {
    redirect("/auth/signin?redirect=/blog/create");
  }

  // Fetch categories for the dropdown
  const categories = await prisma.category.findMany({
    where: { deleted_at: null },
    orderBy: { name: 'asc' },
  });

  // Filter out categories with empty IDs
  const validCategories = categories.filter(category => category.id && category.id.trim() !== '');

  console.log("Categories fetched:", categories);
  console.log("Valid categories:", validCategories);

  return (
    <CreatePostProvider>
      <CreatePostHeader />
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Post</h1>
        <CreatePostForm categories={validCategories} />
      </div>
    </CreatePostProvider>
  );
}
