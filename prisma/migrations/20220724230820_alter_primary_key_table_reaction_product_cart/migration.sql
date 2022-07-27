/*
  Warnings:

  - The primary key for the `products_carts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `reactions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "products_carts" DROP CONSTRAINT "products_carts_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "products_carts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "reactions_pkey" PRIMARY KEY ("id");
