-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "reading_time" INTEGER NOT NULL DEFAULT 0,
    "published_at" DATETIME,
    "author_id" TEXT NOT NULL,
    CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "deleted_at" DATETIME,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "PostCategory" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT '',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "post_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    CONSTRAINT "PostCategory_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PostCategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_author_id_idx" ON "Post"("author_id");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "Post"("status");

-- CreateIndex
CREATE INDEX "Post_published_at_idx" ON "Post"("published_at");

-- CreateIndex
CREATE INDEX "Post_slug_idx" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_deleted_at_idx" ON "Post"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_deleted_at_idx" ON "Category"("deleted_at");

-- CreateIndex
CREATE INDEX "PostCategory_post_id_idx" ON "PostCategory"("post_id");

-- CreateIndex
CREATE INDEX "PostCategory_category_id_idx" ON "PostCategory"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "PostCategory_post_id_category_id_key" ON "PostCategory"("post_id", "category_id");
