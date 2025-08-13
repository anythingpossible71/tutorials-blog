import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { RichTextRenderer } from "@/components/blog/RichTextRenderer";

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  // Get the post with categories and author
  const post = await prisma.post.findFirst({
    where: {
      slug,
      status: "published",
      deleted_at: null,
    },
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
  });

  if (!post) {
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

  // Simple markdown-like content rendering
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold text-gray-900 mt-6 mb-3">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-4 mb-2">{line.substring(4)}</h3>;
        }
        
        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          const elements = parts.map((part, i) => 
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          );
          return <p key={index} className="text-gray-700 leading-relaxed mb-4">{elements}</p>;
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraphs
        return <p key={index} className="text-gray-700 leading-relaxed mb-4">{line}</p>;
      });
  };

  return (
    <article className="max-w-3xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Author and Metadata */}
        <div className="flex items-center space-x-4 text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {post.author.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-medium">Avi Charkham</span>
          </div>
          <span>·</span>
          <span>{formatDate(post.published_at!)}</span>
          <span>·</span>
          <span>{post.reading_time} min read</span>
        </div>

        {/* Categories */}
        <div className="flex space-x-2">
          {post.categories.map((postCategory) => (
            <Badge key={postCategory.category.id} variant="outline">
              {postCategory.category.name}
            </Badge>
          ))}
        </div>
      </header>

      {/* Content */}
      <RichTextRenderer content={post.content} />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Written by Avi Charkham</span>
          <span>Published {formatDate(post.published_at!)}</span>
        </div>
      </footer>
    </article>
  );
}
