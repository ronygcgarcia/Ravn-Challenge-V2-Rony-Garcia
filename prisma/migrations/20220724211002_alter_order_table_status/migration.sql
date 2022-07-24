-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "status_id" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "order_status" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "order_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "order_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
