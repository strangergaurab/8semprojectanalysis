import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import AdminAuthContext from "@/app/admin/context/AuthContext";

type AnalyticsData = {
  date: string;
  user_count: number;
};

type Props = {
  isDashboard?: boolean;
};

const Analytics: React.FC<Props> = ({ isDashboard = false }) => {
  const { authTokens } = useContext(AdminAuthContext) || {};
  const [userAnalytics, setUserAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  const preprocessData = (data: AnalyticsData[]) => {
    const uniqueData: Record<string, AnalyticsData> = {};
    data.forEach((item) => {
      if (uniqueData[item.date]) {
        uniqueData[item.date].user_count += item.user_count;
      } else {
        uniqueData[item.date] = { ...item };
      }
    });
    return Object.values(uniqueData);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!authTokens) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/analytics/users/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user analytics");
        }

        const data = await response.json();
        setUserAnalytics(preprocessData(data));
      } catch (error) {
        console.error("Error fetching user analytics:", error);
        toast.error("Failed to load user analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [authTokens]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isDashboard
          ? "mt-4 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800"
          : "mt-12 p-6"
      }`}
    >
      <div className={isDashboard ? "mb-4" : "mb-8"}>
        <h1
          className={`text-2xl font-bold ${
            isDashboard ? "text-xl" : "text-3xl"
          } mb-2 text-center text-gray-800 dark:text-white`}
        >
          User Analytics
        </h1>
        {!isDashboard && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Last 12 months analytics data
          </p>
        )}
      </div>

      <div className={`w-full ${isDashboard ? "h-[300px]" : "h-[400px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={userAnalytics}
            margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
          >
            {/* Gridlines for better readability */}
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#a5b4fc", fontSize: 12 }}
              stroke="#a5b4fc"
              label={{
                value: "Date",
                position: "insideBottomRight",
                offset: -10,
                fill: "#a5b4fc",
                fontSize: 14,
              }}
            />
            <YAxis
              tick={{ fill: "#a5b4fc", fontSize: 12 }}
              stroke="#a5b4fc"
              label={{
                value: "Users",
                angle: -90,
                position: "insideLeft",
                fill: "#a5b4fc",
                fontSize: 14,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{
                paddingTop: "10px",
                fontSize: "14px",
                color: "#a5b4fc",
              }}
            />
            <Area
              type="monotone"
              dataKey="user_count"
              stroke="#6366f1"
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
