import type { Metadata } from "next";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHeader } from "@/components/ui/headings";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { site } from "@/data/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Dr. Joab Odhiambo for speaking engagements, training, collaborations and consulting.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Get In Touch" />
      <section className="section">
        <div className={`container ${styles.layout}`}>
          <div>
            <h2 className={styles.title}>Let&apos;s connect</h2>
            <p className={styles.lead}>
              Feel free to reach out for speaking engagements, collaborations, or discussions about actuarial science
              and public policy.
            </p>
            <ul role="list" className={styles.details}>
              <li>
                <FaEnvelope aria-hidden />
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
              <li>
                <FaPhone aria-hidden />
                <a href={site.contact.phoneHref}>{site.contact.phone}</a>
              </li>
              <li>
                <FaLocationDot aria-hidden />
                <span>{site.contact.affiliation}</span>
              </li>
            </ul>
            <SocialLinks />
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
