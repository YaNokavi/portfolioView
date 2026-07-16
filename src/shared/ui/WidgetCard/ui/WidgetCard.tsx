import { ReactNode } from "react";
import * as styles from "./WidgetCard.module.scss";

interface WidgetCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const WidgetCard = ({
  title,
  children,
  action,
  className,
}: WidgetCardProps) => (
  <div className={`${styles.card} ${className ?? ""}`}>
    {(title || action) && (
      <div className={styles.header}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {action && <div className={styles.action}>{action}</div>}
      </div>
    )}
    <div className={styles.content}>{children}</div>
  </div>
);
