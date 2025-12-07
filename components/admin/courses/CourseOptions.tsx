import React, { FC } from "react";
import { IoMdCheckmark } from "react-icons/io";

interface Props {
  active: number;
  setActive: (active: number) => void;
}

const CourseOptions: FC<Props> = ({ active }) => {
  const options = ["Course Information", "Course Content", "Course Preview"];

  return (
    <div className="w-full px-2 sm:px-5 md:px-10">
      <div className="flex flex-col items-center justify-between gap-8 sm:flex-row sm:gap-0">
        {options.map((option, index) => (
          <div key={index} className="relative flex flex-col items-center">
            {/* Circle and Text Container */}
            <div className="mb-2 flex items-center">
              <div
                className={`flex size-[35px] items-center justify-center rounded-full ${
                  active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                }`}
              >
                <IoMdCheckmark className="text-[25px] text-white" />
              </div>
              <h5
                className={`pl-3 ${
                  active === index
                    ? "font-semibold text-blue-500"
                    : "text-gray-700 dark:text-gray-200"
                } whitespace-nowrap text-[16px] sm:text-[18px]`}
              >
                {option}
              </h5>
            </div>

            {/* Horizontal line below text */}
            {index !== options.length - 1 && (
              <div
                className={`absolute hidden h-1 w-[150px] sm:block md:w-[200px] lg:w-[300px] ${
                  active + 1 > index ? "bg-blue-500" : "bg-[#384766]"
                } left-[35px] top-[45px]`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseOptions;
