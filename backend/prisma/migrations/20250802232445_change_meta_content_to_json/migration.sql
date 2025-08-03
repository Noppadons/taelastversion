/*
  Warnings:

  - Changed the type of `content` on the `MetaGuide` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."MetaGuide" DROP COLUMN "content",
ADD COLUMN     "content" JSON NOT NULL;
