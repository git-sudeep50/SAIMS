/*
  Warnings:

  - You are about to drop the column `semesterId` on the `Course` table. All the data in the column will be lost.
  - Added the required column `courseType` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lecture` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `practical` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorial` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_semesterId_fkey";

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "semesterId",
ADD COLUMN     "courseType" TEXT NOT NULL,
ADD COLUMN     "lecture" INTEGER NOT NULL,
ADD COLUMN     "practical" INTEGER NOT NULL,
ADD COLUMN     "tutorial" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "SemesterCourses" (
    "id" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    CONSTRAINT "SemesterCourses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SemesterCourses" ADD CONSTRAINT "SemesterCourses_programmeId_fkey" FOREIGN KEY ("programmeId") REFERENCES "Programme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemesterCourses" ADD CONSTRAINT "SemesterCourses_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemesterCourses" ADD CONSTRAINT "SemesterCourses_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
