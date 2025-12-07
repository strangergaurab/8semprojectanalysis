"use client";
import React from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  LineChart,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
} from "recharts";

import { styles } from "@/app/Styles/styles";

// Sample data for the chart
const analyticsData = [
  {
    name: "Jan",
    Count: 4000,
  },
  {
    name: "Feb",
    Count: 3000,
  },
  {
    name: "Mar",
    Count: 5000,
  },
  {
    name: "Apr",
    Count: 7000,
  },
  {
    name: "May",
    Count: 2000,
  },
  {
    name: "Jun",
    Count: 3000,
  },
];

type Props = {
  isDashboard?: boolean;
};

const OrdersAnalytics = ({ isDashboard }: Props) => {
  return (
    <div className={isDashboard ? "h-[30vh]" : "h-screen"}>
      <div className={isDashboard ? "mb-2 mt-0 pl-[40px]" : "mt-[50px]"}>
        <h1
          className={`${styles.title} ${
            isDashboard && "!text-[20px]"
          } px-5 !text-start`}
        >
          Orders Analytics
        </h1>
        {!isDashboard && (
          <p className={`${styles.label} px-5`}>
            Last 12 months analytics data
          </p>
        )}
      </div>
      <div
        className={`w-full ${
          !isDashboard ? "h-4/5" : "h-full"
        } flex items-center justify-center`}
      >
        <ResponsiveContainer
          width={isDashboard ? "100%" : "90%"}
          height={isDashboard ? "100%" : "50%"}
        >
          <LineChart
            width={500}
            height={300}
            data={analyticsData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            {!isDashboard && <Legend />}
            <Line type="monotone" dataKey="Count" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersAnalytics;
