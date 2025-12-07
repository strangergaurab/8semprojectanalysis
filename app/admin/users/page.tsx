"use client";
import React from "react";
import DashboardHeader from "@/app/components/admin/sidebar/DashboardHeader";
import Heading from "@/app/utils/Heading";
import AllUsers from "@/app/components/admin/Users/AllUsers";
const page = () => {
  return (
    <div>
      <Heading
        title="Create Course - RAM LTC Academy"
        description="Create a new course for RAM LTC Academy"
        keywords="course creation, online learning, digital marketing"
      />

      <DashboardHeader />
      <AllUsers />
    </div>
  );
};
export default page;
