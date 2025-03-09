/*
  Warnings:

  - Added the required column `temporaryPassword` to the `Authentication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Authentication" ADD COLUMN     "temporaryPassword" TEXT NOT NULL;
