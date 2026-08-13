/*
  Warnings:

  - You are about to drop the column `name` on the `ProductPrice` table. All the data in the column will be lost.
  - Added the required column `type` to the `ProductPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "salePrice" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "ProductPrice" DROP COLUMN "name",
ADD COLUMN     "type" TEXT NOT NULL;
