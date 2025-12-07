"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useContext } from "react";
import AdminAuthContext from "@/app/admin/context/AuthContext";
import Loader from "../../user/Loader";

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  skills: string[];
}

const EditCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const { authTokens } = useContext(AdminAuthContext) || {};
  const router = useRouter();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/courses/`
      );
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error("Failed to fetch courses:", error);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/admin/courses/${courseId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete course");
      }

      // Remove the course from local state
      setCourses(courses.filter((course) => course.id !== courseId));
      router.refresh(); // Refresh the page to reflect changes
    } catch (error) {
      console.error("Error deleting course:", error);
      setError("Failed to delete course. Please try again later.");
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto ml-4 min-h-screen bg-gray-50 p-5">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="m-5 text-center text-3xl font-bold text-gray-800">
          Manage Courses
        </h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && <Loader className="border-gray-800" />}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  {course.title}
                </h2>
                <div className="flex space-x-2">
                  <Link
                    href={`/admin/edit-course/${course.id}`}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit size={20} />
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <p className="line-clamp-2 text-sm text-gray-600">
                {course.description}
              </p>

              <div className="flex items-center text-gray-700">
                <span className="font-medium">Instructor:</span>
                <span className="ml-2">{course.instructor}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600"
                  >
                    {skill}
                  </span>
                ))}
                {course.skills.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{course.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditCoursesPage;
