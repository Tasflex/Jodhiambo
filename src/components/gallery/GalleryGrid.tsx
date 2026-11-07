"use client";

import Image from "next/image";
import { useState } from "react";
import { galleryCategories, galleryItems, type GalleryCategory } from "@/data/gallery";
import styles from "./gallery.module.css";

type Filter = GalleryCategory | "all";

export function GalleryGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? galleryItems : galleryItems.filter((i) => i.category === filter);
  const options: { value: Filter; label: string }[] = [{ value: "all", label: "All" }, ...galleryCategories];

  return (
    <>
      <div className="chip-row" role="group" aria-label="Filter photos">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="chip"
            aria-pressed={filter === o.value}
            onClick={() => setFilter(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>

      <ul role="list" className={styles.grid}>
        {visible.map((item) => (
          <li key={item.src}>
            <figure className={styles.item} tabIndex={0}>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 380px"
                className={styles.img}
              />
              <figcaption className={styles.caption}>
                <strong>{item.title}</strong>
                <span>{item.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </>
  );
}
