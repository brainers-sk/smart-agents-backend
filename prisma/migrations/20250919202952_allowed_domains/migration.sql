/*
  Warnings:

  - You are about to drop the `ChatbotDomain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ChatbotDomain" DROP CONSTRAINT "ChatbotDomain_chatbotId_fkey";

-- AlterTable
ALTER TABLE "public"."Chatbot" ADD COLUMN     "allowedDomains" TEXT[];

-- DropTable
DROP TABLE "public"."ChatbotDomain";
