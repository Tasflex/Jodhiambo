import type { IconType } from "react-icons";
import {
  FaBook,
  FaBrain,
  FaBuildingColumns,
  FaCalculator,
  FaChartColumn,
  FaChartLine,
  FaChartPie,
  FaCoins,
  FaDatabase,
  FaDiagramProject,
  FaFileInvoiceDollar,
  FaGlobe,
  FaGraduationCap,
  FaHeartPulse,
  FaLandmark,
  FaMagnifyingGlass,
  FaPiggyBank,
  FaScaleBalanced,
  FaShieldHalved,
  FaUsers,
} from "react-icons/fa6";

/** Icons an admin can pick for a course. The key is what the database stores. */
export const courseIcons: Record<string, { icon: IconType; label: string }> = {
  calculator: { icon: FaCalculator, label: "Calculator" },
  "chart-column": { icon: FaChartColumn, label: "Bar chart" },
  "chart-line": { icon: FaChartLine, label: "Line chart" },
  "chart-pie": { icon: FaChartPie, label: "Pie chart" },
  shield: { icon: FaShieldHalved, label: "Shield" },
  "piggy-bank": { icon: FaPiggyBank, label: "Piggy bank" },
  coins: { icon: FaCoins, label: "Coins" },
  "file-invoice": { icon: FaFileInvoiceDollar, label: "Invoice" },
  diagram: { icon: FaDiagramProject, label: "Diagram" },
  brain: { icon: FaBrain, label: "Brain" },
  search: { icon: FaMagnifyingGlass, label: "Magnifier" },
  book: { icon: FaBook, label: "Book" },
  graduation: { icon: FaGraduationCap, label: "Graduation cap" },
  scale: { icon: FaScaleBalanced, label: "Scales" },
  landmark: { icon: FaLandmark, label: "Landmark" },
  bank: { icon: FaBuildingColumns, label: "Bank" },
  globe: { icon: FaGlobe, label: "Globe" },
  database: { icon: FaDatabase, label: "Database" },
  health: { icon: FaHeartPulse, label: "Health" },
  users: { icon: FaUsers, label: "People" },
};

export function CourseIcon({ name }: { name: string }) {
  const Icon = (courseIcons[name] ?? courseIcons.book).icon;
  return <Icon aria-hidden />;
}
