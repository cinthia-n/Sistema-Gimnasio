/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('SUPPLEMENT', 'DRINK', 'SNACK', 'ACCESSORY', 'CLOTHING');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "clientId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Product_code_key" ON "Product"("code");

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
