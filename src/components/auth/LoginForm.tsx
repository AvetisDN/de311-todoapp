import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useProfile } from "../../hooks/useProfile";
import { useAuth } from "../../contexts/AuthContext";
import { t } from "../../lib/i18n";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { toast } from "react-hot-toast";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { initialize } = useAuth();
  const language = profile?.language_preference ?? "ru-RU";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error(
        language === "ru-RU"
          ? "Пожалуйста введите корректный адрес"
          : "Please enter a valid email address",
      );
      return;
    }

    if (isSignUp) {
      if (password.length < 6) {
        toast.error(
          language === "ru-RU"
            ? "Пароль не может быть менее 6"
            : "Password must be at least 6 characters",
        );
        return;
      }

      if (password !== confirmPassword) {
        toast.error(
          language === "ru-RU"
            ? "Пароли не совпадают"
            : "Passwords do not match",
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        console.log("Sign in check:", { signInData, signInError });

        if (signInData.session) {
          throw new Error(
            language === "ru-RU"
              ? "Данный e-mail уже зарегистрирован"
              : "This email is already registered, please sign in",
          );
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log("Sign up result:", { data, error });

        if (error) {
          console.log("Sign up error:", error.message);
          if (
            error.message.includes("User already registered") ||
            error.message.includes("already been registered") ||
            error.message.includes("already been taken") ||
            error.message.includes(
              "A user with this email address has already been registered",
            ) ||
            error.message.includes("duplicate") ||
            error.message.includes("already_exists")
          ) {
            throw new Error(
              language === "ru-RU"
                ? "Данный e-mail уже зарегистрирован"
                : "This email is already registered, please sign in",
            );
          }
          throw error;
        }

        if (
          data.user &&
          data.user.identities &&
          data.user.identities.length === 0
        ) {
          throw new Error(
            language === "ru-RU"
              ? "Данный e-mail уже зарегистрирован"
              : "This email is already registered, please sign in",
          );
        }

        if (data.session) {
          toast.success(
            language === "ru-RU"
              ? "Успешная регистрация!"
              : "Registration successful!",
          );
          await initialize();
          navigate("/", { replace: true });
          onSuccess?.();
        } else if (data.user) {
          const { data: loginData, error: loginError } =
            await supabase.auth.signInWithPassword({
              email,
              password,
            });

          if (loginData.session && !loginError) {
            toast.success(
              language === "ru-RU"
                ? "Успешная регистрация!"
                : "Registration successful!",
            );
            await initialize();
            navigate("/", { replace: true });
            onSuccess?.();
          } else {
            toast.success(t(language, "registrationSuccess"));
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success(t(language, "loginSuccess"));

        await initialize();

        navigate("/", { replace: true });

        onSuccess?.();
      }
    } catch (error: any) {
      toast.error(error.message || t(language, "authFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-card p-4 xl:p-6 animate-fadeIn space-y-4 rounded-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-extrabold animate-fadeIn">
          {isSignUp
            ? t(language, "loginTitleSignup")
            : t(language, "loginTitleSignin")}
        </h2>
        <p
          className=" text-muted-foregound mt-2 animate-fadeIn"
          style={{ animationDelay: "100ms" }}
        >
          {isSignUp
            ? t(language, "loginSubtitleSignup")
            : t(language, "loginSubtitleSignin")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className=" space-y-4 animate-fadeIn"
        style={{ animationDelay: "200ms" }}
        autoComplete="off"
      >
        <div className=" space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t(language, "emailLabel")}
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="off"
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="password"
          >
            {t(language, "passwordLabel")}
          </label>
          <Input
            id="password"
            type="password"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={isLoading}
            autoComplete="new-password"
            className="w-full"
          />
        </div>
        {isSignUp && (
          <div className="space-y-2">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="confirmPassword"
            >
              {language === "ru-RU" ? "Подтвердите пароль" : "Confirm Password"}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="******"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="w-full"
            />
          </div>
        )}
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isSignUp ? t(language, "signUp") : t(language, "signIn")}
        </Button>
      </form>
      <div className="text-center text-sm">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setConfirmPassword("");
          }}
          className="text-primary hover:underline"
          disabled={isLoading}
        >
          {isSignUp ? t(language, "signupSwitch") : t(language, "signinSwitch")}
        </button>
      </div>
    </div>
  );
};
