import { useState } from "react";
import { Lock, Globe } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useProfile } from "../hooks/useProfile";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { toast } from "react-hot-toast";

export function SettingsPage() {
  const { profile, updateLanguage } = useProfile();
  const language = profile?.language_preference ?? "ru-RU";
  const [isUpdating, setIsUpdating] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error(
        language === "ru-RU" ? "Заполните все поля" : "Please fill all fields",
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        language === "ru-RU"
          ? "Пароль не может быть менее 6 символов"
          : "New password must be at least 6 characters",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        language === "ru-RU" ? "Пароли не совпадают" : "Passwords do not match",
      );
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success(
        language === "ru-RU"
          ? "Пароль обновлён"
          : "Password updated successfully",
      );

      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error.message ||
          (language === "ru-RU"
            ? "Произошла ошибка при смене пароля"
            : "Failed to update password"),
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          {language === "ru-RU" ? "Настройки" : "Settings"}
        </h1>
        <p className="text-muted-foreground">
          {language === "ru-RU"
            ? "Управление аккаунтом"
            : "Manage your account settings and preferences"}
        </p>
      </div>

      <div
        className="bg-card rounded-lg border p-6 space-y-4 animate-fadeIn"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center gap-2 pb-2 border-b">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {language === "ru-RU" ? "Языковые настройки" : "Language Settings"}
          </h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {language === "ru-RU"
              ? "Выберите язык интерфейса"
              : "Select your preferred interface language"}
          </p>
          <div className="flex items-center gap-3">
            <select
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={language}
              onChange={(e) =>
                updateLanguage(e.target.value as "ru-RU" | "en-US")
              }
              disabled={isUpdating}
            >
              <option value="ru-RU">Русский</option>
              <option value="en-US">English</option>
            </select>
          </div>
        </div>
      </div>

      <div
        className="bg-card rounded-lg border p-6 space-y-4 animate-fadeIn"
        style={{ animationDelay: "200ms" }}
      >
        <div className="flex items-center gap-2 pb-2 border-b">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">
            {language === "ru-RU" ? "Сменить пароль" : "Change Password"}
          </h3>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === "ru-RU" ? "Новый пароль" : "New Password"}
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={
                language === "ru-RU"
                  ? "Не менее 6 символов"
                  : "At least 6 characters"
              }
              minLength={6}
              disabled={isUpdating}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {language === "ru-RU"
                ? "Подтвердите новый пароль"
                : "Confirm New Password"}
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={
                language === "ru-RU"
                  ? "Введите пароль ещё раз"
                  : "Enter new password again"
              }
              minLength={6}
              disabled={isUpdating}
            />
          </div>

          <Button
            type="submit"
            disabled={isUpdating || !newPassword || !confirmPassword}
          >
            {isUpdating
              ? language === "ru-RU"
                ? "Обновление..."
                : "Updating..."
              : language === "ru-RU"
                ? "Обновить пароль"
                : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
