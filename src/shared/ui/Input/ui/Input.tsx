import { forwardRef, InputHTMLAttributes, useState } from "react";
import * as styles from "./Input.module.scss";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ leftIcon, error, type, className, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className={styles.wrapper}>
        <div
          className={`${styles.inputWrap} ${error ? styles.inputWrapError : ""}`}
        >
          {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
          <input
            ref={ref}
            type={inputType}
            className={`${styles.input} ${leftIcon ? styles.withLeftIcon : ""}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              className={styles.togglePassword}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {/* TODO Сделать иконки */}
              {showPassword ? "🙈" : "👁️"}
            </button>
          )}
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
