/*
  Warnings:

  - Added the required column `openedById` to the `CashClosing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingCash` to the `CashClosing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CashClosingStatus" AS ENUM ('OPEN', 'CLOSED');

-- DropForeignKey
ALTER TABLE "CashClosing" DROP CONSTRAINT "CashClosing_closedById_fkey";

-- AlterTable
ALTER TABLE "CashClosing" ADD COLUMN     "openedById" INTEGER NOT NULL,
ADD COLUMN     "openingCash" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "openingDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "CashClosingStatus" NOT NULL DEFAULT 'OPEN',
ALTER COLUMN "closingDate" DROP NOT NULL,
ALTER COLUMN "closingDate" DROP DEFAULT,
ALTER COLUMN "expectedCash" SET DEFAULT 0,
ALTER COLUMN "countedCash" DROP NOT NULL,
ALTER COLUMN "difference" DROP NOT NULL,
ALTER COLUMN "closedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CashClosing" ADD CONSTRAINT "CashClosing_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashClosing" ADD CONSTRAINT "CashClosing_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
