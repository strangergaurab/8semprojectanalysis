// CourseInformation.tsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { styles } from "@/app/Styles/styles";
import { CourseInfo, ModeType } from "./CreateCourse";

import AddSkill from "../../ui/AddSkll";
import { getImageUrl, uploadFile } from "../helper/helper";

type Props = {
  courseInfo: CourseInfo;
  setCourseInfo: React.Dispatch<React.SetStateAction<CourseInfo>>;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  mode: ModeType;
};

const CourseInformation: React.FC<Props> = ({
  courseInfo,
  setCourseInfo,
  active,
  setActive,
  mode,
}) => {
  const [skillInput, setSkillInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseInfo.thumbnail) {
      alert("Please select a thumbnail.");
      return;
    }
    setActive(active + 1);
  };

  const handleAddSkill = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    const skill = skillInput.trim();
    if (skill) {
      setCourseInfo((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setSkillInput("");
    }
  };

  useEffect(() => {
    const fetchThumbnailUrl = async () => {
      if (mode === "EDIT" && courseInfo.thumbnail) {
        try {
          const imageUrl = await getImageUrl(courseInfo.thumbnail);
          console.log(imageUrl, "\n\n\n\n\n");
          setCourseInfo((prev) => ({
            ...prev,
            thubnailUrl: imageUrl || "",
          }));
        } catch (error) {
          console.error("Error fetching thumbnail URL:", error);
        }
      }
    };

    fetchThumbnailUrl();
  }, [courseInfo.thumbnail, mode, setCourseInfo]);

  const handleFileUploadAndView = async (file: File) => {
    try {
      setUploading(true);

      const { cdnUrl, uploadUrl } = await uploadFile(file);

      const imageUrl = await getImageUrl(cdnUrl);

      setCourseInfo((prev) => ({
        ...prev,
        thumbnail: cdnUrl,
        thubnailUrl: imageUrl,
      }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUploadAndView(file);
    }
  };

  return (
    <div className="m-auto mt-20 w-[90%]">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className={`${styles.label}`}>
            Title
          </label>
          <input
            type="text"
            required
            id="title"
            placeholder="Digital Marketing"
            className={`${styles.input}`}
            value={courseInfo.title}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, title: e.target.value })
            }
          />
        </div>
        <br />
        <div className="mb-5">
          <label htmlFor="description" className={`${styles.label}`}>
            Course Description
          </label>
          <textarea
            id="description"
            cols={30}
            rows={8}
            required
            placeholder="Description..."
            className={`${styles.input} !h-min !py-2`}
            value={courseInfo.description}
            onChange={(e) =>
              setCourseInfo({ ...courseInfo, description: e.target.value })
            }
          />
        </div>
        <div className="mb-5 grid grid-cols-1 gap-4 800px:grid-cols-2">
          <div>
            <label htmlFor="price" className={`${styles.label}`}>
              Price ($)
            </label>
            <input
              type="text"
              required
              id="price"
              placeholder="29.99"
              className={`${styles.input}`}
              value={courseInfo.price}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, price: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="instructor" className={`${styles.label}`}>
              Instructor Name
            </label>
            <input
              type="text"
              required
              id="instructor"
              placeholder="Jon Derkits"
              className={`${styles.input}`}
              value={courseInfo.instructor}
              onChange={(e) =>
                setCourseInfo({ ...courseInfo, instructor: e.target.value })
              }
            />
          </div>
        </div>
        <div className="flex w-full flex-col">
          <label htmlFor="skills" className={`${styles.label}`}>
            Skills
          </label>
          <AddSkill
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            handleAddSkill={handleAddSkill}
            setCourseInfo={setCourseInfo}
            courseInfo={courseInfo}
          />
        </div>

        <br />
        <div className="w-full">
          <input
            type="file"
            id="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file"
            className={`flex min-h-[10vh] w-full items-center justify-center border border-[#00000026] p-3 dark:border-white ${
              uploading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            }`}
          >
            {uploading ? (
              <span className="text-black dark:text-white">Uploading...</span>
            ) : courseInfo.thumbnail ? (
              <img
                src={courseInfo.thubnailUrl || ""}
                alt="Course Thumbnail"
                className="max-h-full w-full object-cover"
              />
            ) : (
              <span className="text-black dark:text-white">
                Click to upload
              </span>
            )}
          </label>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            className="mt-8 h-[40px] w-full cursor-pointer rounded bg-[#0b0d11] text-center text-white 800px:w-[180px]"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseInformation;
