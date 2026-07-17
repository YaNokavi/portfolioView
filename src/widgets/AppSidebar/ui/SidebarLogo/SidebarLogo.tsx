import * as styles from "./SidebarLogo.module.scss";

export const SidebarLogo = () => {
  return (
    <div className={styles.logo}>
      {/* иконка — если своя SVG, положи в shared/assets или public */}
      <span className={styles.logoIcon}>
        <img src="/logo.png" />
      </span>
      <span className={styles.logoText}>portfolioView</span>
    </div>
  );
};
