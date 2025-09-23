-- AlterTable
ALTER TABLE "public"."ChatSession" ADD COLUMN     "adminRating" INTEGER,
ADD COLUMN     "adminTag" TEXT[],
ADD COLUMN     "customerFeedback" TEXT,
ADD COLUMN     "customerRating" INTEGER;
