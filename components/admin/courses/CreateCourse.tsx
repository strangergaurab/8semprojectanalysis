"use client";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AdminAuthContext from "@/app/admin/context/AuthContext";
import CourseInformation from "./CourseInformation";
import CourseOptions from "./CourseOptions";
import CoursePreview from "./CoursePreview";
import CourseContent from "./CourseContent";
import { CourseData } from "@/app/admin/edit-course/[id]/page";

import { abort } from "process";

import toast from "react-hot-toast";

export type statusType =
  | "IDEL"
  | "UPLOADING"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILURE"
  | "EMPTY";

export type ModeType = "CREATE" | "EDIT";

export interface CourseContentType {
  id: number;
  progress: number | null;
  taskId: string | null;
  FileStatus: statusType;
  videoFile: File | null;
  isCollapsed?: boolean;
  title: string;
  description: string;
  url: string;
  video_length: string;
}

export interface CourseInfo {
  starter_video: [];
  title: string;
  description: string;
  thumbnail: string;
  thubnailUrl: string | null;
  price: string;
  instructor: string;
  skills: string[];
}

type PropsType = {
  mode: ModeType;
  data: CourseData | null;
  courserId: string | null;
};

const CreateCourse = ({
  mode = "CREATE",
  data = null,
  courserId = null,
}: PropsType) => {
  const [active, setActive] = useState(0);
  const { authTokens } = useContext(AdminAuthContext) || {};
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  // State for course information
  const [courseInfo, setCourseInfo] = useState<CourseInfo>(() => {
    if (mode === "CREATE")
      return {
        starter_video: [],
        title: "",
        description: "",
        thubnailUrl: "",
        thumbnail: "",
        price: "",
        instructor: "",
        skills: [],
      };

    if (mode === "EDIT" && data) {
      return data?.courseInfo;
    }
    throw abort;
  });
  const [courseCurriculumData, setCourseCurriculumData] = useState<
    CourseContentType[]
  >(() => {
    if (mode === "CREATE") {
      return [
        {
          id: 0,
          progress: null,
          videoFile: null,
          taskId: null,
          FileStatus: "EMPTY",
          title: "title 1",
          description: "des of course",
          url: "",
          video_length: "",
        },
      ];
    }

    if (mode === "EDIT" && data) {
      return data?.courseCurriculumData;
    }
    throw abort;
  });

  console.log(courseInfo, courseCurriculumData);

  const handleSubmit = async () => {
    setIsLoading(true);
    const formattedCourseCurriculumData = courseCurriculumData.map(
      (courseCurriculum) => ({
        title: courseCurriculum.title,
        description: courseCurriculum.description,
        url: courseCurriculum.url,
        video_length: courseCurriculum.video_length,
      })
    );
    const data = {
      title: courseInfo.title,
      description: courseInfo.description,
      thumbnail: courseInfo.thumbnail,
      curriculum: formattedCourseCurriculumData,
      price: courseInfo.price,
      instructor: courseInfo.instructor,
      skills: courseInfo.skills,
    };
    try {
      let response;
      if (mode === "CREATE") {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/courses/`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
      } else {
        response = await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/courses/${courserId}`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );
      }
      setIsLoading(false);
      toast.success("Course created successfully");
      router.push("/admin/edit-course");
      console.log(`Course ${mode} successfully:`, response.data);
    } catch (error) {
      setIsLoading(false);
      toast.error(
        `Failed to ${mode === "CREATE" ? "create" : "update"} course`
      );
      console.error("Error creating course:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="w-full border-b p-5">
        <CourseOptions active={active} setActive={setActive} />
      </div>
      <div className="w-full">
        {active === 0 && (
          <CourseInformation
            courseInfo={courseInfo}
            setCourseInfo={setCourseInfo}
            active={active}
            setActive={setActive}
            mode={mode}
          />
        )}
        {active === 1 && (
          <CourseContent
            mode={mode}
            courseCurriculumData={courseCurriculumData}
            setCourseCurriculumData={setCourseCurriculumData}
            active={active}
            setActive={setActive}
          />
        )}
        {active === 2 && (
          <CoursePreview
            courseInfo={courseInfo}
            courseCurriculumData={courseCurriculumData}
            handleSubmit={handleSubmit}
            active={active}
            setActive={setActive}
            mode={mode}
            isloading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
