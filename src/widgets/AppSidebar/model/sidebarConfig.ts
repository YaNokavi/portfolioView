import {
  Database,
  History,
  Layers,
  LayoutDashboard,
  Link2,
  PieChart,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Categories", path: "/categories", icon: Layers },
  { label: "Assets", path: "/assets", icon: Database },
  { label: "Allocation", path: "/allocation", icon: PieChart },
  { label: "History", path: "/history", icon: History },
  { label: "Sources", path: "/sources", icon: Link2 },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Settings", path: "/settings", icon: Settings },
];
