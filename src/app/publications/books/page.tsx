import type { Metadata } from "next";
import Image from "next/image";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { books } from "@/data/books";
import styles from "@/components/publications/publications.module.css";

export const metadata: Metadata = {
  title: "Books",
  description: "Books by Dr. Joab Odhiambo on AI in actuarial science, mortality risk modelling and more.",
};

export default function BooksPage() {
  return (
    <>
      <h2 className="visually-hidden">Books</h2>
      <ul role="list" className="grid">
        {books.map((book) => (
          <li key={book.title} className={`card card--hover ${styles.book}`}>
            <div className={styles.cover}>
              <Image src={book.image} alt={`Cover of ${book.title}`} fill sizes="300px" />
            </div>
            <div className={styles.bookBody}>
              <h3>{book.title}</h3>
              <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="link-arrow">
                View on Amazon <FaArrowUpRightFromSquare aria-hidden />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
