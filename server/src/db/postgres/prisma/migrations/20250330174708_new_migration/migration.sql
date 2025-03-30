/*
  Warnings:

  - You are about to drop the column `temporaryPassword` on the `Authentication` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN', 'ADVISOR', 'INSTRUCTOR');

-- AlterTable
ALTER TABLE "Authentication" DROP COLUMN "temporaryPassword";

-- CreateTable
CREATE TABLE "RoleAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "RoleAssignment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoleAssignment" ADD CONSTRAINT "RoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Authentication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
