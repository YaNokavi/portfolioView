import { ButtonHTMLAttributes } from "react";
import * as styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = ({
  variant = "primary",
  isLoading = false,
  leftIcon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        fullWidth ? styles.fullWidth : "",
        className,
      ].join(" ")}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <span className={styles.spinner} />
      ) : (
        <>
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
