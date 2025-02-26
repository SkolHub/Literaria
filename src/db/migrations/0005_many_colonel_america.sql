CREATE TABLE "drafts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "drafts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"author" text NOT NULL,
	"image" text NOT NULL,
	"parent_id" integer
);
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "path" integer[];--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "category_id" integer;--> statement-breakpoint
CREATE INDEX "articles_category_id_index" ON "articles" USING btree ("category_id");