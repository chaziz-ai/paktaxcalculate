import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL, OG_IMAGE, SLAB_ROWS } from "../content/tax-data";

export const Route = createFileRoute("/tax-guide")({
  head: () => ({
    meta: [
      { title: "Pakistan Income Tax Guide 2026 | FBR Slabs, Salary & Freelancer Tax" },
      {
        name: "description",
        content:
          "Updated Pakistan income tax guide for FY 2026-27: FBR salary slabs, freelancer rates, filer benefits and how to estimate your take-home pay accurately.",
      },
      { name: "keywords", content: "Pakistan income tax guide 2026, FBR tax slabs 2026-27, salary tax Pakistan, freelancer tax Pakistan, income tax slab Pakistan" },
      { property: "og:title", content: "Pakistan Income Tax Guide 2026 | FBR Slabs, Salary & Freelancer Tax" },
      { property: "og:description", content: "FBR salary slabs, freelancer tax and filer rules for FY 2026-27 — explained in plain language." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: SITE_URL + "/tax-guide" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:title", content: "Pakistan Income Tax Guide 2026" },
      { name: "twitter:description", content: "FBR salary slabs and freelancer tax explained — updated for FY 2026-27." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/tax-guide" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Pakistan Income Tax Guide 2026-27",
          description:
            "FBR salary slabs, freelancer rates and filer rules for FY 2026-27 explained in plain language.",
          image: OG_IMAGE,
          mainEntityOfPage: SITE_URL + "/tax-guide",
          author: { "@type": "Organization", name: "Pakistan Tax Calculator" },
          publisher: {
            "@type": "Organization",
            name: "Pakistan Tax Calculator",
            logo: { "@type": "ImageObject", url: SITE_URL + "/logo.png" },
          },
          inLanguage: "en-PK",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Tax Guide", item: SITE_URL + "/tax-guide" },
          ],
        }),
      },
    ],
  }),
  component: TaxGuidePage,
});

function TaxGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> <span className="px-1">/</span> <span className="text-foreground">Tax Guide</span>
        </nav>

        <article className="space-y-10">
          <header>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Guide</div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Pakistan Income Tax Guide 2026-27</h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              A plain-language walkthrough of the latest FBR salary and freelancer rules for FY 2026-27 — so you can estimate your take-home pay confidently using the{" "}
              <Link to="/" className="text-primary hover:underline">Pakistan Tax Calculator</Link>.
            </p>
          </header>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Summary</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Pakistan Tax Calculator 2026-27 helps salaried individuals, government employees, freelancers, and business owners estimate income tax liability under the latest FBR tax slabs announced in Budget 2026-27. You can calculate salary tax, freelancer tax, deductions, net salary, and compare tax savings against the previous year.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Salary Tax Calculator Pakistan</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Our <strong>Salary Tax Calculator Pakistan</strong> applies the official FBR salaried-individual slabs to your monthly or annual income. Enter your salary, choose between salaried and government employment, and instantly see annual tax, monthly deduction, effective tax rate, and net salary. The tool also compares <strong>Pakistan Salary Tax</strong> for FY 2025-26 vs FY 2026-27 so you can see exactly how much you save under the new Budget 2026-27 Tax Slabs after the high-income surcharge was removed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Latest FBR Tax Slabs 2026-27</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The latest <strong>FBR Tax Slabs 2026-27</strong> keep the tax-free threshold at Rs 600,000 per year (Rs 50,000 per month) and reduce rates across most brackets. Income up to Rs 1.2 million is now taxed at just 1% on the amount above Rs 600,000, down from 5%. Higher slabs continue at 11%, 23%, 30%, and 35%, but the 10% surcharge on income above Rs 10 million has been abolished.
            </p>
            <div className="mt-5 glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-white/5 text-left">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Annual Income (PKR)</th>
                      <th className="px-4 py-3 font-semibold text-muted-foreground">FY 2025-26</th>
                      <th className="px-4 py-3 font-semibold text-primary">FY 2026-27</th>
                      <th className="px-4 py-3 font-semibold">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SLAB_ROWS.map((r) => (
                      <tr key={r.range} className="border-t border-white/5 hover:bg-white/[0.02] transition">
                        <td className="px-4 py-3 font-medium">{r.range}</td>
                        <td className="px-4 py-3 text-muted-foreground line-through decoration-white/20">{r.old}</td>
                        <td className="px-4 py-3 text-foreground font-semibold">{r.neu}</td>
                        <td className="px-4 py-3 text-primary font-medium">{r.diff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Freelancer Tax in Pakistan</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              <strong>Freelancer Tax Pakistan</strong> follows the export-of-services regime: registered FBR filers pay just 1% withholding on foreign remittances, while non-filers pay 2%. Use the <Link to="/" className="text-primary hover:underline">FBR tax calculator</Link> to estimate liability on your annual freelance income from platforms like Upwork, Fiverr, and direct clients. Freelancers earning over Rs 600,000 a year must register on FBR Iris and file an annual income tax return to retain Active Taxpayer List (ATL) benefits on bank transactions, property, and vehicles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight">Income Tax Slab Pakistan</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The <strong>Income Tax Slab Pakistan</strong> structure for salaried individuals is progressive: higher earners pay a higher marginal rate. The first Rs 600,000 of annual income is fully exempt, and only the portion above each threshold is taxed at the bracket rate. Government employees benefit from an additional 25% rebate on calculated tax under Section 149. Combined with the new Budget 2026-27 Tax Slabs, most salaried Pakistanis in Karachi, Lahore, Islamabad, Rawalpindi, and Faisalabad will see a meaningful reduction in <strong>Income Tax Pakistan</strong> liability this year.
            </p>
          </section>

          <aside className="glass rounded-2xl p-6">
            <h2 className="text-base font-semibold">Have a specific question?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse the{" "}
              <Link to="/faq" className="text-primary hover:underline">Pakistan tax FAQs</Link>{" "}
              or jump back to the{" "}
              <Link to="/" className="text-primary hover:underline">income tax calculator Pakistan</Link>.
            </p>
          </aside>
        </article>
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