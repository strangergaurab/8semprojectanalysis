"use client";
import React from "react";

// import Heading from "@/app/utils/Heading";
// import { ThemeProvider } from "@/app/utils/theme-provider";

import DashboardMain from "@/app/components/admin/sidebar/DashboardMain";

import AdminFooter from "../components/admin/sidebar/AdminFoter";

const AdminDashboardPage: React.FC = () => {
  return (
    <div>
      <DashboardMain />
      <AdminFooter />
    </div>
  );
};

export default AdminDashboardPage;
