/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Service_code_key" ON "Service"("code");
