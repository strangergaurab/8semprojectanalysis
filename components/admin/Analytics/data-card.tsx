import { Type } from "lucide-react";

import { CountUp } from "./count-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

interface DataCardProps {
  icon: typeof Type;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}

/**
 * Renders a data card component with an icon, title, value, and date range.
 *
 * @param icon - The icon component to display in the card header.
 * @param title - The title of the data card.
 * @param value - The numeric value to display in the card content.
 * @param dateRange - The date range to display in the card header.
 * @returns A React component that renders the data card.
 */
export const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  dateRange,
}: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-x-2">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">{title}</CardTitle>
          <CardDescription className="line-clamp-1 ">
            {dateRange}
          </CardDescription>
        </div>
        <div>
          <Icon />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="mb-2 line-clamp-1 break-all text-2xl font-bold">
          <CountUp preserveValue start={0} end={value} />
        </h1>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          from last period.
        </p>
      </CardContent>
    </Card>
  );
};

export const DataCardSkeleton = () => {
  return (
    <Card className="h-[180px] border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-10 w-24 shrink-0" />
        <Skeleton className="h-4 w-40 shrink-0" />
      </CardContent>
    </Card>
  );
};
