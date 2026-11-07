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
export type CourseLevel = "Intermediate" | "Advanced";

export const courseCategories: { value: CourseCategory; label: string }[] = [
  { value: "actuarial", label: "Actuarial Science" },
  { value: "finance", label: "Finance & Economics" },
  { value: "data", label: "Statistics & Data" },
];

export type Course = {
  slug: string;
  title: string;
  category: CourseCategory;
  level: CourseLevel;
  icon: IconType;
  /** One line for cards. */
  summary: string;
  /** A short paragraph for the course page. */
  overview: string;
  /** What students will be able to do. */
  outcomes: string[];
  /** The syllabus, in teaching order. */
  topics: string[];
  prerequisites: string;
  audience: string[];
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

/*
 * DRAFT COPY: overviews, outcomes and audiences below describe each subject's
 * standard syllabus. Review and adjust them to match the actual materials.
 */
export const courses: Course[] = [
  {
    slug: "advanced-actuarial-mathematics",
    title: "Advanced Actuarial Mathematics",
    category: "actuarial",
    level: "Advanced",
    icon: FaCalculator,
    summary: "Life contingencies, multiple-state models and the valuation of insurance and annuity contracts.",
    overview:
      "The mathematical core of life insurance and pensions. Starting from survival models, the course builds up to pricing and reserving for life insurance and annuity products, then extends to multiple lives, multiple decrements and multiple-state models used for disability and critical-illness cover.",
    outcomes: [
      "Build and interpret survival models and life tables",
      "Value life insurance and annuity benefits using actuarial present values",
      "Calculate premiums and policy reserves, including Thiele's differential equation",
      "Apply multiple-state and multiple-decrement models to real products",
    ],
    topics: [
      "Survival models and the force of mortality",
      "Life tables and selection",
      "Life insurance and annuity benefits",
      "Premium calculation principles",
      "Policy values and reserves",
      "Multiple lives, multiple decrements and multiple-state models",
    ],
    prerequisites: "Probability, calculus and the theory of interest (financial mathematics).",
    audience: [
      "Actuarial science students in their later undergraduate or postgraduate years",
      "Candidates preparing for professional life-contingencies examinations",
      "Analysts in life insurance and pensions who want a rigorous foundation",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-acturial-mathematics/`,
  },
  {
    slug: "advanced-risk-mathematics",
    title: "Advanced Risk Mathematics",
    category: "actuarial",
    level: "Advanced",
    icon: FaChartColumn,
    summary: "Loss distributions, aggregate claims and ruin theory for general insurance.",
    overview:
      "How general insurers model claims. The course covers fitting loss distributions, modelling claim frequency and severity together as aggregate claims, the effect of reinsurance and policy limits, and ruin theory for assessing an insurer's long-run solvency.",
    outcomes: [
      "Fit and compare loss distributions for claim severity",
      "Model aggregate claims using compound distributions",
      "Quantify the effect of deductibles, limits and reinsurance",
      "Use ruin theory to reason about insurer solvency",
    ],
    topics: [
      "Loss distributions and parameter estimation",
      "Claim frequency models",
      "Compound and aggregate claim models",
      "Deductibles, limits and reinsurance",
      "Credibility theory basics",
      "Ruin theory",
    ],
    prerequisites: "Probability and statistics, including common distributions and moment-generating functions.",
    audience: [
      "Actuarial and statistics students",
      "Candidates preparing for risk-modelling examinations",
      "General insurance pricing and reserving analysts",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-risk-mathematics/`,
  },
  {
    slug: "actuarial-risk-management",
    title: "Actuarial Risk Management",
    category: "actuarial",
    level: "Advanced",
    icon: FaShieldHalved,
    summary: "Identifying, measuring and managing risk across insurance, pensions and financial institutions.",
    overview:
      "The practitioner's view of risk. The course connects actuarial techniques to decisions: how institutions identify and classify risks, measure them with modern risk measures, hold capital against them, match assets to liabilities, and govern the whole process under regulation.",
    outcomes: [
      "Identify and classify the risks facing financial institutions",
      "Apply risk measures such as VaR and expected shortfall",
      "Explain approaches to capital, asset-liability management and hedging",
      "Discuss regulation, governance and enterprise risk management",
    ],
    topics: [
      "The risk management control cycle",
      "Risk identification and classification",
      "Risk measures and economic capital",
      "Asset-liability management",
      "Risk mitigation and transfer",
      "Regulation and governance",
    ],
    prerequisites: "Familiarity with actuarial or financial mathematics is helpful.",
    audience: [
      "Final-year actuarial students",
      "Candidates preparing for actuarial risk management examinations",
      "Risk, finance and compliance professionals",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/actuarial-risk-modelling/`,
  },
  {
    slug: "pensions-mathematics",
    title: "Pensions Mathematics",
    category: "actuarial",
    level: "Advanced",
    icon: FaPiggyBank,
    summary: "Valuation and funding of defined benefit and defined contribution pension schemes.",
    overview:
      "The mathematics behind retirement benefits. The course explains how pension schemes are designed, how their liabilities are valued, the funding methods used to set contributions, and how assumptions about salaries, interest and mortality drive the results.",
    outcomes: [
      "Describe defined benefit and defined contribution scheme design",
      "Value pension liabilities using appropriate decrement models",
      "Compare funding methods and set contribution rates",
      "Analyse the effect of assumptions on scheme funding",
    ],
    topics: [
      "Pension scheme design and benefits",
      "Service tables and decrements",
      "Valuation of accrued and future benefits",
      "Funding methods",
      "Contribution rate setting",
      "Assumptions and sensitivity",
    ],
    prerequisites: "Life contingencies (Advanced Actuarial Mathematics or equivalent).",
    audience: [
      "Actuarial students specialising in pensions",
      "Pension fund trustees and administrators",
      "Consultants working with retirement benefit schemes",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/pensions-mathematics/`,
  },
  {
    slug: "advanced-financial-economics",
    title: "Advanced Financial Economics",
    category: "finance",
    level: "Advanced",
    icon: FaCoins,
    summary: "Asset pricing, portfolio theory and derivative valuation for actuaries and financial analysts.",
    overview:
      "The economic theory that underpins investment and pricing decisions. The course moves from utility and portfolio choice through equilibrium asset pricing models to interest-rate models and the no-arbitrage pricing of options and other derivatives.",
    outcomes: [
      "Apply utility theory and mean-variance portfolio selection",
      "Use CAPM and multifactor models to explain returns",
      "Price derivatives by no-arbitrage and risk-neutral methods",
      "Describe and compare common interest-rate models",
    ],
    topics: [
      "Utility theory and risk aversion",
      "Mean-variance portfolio theory",
      "Asset pricing models (CAPM, APT)",
      "Efficient markets",
      "Option pricing: binomial and Black-Scholes",
      "Interest-rate models",
    ],
    prerequisites: "Probability, calculus and basic financial mathematics.",
    audience: [
      "Actuarial, finance and economics students",
      "Candidates preparing for financial economics examinations",
      "Investment and treasury analysts",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-financial-economics/`,
  },
  {
    slug: "advanced-financial-modelling",
    title: "Advanced Financial Modelling",
    category: "finance",
    level: "Intermediate",
    icon: FaFileInvoiceDollar,
    summary: "Building robust financial models for valuation, forecasting and decision support.",
    overview:
      "A practical course in building models that decision-makers can trust. It covers model structure, forecasting financial statements, valuation, scenario and sensitivity analysis, and the checks that keep a model accurate and auditable.",
    outcomes: [
      "Structure clear, auditable financial models",
      "Forecast financial statements from sound assumptions",
      "Value businesses and projects using discounted cash flow",
      "Run scenario and sensitivity analysis to support decisions",
    ],
    topics: [
      "Model design principles",
      "Forecasting the three financial statements",
      "Discounted cash flow valuation",
      "Scenario and sensitivity analysis",
      "Risk and uncertainty in models",
      "Model review and validation",
    ],
    prerequisites: "Basic accounting and spreadsheet skills.",
    audience: [
      "Finance, accounting and actuarial students",
      "Analysts in banking, investment and corporate finance",
      "Entrepreneurs preparing projections for investors",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/advanced-financial-modelling/`,
  },
  {
    slug: "financial-time-series-and-econometrics",
    title: "Financial Time Series and Econometrics Modelling",
    category: "finance",
    level: "Advanced",
    icon: FaChartLine,
    summary: "Time series and econometric techniques for financial and economic data.",
    overview:
      "Methods for data that unfold over time. The course covers stationarity and ARIMA models, volatility modelling with ARCH and GARCH, regression and panel econometrics, and forecasting, with applications to markets and macroeconomic data.",
    outcomes: [
      "Test for stationarity and fit ARIMA models",
      "Model time-varying volatility with ARCH and GARCH",
      "Estimate and interpret econometric regression models",
      "Produce and evaluate forecasts",
    ],
    topics: [
      "Stationarity and autocorrelation",
      "ARMA and ARIMA models",
      "Volatility models: ARCH and GARCH",
      "Regression and its assumptions",
      "Panel data methods",
      "Forecasting and evaluation",
    ],
    prerequisites: "Statistics and linear regression.",
    audience: [
      "Postgraduate students in finance, economics and statistics",
      "Researchers working with market or macroeconomic data",
      "Quantitative and risk analysts",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/financial-time-series-and-econometrics-modelling/`,
  },
  {
    slug: "stochastic-processes-modelling",
    title: "Stochastic Processes Modelling",
    category: "data",
    level: "Advanced",
    icon: FaDiagramProject,
    summary: "Markov chains, Poisson processes and Brownian motion with actuarial and financial applications.",
    overview:
      "The language of randomness over time. The course develops Markov chains, counting processes, continuous-time Markov models and Brownian motion, and shows how they model insurance claims, health states, epidemics and asset prices.",
    outcomes: [
      "Classify stochastic processes and their properties",
      "Analyse discrete- and continuous-time Markov chains",
      "Model claim arrivals with Poisson and counting processes",
      "Use Brownian motion and simple stochastic calculus in finance",
    ],
    topics: [
      "Principles of stochastic processes",
      "Discrete-time Markov chains",
      "Poisson and counting processes",
      "Continuous-time Markov models",
      "Brownian motion",
      "Applications in insurance, health and finance",
    ],
    prerequisites: "Probability theory and calculus.",
    audience: [
      "Actuarial science and statistics students",
      "Candidates preparing for stochastic-modelling examinations",
      "Researchers modelling risk, health or epidemics",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/stochastic-processes-modelling/`,
  },
  {
    slug: "statistical-machine-learning-data-analytics",
    title: "Statistical Machine Learning & Data Analytics",
    category: "data",
    level: "Intermediate",
    icon: FaBrain,
    summary: "Supervised and unsupervised learning methods for prediction and insight from data.",
    overview:
      "Machine learning grounded in statistics. The course covers the full workflow, from preparing data through regression, classification, tree-based ensembles and clustering, to validating models properly so they generalise to new data.",
    outcomes: [
      "Prepare and explore data for modelling",
      "Build regression and classification models",
      "Use tree-based ensembles and clustering methods",
      "Evaluate models with cross-validation and appropriate metrics",
    ],
    topics: [
      "The machine learning workflow",
      "Regression and regularisation",
      "Classification methods",
      "Decision trees, random forests and boosting",
      "Clustering and dimension reduction",
      "Model evaluation and selection",
    ],
    prerequisites: "Introductory statistics; some programming experience helps.",
    audience: [
      "Students in statistics, actuarial science and data science",
      "Analysts moving into predictive modelling",
      "Researchers applying machine learning to their data",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/statistical-machine-learning-data-analytics/`,
  },
  {
    slug: "statistical-modelling",
    title: "Statistical Modelling",
    category: "data",
    level: "Intermediate",
    icon: FaChartPie,
    summary: "Generalised linear models and statistical inference for real-world data.",
    overview:
      "The core toolkit for drawing conclusions from data. The course reviews estimation and hypothesis testing, then develops linear and generalised linear models for continuous, count and binary outcomes, with careful attention to diagnostics and interpretation.",
    outcomes: [
      "Estimate parameters and test hypotheses correctly",
      "Fit and interpret linear regression models",
      "Use generalised linear models for counts and binary data",
      "Check model assumptions with diagnostics",
    ],
    topics: [
      "Estimation and inference",
      "Hypothesis testing",
      "Linear regression",
      "Generalised linear models",
      "Model diagnostics",
      "Applications in insurance and research",
    ],
    prerequisites: "Probability and introductory statistics.",
    audience: [
      "Undergraduate and postgraduate students",
      "Candidates preparing for statistics examinations",
      "Researchers who analyse quantitative data",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/statistical-modelling/`,
  },
  {
    slug: "research-and-data-analysis",
    title: "Research and Data Analysis",
    category: "data",
    level: "Intermediate",
    icon: FaMagnifyingGlass,
    summary: "Research design, data collection and analysis for theses, projects and policy work.",
    overview:
      "A guide from research question to defended findings. The course covers research design, sampling and data collection, choosing and running the right quantitative analysis, and presenting results clearly in theses, reports and policy briefs.",
    outcomes: [
      "Design a sound research study around a clear question",
      "Choose sampling and data collection methods",
      "Select and run appropriate quantitative analyses",
      "Report findings clearly for academic and policy audiences",
    ],
    topics: [
      "Research questions and design",
      "Sampling and data collection",
      "Data cleaning and preparation",
      "Descriptive and inferential analysis",
      "Interpreting results",
      "Writing and presenting findings",
    ],
    prerequisites: "None beyond basic statistics.",
    audience: [
      "Master's and PhD candidates preparing theses",
      "Researchers and policy analysts",
      "Monitoring and evaluation professionals",
    ],
    priceKes: PLACEHOLDER_PRICE,
    legacyUrl: `${LEGACY}/research-and-data-analysis/`,
  },
];

const bySlug = new Map(courses.map((c) => [c.slug, c]));

export function getCourse(slug: string): Course | undefined {
  return bySlug.get(slug);
}

export const categoryLabel = (c: CourseCategory) => courseCategories.find((x) => x.value === c)?.label ?? c;
