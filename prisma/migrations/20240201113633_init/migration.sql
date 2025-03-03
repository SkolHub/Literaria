-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "parentID" INTEGER,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleContent" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "articleID" INTEGER NOT NULL,

    CONSTRAINT "ArticleContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecommendedArticle" (
    "id" SERIAL NOT NULL,
    "articleID" INTEGER NOT NULL,

    CONSTRAINT "RecommendedArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_user_key" ON "User"("user");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleContent_articleID_key" ON "ArticleContent"("articleID");

-- CreateIndex
CREATE UNIQUE INDEX "RecommendedArticle_articleID_key" ON "RecommendedArticle"("articleID");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_parentID_fkey" FOREIGN KEY ("parentID") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleContent" ADD CONSTRAINT "ArticleContent_articleID_fkey" FOREIGN KEY ("articleID") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecommendedArticle" ADD CONSTRAINT "RecommendedArticle_articleID_fkey" FOREIGN KEY ("articleID") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
