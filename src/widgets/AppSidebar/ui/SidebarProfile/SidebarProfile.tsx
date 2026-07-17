import { ChevronDown } from "lucide-react";
import * as styles from "./SidebarProfile.module.scss";

interface SidebarProfileProps {
  name: string;
  plan: string;
  initials: string;
}

export const SidebarProfile = ({
  name,
  plan,
  initials,
}: SidebarProfileProps) => {
  return (
    <div className={styles.profile}>
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.plan}>{plan}</span>
      </div>
      <ChevronDown size={16} className={styles.chevron} />
    </div>
  );
};
