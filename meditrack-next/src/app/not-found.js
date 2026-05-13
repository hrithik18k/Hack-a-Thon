"use client";

import Link from "next/link";

const ErrorPage = () => {
  return (
    <main className="editorial-page">
      <section className="editorial-page-hero">
        <div className="editorial-shell editorial-narrow-shell">
          <span className="editorial-eyebrow">Page missing</span>
          <h1 className="editorial-page-title">The page you requested is not available.</h1>
          <p className="editorial-lede">
            Return to the main care experience and continue from a known route.
          </p>
          <Link href="/" className="editorial-btn editorial-btn-primary">
            Go to homepage
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ErrorPage;
