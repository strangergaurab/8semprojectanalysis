"use client";
import React, { FC } from "react";

// import DashboardHeader from "./DashboardHeader";
import DashboardHeader from "./DashboardHeader";
import { DataGrid } from "../Analytics/data-grid";
import DashboardWidgets from "../Widget/DashboardWidgets";
import AdminAuthContext from "@/app/admin/context/AuthContext";

type Props = {
  isDashboard?: boolean;
};

const DashboardMain: FC<Props> = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="ml-12 mt-5">
        <DataGrid />
      </div>
      <DashboardWidgets />
    </div>
  );
};
export default DashboardMain;
