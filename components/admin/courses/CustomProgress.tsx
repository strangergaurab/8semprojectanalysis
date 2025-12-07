import * as Progress from "@radix-ui/react-progress";

interface CustomProgressProps {
  value: number | null;
  className?: string;
}

const CustomProgress = ({ value = 0, className = "" }: CustomProgressProps) => {
  const progressValue = value ?? 0;

  return (
    <Progress.Root
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
    >
      <Progress.Indicator
        className="h-full w-full bg-indigo-600 transition-transform duration-300"
        style={{ transform: `translateX(-${100 - progressValue}%)` }}
      />
    </Progress.Root>
  );
};

export default CustomProgress;
