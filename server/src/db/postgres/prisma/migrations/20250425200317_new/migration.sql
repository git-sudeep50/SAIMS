/*
  Warnings:

  - You are about to drop the `_StudentCourses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_StudentCourses" DROP CONSTRAINT "_StudentCourses_A_fkey";

-- DropForeignKey
ALTER TABLE "_StudentCourses" DROP CONSTRAINT "_StudentCourses_B_fkey";

-- DropTable
DROP TABLE "_StudentCourses";

-- CreateTable
CREATE TABLE "StudentCourses" (
    "studentId" TEXT NOT NULL,
    "semesterId" TEXT NOT NULL,
    "courseCode" TEXT NOT NULL,

    CONSTRAINT "StudentCourses_pkey" PRIMARY KEY ("studentId","semesterId","courseCode")
);

-- AddForeignKey
ALTER TABLE "StudentCourses" ADD CONSTRAINT "StudentCourses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("enrollmentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCourses" ADD CONSTRAINT "StudentCourses_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
