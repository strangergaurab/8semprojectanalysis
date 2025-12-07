"use client";

import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-hot-toast";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import AdminAuthContext from "@/app/admin/context/AuthContext";

type Props = {
  isDashboard?: boolean;
};

type AnalyticsData = {
  date: string;
  courses_bought_count: number;
};

const CourseAnalytics: React.FC<Props> = ({ isDashboard = false }) => {
  const { authTokens } = useContext(AdminAuthContext) || {};
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!authTokens) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}api/analytics/courses/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authTokens?.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch course analytics");
        }

        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching course analytics:", error);
        toast.error("Failed to load course analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [authTokens]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  const totalCoursesBought = analyticsData.reduce(
    (sum, item) => sum + item.courses_bought_count,
    0
  );

  return (
    <div
      className={`relative ${
        isDashboard ? "mt-4" : "mt-5"
      } rounded-lg bg-white px-6 shadow-lg`}
    >
      <div>
        <h1
          className={`text-2xl font-bold ${
            isDashboard ? "text-xl" : "text-3xl"
          } mb-2 text-center text-gray-800`}
        >
          Course Analytics
        </h1>
        {!isDashboard && (
          <p className="text-sm text-gray-600">Last 12 months analytics data</p>
        )}
      </div>

      {/* Summary Card */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-700">
        <h3 className="text-sm font-medium text-gray-500">
          Total Courses Purchased
        </h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {totalCoursesBought}
        </p>
      </div>

      <div className={`w-full ${isDashboard ? "h-[300px]" : "h-[400px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={analyticsData}
            margin={{ top: 20, right: 40, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#4b5563", fontSize: 12 }}
              stroke="#4b5563"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: "#4b5563", fontSize: 12 }}
              stroke="#4b5563"
              label={{
                value: "Courses Purchased",
                angle: -90,
                position: "insideLeft",
                fill: "#4b5563",
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
                color: "#4b5563",
              }}
            />
            <Bar
              dataKey="courses_bought_count"
              name="Courses Purchased"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile Data Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">
                Purchases
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-600 dark:bg-gray-700">
            {analyticsData.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {item.date}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                  {item.courses_bought_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseAnalytics;
