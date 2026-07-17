import { NavLink } from "react-router-dom";
import { NavItem } from "../../model/sidebarConfig";
import * as styles from "./SidebarNavItem.module.scss";

interface SidebarNavItemProps {
  item: NavItem;
}

export const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `${styles.item} ${isActive ? styles.active : ""}`
      }
    >
      <span className={styles.icon}>
        <item.icon size={20} />
      </span>
      <span className={styles.label}>{item.label}</span>
    </NavLink>
  );
};
