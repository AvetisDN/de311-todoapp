import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import { Button } from "../ui/Button";
//
import { t } from "../../lib/i18n";

export const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const language = "ru-RU";
  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        className={`fixed inset-y-0 left-0 z-40 w-64 transition lg:static lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex grow flex-col">
        <header className="flex p-4 items-center gap-4 bg-card border-b border-border lg:hidden">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold">{t(language, "appName")}</h2>
        </header>
        <main className="grow overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
