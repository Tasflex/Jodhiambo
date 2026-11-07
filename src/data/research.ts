export type ResearchPaper = {
  title: string;
  venue: string;
  year: number;
  doi?: string;
  tags: string[];
};

export const AUTHOR = "Odhiambo, J.O.";

// TODO: several "venue" values below ("Healthcare Technology", "Environmental Policy",
// "Engineering Mathematics") read like subject areas rather than journal names.
// Replace them with the actual journal titles and add DOIs where available.
const papers: ResearchPaper[] = [
  {
    title: "Pathways to green hydrogen production as a sustainable energy solution in Kenya by 2040",
    venue: "Springer",
    year: 2026,
    doi: "10.1007/s43937-025-00098-0",
    tags: ["Sustainable Energy", "Green Hydrogen"],
  },
  {
    title: "Robotic Medical Services and the Future of Healthcare in Kenya",
    venue: "Healthcare Technology",
    year: 2024,
    tags: ["Healthcare", "Robotics"],
  },
  {
    title: "The Role of Artificial Intelligence in Kenya's Environmental Diplomacy: A Foresight Approach, by 2040",
    venue: "Environmental Policy",
    year: 2024,
    tags: ["AI", "Environmental Policy"],
  },
  {
    title: "Role of Artificial Intelligence in Robotic Medical Services: Kenyan Healthcare Foresight",
    venue: "SSRN",
    year: 2024,
    doi: "10.2139/ssrn.4808101",
    tags: ["Healthcare", "AI"],
  },
  {
    title: "Pricing of European Call Options Using Generalized Wishart Processes",
    venue: "Mathematics and Systems Science",
    year: 2023,
    doi: "10.54517/mss.v1i1.2189",
    tags: ["Quantitative Finance"],
  },
  {
    title: "Deep Learning Incorporated Buhlmann Credibility in the Modified Lee-Carter Mortality Model",
    venue: "Mathematical Problems in Engineering",
    year: 2023,
    tags: ["Mortality Modeling", "AI Applications"],
  },
  {
    title: "Poisson Incorporated Credibility Regression Modelling of Systematic Mortality Risk for Populations with Finite Data",
    venue: "Mathematical Problems in Engineering",
    year: 2022,
    tags: ["Risk Modeling"],
  },
  {
    title: "Bühlmann credibility approach to systematic mortality risk modeling for sub-Saharan Africa populations (Kenya)",
    venue: "Research in Mathematics",
    year: 2022,
    tags: ["African Demographics"],
  },
  {
    title: "A Deep Learning Integrated Cairns-Blake-Dowd (CBD) Systematic Mortality Risk Model",
    venue: "Journal of Risk and Financial Management",
    year: 2021,
    tags: ["Machine Learning"],
  },
  {
    title: "Modeling Kenyan economic impact of coronavirus in Kenya using discrete-time Markov chains",
    venue: "Journal of Finance and Economics",
    year: 2021,
    tags: ["Pandemic Economics"],
  },
  {
    title: "Modeling of Returns of Nairobi Securities Exchange 20 Share Index Using Log-Normal Distribution",
    venue: "Journal of Financial Economics",
    year: 2020,
    tags: ["Financial Markets"],
  },
  {
    title: "Modelling of COVID-19 transmission in Kenya using compound Poisson regression model",
    venue: "Journal of Advances in Mathematics and Computer Science",
    year: 2020,
    tags: ["Epidemiology"],
  },
  {
    title: "Stochastic Modeling and Prediction of the COVID-19 Spread in Kenya",
    venue: "Engineering Mathematics",
    year: 2020,
    tags: ["Stochastic Models"],
  },
  {
    title: "Modeling of COVID-19 Transmission under Markov Chains in Uganda",
    venue: "African Journal of Health Sciences",
    year: 2020,
    tags: ["Markov Models"],
  },
];

export const researchPapers = [...papers].sort((a, b) => b.year - a.year);
