import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/SignInForm";
import { PageHeader } from "@/components/ui/headings";
import { safeNextPath } from "@/lib/safe-redirect";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const { next, error } = await searchParams;
  const nextPath = safeNextPath(next);
  if (await getUser()) redirect(nextPath);

  return (
    <>
      <PageHeader eyebrow="Student area" title="Sign in" intro="Access your courses and All-Access pass." />
      <section className="section">
        <div className="container" style={{ maxWidth: 520 }}>
          {error && (
            <p className="alert alert--error" role="alert" style={{ marginBottom: 20 }}>
              That sign-in link is invalid or has expired. Please request a new one.
            </p>
          )}
          <SignInForm next={nextPath} />
        </div>
      </section>
    </>
  );
}
