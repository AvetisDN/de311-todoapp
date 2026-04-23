import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  ListTodo,
  LogOut,
  Hash,
  Star,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../hooks/useProfile";
import { t } from "../../lib/i18n";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const Sidebar = ({ className, onClose }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const languageValue = profile?.language_preference ?? "ru-RU";

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const links = [
    { to: "/", icon: LayoutDashboard, label: t(languageValue, "dashboard") },
    { to: "/today", icon: ListTodo, label: t(languageValue, "today") },
    { to: "/upcoming", icon: Calendar, label: t(languageValue, "upcoming") },
    { to: "/important", icon: Star, label: t(languageValue, "important") },
    { to: "/settings", icon: Settings, label: t(languageValue, "settings") },
  ];

  return (
    <aside
      className={cn(
        "flex flex-col h-screen w-64 bg-card border-r border-border px-4 py-5 xl:px-5 xl:py-6",
        className,
      )}
    >
      <div className="mb-8 flex items-center pl-2 justify-between">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-11 w-11 rounded-full bg-primary">
            <ListTodo strokeWidth={3} className="w-6 h-6" />
          </div>
          <span className="text-xl font-black ml-3">
            {t(languageValue, "appName")}
          </span>
        </div>
        <Button
          size={"icon"}
          variant={"ghost"}
          className="lg:hidden"
          onClick={onClose}
        >
          <X />
        </Button>
      </div>

      {/* MAIN MENU */}
      <div className="space-y-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-md px-3 py-2 font-medium transition hover:bg-secondary/50 hover:text-secondary-foreground active:scale-[0.98]",
                isActive
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary"
                  : "text-muted-foreground",
              )
            }
          >
            <link.icon className="mr-3 h-5 w-5" />
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* CATEGORY MENU */}
      <div className="py-4 border-t border-border mt-4">
        <p className="mb-2 text-xs font-extrabold text-muted uppercase tracking-wide">
          {t(languageValue, "categories")}
        </p>
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            cn(
              "flex items-center rounded-md px-3 py-2 font-medium transition hover:bg-secondary/50 hover:text-secondary-foreground active:scale-[0.98]",
              isActive
                ? "bg-secondary text-secondary-foreground hover:bg-secondary"
                : "text-muted-foreground",
            )
          }
        >
          <Hash className="mr-3" />
          {t(languageValue, "categories")}
        </NavLink>
      </div>

      {/* USER DATA */}
      <div className=" mt-auto border-t border-border py-4">
        <div className="flex gap-4">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-secondary text-secondary-foreground  font-black">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="capitalize font-semibold truncate">
              {user?.email?.split("@")[0]}
            </span>
            <span className="text-sm text-muted">{user?.email}</span>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={() => signOut()}
          >
            {t(languageValue, "signOut")}
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
