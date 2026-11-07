import type { Metadata } from "next";
import Link from "next/link";
import { FaCircleCheck } from "react-icons/fa6";
import { AddToCartButton } from "@/components/courses/AddToCartButton";
import { PageHeader, SectionTitle } from "@/components/ui/headings";
import { COURSE_ACCESS_DAYS, courses } from "@/data/courses";
import { planFeatures, plans } from "@/data/plans";
import { describeAccess, planProductId } from "@/lib/catalog";
import { formatKes } from "@/lib/format";
import styles from "./pricing.module.css";

export const metadata: Metadata = {
  title: "Pricing",
  description: "All-Access passes for every course, or buy individual courses. Pay with M-Pesa or card.",
};

const faqs = [
  {
    q: "Does the pass renew automatically?",
    a: "No. Each pass is a one-off payment for a fixed period, so you are never charged unexpectedly. Buy again any time to extend; the new period starts when your current one ends.",
  },
  {
    q: "Can I download the PDFs?",
    a: "Materials are read online in the built-in viewer on any device while your access is active. They are not available for download.",
  },
  {
    q: "How do I pay?",
    a: "Checkout is handled by Paystack. You can pay with M-Pesa or a debit/credit card.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="All-Access Pass"
        intro={`Every course, one price. Read all ${courses.length} courses' materials for as long as your pass is active.`}
      />

      <section className="section">
        <div className="container">
          <ul role="list" className={styles.plans}>
            {plans.map((plan) => (
              <li key={plan.id} className={`card ${styles.plan} ${plan.featured ? styles.featured : ""}`}>
                {plan.featured && <span className={styles.ribbon}>Most popular</span>}
                <h2>{plan.name}</h2>
                <p className={styles.blurb}>{plan.blurb}</p>
                <p className={styles.price}>{formatKes(plan.priceKes)}</p>
                <p className={styles.per}>{describeAccess(plan.accessDays)} of access · no auto-renewal</p>
                <ul role="list" className={styles.features}>
                  {planFeatures.map((f) => (
                    <li key={f}>
                      <FaCircleCheck aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
                <AddToCartButton
                  productId={planProductId(plan.id)}
                  label="Choose plan"
                  variant={plan.featured ? "primary" : "secondary"}
                  block
                />
              </li>
            ))}
          </ul>

          <p className={styles.alt}>
            Only need one subject? <Link href="/courses">Buy individual courses</Link> with{" "}
            {describeAccess(COURSE_ACCESS_DAYS)} of access each.
          </p>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="faq-title">
        <div className="container" style={{ maxWidth: 800 }}>
          <SectionTitle id="faq-title" title="Questions" />
          <dl className={styles.faq}>
            {faqs.map((f) => (
              <div key={f.q} className="card">
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
