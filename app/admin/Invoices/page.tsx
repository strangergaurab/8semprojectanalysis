"use client";
import React from "react";

import FAQ from "@/app/components/admin/FAQ/FAQ";
import AllInvoices from "@/app/components/admin/Order/allInvoices";
import Heading from "@/app/utils/Heading";
import DashboardHeader from "@/app/components/admin/sidebar/DashboardHeader";

const page = () => {
  return (
    <div>
      <Heading
        title="Create Course - RAM LTC Academy"
        description="Create a new course for RAM LTC Academy"
        keywords="course creation, online learning, digital marketing"
      />
      <DashboardHeader />
      <AllInvoices />
    </div>
  );
};
export default page;
