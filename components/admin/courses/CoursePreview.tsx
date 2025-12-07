import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { BsFileEarmarkText, BsStarFill } from "react-icons/bs";
import { FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { MdOndemandVideo, MdOutlineDescription } from "react-icons/md";
import { CourseContentType, CourseInfo } from "./CreateCourse";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseInfo: CourseInfo;
  courseCurriculumData: CourseContentType[];
  isloading: boolean;
  handleSubmit: () => void;
  mode: "EDIT" | "CREATE";
};

interface ImageViewerProps {
  cdnUrl?: string;
}

const CoursePreview: FC<Props> = ({
  courseInfo,
  courseCurriculumData,
  handleSubmit,
  setActive,
  active,
  mode,
  isloading,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "preview"
  >("overview");
  const [imageUrl, setImageUrl] = useState<string>("");

  const getTotalDuration = () => {
    return courseCurriculumData.reduce((total, item) => {
      const duration = parseInt(item.video_length) || 0;
      return total + duration;
    }, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };
  console.log(isloading);
  const ImageViewer = ({ cdnUrl }: ImageViewerProps) => {
    useEffect(() => {
      const fetchPreSignedUrl = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}do/presigned-url/`,
            {
              key: cdnUrl,
            }
          );
          setImageUrl(response.data.url);
        } catch (error) {
          console.error("Error fetching the presigned URL:", error);
        }
      };

      if (cdnUrl) {
        fetchPreSignedUrl();
      }
    }, [cdnUrl]);

    return imageUrl;
  };
  const ImageUrl = ImageViewer({ cdnUrl: courseInfo.thumbnail });

  return (
    <div className="mx-auto w-full max-w-screen-1200px px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-white">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold leading-tight md:text-4xl"
            >
              {courseInfo.title}
            </motion.h1>
            <div className="flex items-center space-x-4 text-blue-100">
              <span className="flex items-center">
                <FaUsers className="mr-2" />0 Students
              </span>
              <span className="flex items-center">
                <BsStarFill className="mr-2" />
                New Course
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Image
                src={imageUrl || "/default-avatar.png"}
                alt={courseInfo.instructor}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="text-sm opacity-75">Instructor</p>
                <p className="font-medium">{courseInfo.instructor}</p>
              </div>
            </div>
          </div>
          <div className="relative">
            {courseInfo.thumbnail ? (
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={ImageUrl}
                  alt="Course Thumbnail"
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
                {courseInfo.starter_video && (
                  <div
                    className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black opacity-40"
                    onClick={() => setActiveTab("preview")}
                  >
                    <div className="flex size-16 items-center justify-center rounded-full bg-white opacity-80 transition-transform group-hover:scale-110">
                      <MdOndemandVideo size={32} className="text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-xl bg-blue-800">
                <span className="text-blue-200">No thumbnail uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Details Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Navigation Tabs */}
          <div className="mb-6 flex space-x-2 border-b">
            {["overview", "curriculum", "preview"].map((tab) => (
              <button
                key={tab}
                onClick={() =>
                  setActiveTab(tab as "overview" | "curriculum" | "preview")
                }
                className={`border-b-2 px-4 py-2 font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            {activeTab === "overview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="mb-4 flex items-center text-xl font-semibold">
                    <MdOutlineDescription className="mr-2" size={24} />
                    Course Description
                  </h2>
                  <p className="whitespace-pre-line text-gray-600">
                    {courseInfo.description}
                  </p>
                </div>

                <div>
                  <h2 className="mb-4 text-xl font-semibold">
                    Skills You will Learn
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {courseInfo.skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-100"
                      >
                        {skill}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "curriculum" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Course Content</h2>
                  <div className="text-sm text-gray-600">
                    {courseCurriculumData.length} sections •{" "}
                    {formatDuration(getTotalDuration())} total length
                  </div>
                </div>

                <div className="space-y-4">
                  {courseCurriculumData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-lg bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-blue-100 p-2">
                            <MdOndemandVideo
                              className="text-blue-600"
                              size={20}
                            />
                          </div>
                          <h3 className="font-medium">{item.title}</h3>
                        </div>
                        <span className="flex items-center text-sm text-gray-600">
                          <IoMdTime className="mr-1" />
                          {item.video_length} min
                        </span>
                      </div>
                      <p className="ml-11 mt-2 text-gray-600">
                        {item.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "preview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="aspect-video overflow-hidden rounded-xl bg-black"
              >
                {courseInfo.starter_video ? (
                  <video controls className="size-full" src={""} />
                ) : (
                  <div className="flex size-full items-center justify-center text-gray-400">
                    No preview video available
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 text-center">
              <div className="mb-2 text-3xl font-bold text-gray-900">
                {parseFloat(courseInfo.price) === 0
                  ? "Free"
                  : `${courseInfo.price}`}
              </div>
              <button className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-700">
                Enroll Now
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <MdOndemandVideo className="mr-3 size-5 text-gray-400" />
                <span>{courseCurriculumData.length} lessons</span>
              </div>
              <div className="flex items-center">
                <IoMdTime className="mr-3 size-5 text-gray-400" />
                <span>{formatDuration(getTotalDuration())} total length</span>
              </div>
              <div className="flex items-center">
                <FaChalkboardTeacher className="mr-3 size-5 text-gray-400" />
                <span>Full lifetime access</span>
              </div>
              <div className="flex items-center">
                <BsFileEarmarkText className="mr-3 size-5 text-gray-400" />
                <span>Certificate of completion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => setActive(active - 1)}
          className="rounded-lg bg-gray-100 px-6 py-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200"
        >
          Previous Step
        </button>
        <button
          onClick={handleSubmit}
          disabled={isloading}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
        >
          {mode == "CREATE" ? "Create Course" : "Update Course"}
        </button>
      </div>
    </div>
  );
};
export default CoursePreview;
