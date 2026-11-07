import type { IconType } from "react-icons";
import {
  FaBook,
  FaBriefcase,
  FaBullhorn,
  FaChartLine,
  FaChartPie,
  FaDatabase,
  FaGears,
  FaLandmark,
  FaLightbulb,
  FaLock,
  FaMagnifyingGlass,
  FaMoneyBillWave,
  FaPenFancy,
  FaScrewdriverWrench,
  FaTractor,
  FaUsers,
} from "react-icons/fa6";

export type ExpertiseArea = {
  title: string;
  description: string;
  icon: IconType;
};

export const coreExpertise: ExpertiseArea[] = [
  { icon: FaChartLine, title: "Actuarial Science", description: "Risk assessment, financial modelling and insurance mathematics that safeguard financial stability." },
  { icon: FaBook, title: "Education Policy", description: "Analysing and developing strategic reforms for education systems, including CBC rollout challenges." },
  { icon: FaLandmark, title: "Public Policy", description: "Data-driven policy analysis addressing complex societal challenges and economic issues." },
  { icon: FaBullhorn, title: "Speaking & Training", description: "Sharing knowledge through lectures, workshops and public speaking engagements." },
  { icon: FaPenFancy, title: "Column Writing", description: "Regular contributor to national publications on actuarial science, education and public policy." },
  { icon: FaLightbulb, title: "Strategic Consulting", description: "Advising organisations on financial strategy and policy implementation." },
];

export const policyExpertise: ExpertiseArea[] = [
  { icon: FaGears, title: "Public Policy Making Process", description: "All stages of policy development, from agenda setting to evaluation." },
  { icon: FaChartPie, title: "Monitoring & Evaluation", description: "Methodologies for assessing policy performance and impact." },
  { icon: FaMagnifyingGlass, title: "Applied Policy Research", description: "Research design, data collection and analysis for policy development." },
  { icon: FaChartLine, title: "Microeconomic Modelling", description: "Economic modelling and forecasting to inform policy decisions." },
  { icon: FaDatabase, title: "Digitised Data Collection", description: "Digital tools and platforms for efficient data gathering and management." },
  { icon: FaBriefcase, title: "Private Sector Development", description: "Policies and frameworks that support private sector growth." },
  { icon: FaBook, title: "MERL Integration", description: "Combining Monitoring, Evaluation, Research and Learning for policy effectiveness." },
  { icon: FaScrewdriverWrench, title: "Policy Analysis Tools", description: "Analytical techniques used in policy analysis and decision-making." },
  { icon: FaUsers, title: "Inclusive Planning", description: "Planning and budgeting processes for marginalised groups." },
  { icon: FaTractor, title: "Agricultural Policy", description: "Sector planning and budgeting to improve food security and rural development." },
  { icon: FaLock, title: "Data Protection", description: "Legal and ethical considerations in data management." },
  { icon: FaMoneyBillWave, title: "Revenue Forecasting", description: "Models for revenue generation and fiscal planning." },
];

export const credentials = [
  {
    title: "Outstanding Actuary in Academia Award",
    description:
      "Recognised for excellence in actuarial science education and research, and for industry experience bridging academia and industry.",
    kind: "award" as const,
  },
  {
    title: "Post-Doc in Public Policy Research Analysis",
    description:
      "Advanced applied research methods in policy design, impact evaluation, strategic foresight, M&E and institutional reform.",
    kind: "degree" as const,
  },
  {
    title: "BSc, MSc and PhD in Actuarial Science",
    description:
      "Stochastic modelling, risk theory, survival analysis, financial mathematics, credibility theory and actuarial data analytics, with an emphasis on predictive models for insurance, pensions and financial risk that integrate machine learning, climate risk and demographic dynamics.",
    kind: "degree" as const,
  },
];
