/*
  Warnings:

  - You are about to drop the column `isStudent` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `minimumStock` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `Product` table. All the data in the column will be lost.
  - Added the required column `supplierId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `ProductPrice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProductPriceType" AS ENUM ('MINORISTA', 'MAYORISTA');

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "isStudent";

-- AlterTable
ALTER TABLE "ClientService" ADD COLUMN     "isStudent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "minimumStock",
DROP COLUMN "salePrice",
ADD COLUMN     "minimumstock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ProductPrice" DROP COLUMN "type",
ADD COLUMN     "type" "ProductPriceType" NOT NULL;

-- CreateTable
CREATE TABLE "ServicePrice" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "isStudent" BOOLEAN NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServicePrice_serviceId_isStudent_key" ON "ServicePrice"("serviceId", "isStudent");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePrice" ADD CONSTRAINT "ServicePrice_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
