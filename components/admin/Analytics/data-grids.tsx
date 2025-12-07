"use client";

import {
  UsersRound,
  DollarSign,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";

import AdminAuthContext from "@/app/admin/context/AuthContext";
import { formatDateRange } from "@/app/lib/utils";

// Animated Counter Component
const AnimatedCounter = ({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setCount(Math.min(Math.floor(value * progress), value));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};
// Enhanced DataCard Component
const DataCard = ({
  title,
  value,
  icon: Icon,
  dateRange,
  trend = 0,
  prefix = "",
  suffix = "",
  description = "",
  isDashboard = false,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  dateRange?: string;
  trend?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  isDashboard?: boolean;
}) => (
  <div className="group relative ">
    <div className="animate-gradient absolute -inset-0.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 opacity-30 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200"></div>
    <div
      className={`relative rounded-lg bg-white shadow-xl ring-1 ring-gray-900/5 transition-all duration-300 hover:scale-[1.02] dark:bg-gray-900${
        isDashboard ? "p-3 sm:p-4" : "p-4 sm:p-6"
      }`}
    >
      <div className="mb-2 flex items-center justify-between sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div
            className={`rounded-lg ${
              isDashboard ? "p-1.5" : "p-2"
            } bg-blue-50 dark:bg-blue-900/30`}
          >
            <Icon
              className={`${
                isDashboard ? "size-4 sm:size-5" : "size-5 sm:size-6"
              } text-blue-600 dark:text-blue-400`}
            />
          </div>
          <h3
            className={`font-medium text-gray-600 dark:text-gray-300 ${
              isDashboard ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            {title}
          </h3>
        </div>
        {trend !== 0 && (
          <div
            className={`flex items-center space-x-1 ${
              trend > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend > 0 ? (
              <ArrowUpRight
                className={`${isDashboard ? "size-3" : "size-4"}`}
              />
            ) : (
              <ArrowDownRight
                className={`${isDashboard ? "size-3" : "size-4"}`}
              />
            )}
            <span
              className={`font-medium ${isDashboard ? "text-xs" : "text-sm"}`}
            >
              {Math.abs(trend)}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1 sm:space-y-2">
        <div className="flex items-baseline">
          <span
            className={`font-bold text-gray-900 dark:text-white ${
              isDashboard ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
            }`}
          >
            {prefix}
            <AnimatedCounter value={value} />
            {suffix}
          </span>
        </div>
        {description && (
          <p
            className={`text-gray-500 dark:text-gray-400 ${
              isDashboard ? "text-xs" : "text-sm"
            }`}
          >
            {description}
          </p>
        )}
        {dateRange && (
          <p
            className={`text-gray-400 dark:text-gray-500 ${
              isDashboard ? "mt-1 text-[10px] sm:text-xs" : "mt-2 text-xs"
            }`}
          >
            {dateRange}
          </p>
        )}
      </div>
    </div>
  </div>
);
// Loading Skeleton
const DataCardSkeleton = ({ isDashboard = false }) => (
  <div
    className={`rounded-lg bg-white shadow-xl dark:bg-gray-900 ${
      isDashboard ? "p-3 sm:p-4" : "p-4 sm:p-6"
    }`}
  >
    <div className="animate-pulse space-y-3 sm:space-y-4">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div
          className={`rounded-lg bg-gray-200 dark:bg-gray-700 ${
            isDashboard ? "size-8" : "size-10"
          }`}
        ></div>
        <div
          className={`h-3 w-20 rounded bg-gray-200 dark:bg-gray-700 sm:h-4 sm:w-24`}
        ></div>
      </div>
      <div
        className={`h-6 w-28 rounded bg-gray-200 dark:bg-gray-700 sm:h-8 sm:w-32`}
      ></div>
      <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700 sm:h-3"></div>
    </div>
  </div>
);

// Main DataGrid Component
export const DataGrid = ({ isDashboard = false }) => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { authTokens } = useContext(AdminAuthContext) || {};
  const params = useSearchParams();

  const staticData = {
    remainingChange: 10,
    totalMembershipUser: 20,
    incomeChange: 15,
    expensesAmount: 15000,
    expensesChange: -5,
  };

  useEffect(() => {
    const fetchTotalUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/admin/count/users/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setTotalUsers(data.no_of_users);
        } else {
          const errorMessage = await response.text();
          setError(`Failed to fetch total users: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error fetching total users:", error);
        setError("Error occurred while fetching total users.");
      } finally {
        setIsLoading(false);
      }
    };

    if (authTokens?.access_token) {
      fetchTotalUsers();
    }
  }, [authTokens?.access_token]);

  const dateRangeLabel = formatDateRange({
    to: params.get("to") || undefined,
    from: params.get("from") || undefined,
  });

  if (isLoading) {
    return (
      <div
        className={`grid gap-3 sm:gap-4 md:gap-6 ${
          isDashboard
            ? "grid-cols-1 p-2 sm:grid-cols-2 sm:p-4 lg:grid-cols-3"
            : "grid-cols-1 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        <DataCardSkeleton isDashboard={isDashboard} />
        <DataCardSkeleton isDashboard={isDashboard} />
        <DataCardSkeleton isDashboard={isDashboard} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 ${
          isDashboard ? "p-3 sm:p-4" : "p-4 sm:p-6"
        }`}
      >
        <p
          className={`text-center text-red-600 dark:text-red-400 ${
            isDashboard ? "text-sm" : "text-base"
          }`}
        >
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-3 sm:gap-4 md:gap-6 ${
        isDashboard
          ? "grid-cols-1 p-2 sm:grid-cols-2 sm:p-4 lg:grid-cols-3"
          : "grid-cols-1 p-4 sm:p-6 md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      <DataCard
        title="Total Users"
        value={totalUsers !== null ? totalUsers : 0}
        icon={Users}
        dateRange={dateRangeLabel}
        trend={8.2}
        description="Active users in the platform"
        isDashboard={isDashboard}
      />
      <DataCard
        title="Premium Users"
        value={staticData.totalMembershipUser}
        icon={UsersRound}
        dateRange={dateRangeLabel}
        trend={staticData.remainingChange}
        description="Users with active subscriptions"
        isDashboard={isDashboard}
      />
      <DataCard
        title="Revenue"
        value={staticData.expensesAmount}
        icon={DollarSign}
        dateRange={dateRangeLabel}
        trend={staticData.incomeChange}
        prefix="$"
        description="Total revenue this period"
        isDashboard={isDashboard}
      />
    </div>
  );
};

export default DataGrid;
