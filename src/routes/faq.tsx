import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FAQ, SITE_URL, OG_IMAGE } from "../content/tax-data";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Pakistan Tax FAQs 2026 | FBR Salary, Freelancer & Filer Q&A" },
      {
        name: "description",
        content:
          "Free Pakistan tax FAQs for 2026: FBR salary tax slabs, freelancer rates, filer vs non-filer, surcharge, and return deadlines — clear, updated answers.",
      },
      { name: "keywords", content: "Pakistan tax FAQ, FBR tax questions 2026, filer non-filer Pakistan, freelancer tax FAQ, salary tax Pakistan FAQ" },
      { property: "og:title", content: "Pakistan Tax FAQs 2026 | FBR Salary, Freelancer & Filer Q&A" },
      { property: "og:description", content: "Clear, updated answers to common FBR salary, freelancer and filer questions in Pakistan for 2026." },
      { property: "og:url", content: SITE_URL + "/faq" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:title", content: "Pakistan Tax FAQs 2026" },
      { name: "twitter:description", content: "FBR salary, freelancer and filer Q&A — updated for FY 2026-27." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "FAQ", item: SITE_URL + "/faq" },
          ],
        }),
      },
    ],
  }),
  component: FaqPage,
});

const inputCls =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ.map((f, i) => ({ ...f, i }));
    return FAQ.map((f, i) => ({ ...f, i })).filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> <span className="px-1">/</span> <span className="text-foreground">FAQ</span>
        </nav>
        <header className="mb-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">FBR Q&amp;A</div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Pakistan Tax FAQs 2026-27</h1>
          <p className="mt-3 text-muted-foreground">
            Common questions about salary tax, surcharge, filer benefits, and freelancer tax under the latest FBR rules. Use search to jump straight to your topic.
          </p>
        </header>

        <article className="space-y-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search questions… e.g. surcharge, filer, freelancer"
            className={inputCls}
            aria-label="Search FAQs"
          />
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6">No matching questions. Try another keyword.</p>
          ) : (
            filtered.map((f) => {
              const isOpen = open === f.i;
              return (
                <section key={f.i} className="glass rounded-xl overflow-hidden hover:border-white/20 transition">
                  <h2>
                    <button
                      onClick={() => setOpen(isOpen ? null : f.i)}
                      className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-white/[0.03] transition"
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium pr-4">{f.q}</span>
                      <span className={`text-primary text-xl transition-transform shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
                    </button>
                  </h2>
                  {isOpen && <div className="px-5 pb-5 text-muted-foreground leading-relaxed animate-fade-up">{f.a}</div>}
                </section>
              );
            })
          )}
        </article>

        <aside className="mt-12 glass rounded-2xl p-6 text-sm">
          <h2 className="font-semibold text-base mb-2">Try the Pakistan Tax Calculator</h2>
          <p className="text-muted-foreground">
            Estimate your salary or freelancer tax in seconds using the latest FBR slabs.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition">Open Calculator</Link>
            <Link to="/tax-guide" className="rounded-xl glass px-4 py-2 text-sm hover:bg-white/10 transition">Read Tax Guide</Link>
          </div>
        </aside>
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-black">PK</span>
          <span className="hidden sm:inline">Tax Calculator</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to="/" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Calculator</Link>
          <Link to="/tax-guide" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Tax Guide</Link>
          <Link to="/faq" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-bold">Pakistan Tax Calculator</div>
          <p className="text-muted-foreground mt-2">Updated as per Budget 2026-27 | Finance Bill June 12, 2026</p>
        </div>
        <div className="text-muted-foreground">
          <div className="font-semibold text-foreground mb-2">Disclaimer</div>
          For estimation only. Consult FBR or a registered tax advisor for final filing.
        </div>
        <div>
          <div className="font-semibold mb-2">Explore</div>
          <ul className="space-y-1 text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition">Pakistan Tax Calculator</Link></li>
            <li><Link to="/tax-guide" className="hover:text-primary transition">FBR Tax Slabs 2026</Link></li>
            <li><Link to="/faq" className="hover:text-primary transition">Tax FAQs</Link></li>
            <li><a className="hover:text-primary transition" href="https://www.fbr.gov.pk" target="_blank" rel="noreferrer noopener">FBR Official Site</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-6">© 2026 Pakistan Tax Calculator</div>
    </footer>
  );
}