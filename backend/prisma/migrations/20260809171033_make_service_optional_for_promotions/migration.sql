-- DropForeignKey
ALTER TABLE "ClientService" DROP CONSTRAINT "ClientService_serviceId_fkey";

-- AlterTable
ALTER TABLE "ClientService" ALTER COLUMN "serviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ClientService" ADD CONSTRAINT "ClientService_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE SET NULL ON UPDATE CASCADE;
