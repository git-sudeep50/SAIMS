/*
  Warnings:

  - You are about to drop the column `password` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "phone" TEXT;
