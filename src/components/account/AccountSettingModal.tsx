import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useProfile } from "../../hooks/useProfile";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Modal from "../ui/Modal";
import { toast } from "react-hot-toast";

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
}

export function AccountSettingsModal({
  isOpen,
  onClose,
  language,
}: AccountSettingsModalProps) {
  const { profile, fetchProfile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (isOpen && profile) {
      setFullName(profile.full_name || "");
    }
  }, [isOpen, profile]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("id", user.id);

      if (error) throw error;

      await fetchProfile();
      toast.success(
        language === "ru-RU"
          ? "Имя успешно обновлено"
          : "Name updated successfully",
      );
    } catch (error: any) {
      toast.error(
        error.message || (language === "ru-RU" ? "Ошибка" : "Update failed"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(
        language === "ru-RU" ? "Заполните поля" : "Please fill all fields",
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        language === "ru-RU"
          ? "Не менее 6 символов"
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

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success(
        language === "ru-RU"
          ? "Пароль успешно обновлён"
          : "Password updated successfully",
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error.message ||
          (language === "ru-RU"
            ? "Ошибка обновления пароля"
            : "Failed to update password"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "ru-RU" ? "Настройки аккаунта" : "Account Settings"}
    >
      <div className="space-y-6">
        {/* 更新用户名 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <User className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">
              {language === "ru-RU" ? "Отображаемое имя" : "Display Name"}
            </h3>
          </div>

          <form onSubmit={handleUpdateName} className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "ru-RU" ? "Новое имя" : "New Display Name"}
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={
                  language === "ru-RU" ? "Введите имя" : "Enter your name"
                }
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !fullName.trim()}
              className="w-full"
            >
              {isLoading
                ? language === "ru-RU"
                  ? "Обновляем..."
                  : "Updating..."
                : language === "ru-RU"
                  ? "Обновить имя"
                  : "Update Name"}
            </Button>
          </form>
        </div>

        {/* 修改密码 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">
              {language === "ru-RU" ? "Сменить пароль" : "Change Password"}
            </h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "zh-CN" ? "新密码" : "New Password"}
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
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "ru-RU"
                  ? "Подвердите пароль"
                  : "Confirm New Password"}
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={
                  language === "ru-RU"
                    ? "Введите пароль ещё пароль"
                    : "Enter new password again"
                }
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword}
              className="w-full"
            >
              {isLoading
                ? language === "ru-RU"
                  ? "Обновляем..."
                  : "Updating..."
                : language === "ru-RU"
                  ? "Обновить пароль"
                  : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
