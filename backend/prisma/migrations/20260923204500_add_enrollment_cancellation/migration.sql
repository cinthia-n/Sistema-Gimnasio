-- AlterEnum
ALTER TYPE "CashReferenceType" ADD VALUE 'MEMBERSHIP_PAYMENT_REVERSAL';

-- AlterTable
ALTER TABLE "ClientService" ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledById" INTEGER;

-- AddForeignKey
ALTER TABLE "ClientService" ADD CONSTRAINT "ClientService_cancelledById_fkey" FOREIGN KEY ("cancelledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
