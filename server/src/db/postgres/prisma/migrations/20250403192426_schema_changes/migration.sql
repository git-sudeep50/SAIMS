/*
  Warnings:

  - Changed the type of `name` on the `Semester` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Semester" DROP COLUMN "name",
ADD COLUMN     "name" INTEGER NOT NULL;
