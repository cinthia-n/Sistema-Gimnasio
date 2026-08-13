ALTER TABLE "Purchase"
ADD COLUMN "paymentMethod" "PaymentMethod";

UPDATE "Purchase"
SET "paymentMethod" = 'CASH'
WHERE "paymentMethod" IS NULL;

ALTER TABLE "Purchase"
ALTER COLUMN "paymentMethod" SET NOT NULL;