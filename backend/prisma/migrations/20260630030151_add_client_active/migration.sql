/*
  Warnings:

  - You are about to drop the column `isActive` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `isStudent` on the `Client` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `Client` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CashMovementStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CashReferenceType" AS ENUM ('MEMBERSHIP_PAYMENT', 'PRODUCT_SALE', 'PURCHASE', 'OTHER_EXPENSE');

-- AlterTable
ALTER TABLE "CashMovement" ADD COLUMN     "referenceType" "CashReferenceType",
ADD COLUMN     "status" "CashMovementStatus" NOT NULL DEFAULT 'CONFIRMED';

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "isActive",
DROP COLUMN "isStudent",
DROP COLUMN "schoolName",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "email" TEXT;
