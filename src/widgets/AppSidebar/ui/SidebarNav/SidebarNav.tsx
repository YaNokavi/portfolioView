import { NavItem } from "../../model/sidebarConfig";
import * as styles from "./SidebarNav.module.scss";
import { SidebarNavItem } from "./SidebarNavItem";

interface SidebarNavProps {
  items: NavItem[];
}

export const SidebarNav = ({ items }: SidebarNavProps) => (
  <nav>
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item.path}>
          <SidebarNavItem item={item} />
        </li>
      ))}
    </ul>
  </nav>
);
