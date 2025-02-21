CREATE TABLE "article_contents"
(
    "id"      integer PRIMARY KEY NOT NULL,
    "content" text                NOT NULL
);
--> statement-breakpoint
CREATE TABLE "articles"
(
    "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "articles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "created_at" timestamp(3) DEFAULT now() NOT NULL,
    "title"      text                       NOT NULL,
    "author"     text                       NOT NULL,
    "image"      text                       NOT NULL,
    "parent_id"  integer
);
--> statement-breakpoint
CREATE TABLE "highlight_articles"
(
    "id"         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "highlight_articles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
    "article_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "article_contents"
    ADD CONSTRAINT "article_contents_id_articles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."articles" ("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "highlight_articles"
    ADD CONSTRAINT "highlight_articles_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles" ("id") ON DELETE no action ON UPDATE no action;