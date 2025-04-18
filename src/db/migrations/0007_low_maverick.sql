ALTER TABLE "articles" ADD COLUMN "title_id" text DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
CREATE INDEX "articles_title_id_index" ON "articles" USING btree ("title_id");--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_title_id_unique" UNIQUE("title_id");