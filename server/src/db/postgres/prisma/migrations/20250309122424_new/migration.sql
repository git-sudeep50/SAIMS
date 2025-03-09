-- AlterTable
ALTER TABLE "Authentication" ALTER COLUMN "password" DROP NOT NULL,
ALTER COLUMN "temporaryPassword" DROP NOT NULL;
