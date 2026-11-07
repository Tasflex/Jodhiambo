import type { IconType } from "react-icons";
import {
  FaBrain,
  FaCalculator,
  FaChartColumn,
  FaChartLine,
  FaChartPie,
  FaCoins,
  FaDiagramProject,
  FaFileInvoiceDollar,
  FaMagnifyingGlass,
  FaPiggyBank,
  FaShieldHalved,
} from "react-icons/fa6";

export type CourseCategory = "actuarial" | "finance" | "data";

export const courseCategories: { value: CourseCategory; label: string }[] = [
  { value: "actuarial", label: "Actuarial Science" },
  { value: "finance", label: "Finance & Economics" },
  { value: "data", label: "Statistics & Data" },
];

export type Course = {
  slug: string;
  title: string;
  category: CourseCategory;
  icon: IconType;
  summary: string;
  topics: string[];
  /** Price in Kenyan shillings (whole shillings). */
  priceKes: number;
  /** Where the materials are currently sold, until they are migrated to this store. */
  legacyUrl: string;
};

const LEGACY = "https://jodhiamboinstitute.co.ke/index.php/product-category";

/**
 * PLACEHOLDER PRICES: every course is set to KES 5,000 so the cart and checkout can
 * be tested end to end. Replace each `priceKes` with the real price before launch.
 * Prices are only ever read from this file on the server; the browser never sets them.
 */
const PLACEHOLDER_PRICE = 5000;

/**
 * PLACEHOLDER: how long a single-course purchase gives access to that course's
 * materials. Buying again extends from the current expiry.
 */
export const COURSE_ACCESS_DAYS = 365;

export const courses: Course[] = [
  {
    slug: "advanced-actuarial-mathematics",
    title: "Advanced Actuarial Mathematics",
    category: "actuarial",
    icon: FaCalculator,
    summary: "Life contingencies, multiple-state models and the valuation of insurance and annuity contracts.",
    topics: ["Survival models and life tables", "Life insurance and annuity valuation", "Premiums and policy reserves", "Multiple-state and multiple-decrement models"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-acturial-mathematics/`,
  },
  {
    slug: "advanced-risk-mathematics",
    title: "Advanced Risk Mathematics",
    category: "actuarial",
    icon: FaChartColumn,
    summary: "Loss distributions, aggregate claims and ruin theory for general insurance.",
    topics: ["Loss and frequency distributions", "Aggregate claims models", "Reinsurance", "Ruin theory"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-risk-mathematics/`,
  },
  {
    slug: "actuarial-risk-management",
    title: "Actuarial Risk Management",
    category: "actuarial",
    icon: FaShieldHalved,
    summary: "Identifying, measuring and managing risk across insurance, pensions and financial institutions.",
    topics: ["Risk identification and classification", "Risk measures and capital", "Asset-liability management", "Regulation and governance"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/actuarial-risk-modelling/`,
  },
  {
    slug: "pensions-mathematics",
    title: "Pensions Mathematics",
    category: "actuarial",
    icon: FaPiggyBank,
    summary: "Valuation and funding of defined benefit and defined contribution pension schemes.",
    topics: ["Pension scheme design", "Funding methods", "Valuation of pension liabilities", "Contribution rate setting"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/pensions-mathematics/`,
  },
  {
    slug: "advanced-financial-economics",
    title: "Advanced Financial Economics",
    category: "finance",
    icon: FaCoins,
    summary: "Asset pricing, portfolio theory and derivative valuation for actuaries and financial analysts.",
    topics: ["Utility theory and portfolio selection", "Asset pricing models", "Interest rate models", "Option pricing"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-financial-economics/`,
  },
  {
    slug: "advanced-financial-modelling",
    title: "Advanced Financial Modelling",
    category: "finance",
    icon: FaFileInvoiceDollar,
    summary: "Building robust financial models for valuation, forecasting and decision support.",
    topics: ["Model design and structure", "Forecasting and valuation", "Scenario and sensitivity analysis", "Model validation"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-financial-modelling/`,
  },
  {
    slug: "financial-time-series-and-econometrics",
    title: "Financial Time Series and Econometrics Modelling",
    category: "finance",
    icon: FaChartLine,
    summary: "Time series and econometric techniques for financial and economic data.",
    topics: ["ARIMA models", "Volatility models (ARCH/GARCH)", "Regression and panel data", "Forecasting"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/financial-time-series-and-econometrics-modelling/`,
  },
  {
    slug: "stochastic-processes-modelling",
    title: "Stochastic Processes Modelling",
    category: "data",
    icon: FaDiagramProject,
    summary: "Markov chains, Poisson processes and Brownian motion with actuarial and financial applications.",
    topics: ["Markov chains", "Poisson and counting processes", "Brownian motion", "Applications in insurance and finance"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/stochastic-processes-modelling/`,
  },
  {
    slug: "statistical-machine-learning-data-analytics",
    title: "Statistical Machine Learning & Data Analytics",
    category: "data",
    icon: FaBrain,
    summary: "Supervised and unsupervised learning methods for prediction and insight from data.",
    topics: ["Regression and classification", "Tree-based methods", "Clustering and dimension reduction", "Model evaluation"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/statistical-machine-learning-data-analytics/`,
  },
  {
    slug: "statistical-modelling",
    title: "Statistical Modelling",
    category: "data",
    icon: FaChartPie,
    summary: "Generalised linear models and statistical inference for real-world data.",
    topics: ["Statistical inference", "Linear regression", "Generalised linear models", "Model diagnostics"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/statistical-modelling/`,
  },
  {
    slug: "research-and-data-analysis",
    title: "Research and Data Analysis",
    category: "data",
    icon: FaMagnifyingGlass,
    summary: "Research design, data collection and analysis for theses, projects and policy work.",
    topics: ["Research design", "Sampling and data collection", "Quantitative analysis", "Reporting findings"],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/research-and-data-analysis/`,
  },
];

const bySlug = new Map(courses.map((c) => [c.slug, c]));

export function getCourse(slug: string): Course | undefined {
  return bySlug.get(slug);
}
