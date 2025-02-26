ALTER TABLE "article_contents" RENAME COLUMN "id" TO "article_id";--> statement-breakpoint
ALTER TABLE "article_contents" DROP CONSTRAINT "article_contents_id_articles_id_fk";
--> statement-breakpoint
ALTER TABLE "articles" ALTER COLUMN "created_at" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "article_contents" ADD CONSTRAINT "article_contents_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;