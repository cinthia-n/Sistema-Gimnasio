-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "createdById" INTEGER,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "notes" TEXT;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
