/*
  Warnings:

  - You are about to drop the column `description` on the `CashMovement` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CashMovement` table. All the data in the column will be lost.
  - Added the required column `concept` to the `CashMovement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `CashMovement` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CashMovement" DROP CONSTRAINT "CashMovement_userId_fkey";

-- AlterTable
ALTER TABLE "CashMovement" DROP COLUMN "description",
DROP COLUMN "userId",
ADD COLUMN     "concept" TEXT NOT NULL,
ADD COLUMN     "createdById" INTEGER NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "referenceId" INTEGER;

-- AddForeignKey
ALTER TABLE "CashMovement" ADD CONSTRAINT "CashMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
