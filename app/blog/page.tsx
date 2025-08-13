import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPageProps {
  searchParams: { category?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;

  // Get all categories for filtering
  const categories = await prisma.category.findMany({
    where: { deleted_at: null },
    orderBy: { name: "asc" },
  });

  // Build the query for posts
  const whereClause: any = {
    status: "published",
    deleted_at: null,
  };

  if (category) {
    whereClause.categories = {
      some: {
        category: {
          slug: category,
          deleted_at: null,
        },
      },
    };
  }

  // Get posts with categories
  const posts = await prisma.post.findMany({
    where: whereClause,
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      author: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: { published_at: "desc" },
  });

  if (!posts.length) {
    notFound();
  }

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-8">
      {/* Author Section */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-gray-900">By Avi Charkham</h1>
      </div>

      {/* Category Filters */}
      <div className="flex justify-center space-x-2">
        <Link href="/blog">
          <Badge
            variant={!category ? "default" : "secondary"}
            className="cursor-pointer hover:bg-gray-100"
          >
            All
          </Badge>
        </Link>
        {categories.map((cat) => (
          <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
            <Badge
              variant={category === cat.slug ? "default" : "secondary"}
              className="cursor-pointer hover:bg-gray-100"
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b border-gray-200 pb-6 last:border-b-0">
            <Link href={`/blog/${post.slug}`} className="group">
              <div className="space-y-3">
                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-gray-600 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{formatDate(post.published_at!)}</span>
                    <span>·</span>
                    <span>{post.reading_time} min read</span>
                  </div>

                  {/* Categories */}
                  <div className="flex space-x-2">
                    {post.categories.map((postCategory) => (
                      <Badge key={postCategory.category.id} variant="outline" className="text-xs">
                        {postCategory.category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
