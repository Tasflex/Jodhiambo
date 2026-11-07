export type Book = {
  title: string;
  image: string;
  amazonUrl: string;
};

export const books: Book[] = [
  {
    title: "Artificial Intelligence in Actuarial Science within Sub-Saharan Africa",
    image: "/img/books/ai-in-actuarial-science.jpg",
    amazonUrl: "https://www.amazon.com/Artificial-Intelligence-Actuarial-Science-Sub-Saharan-ebook/dp/B0D5YRFCTJ",
  },
  {
    title: "ChatGPT Billionaire's Paradise: From Grass to Grace Practical Guide",
    image: "/img/books/chatgpt-billionaires-paradise.jpg",
    amazonUrl: "https://www.amazon.com/ChatGPT-Billionaires-Paradise-Practical-Sub-Saharan-ebook/dp/B0C8W5MVJ8",
  },
  {
    title: "Stochastic Systematic Mortality Risk Modeling Under Collateral Data and Actuarial Applications",
    image: "/img/books/stochastic-systematic-mortality.jpg",
    amazonUrl: "https://www.amazon.com/STOCHASTIC-SYSTEMATIC-MORTALITY-COLLATERAL-APPLICATIONS/dp/9994987313",
  },
];
