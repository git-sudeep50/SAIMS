-- AlterTable
ALTER TABLE "Programme" ADD COLUMN     "maximumCredits" INTEGER,
ADD COLUMN     "minimumCredits" INTEGER;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "cgpa" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "StudentCourses" ADD COLUMN     "grade" INTEGER,
ADD COLUMN     "marks" DOUBLE PRECISION,
ADD COLUMN     "status" TEXT;

-- CreateTable
CREATE TABLE "StudentSemester" (
    "rollNo" TEXT NOT NULL,
    "semesterNo" INTEGER NOT NULL,
    "programmeId" TEXT NOT NULL,
    "sgpa" DOUBLE PRECISION,

    CONSTRAINT "StudentSemester_pkey" PRIMARY KEY ("rollNo","semesterNo")
);

-- AddForeignKey
ALTER TABLE "StudentSemester" ADD CONSTRAINT "StudentSemester_rollNo_fkey" FOREIGN KEY ("rollNo") REFERENCES "Student"("enrollmentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentSemester" ADD CONSTRAINT "StudentSemester_semesterNo_programmeId_fkey" FOREIGN KEY ("semesterNo", "programmeId") REFERENCES "Semester"("semesterNo", "programmeId") ON DELETE RESTRICT ON UPDATE CASCADE;
