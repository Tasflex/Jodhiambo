import type { Metadata } from "next";
import Image from "next/image";
import { FaAmazon, FaArrowUpRightFromSquare } from "react-icons/fa6";
import styles from "@/components/publications/publications.module.css";
import { getBooks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Books",
  description: "Books by Dr. Joab Odhiambo on AI in actuarial science, mortality risk modelling and more.",
};

export default async function BooksPage() {
  const books = await getBooks();
  return (
    <>
      <h2 className="visually-hidden">Books</h2>
      <ul role="list" className={styles.books}>
        {books.map((book, i) => (
          <li key={book.id} className={styles.book} data-reveal style={{ "--reveal-i": i } as React.CSSProperties}>
            <div className={styles.cover}>
              <Image src={book.image} alt={`Cover of ${book.title}`} fill sizes="240px" />
            </div>
            <div className={styles.bookBody}>
              <span className="badge badge--accent">Book</span>
              <h3>{book.title}</h3>
              <p>By Dr. Joab Onyango Odhiambo</p>
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">
                <FaAmazon aria-hidden /> View on Amazon <FaArrowUpRightFromSquare aria-hidden />
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
