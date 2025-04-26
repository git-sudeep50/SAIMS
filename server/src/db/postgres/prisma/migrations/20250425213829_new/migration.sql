/*
  Warnings:

  - You are about to drop the column `semesterId` on the `AdvisorMapping` table. All the data in the column will be lost.
  - The primary key for the `Semester` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Semester` table. All the data in the column will be lost.
  - You are about to drop the column `semesterId` on the `SemesterCourses` table. All the data in the column will be lost.
  - You are about to drop the column `currentSemesterId` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `StudentCourses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `semesterNo` to the `AdvisorMapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterNo` to the `Semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterNo` to the `SemesterCourses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentSemesterNo` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programmeId` to the `StudentCourses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `semesterId` on the `StudentCourses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AdvisorMapping" DROP CONSTRAINT "AdvisorMapping_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "SemesterCourses" DROP CONSTRAINT "SemesterCourses_semesterId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_currentSemesterId_fkey";

-- DropForeignKey
ALTER TABLE "StudentCourses" DROP CONSTRAINT "StudentCourses_semesterId_fkey";

-- AlterTable
ALTER TABLE "AdvisorMapping" DROP COLUMN "semesterId",
ADD COLUMN     "semesterNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Semester" DROP CONSTRAINT "Semester_pkey",
DROP COLUMN "id",
ADD COLUMN     "semesterNo" INTEGER NOT NULL,
ADD CONSTRAINT "Semester_pkey" PRIMARY KEY ("semesterNo", "programmeId");

-- AlterTable
ALTER TABLE "SemesterCourses" DROP COLUMN "semesterId",
ADD COLUMN     "semesterNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "currentSemesterId",
ADD COLUMN     "currentSemesterNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "StudentCourses" DROP CONSTRAINT "StudentCourses_pkey",
ADD COLUMN     "programmeId" TEXT NOT NULL,
DROP COLUMN "semesterId",
ADD COLUMN     "semesterId" INTEGER NOT NULL,
ADD CONSTRAINT "StudentCourses_pkey" PRIMARY KEY ("studentId", "semesterId", "courseCode");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_currentSemesterNo_programmeId_fkey" FOREIGN KEY ("currentSemesterNo", "programmeId") REFERENCES "Semester"("semesterNo", "programmeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemesterCourses" ADD CONSTRAINT "SemesterCourses_semesterNo_programmeId_fkey" FOREIGN KEY ("semesterNo", "programmeId") REFERENCES "Semester"("semesterNo", "programmeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourses" ADD CONSTRAINT "StudentCourses_semesterId_programmeId_fkey" FOREIGN KEY ("semesterId", "programmeId") REFERENCES "Semester"("semesterNo", "programmeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdvisorMapping" ADD CONSTRAINT "AdvisorMapping_semesterNo_programmeId_fkey" FOREIGN KEY ("semesterNo", "programmeId") REFERENCES "Semester"("semesterNo", "programmeId") ON DELETE RESTRICT ON UPDATE CASCADE;
