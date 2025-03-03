CREATE TABLE IF NOT EXISTS "Article" (
	"id" serial PRIMARY KEY NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"image" text NOT NULL,
	"parentID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ArticleContent" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"articleID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RecommendedArticle" (
	"id" serial PRIMARY KEY NOT NULL,
	"articleID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"user" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "User_user_unique" UNIQUE("user")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Article" ADD CONSTRAINT "foreign" FOREIGN KEY ("parentID") REFERENCES "Article"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ArticleContent" ADD CONSTRAINT "ArticleContent_articleID_Article_id_fk" FOREIGN KEY ("articleID") REFERENCES "Article"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RecommendedArticle" ADD CONSTRAINT "RecommendedArticle_articleID_Article_id_fk" FOREIGN KEY ("articleID") REFERENCES "Article"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
