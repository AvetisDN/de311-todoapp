import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useProfile } from "../../hooks/useProfile";
import { t } from "../../lib/i18n";
import { Button } from "../ui/Button";

export const ThemeToggle = () => {
  const { profile } = useProfile();
  const language = profile?.language_preference ?? "zh-CN";
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Button variant={"outline"} size={"icon"} onClick={toggleTheme}>
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
};
