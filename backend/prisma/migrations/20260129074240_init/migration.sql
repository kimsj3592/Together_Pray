-- CreateEnum
CREATE TYPE "GroupRole" AS ENUM ('admin', 'member');

-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('기도중', '부분 응답', '응답 완료');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "invite_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "role" "GroupRole" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_items" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "status" "PrayerStatus" NOT NULL DEFAULT '기도중',
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prayer_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_updates" (
    "id" TEXT NOT NULL,
    "prayer_item_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prayer_reactions" (
    "id" TEXT NOT NULL,
    "prayer_item_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reacted_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prayer_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "prayer_item_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "groups_invite_code_key" ON "groups"("invite_code");

-- CreateIndex
CREATE INDEX "group_members_user_id_idx" ON "group_members"("user_id");

-- CreateIndex
CREATE INDEX "group_members_group_id_idx" ON "group_members"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_members_user_id_group_id_key" ON "group_members"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "prayer_items_group_id_idx" ON "prayer_items"("group_id");

-- CreateIndex
CREATE INDEX "prayer_items_author_id_idx" ON "prayer_items"("author_id");

-- CreateIndex
CREATE INDEX "prayer_items_status_idx" ON "prayer_items"("status");

-- CreateIndex
CREATE INDEX "prayer_items_created_at_idx" ON "prayer_items"("created_at" DESC);

-- CreateIndex
CREATE INDEX "prayer_reactions_prayer_item_id_idx" ON "prayer_reactions"("prayer_item_id");

-- CreateIndex
CREATE INDEX "prayer_reactions_user_id_idx" ON "prayer_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prayer_reactions_prayer_item_id_user_id_reacted_at_key" ON "prayer_reactions"("prayer_item_id", "user_id", "reacted_at");

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_items" ADD CONSTRAINT "prayer_items_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_items" ADD CONSTRAINT "prayer_items_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_updates" ADD CONSTRAINT "prayer_updates_prayer_item_id_fkey" FOREIGN KEY ("prayer_item_id") REFERENCES "prayer_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_reactions" ADD CONSTRAINT "prayer_reactions_prayer_item_id_fkey" FOREIGN KEY ("prayer_item_id") REFERENCES "prayer_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prayer_reactions" ADD CONSTRAINT "prayer_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_prayer_item_id_fkey" FOREIGN KEY ("prayer_item_id") REFERENCES "prayer_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
