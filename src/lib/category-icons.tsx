import {
  Building2,
  Factory,
  HeartPulse,
  Leaf,
  Sprout,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "./constants";

const iconMap: Record<string, LucideIcon> = {
  building: Building2,
  sprout: Sprout,
  factory: Factory,
  "heart-pulse": HeartPulse,
  leaf: Leaf,
};

export function getCategoryIcon(iconKey: string): LucideIcon {
  return iconMap[iconKey] ?? Building2;
}

export function CategoryIcon({
  iconKey,
  className = "h-6 w-6",
}: {
  iconKey: (typeof CATEGORIES)[number]["icon"];
  className?: string;
}) {
  const Icon = getCategoryIcon(iconKey);
  return <Icon className={className} aria-hidden="true" />;
}
