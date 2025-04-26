-- AddForeignKey
ALTER TABLE "StudentCourses" ADD CONSTRAINT "StudentCourses_courseCode_fkey" FOREIGN KEY ("courseCode") REFERENCES "Course"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
