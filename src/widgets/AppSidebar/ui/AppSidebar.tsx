import { useState } from "react";
import { BOTTOM_NAV_ITEMS, NAV_ITEMS } from "../model/sidebarConfig";
import { SidebarNav } from "./SidebarNav/SidebarNav";
import * as styles from "./AppSidebar.module.scss";
import { ChevronLeft } from "lucide-react";

export const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside data-collapsed={isCollapsed} className={styles.sidebar}>
      <div className={styles.header}>
        {/* SidebarLogo сюда — пока не реализован */}
        <button
          className={styles.toggleButton}
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <SidebarNav items={NAV_ITEMS} />

      <div className={styles.bottomSection}>
        <SidebarNav items={BOTTOM_NAV_ITEMS} />
        {/* SidebarProfile сюда — пока не реализован */}
      </div>
    </aside>
  );
};
