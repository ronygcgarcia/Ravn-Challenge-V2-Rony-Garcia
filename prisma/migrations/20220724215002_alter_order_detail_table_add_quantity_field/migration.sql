/*
  Warnings:

  - Added the required column `quantity` to the `order_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_details" ADD COLUMN     "quantity" INTEGER NOT NULL;
