"use client";

import { Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";

import "react-pro-sidebar/dist/css/styles.css";
import avatarDefault from "@/public/ram.jpg";
import { useContext } from "react";
import AdminAuthContext from "@/app/admin/context/AuthContext";
import {
  ReceiptOutlinedIcon,
  BarChartOutlinedIcon,
  MapOutlinedIcon,
  GroupIcon,
  VideoCallIcon,
  WebIcon,
  WysiwygIcon,
  ManageHistoryIcon,
  SettingsIcon,
  ExitToAppIcon,
  DashboardIcon,
  MenuOpenIcon,
} from "./Icon";

// Item Component
const Item: FC<{
  title: string;
  to: string;
  icon: JSX.Element;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  onClick?: () => void;
}> = ({ title, to, icon, selected, setSelected, onClick }) => (
  <MenuItem
    active={selected === title}
    onClick={() => {
      setSelected(title);
      onClick && onClick(); // Call onClick if it exists
    }}
    icon={icon}
    className={`rounded-lg transition-colors duration-300 ${
      selected === title
        ? "bg-customColor text-white"
        : "text-white hover:bg-customColor"
    }`}
  >
    <Typography className="!font-Poppins !text-[16px] capitalize">
      {title}
    </Typography>
    <Link href={to} />
  </MenuItem>
);

// Avatar Section
const AvatarSection: FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <Box className={`py-4 ${isCollapsed ? "px-2" : "px-4"}`}>
    {!isCollapsed && (
      <Box className="flex justify-center">
        <Image
          className="rounded-full"
          alt="profile-user"
          width={150}
          priority
          src={avatarDefault}
        />
      </Box>
    )}
  </Box>
);

// Sidebar Header and Toggle Button with Admin Panel text
const SidebarHeader: FC<{
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isCollapsed, setIsCollapsed }) => (
  <MenuItem
    onClick={() => setIsCollapsed(!isCollapsed)}
    icon={isCollapsed ? <MenuOpenIcon /> : undefined}
    style={{
      margin: "-10px 0 2px 5px",
    }}
  >
    {!isCollapsed && (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        ml="10px"
      >
        <Typography
          variant="h6"
          className="capitalize text-black dark:text-[#ffffffc1]"
        >
          <AvatarSection isCollapsed={isCollapsed} />
        </Typography>
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="inline-block"
          sx={{ ml: 2 }}
        >
          <MenuOpenIcon className="text-black dark:text-[#ffffffc1]" />
        </IconButton>
      </Box>
    )}
  </MenuItem>
);

// Menu Section (Reusable)
const MenuSection: FC<{
  title: string;
  isCollapsed: boolean;
  items: {
    title: string;
    to: string;
    icon: JSX.Element;
    onClick?: () => void;
  }[];
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}> = ({ title, isCollapsed, items, selected, setSelected }) => (
  <>
    {!isCollapsed && (
      <Typography
        variant="h5"
        sx={{ m: "15px 0 5px 25px" }}
        className="!text-[18px] !font-[400] capitalize text-black dark:text-[#ffffffc1]"
      >
        {title}
      </Typography>
    )}
    {items.map((item) => (
      <Item
        key={item.title}
        title={item.title}
        to={item.to}
        icon={item.icon}
        selected={selected}
        setSelected={setSelected}
      />
    ))}
  </>
);

// Main Sidebar Component
const AdminSidebar: FC<{ onCollapse: (collapsed: boolean) => void }> = ({
  onCollapse,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const authContext = useContext(AdminAuthContext);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    onCollapse(isCollapsed);
  }, [isCollapsed, onCollapse]);

  if (!mounted) return null;
  if (!authContext) return null;
  const { logoutAdmin } = authContext;
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${
            theme === "#111C43 !important"
              ? "#111C43 !important"
              : "#fff !important"
          }`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item:hover": {
          color: "#888dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-menu-item": {
          color: `${theme !== "dark" && "#111C43 !important"}`,
        },
      }}
      className="!bg-white dark:bg-[#111C43]"
    >
      <ProSidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "16%",
        }}
      >
        {/* Sidebar Header with Admin Panel text */}
        <Menu iconShape="square">
          <SidebarHeader
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          <Item
            title="Dashboard"
            to="/admin"
            icon={<DashboardIcon />}
            selected={selected}
            setSelected={setSelected}
          />
          <hr />

          {/* User Data Section */}
          <MenuSection
            title="User Data"
            isCollapsed={isCollapsed}
            items={[
              { title: "Users", to: "/admin/users", icon: <GroupIcon /> },
              {
                title: "Payment History",
                to: "/admin/Invoices",
                icon: <ReceiptOutlinedIcon />,
              },
            ]}
            selected={selected}
            setSelected={setSelected}
          />

          {/* Content Section */}
          <MenuSection
            title="Content"
            isCollapsed={isCollapsed}
            items={[
              {
                title: "Create Course",
                to: "/admin/create-course",
                icon: <VideoCallIcon />,
              },
            ]}
            selected={selected}
            setSelected={setSelected}
          />

          {/* Customization Section */}
          <MenuSection
            title="Customization"
            isCollapsed={isCollapsed}
            items={[
              {
                title: "Edit courses",
                to: "/admin/edit-course",
                icon: <WebIcon />,
              },
              {
                title: "FAQ",
                to: "/admin/FAQ",
                icon: <WysiwygIcon />,
              },
              {
                title: "Review",
                to: "/admin/reviews",
                icon: <WysiwygIcon />,
              },
            ]}
            selected={selected}
            setSelected={setSelected}
          />

          {/* Analytics Section */}
          <MenuSection
            title="Analytics"
            isCollapsed={isCollapsed}
            items={[
              {
                title: "Courses Analytics",
                to: "/admin/courses-analytics",
                icon: <BarChartOutlinedIcon />,
              },
              // {
              //   title: "Order Analytics",
              //   to: "/admin/order-analytics",
              //   icon: <MapOutlinedIcon />,
              // },
              {
                title: "User Analytics",
                to: "/admin/user-analytics",
                icon: <ManageHistoryIcon />,
              },
            ]}
            selected={selected}
            setSelected={setSelected}
          />

          {/* Extras Section */}
          <MenuSection
            title="Extras"
            isCollapsed={isCollapsed}
            items={[
              // {
              //   title: "Settings",
              //   to: "/admin/setting",
              //   icon: <SettingsIcon />,
              // },
              {
                title: "Logout",
                to: "/admin/auth/sign-in",
                icon: <ExitToAppIcon />,
                onClick: () => logoutAdmin(), // Wrap in an arrow function
              },
            ]}
            selected={selected}
            setSelected={setSelected}
          />
        </Menu>
      </ProSidebar>
    </Box>
  );
};
export default AdminSidebar;
