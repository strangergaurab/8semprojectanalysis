import { SettingsIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";

import AdminAuthContext, {
  AdminAuthContextProps,
} from "@/app/admin/context/AuthContext";

interface MenuItem {
  title: string;
  to: string;
  icon: React.ReactNode;
}

interface MenuSectionProps {
  title: string;
  isCollapsed: boolean;
  items: MenuItem[];
  selected: string;
  setSelected: (value: string) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  isCollapsed,
  items,
  selected,
  setSelected,
}) => {
  const router = useRouter();
  const authContext = useContext(AdminAuthContext) as AdminAuthContextProps;

  const handleItemClick = (item: MenuItem) => {
    if (item.title === "Logout") {
      // Call the logout function from context
      authContext.logoutAdmin();
    } else {
      setSelected(item.title);
      router.push(item.to);
    }
  };

  return (
    <div className="px-3 py-2">
      {!isCollapsed && (
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          {title}
        </h2>
      )}
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item.title}
            onClick={() => handleItemClick(item)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 ${
              selected === item.title
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                : ""
            }`}
          >
            {item.icon}
            {!isCollapsed && (
              <span className="text-sm font-medium">{item.title}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Example usage:
export const ExtrasMenuSection: React.FC<{
  isCollapsed: boolean;
  selected: string;
  setSelected: (value: string) => void;
}> = ({ isCollapsed, selected, setSelected }) => {
  return (
    <MenuSection
      title="Extras"
      isCollapsed={isCollapsed}
      items={[
        {
          title: "Settings",
          to: "/admin/settings",
          icon: <SettingsIcon className="size-4" />,
        },
        {
          title: "Logout",
          to: "/admin/auth/sign-in", // This won't be used directly as we handle logout separately
          icon: <LogOutIcon className="size-4" />,
        },
      ]}
      selected={selected}
      setSelected={setSelected}
    />
  );
};

export default MenuSection;
