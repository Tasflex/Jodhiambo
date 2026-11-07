export type Outlet = "Business Daily Africa" | "Daily Nation" | "Citizen Digital" | "KIPPRA";

export type MediaArticle = {
  title: string;
  outlet: Outlet;
  /** ISO date, YYYY-MM-DD */
  date: string;
  url: string;
};

const BD = "https://www.businessdailyafrica.com/bd";
const NATION = "https://nation.africa/kenya/blogs-opinion/blogs";
const CITIZEN = "https://www.citizen.digital/wananchi-reporting";

const articles: MediaArticle[] = [
  { title: "Address key CBC implementation guidelines gaps for senior schools", outlet: "Business Daily Africa", date: "2025-04-09", url: `${BD}/opinion-analysis/columnists/address-key-cbc-implementation-guidelines-gaps-4994922` },
  { title: "Mathematics needs to be a compulsory subject", outlet: "Daily Nation", date: "2025-03-17", url: `${NATION}/mathematics-needs-to-be-a-compulsory-subject-4967282` },
  { title: "Why Kenya needs to enact an honorary degree policy to tame rogue awards", outlet: "Citizen Digital", date: "2025-01-16", url: "https://citizen.digital/wananchi-reporting/why-kenya-needs-to-enact-an-honorary-degree-policy-to-tame-rogue-awards-n355977" },
  { title: "Solutions to the shortage of science teachers in Kenya", outlet: "Business Daily Africa", date: "2024-10-29", url: `${BD}/opinion-analysis/columnists/solutions-to-the-shortage-of-science-teachers-in-kenya-4804116` },
  { title: "Bridge AI gap in universities", outlet: "Daily Nation", date: "2024-10-22", url: `${NATION}/bridge-ai-gap-in-universities-4799990` },
  { title: "Promoting Gender Equity and Inclusivity in the Employment Sector in Kenya", outlet: "KIPPRA", date: "2024-09-27", url: "https://kippra.or.ke/promoting-gender-equity-and-inclusivity-in-the-employment-sector-in-kenya/" },
  { title: "How Kenya can seize opportunity to grow exports to EAC countries", outlet: "Business Daily Africa", date: "2024-08-25", url: `${BD}/opinion-analysis/columnists/how-kenya-can-seize-opportunity-to-grow-exports-in-eac-4738740` },
  { title: "How Kenya can harness AI power to curb road carnage", outlet: "Business Daily Africa", date: "2024-03-25", url: `${BD}/data-hub/how-kenya-can-harness-ai-power-to-curb-road-carnage--4568252` },
  { title: "How AI will transform electoral malpractices", outlet: "Daily Nation", date: "2024-03-22", url: `${NATION}/how-ai-will-transform-electoral-malpractices-4564632` },
  { title: "How AI has transformed exam cheating in universities", outlet: "Business Daily Africa", date: "2024-03-20", url: `${BD}/corporate/technology/how-ai-has-transformed-exam-cheating-in-universities--4562188` },
  { title: "Inject 4IR technologies into Senior Secondary School curriculum", outlet: "Citizen Digital", date: "2024-03-03", url: `${CITIZEN}/wananchi-opinion-inject-4ir-technologies-into-senior-secondary-school-curriculum-n337762` },
  { title: "How to tame endemic fake papers vice in Kenya", outlet: "Business Daily Africa", date: "2024-03-01", url: `${BD}/data-hub/how-to-end-endemic-fake-papers-vice-in-kenya--4541010` },
  // TODO: confirm this date. The original listed February 25, 2024, but Nation's
  // article IDs are sequential and 4502292 falls between January 12 (4489374) and
  // February 7 (4516394), so it was most likely published in late January 2024.
  { title: "Actuaries can play a huge role in solving our economic woes", outlet: "Daily Nation", date: "2024-02-25", url: `${NATION}/actuaries-can-play-a-huge-role-in-solving-our-economic-woes-4502292` },
  { title: "Why Kenyan universities should publish annual lists of graduates", outlet: "Citizen Digital", date: "2024-02-21", url: `${CITIZEN}/wananchi-opinion-why-kenyan-universities-should-publish-annual-lists-of-graduates-n337133` },
  { title: "We need a national agency to run bursaries and scholarships", outlet: "Daily Nation", date: "2024-02-07", url: `${NATION}/we-need-a-national-agency-to-run-bursaries-and-scholarships-4516394` },
  { title: "Make Open University of Kenya accessible to all citizens in 2024", outlet: "Business Daily Africa", date: "2024-01-12", url: `${BD}/opinion-analysis/columnists/make-open-university-of-kenya-accessible-to-all-citizens-4489374` },
  { title: "Students who scored As from village schools deserve more flowers", outlet: "Citizen Digital", date: "2024-01-11", url: `${CITIZEN}/opinion-students-who-scored-as-from-village-schools-deserve-more-flowers-n334576` },
  { title: "Economic landscape in post-final Eurobond debt payment shocks", outlet: "Daily Nation", date: "2024-01-03", url: `${NATION}/economic-landscape-in-post-final-eurobond-debt-payment-shocks-4480616` },
  { title: "New CBK rate ripple effects to hand households a forgettable Christmas", outlet: "Business Daily Africa", date: "2023-12-22", url: `${BD}/opinion-analysis/columnists/new-cbk-rate-ripple-effects-to-hand-households-christmas--4471366` },
  { title: "Kenya has one of the highest PhD dropouts, and students take up to 15 years studying", outlet: "Citizen Digital", date: "2023-11-16", url: `${CITIZEN}/opinion-kenya-has-one-of-the-highest-phd-dropouts-and-students-up-to-15-years-studying-n331461` },
  { title: "Kenya's Dollar Volatility problem has a cure", outlet: "Citizen Digital", date: "2023-11-14", url: `${CITIZEN}/wananchi-opinion-kenyas-dollar-volatility-problem-has-a-cure-n331280` },
  { title: "Charting Career Paths for PhD Graduates Beyond Academia", outlet: "Business Daily Africa", date: "2023-10-24", url: `${BD}/opinion-analysis/columnists/charting-career-paths-for-phd-graduates-beyond-academia--4412050` },
  { title: "Let's use AI tools to transform research in Kenyan universities", outlet: "Citizen Digital", date: "2023-10-23", url: "https://citizen.digital/wananchi-reporting/wananchi-opinion-lets-use-ai-tools-to-transform-research-in-kenyan-universities-n329845" },
  { title: "How to bridge wide PhD gap among women", outlet: "Daily Nation", date: "2023-10-13", url: `${NATION}/how-to-bridge-wide-phd-gap-among-women-4399096` },
  { title: "How to Increase Uptake of Research by Kenyan Universities", outlet: "Business Daily Africa", date: "2023-10-04", url: `${BD}/opinion-analysis/columnists/how-to-increase-uptake-of-research-by-kenyan-universities--4389896` },
  { title: "It's Wrong to Ethnicise VC Appointments in Kenyan Universities", outlet: "Citizen Digital", date: "2023-10-03", url: `${CITIZEN}/opinion-its-wrong-to-ethnicise-vc-appointments-in-kenyan-universities-n328588` },
  { title: "Short-time measures in taming fuel prices for the Kenyan consumer", outlet: "Business Daily Africa", date: "2023-09-20", url: `${BD}/opinion-analysis/columnists/short-time-measures-in-taming-fuel-prices-for-kenyan-consumer--4374206` },
  { title: "Kenyan universities must embrace AI or perish in “self-denial”", outlet: "Citizen Digital", date: "2023-09-19", url: `${CITIZEN}/kenyan-universities-must-embrace-ai-or-perish-in-self-denial-n327660` },
  { title: "Reform varsity research policies", outlet: "Daily Nation", date: "2023-08-31", url: `${NATION}/reform-varsity-research-policies-4352838` },
  { title: "New varsity model will push students to cheaper courses", outlet: "Daily Nation", date: "2023-08-25", url: `${NATION}/new-varsity-model-will-push-students-to-cheaper-courses-4346340` },
  { title: "Reform fuel subsidies to cushion them from politics, achieve goals", outlet: "Business Daily Africa", date: "2023-08-25", url: `${BD}/opinion-analysis/columnists/reform-fuel-subsidies-to-cushion-them-from-politics--4346106` },
  { title: "New varsity funding model pushes students to cheaper courses at the expense of “Ability”", outlet: "Citizen Digital", date: "2023-08-16", url: `${CITIZEN}/new-varsity-funding-model-pushes-students-to-cheaper-courses-at-the-expense-of-ability-n325605` },
  { title: "How borrowers can survive higher interest rate cycles", outlet: "Business Daily Africa", date: "2023-08-11", url: `${BD}/data-hub/how-borrowers-can-survive-higher-interest-rate-cycles--4332458` },
  { title: "Academic Clock: Age crisis of PhD graduates in Kenyan Universities Worrying", outlet: "Citizen Digital", date: "2023-08-10", url: `${CITIZEN}/academic-clock-age-crisis-of-phd-graduates-in-kenyan-universities-worrying-n325258` },
  { title: "How Kenya can counter global oil price volatility", outlet: "Business Daily Africa", date: "2023-08-02", url: `${BD}/data-hub/how-kenya-can-counter-global-oil-price-volatility--4323138` },
  { title: "Need for policy reforms in varsity funding model", outlet: "Daily Nation", date: "2023-07-25", url: `${NATION}/need-for-policy-reforms-in-varsity-funding-model-4314622` },
];

export const mediaArticles = [...articles].sort((a, b) => b.date.localeCompare(a.date));

export const outlets: Outlet[] = Array.from(new Set(articles.map((a) => a.outlet))).sort();
