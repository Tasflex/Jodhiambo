import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowUpRightFromSquare, FaRightFromBracket } from "react-icons/fa6";
import { AdminNav } from "@/components/admin/AdminNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { requireAdminPage } from "@/lib/admin/auth";
import styles from "@/components/admin/admin.module.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdminPage();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.brand} aria-label="Admin home">
          <Logo />
          <span className={styles.brandTag}>Admin</span>
        </Link>
        <AdminNav />
        <div className={styles.sideFoot}>
          <p className={styles.who} title={user.email}>
            {user.email}
          </p>
          <div className={styles.sideActions}>
            <Link href="/" className={styles.sideLink} target="_blank">
              <FaArrowUpRightFromSquare aria-hidden /> View site
            </Link>
            <ThemeToggle className={styles.sideIconBtn} />
            <form action="/auth/signout" method="post">
              <button type="submit" className={styles.sideIconBtn} aria-label="Sign out" title="Sign out">
                <FaRightFromBracket aria-hidden />
              </button>
            </form>
          </div>
        </div>
      </aside>
      <main id="main" className={styles.main}>
        {children}
      </main>
    </div>
  );
}
