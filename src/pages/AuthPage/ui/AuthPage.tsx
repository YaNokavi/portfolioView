import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as styles from "./AuthPage.module.scss";
import * as z from "zod";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import { useNavigate } from "react-router-dom";

const MOCK_USER = {
  email: "demo@view.app",
  password: "111111",
};

const AuthSchema = z.object({
  email: z.email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof AuthSchema>;

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setAuthError(null);

    await new Promise((r) => setTimeout(r, 800)); // имитация запроса

    if (
      data.email === MOCK_USER.email &&
      data.password === MOCK_USER.password
    ) {
      localStorage.setItem("token", "mock-jwt-token");
      navigate("/dashboard");
    } else {
      setAuthError("Неверный email или пароль");
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.page}>
      {/* Фоновый градиент */}
      <div className={styles.bgGlow} />

      <div className={styles.card}>
        {/* Логотип */}
        <div className={styles.logo}>
          <img src="/logo.png" alt="portfolioView" width={100} height={100} />
        </div>

        {/* Заголовок */}
        <h1 className={styles.title}>
          Вход в <span className={styles.accent}>portfolioView</span>
        </h1>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <Input
              leftIcon={<MailIcon />}
              placeholder="Введите ваш email"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Пароль</label>
            <Input
              type="password"
              leftIcon={<LockIcon />}
              placeholder="Введите пароль"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>

          {/* Запомнить + Забыли пароль */}
          <div className={styles.row}>
            <label className={styles.checkbox}>
              <input type="checkbox" {...register("rememberMe")} />
              <span>Запомнить меня</span>
            </label>
            <button type="button" className={styles.forgotLink}>
              Забыли пароль?
            </button>
          </div>

          {authError && <div className={styles.authError}>{authError}</div>}

          <Button type="submit" fullWidth isLoading={isLoading}>
            Войти
          </Button>
        </form>

        {/* Разделитель */}
        <div className={styles.divider}>
          <span>или</span>
        </div>

        {/* Социальные кнопки */}
        <div className={styles.socialButtons}>
          <Button
            variant="secondary"
            fullWidth
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            }
          >
            Войти через Google
          </Button>

          <Button
            variant="secondary"
            fullWidth
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#2AABEE">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.19-1.82 6.98-3.02 8.38-3.61 3.99-1.66 4.82-1.95 5.36-1.96.12 0 .38.03.55.17.14.12.18.28.2.45-.02.07-.02.13-.03.2z" />
              </svg>
            }
          >
            Войти через Telegram
          </Button>
        </div>

        {/* Регистрация */}
        <p className={styles.registerText}>
          Нет аккаунта?{" "}
          <button type="button" className={styles.registerLink}>
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  );
};
