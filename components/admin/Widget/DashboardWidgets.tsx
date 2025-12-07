import { Box, CircularProgress } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { BiBorderLeft } from "react-icons/bi";
import { PiUsersFourLight } from "react-icons/pi";

import OrdersAnalytics from "../Analytics/OrdersAnalytics";
import UserAnalytics from "../Analytics/UsersAnalytics";
import CourseAnalytics from "../Analytics/CourseAnalytics";

type ComparePercentage = {
  currentMonth: number;
  previousMonth: number;
  percentChange: number;
} | null;

type Props = {
  open?: boolean;
  value?: number;
};

const staticUserData = {
  users: {
    last12Months: [
      { month: "August 2023", count: 10 },
      { month: "September 2023", count: 15 },
    ],
  },
};

const staticOrdersData = {
  orders: {
    last12Months: [
      { month: "August 2023", count: 6 },
      { month: "September 2023", count: 10 },
    ],
  },
};

const CircularProgressWithLabel: FC<Props> = ({ open, value }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={value}
        size={45}
        color={value && value > 99 ? "info" : "error"}
        thickness={4}
        style={{ zIndex: open ? -1 : 1 }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
    </Box>
  );
};

const DashboardWidgets: FC<Props> = ({ open }) => {
  const [orderComparePercentenge, setOrderComparePercentenge] =
    useState<ComparePercentage>(null);
  const [userComparePercentenge, setUserComparePercentenge] =
    useState<ComparePercentage>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); // Start loading
    try {
      const usersLastTwoMonths = staticUserData.users.last12Months.slice(-2);
      const ordersLastTwoMonths =
        staticOrdersData.orders.last12Months.slice(-2);

      if (usersLastTwoMonths.length === 2 && ordersLastTwoMonths.length === 2) {
        const usersCurrentMonth = usersLastTwoMonths[1].count;
        const usersPreviousMonth = usersLastTwoMonths[0].count;
        const ordersCurrentMonth = ordersLastTwoMonths[1].count;
        const ordersPreviousMonth = ordersLastTwoMonths[0].count;

        const usersPercentChange =
          ((usersCurrentMonth - usersPreviousMonth) /
            (usersPreviousMonth === 0 ? 1 : usersPreviousMonth)) *
          100;
        const ordersPercentChange =
          ((ordersCurrentMonth - ordersPreviousMonth) /
            (ordersPreviousMonth === 0 ? 1 : ordersPreviousMonth)) *
          100;

        setUserComparePercentenge({
          currentMonth: usersCurrentMonth,
          previousMonth: usersPreviousMonth,
          percentChange: usersPercentChange,
        });
        setOrderComparePercentenge({
          currentMonth: ordersCurrentMonth,
          previousMonth: ordersPreviousMonth,
          percentChange: ordersPercentChange,
        });
      }
    } catch (err) {
      setError("Failed to calculate percentages. Please try again." + err); // Handle error
    } finally {
      setLoading(false); // Stop loading
    }
  }, []);

  if (loading) {
    return <CircularProgress />; // Show loading spinner
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-[100%]">
        <div className="p-8">
          <CourseAnalytics isDashboard={true} />
        </div>
      </div>
      <div className="mt-[-20px] grid grid-cols-[100%]">
        <div className="m-auto mt-[30px] h-[40vh] w-[94%] shadow-sm dark:bg-[#111c43]">
          <UserAnalytics isDashboard={true} />
        </div>
        <div className="p-5">
          {/* Removed AllInvoices as it's not needed */}
        </div>
      </div>
    </div>
  );
};
export default DashboardWidgets;
