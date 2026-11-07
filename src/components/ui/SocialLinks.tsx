import type { IconType } from "react-icons";
import { FaBluesky, FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok, FaXTwitter } from "react-icons/fa6";
import { socialLinks, type SocialNetwork } from "@/data/site";
import styles from "./SocialLinks.module.css";

const icons: Record<SocialNetwork, IconType> = {
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  x: FaXTwitter,
  bluesky: FaBluesky,
  tiktok: FaTiktok,
};

export function SocialLinks({ variant = "default" }: { variant?: "default" | "footer" }) {
  return (
    <ul role="list" className={`${styles.list} ${variant === "footer" ? styles.footer : ""}`}>
      {socialLinks.map(({ network, label, href }) => {
        const Icon = icons[network];
        return (
          <li key={network}>
            <a href={href} className={styles.link} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
