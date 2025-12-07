"use client";

import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { AdminAuthProvider } from "@/app/admin/context/AuthContext";
import AdminSidebar from "@/app/components/admin/sidebar/AdminSidebar";

import PrivateRoute from "../utils/PrivateRoute";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const isLoginPage = pathname === "/admin/auth/sign-in";

  return (
    <AdminAuthProvider>
      <div>
        <div className={`flex ${isLoginPage ? "h-screen" : "h-[200vh]"}`}>
          {!isLoginPage && (
            <div className={`w-1/5 1500px:w-[15%]`}>
              <PrivateRoute>
                <AdminSidebar onCollapse={handleSidebarCollapse} />
              </PrivateRoute>
            </div>
          )}

          <div className="w-[93%] md:w-[85%]">
            {isLoginPage ? children : <PrivateRoute>{children}</PrivateRoute>}
          </div>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
