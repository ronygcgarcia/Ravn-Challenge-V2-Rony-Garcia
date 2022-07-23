-- AlterTable
ALTER TABLE "users" ALTER COLUMN "last_login" DROP NOT NULL,
ALTER COLUMN "token_valid_after" DROP NOT NULL;
