import { useState } from "react";
import { BOTTOM_NAV_ITEMS, NAV_ITEMS } from "../model/sidebarConfig";
import { SidebarNav } from "./SidebarNav/SidebarNav";
import * as styles from "./AppSidebar.module.scss";
import { ChevronLeft } from "lucide-react";
import { SidebarLogo } from "./SidebarLogo/SidebarLogo";
import { SidebarProfile } from "./SidebarProfile/SidebarProfile";

export const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside data-collapsed={isCollapsed} className={styles.sidebar}>
      <div className={styles.header}>
        <SidebarLogo />
        <button
          type="button"
          className={styles.toggleButton}
          data-collapsed={isCollapsed}
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className={styles.mainSection}>
        <SidebarNav items={NAV_ITEMS} />
      </div>

      <div className={styles.bottomSection}>
        {/* <SidebarNav items={BOTTOM_NAV_ITEMS} /> */}
        <SidebarProfile name={"user"} plan={"pro"} initials={"US"} />
      </div>
    </aside>
  );
};
