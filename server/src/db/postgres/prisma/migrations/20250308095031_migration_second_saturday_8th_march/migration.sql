/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentNumber]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `enrollmentNumber` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "enrollmentNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Authentication" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Authentication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollmentNumber_key" ON "Student"("enrollmentNumber");
