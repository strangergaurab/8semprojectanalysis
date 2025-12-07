"use client";
import React from "react";

import { DataGrid } from "@/app/components/admin/Analytics/data-grids";
import Analytics from "@/app/components/admin/Analytics/UsersAnalyticss";
import DashboardHeader from "@/app/components/admin/sidebar/DashboardHeader";
import AllUsers from "@/app/components/admin/Users/AllUsers";
import Heading from "@/app/utils/Heading";
const CreateCoursePage = () => {
  return (
    <div>
      <Heading
        title="Create Course - RAM LTC Academy"
        description="Create a new course for RAM LTC Academy"
        keywords="course creation, online learning, digital marketing"
      />
      <DashboardHeader />
      <div className="ml-12 mt-20">
        <DataGrid />
      </div>
      <Analytics />
      <AllUsers />
    </div>
  );
};

export default CreateCoursePage;
