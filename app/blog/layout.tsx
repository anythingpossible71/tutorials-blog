import { BlogHeader } from "@/components/blog/BlogHeader";

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <BlogHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
