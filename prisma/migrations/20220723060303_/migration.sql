/*
  Warnings:

  - The primary key for the `profiles_roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `profiles_roles` table. All the data in the column will be lost.
  - The primary key for the `users_profiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users_profiles` table. All the data in the column will be lost.
  - Added the required column `valid` to the `refresh_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profiles_roles" DROP CONSTRAINT "profiles_roles_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "profiles_roles_pkey" PRIMARY KEY ("profile_id", "role_id");

-- AlterTable
ALTER TABLE "refresh_token" ADD COLUMN     "valid" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users_profiles" DROP CONSTRAINT "users_profiles_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "users_profiles_pkey" PRIMARY KEY ("profile_id", "user_id");
