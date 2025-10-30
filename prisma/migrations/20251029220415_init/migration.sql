-- CreateEnum
CREATE TYPE "ChatMessageRole" AS ENUM ('user', 'assistant', 'system');

-- CreateEnum
CREATE TYPE "ServiceEnum" AS ENUM ('openai', 'copilot');

-- CreateTable
CREATE TABLE "Chatbot" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT NOT NULL DEFAULT '',
    "allowCustomerRating" BOOLEAN NOT NULL DEFAULT false,
    "themeCss" TEXT,
    "buttonLabel" TEXT,
    "buttonStyleCss" TEXT,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.2,
    "service" "ServiceEnum" NOT NULL DEFAULT 'openai',
    "model" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    "allowedDomains" TEXT[],

    CONSTRAINT "Chatbot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatbotFile" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "chatbotId" INTEGER NOT NULL,

    CONSTRAINT "ChatbotFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatSession" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerRating" INTEGER,
    "customerFeedback" TEXT,
    "adminRating" INTEGER,
    "adminTag" TEXT[],
    "chatbotId" INTEGER NOT NULL,

    CONSTRAINT "ChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "role" "ChatMessageRole" NOT NULL,
    "chatSessionId" INTEGER NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chatbot_uuid_key" ON "Chatbot"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ChatbotFile_uuid_key" ON "ChatbotFile"("uuid");

-- CreateIndex
CREATE INDEX "ChatbotFile_chatbotId_idx" ON "ChatbotFile"("chatbotId");

-- CreateIndex
CREATE UNIQUE INDEX "ChatSession_uuid_key" ON "ChatSession"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessage_uuid_key" ON "ChatMessage"("uuid");

-- CreateIndex
CREATE INDEX "ChatMessage_chatSessionId_idx" ON "ChatMessage"("chatSessionId");

-- AddForeignKey
ALTER TABLE "ChatbotFile" ADD CONSTRAINT "ChatbotFile_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatSession" ADD CONSTRAINT "ChatSession_chatbotId_fkey" FOREIGN KEY ("chatbotId") REFERENCES "Chatbot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "ChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
