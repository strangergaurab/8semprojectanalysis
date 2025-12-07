import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { AiOutlinePlusCircle, AiOutlineDelete } from "react-icons/ai";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { BiAddToQueue } from "react-icons/bi";
import AdminAuthContext from "@/app/admin/context/AuthContext";
import { Progress } from "@/app/components/ui/progress";
import { CourseContentType, statusType } from "./CreateCourse";
import { deleteVideo, getVideoDuration } from "../helper/helper";

type Props = {
  active: number;
  setActive: (active: number) => void;
  courseCurriculumData: CourseContentType[];
  setCourseCurriculumData: React.Dispatch<
    React.SetStateAction<CourseContentType[]>
  >;
  mode: "EDIT" | "CREATE";
};

export default function CourseContent({
  active,
  setActive,
  courseCurriculumData,
  setCourseCurriculumData,
  mode,
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(
    Array(courseCurriculumData.length).fill(false)
  );

  const { authTokens } = useContext(AdminAuthContext) || {};
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => {
    const listWithTaskId = courseCurriculumData.filter(
      (curriculumItem) => curriculumItem.taskId !== null
    );
    console.log("curriculum with taskid", listWithTaskId);
    if (listWithTaskId.length) {
      console.log("inide effet", "\n\n\n\n");
      const interval = setInterval(() => {
        listWithTaskId.forEach(async (curriculumItem) => {
          try {
            console.log("polling useeffect ");
            const { data } = await axios.get(
              `${process.env.NEXT_PUBLIC_API_URL}do/upload-video/`,
              {
                params: { task_id: curriculumItem.taskId },
              }
            );
            console.log(data, "processing video\n\n\n");
            if (data.status === "success") {
              setCourseCurriculumData((prev) =>
                prev.map((c) =>
                  c.id === curriculumItem.id
                    ? {
                        ...c,
                        FileStatus: "SUCCESS" as statusType,
                        taskId: null,
                        progress: 100,
                      }
                    : c
                )
              );
              toast.success("Video processing completed!");
              clearInterval(interval);
            } else if (data.status === "processing") {
              setCourseCurriculumData((prev) =>
                prev.map((c) =>
                  c.id === curriculumItem.id
                    ? {
                        ...c,

                        FileStatus: "PROCESSING" as statusType,
                        progress: data.progress,
                      }
                    : c
                )
              );
            } else if (data.status === "failure") {
              setCourseCurriculumData((prev) =>
                prev.map((c) =>
                  c.id === curriculumItem.id
                    ? {
                        ...c,
                        FileStatus: "FAILURE" as statusType,
                        taskId: null,
                        progress: 0,
                      }
                    : c
                )
              );
            }
          } catch (error) {
            console.error("Error polling for progress:", error);
            setCourseCurriculumData((prev) =>
              prev.map((c) =>
                c.id === curriculumItem.id
                  ? {
                      ...c,
                      FileStatus: "FAILURE" as statusType,
                      taskId: null,
                      progress: 0,
                    }
                  : c
              )
            );
          }
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [courseCurriculumData, setCourseCurriculumData]);

  const handleCollapseToggle = (id: number) => {
    const updatedCollapsed = [...isCollapsed];
    updatedCollapsed[id] = !updatedCollapsed[id];
    setIsCollapsed(updatedCollapsed);
  };

  const handleInputChange = async (
    id: number,
    field: keyof CourseContentType | "videoFile",
    value: string | File | null
  ) => {
    console.log("handleInput", id, field, value);

    // Select the item from the curriculum data
    let selectCurriculumItem = courseCurriculumData.filter(
      (curriculumItem) => curriculumItem.id === id
    )[0];
    console.log(selectCurriculumItem);
    if (value instanceof File) {
      const processedFile = await processVideoFile(value);
      if (!processedFile) return;

      // Update state with video file information
      updateCurriculumWithVideo(id, processedFile);
      return;
    }
    // Handle regular field updates
    setCourseCurriculumData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };
  const processVideoFile = async (file: File): Promise<File | null> => {
    try {
      // Process filename
      const fileName = file.name;
      const lastDotIndex = fileName.lastIndexOf(".");
      const name =
        lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
      const extension = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : "";
      const trimmedName = name.trim().replace(/\s+/g, "_");

      // Create new file with processed name
      const processedFile = new File([file], `${trimmedName}${extension}`, {
        type: file.type,
      });

      return processedFile;
    } catch (error) {
      console.error("Error processing video file:", error);
      return null;
    }
  };

  const updateCurriculumWithVideo = (id: number, videoFile: File) => {
    // Update initial video file state
    setCourseCurriculumData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              videoFile,
              video_length: "0.00",
              FileStatus: "IDEL",
              progress: 0,
            }
          : item
      )
    );

    getVideoDuration(videoFile)
      .then((duration) => {
        console.log(`Video Duration: ${duration} seconds`);

        setCourseCurriculumData((prev) =>
          prev.map((curriculumItem) =>
            curriculumItem.id === id
              ? { ...curriculumItem, video_length: `${duration}` }
              : curriculumItem
          )
        );
      })
      .catch((error) => {
        console.error("Error extracting video duration", error);
        toast.error("Failed to get video duration");
      });
  };

  const handleFileUpload = async (id: number) => {
    const videoFile = courseCurriculumData[id].videoFile;

    if (!videoFile) {
      toast.error("Please select a video file first!");
      return;
    }

    // Validate file size and type
    const maxSize = 4000 * 1024 * 1024; // 3GB
    if (videoFile.size > maxSize) {
      toast.error("File size too large. Maximum size is 3 GB");
      return;
    }

    if (!videoFile.type.startsWith("video/")) {
      toast.error("Please upload a valid video file");
      return;
    }

    try {
      setCourseCurriculumData((prev) =>
        prev.map((curriculumItem) =>
          curriculumItem.id === id
            ? {
                ...curriculumItem,
                progress: 0,
                FileStatus: "UPLOADING",
              }
            : curriculumItem
        )
      );

      // 1. Get the pre-signed URL from the backend
      const presignedUrlResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}do/get-upload-url/`,
        {
          params: {
            file_name: videoFile.name,
            content_type: videoFile.type,
          },
          headers: {
            Authorization: `Bearer ${authTokens?.access_token}`,
          },
        }
      );

      const { upload_url, cdn_url } = presignedUrlResponse.data;

      // Step 2: Upload to DigitalOcean using presigned URL
      await axios.put(upload_url, videoFile, {
        headers: {
          "Content-Type": videoFile.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setCourseCurriculumData((prev) =>
              prev.map((curriculumItem) =>
                curriculumItem.id === id
                  ? {
                      ...curriculumItem,
                      progress,
                      FileStatus: "UPLOADING",
                    }
                  : curriculumItem
              )
            );
          }
        },
      });

      // 3. Send the CDN URL to the backend for processing

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}do/upload-video/`,
        { cdn_url }
      );
      console.log(response, "final this give cdn url \n\n\\n\n");

      setCourseCurriculumData((prev) =>
        prev.map((curriculumItem) =>
          curriculumItem.id === id
            ? {
                ...curriculumItem,
                progress: 0,
                url: response.data.cdn_url,
                FileStatus: "PROCESSING",
              }
            : curriculumItem
        )
      );

      setCourseCurriculumData((prev) =>
        prev.map((curriculumItem) =>
          curriculumItem.id === id
            ? { ...curriculumItem, taskId: response.data.task_id }
            : curriculumItem
        )
      );
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video. Please try again.");
      setCourseCurriculumData((prev) =>
        prev.map((curriculumItem) =>
          curriculumItem.id === id
            ? {
                ...curriculumItem,
                progress: 0,
                FileStatus: "FAILURE",
              }
            : curriculumItem
        )
      );
    }
  };

  const addNewContent = () => {
    const lastContent = courseCurriculumData[courseCurriculumData.length - 1];
    const canAddcontent =
      mode === "CREATE"
        ? Boolean(
            lastContent?.title &&
              lastContent?.description &&
              lastContent?.videoFile &&
              lastContent?.video_length
          )
        : Boolean(
            lastContent?.title &&
              lastContent?.description &&
              lastContent?.url &&
              lastContent?.video_length
          );

    if (canAddcontent) {
      const newContent: CourseContentType = {
        id: courseCurriculumData.length,
        taskId: null,
        progress: 0,
        FileStatus: "EMPTY",
        videoFile: null,
        title: `${courseCurriculumData.length + 1}`,
        description: `${courseCurriculumData.length + 1}`,
        url: "",
        video_length: "",
      };
      setCourseCurriculumData([...courseCurriculumData, newContent]);
    } else {
      toast.error("Please complete the last section before adding a new one!");
    }
  };

  const removeContent = async (id: number) => {
    try {
      const videoUrl = courseCurriculumData[id].url;
      const accesstoken = authTokens?.access_token;
      if (videoUrl && accesstoken) {
        await deleteVideo(videoUrl, accesstoken);
      }

      const updatedData = courseCurriculumData
        .filter((_, i) => i !== id)
        .map((content, index) => ({
          ...content,
          id: index,
        }));

      setCourseCurriculumData(updatedData);

      // Update collapse states
      setIsCollapsed((prev) => prev.filter((_, i) => i !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete video"
      );
    }
  };

  const moveBack = () => {
    const permission = courseCurriculumData.some(
      (curriculumeItem) =>
        curriculumeItem.FileStatus === "IDEL" ||
        curriculumeItem.FileStatus === "UPLOADING" ||
        curriculumeItem.FileStatus === "PROCESSING"
    );
    if (permission) {
      console.log(
        "There is at least one item with FileStatus !== 'COMPLETED' and FileStatus === 'IDLE'."
      );
    } else {
      console.log("No such item exists.");
    }

    console.log("moving prev permission", permission);
    if (permission) {
      toast.error("All video file must be processed");
      return;
    }
    setActive(active - 1);
  };

  const moveNext = () => {
    const permission = courseCurriculumData.some(
      (curriculumeItem) =>
        curriculumeItem.FileStatus === "IDEL" ||
        curriculumeItem.FileStatus === "UPLOADING" ||
        curriculumeItem.FileStatus === "PROCESSING"
    );
    console.log("movving next permission", permission);

    if (permission) {
      toast.error(
        "Please complete all sections and ensure videos status is compleetd!"
      );
      return;
    }

    setActive(active + 1);
  };

  const getUploadStatusText = (id: number) => {
    const selectedCurriculumItem = courseCurriculumData.filter(
      (currriculumItem) => currriculumItem.id === id
    )[0];
    const status = selectedCurriculumItem.FileStatus;
    const progress = selectedCurriculumItem.progress;

    switch (status) {
      case "UPLOADING":
        return `Uploading video: ${progress}%`;
      case "PROCESSING":
        return "Processing video... This may take a few minutes";
      case "SUCCESS":
        return "Video uploaded and processed successfully";
      case "FAILURE":
        return "Error uploading video. Please try again";
    }
  };

  const handleVideoDelete = async (id: number) => {
    try {
      const videoUrl = courseCurriculumData[id].url;
      const accesstoken = authTokens?.access_token;

      if (videoUrl && accesstoken) {
        await deleteVideo(videoUrl, accesstoken);

        if (fileInputRefs.current[id]) {
          fileInputRefs.current[id]!.value = "";
        }
        // Update the course curriculum data to remove only the video-related fields
        setCourseCurriculumData((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  videoFile: null,
                  url: "",
                  video_length: "",
                  FileStatus: "EMPTY",
                  progress: 0,
                  taskId: null,
                }
              : item
          )
        );

        toast.success("Video deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete video"
      );
    }
  };

  const insertNewContent = (position: number) => {
    // Create the new content with a temporary ID
    const newContent: CourseContentType = {
      id: position,
      taskId: null,
      progress: 0,
      FileStatus: "EMPTY",
      videoFile: null,
      title: `New Section`,
      description: `New Section Description`,
      url: "",
      video_length: "",
    };

    // Insert the new content and reorder all IDs
    const updatedData = courseCurriculumData.reduce(
      (acc: CourseContentType[], curr, idx) => {
        if (idx === position) {
          acc.push(newContent);
        }
        if (idx >= position) {
          acc.push({ ...curr, id: curr.id + 1 });
        } else {
          acc.push(curr);
        }
        return acc;
      },
      []
    );

    if (position === courseCurriculumData.length) {
      updatedData.push(newContent);
    }

    setCourseCurriculumData(updatedData);

    // Update collapse states
    setIsCollapsed((prev) => {
      const newCollapsed = [...prev];
      newCollapsed.splice(position, 0, false);
      return newCollapsed;
    });
  };
  return (
    <div className="mx-auto mt-8 w-[90%]">
      <form>
        {courseCurriculumData.map((content, index) => {
          const id = content.id;
          return (
            <div key={id} className="mt-20 rounded-lg bg-white p-6 shadow-lg">
              <div className="flex justify-center">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-indigo-600 hover:bg-indigo-200"
                  onClick={() => insertNewContent(index)}
                >
                  <BiAddToQueue size={20} />
                  Insert Section Here
                </button>
              </div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Section {id + 1}: {content.title || "Untitled"}
                </h2>
                <div className="flex items-center">
                  <AiOutlineDelete
                    className="cursor-pointer text-red-500"
                    size={24}
                    onClick={() => removeContent(id)}
                  />
                  <MdOutlineKeyboardArrowDown
                    className={`cursor-pointer transition-transform${
                      isCollapsed[id] ? "rotate-180" : ""
                    }`}
                    size={28}
                    onClick={() => handleCollapseToggle(id)}
                  />
                </div>
              </div>

              {!isCollapsed[id] && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={content.title}
                      onChange={(e) =>
                        handleInputChange(id, "title", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={content.description}
                      onChange={(e) =>
                        handleInputChange(id, "description", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Video Upload
                    </label>
                    <div className="mt-1 flex items-center space-x-4">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) =>
                          handleInputChange(
                            id,
                            "videoFile",
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:rounded-full file:border-0
                        file:bg-indigo-50 file:px-4
                        file:py-2 file:text-sm
                        file:font-semibold file:text-indigo-700
                        hover:file:bg-indigo-100"
                      />
                      {/* <button
                        type="button"
                        onClick={() => handleVideoDelete(id)}
                        className={`rounded-md px-4 py-2 text-white ${
                          !content.url
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Delete Video
                      </button> */}
                      <button
                        type="button"
                        onClick={() => handleFileUpload(id)}
                        disabled={
                          !content.videoFile ||
                          content.FileStatus === "UPLOADING" ||
                          content.FileStatus === "PROCESSING"
                        }
                        className={`rounded-md px-4 py-2 text-white ${
                          !content.videoFile ||
                          content.FileStatus === "UPLOADING" ||
                          content.FileStatus === "PROCESSING"
                            ? "cursor-not-allowed bg-gray-400"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                      >
                        {content.FileStatus === "SUCCESS"
                          ? "Upload New Video"
                          : "Upload Video"}
                      </button>
                    </div>

                    {content.FileStatus !== "EMPTY" &&
                      content.FileStatus !== "IDEL" && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {getUploadStatusText(id)}
                            </span>
                          </div>
                          <Progress
                            value={content.progress}
                            className="h-2 w-full"
                          />
                        </div>
                      )}

                    {/* {content.url && (
                      <div className="mt-2 text-sm text-green-600">
                        Video URL: {content.url}
                      </div>
                    )} */}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      Video Length:
                      {content.video_length ? (
                        <span className="rounded bg-gray-100 px-3 py-1 font-mono text-gray-600">
                          {content.video_length}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not available</span>
                      )}
                    </label>
                    <input
                      type="hidden"
                      className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={content.video_length}
                      onChange={(e) =>
                        handleInputChange(id, "video_length", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            className="mt-8 flex h-[40px] w-full cursor-pointer items-center justify-center rounded bg-[#0b0d11] text-center text-white 800px:w-[180px]"
            onClick={moveBack}
          >
            Prev
          </button>

          <button
            type="button"
            className="flex items-center text-indigo-600 hover:text-indigo-800"
            onClick={addNewContent}
          >
            <AiOutlinePlusCircle size={24} className="mr-2" />
            Add New Section
          </button>

          <button
            type="button"
            onClick={moveNext}
            className="rounded-md bg-indigo-600 px-6 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
