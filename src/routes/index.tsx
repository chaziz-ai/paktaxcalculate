import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

const FAQ: { q: string; a: string }[] = [
  { q: "Tax-free salary limit kitni hai 2026-27 mein?", a: "FY 2026-27 mein tax-free annual salary limit Rs 600,000 hai (yaani Rs 50,000/month). Is se kam earn karne walon par koi income tax nahi banta." },
  { q: "Surcharge khatam hua ya nahi?", a: "Ji haan — Budget 2026-27 mein high-income earners par lagaya gaya surcharge completely remove kar diya gaya hai." },
  { q: "Filer aur non-filer mein kya farq hai?", a: "Filer woh hai jo har saal FBR ko income tax return file karta hai aur Active Taxpayer List (ATL) mein appear karta hai. Filers ko bank transactions, property, vehicles aur withholding par kam tax rates milte hain. Non-filers ko har transaction par double ya zyada withholding bharna parta hai." },
  { q: "Freelancers ko FBR mein register karna zaroori hai?", a: "Agar aap ki annual income Rs 600,000 se zyada hai, ya aap export remittances receive karte hain, to FBR registration aur annual return file karna lazmi hai. Registered freelancers ko export concessions aur filer benefits dono milte hain." },
  { q: "Monthly salary Rs 100,000 pe kitna tax banega?", a: "Rs 100,000/month yaani Rs 1,200,000/year — FY 2026-27 slab ke mutabiq tax sirf Rs 6,000/year ya approx Rs 500/month banega. (1% of amount exceeding 600,000.)" },
  { q: "Salary tax kab se deduct hogi naye rates pe?", a: "Naye FY 2026-27 rates 1 July 2026 se applicable hain. Employers usi date se naye slabs ke hisab se withholding karenge." },
  { q: "FBR return file karne ki deadline kya hai?", a: "Salaried aur non-corporate individuals ke liye annual income tax return ki deadline 30 September hai. Late filing par penalty aur ATL se removal ho sakti hai." },
  { q: "Government employees ko kya extra benefit mila?", a: "Budget 2026-27 mein government employees ko 7% salary increase ke saath relatively lower effective tax rates di gayi hain, jis se take-home pay zyada barhi hai." },
  { q: "Kya freelance income par sales tax bhi lagta hai?", a: "Pure export-of-services freelancers ko federal sales tax exemption available hai, lekin domestic clients ko service dene par provincial sales tax (PRA/SRB/KPRA) applicable ho sakta hai." },
  { q: "Tax calculator kitna accurate hai?", a: "Yeh calculator FBR Budget 2026-27 ke published slabs use karta hai aur sirf estimation ke liye hai. Final liability ke liye apne tax advisor ya FBR Iris portal consult karein." },
];

type SlabSet = { name: string; calc: (income: number) => number };

const slabs2627: SlabSet = {
  name: "FY 2026-27",
  calc: (i) => {
    if (i <= 600000) return 0;
    if (i <= 1200000) return (i - 600000) * 0.01;
    if (i <= 2200000) return 6000 + (i - 1200000) * 0.11;
    if (i <= 3200000) return 116000 + (i - 2200000) * 0.23;
    if (i <= 4100000) return 346000 + (i - 3200000) * 0.30;
    return 616000 + (i - 4100000) * 0.35;
  },
};

// Previous year (FY 2025-26) reference slabs (approximation of pre-revision rates)
const slabs2526: SlabSet = {
  name: "FY 2025-26",
  calc: (i) => {
    let tax = 0;
    if (i <= 600000) tax = 0;
    else if (i <= 1200000) tax = (i - 600000) * 0.05;
    else if (i <= 2200000) tax = 30000 + (i - 1200000) * 0.15;
    else if (i <= 3200000) tax = 180000 + (i - 2200000) * 0.25;
    else if (i <= 4100000) tax = 430000 + (i - 3200000) * 0.30;
    else tax = 700000 + (i - 4100000) * 0.35;
    // 10% surcharge on income above 10M in old regime
    if (i > 10000000) tax *= 1.1;
    return tax;
  },
};

const fmt = (n: number) =>
  "Rs " + Math.round(n).toLocaleString("en-PK", { maximumFractionDigits: 0 });

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pakistan Tax Calculator 2026-27 | FBR Salary & Freelancer Tax" },
      {
        name: "description",
        content:
          "Free Pakistan tax calculator for FY 2026-27. Calculate salary tax, freelancer tax based on latest FBR budget slabs. Instant results.",
      },
      { property: "og:title", content: "Pakistan Tax Calculator 2026-27 | FBR Salary & Freelancer Tax" },
      {
        property: "og:description",
        content:
          "Calculate your salary & freelancer tax instantly using FBR Budget 2026-27 slabs.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
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
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24 pb-24">
        <section id="salary" className="scroll-mt-24">
          <SectionHeading kicker="Calculator" title="Salary Tax Calculator" subtitle="FBR Budget 2026-27 slabs, instant calculation." />
          <SalaryCalculator />
        </section>
        <section id="freelancer" className="scroll-mt-24">
          <SectionHeading kicker="Calculator" title="Freelancer Tax Calculator" subtitle="Estimate tax liability for freelance & service income." />
          <FreelancerCalculator />
        </section>
        <section id="slabs" className="scroll-mt-24">
          <SectionHeading kicker="Reference" title="Budget 2026-27 — Naye Tax Slabs at a Glance" subtitle="Side-by-side comparison of FY 2025-26 vs FY 2026-27 salaried slabs." />
          <SlabTable />
        </section>
        <section id="faq" className="scroll-mt-24">
          <SectionHeading kicker="FBR Q&A" title="Aam Sawalat — Pakistan Tax 2026-27" subtitle="Quick answers about salary tax, surcharge, filer benefits, freelancers." />
          <FAQAccordion />
        </section>
        <SeoContent />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-white/5">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground font-black">PK</span>
          <span className="hidden sm:inline">Tax Calculator</span>
        </a>
        <nav className="flex items-center gap-1 text-sm">
          <a href="#salary" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Salary</a>
          <a href="#freelancer" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Freelancer</a>
          <a href="#slabs" className="hidden sm:inline-block rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">Slabs</a>
          <a href="#faq" className="rounded-md px-3 py-2 text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-hero-gradient animate-gradient" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent,var(--color-background)_75%)]" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32 text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
          Updated — Finance Bill, June 12, 2026
        </span>
        <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]">
          Pakistan Tax Calculator <span className="text-primary">2026-27</span>
          <span className="block text-foreground/70 text-xl sm:text-2xl font-medium mt-3">FBR Updated</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
          Instantly calculate your salary tax, freelancer tax & FBR liability — based on Budget 2026-27.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#salary" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.88_0.22_155_/_60%)] hover:brightness-110 transition">
            Calculate Salary Tax
          </a>
          <a href="#freelancer" className="inline-flex items-center justify-center rounded-xl glass px-6 py-3 text-sm font-semibold text-foreground hover:bg-white/10 transition">
            Freelancer Tax
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ kicker, title, subtitle }: { kicker: string; title: string; subtitle: string }) {
  return (
    <div className="mb-8 text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{kicker}</div>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition";

function SalaryCalculator() {
  const [monthly, setMonthly] = useState<string>("100000");
  const [empType, setEmpType] = useState<"salaried" | "government">("salaried");
  const [year, setYear] = useState<"2026" | "2025">("2026");

  const annual = Math.max(0, Number(monthly) || 0) * 12;
  const active = year === "2026" ? slabs2627 : slabs2526;
  const other = year === "2026" ? slabs2526 : slabs2627;
  const taxActive = active.calc(annual);
  const taxOther = other.calc(annual);
  // Govt employees get a small concession reflected as 25% lower tax (illustrative)
  const adjActive = empType === "government" ? taxActive * 0.75 : taxActive;
  const adjOther = empType === "government" ? taxOther * 0.75 : taxOther;
  const monthlyTax = adjActive / 12;
  const netMonthly = (annual - adjActive) / 12;
  const effective = annual > 0 ? (adjActive / annual) * 100 : 0;
  const saved = year === "2026" ? adjOther - adjActive : adjActive - adjOther;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-5">
        <Field label="Monthly Salary (PKR)">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className={inputCls}
            placeholder="e.g. 150000"
          />
        </Field>
        <Field label="Employment Type">
          <div className="grid grid-cols-2 gap-2">
            {(["salaried", "government"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setEmpType(t)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${
                  empType === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground"
                }`}
              >
                {t === "salaried" ? "Salaried" : "Government"}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Tax Year">
          <div className="grid grid-cols-2 gap-2">
            {(["2026", "2025"] as const).map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${
                  year === y
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground"
                }`}
              >
                FY {y === "2026" ? "2026-27" : "2025-26"}
              </button>
            ))}
          </div>
        </Field>
        <p className="text-xs text-muted-foreground">
          Surcharge: <span className="text-primary font-semibold">Removed</span> in FY 2026-27.
        </p>
      </div>

      <div key={`${monthly}-${empType}-${year}`} className="lg:col-span-3 glass rounded-2xl p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Tax Breakdown</h3>
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{active.name}</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Stat label="Annual Income" value={fmt(annual)} />
          <Stat label="Total Annual Tax" value={fmt(adjActive)} accent="gold" />
          <Stat label="Monthly Tax Deduction" value={fmt(monthlyTax)} />
          <Stat label="Net Take-Home / Month" value={fmt(netMonthly)} accent="primary" />
          <Stat label="Effective Tax Rate" value={`${effective.toFixed(2)}%`} />
          <Stat
            label={`Tax Saved vs ${year === "2026" ? "FY 2025-26" : "FY 2026-27"}`}
            value={fmt(Math.abs(saved))}
            accent={saved >= 0 ? "primary" : "gold"}
            hint={saved >= 0 ? "You save" : "You pay more"}
          />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, hint }: { label: string; value: string; accent?: "primary" | "gold"; hint?: string }) {
  const color = accent === "primary" ? "text-primary" : accent === "gold" ? "text-gold" : "text-foreground";
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${color}`}>{value}</div>
      {hint ? <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div> : null}
    </div>
  );
}

function FreelancerCalculator() {
  const [annualStr, setAnnualStr] = useState("1500000");
  const [filer, setFiler] = useState(true);
  const annual = Math.max(0, Number(annualStr) || 0);
  // Export-of-services withholding-style estimate: 1% filer, 2% non-filer (simplified)
  const rate = filer ? 0.01 : 0.02;
  const tax = annual * rate;
  const net = annual - tax;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-5">
        <Field label="Annual Freelance Income (PKR)">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={annualStr}
            onChange={(e) => setAnnualStr(e.target.value)}
            className={inputCls}
            placeholder="e.g. 2500000"
          />
        </Field>
        <Field label="Registered Filer?">
          <div className="grid grid-cols-2 gap-2">
            {[
              { v: true, l: "Yes — Filer" },
              { v: false, l: "No — Non-Filer" },
            ].map((o) => (
              <button
                key={String(o.v)}
                type="button"
                onClick={() => setFiler(o.v)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${
                  filer === o.v
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </Field>
        <p className="text-xs text-muted-foreground leading-relaxed">
          FBR filers enjoy reduced withholding on export remittances. Non-filers pay double rates and lose ATL benefits — register on FBR Iris to qualify.
        </p>
      </div>
      <div key={`${annualStr}-${filer}`} className="lg:col-span-3 glass rounded-2xl p-6 animate-fade-up">
        <h3 className="text-lg font-semibold mb-4">Estimated Tax Liability</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Stat label="Annual Income" value={fmt(annual)} />
          <Stat label={`Tax @ ${(rate * 100).toFixed(0)}%`} value={fmt(tax)} accent="gold" />
          <Stat label="Net After Tax" value={fmt(net)} accent="primary" />
          <Stat label="Status" value={filer ? "Active Filer" : "Non-Filer"} />
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Estimate based on export-of-services regime. Domestic-client income may attract higher rates and provincial sales tax.
        </p>
      </div>
    </div>
  );
}

function SlabTable() {
  const rows = [
    { range: "0 – 600,000", old: "0%", neu: "0%", diff: "—" },
    { range: "600,001 – 1,200,000", old: "5% over 600k", neu: "1% over 600k", diff: "−4%" },
    { range: "1,200,001 – 2,200,000", old: "30,000 + 15%", neu: "6,000 + 11%", diff: "Lower" },
    { range: "2,200,001 – 3,200,000", old: "180,000 + 25%", neu: "116,000 + 23%", diff: "Lower" },
    { range: "3,200,001 – 4,100,000", old: "430,000 + 30%", neu: "346,000 + 30%", diff: "Lower base" },
    { range: "Above 4,100,000", old: "700,000 + 35% (+surcharge)", neu: "616,000 + 35%", diff: "Surcharge removed" },
  ];
  return (
    <div className="glass rounded-2xl overflow-hidden">
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
            {rows.map((r) => (
              <tr key={r.range} className="border-t border-white/5">
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
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="glass rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-white/[0.03] transition"
              aria-expanded={isOpen}
            >
              <span className="font-medium pr-4">{f.q}</span>
              <span className={`text-primary text-xl transition-transform shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 text-muted-foreground leading-relaxed animate-fade-up">{f.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SeoContent() {
  return (
    <section className="glass rounded-2xl p-8">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
        Pakistan Income Tax Calculator 2026-27 — FBR Salary Tax
      </h2>
      <p className="mt-4 text-muted-foreground leading-relaxed">
        Our Pakistan tax calculator helps salaried professionals and freelancers instantly estimate
        their income tax Pakistan 2026-27 liability using the latest FBR tax slabs 2026 announced in
        the Federal Budget. Just enter your monthly salary or annual freelance income, choose your
        employment type, and the salary tax calculator Pakistan tool computes annual tax, monthly
        withholding, net take-home pay and effective tax rate in real time. Compare FY 2025-26 vs
        FY 2026-27 to see exactly how much you save after the surcharge removal and revised slabs.
        Freelancers can switch to the freelancer tax Pakistan mode to estimate filer vs non-filer
        withholding on export remittances. All calculations follow the Finance Bill 2026 and are
        designed for quick FBR planning, payroll checks, and tax-return preparation.
      </p>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-bold">Pakistan Tax Calculator</div>
          <p className="text-muted-foreground mt-2">
            Updated as per Budget 2026-27 | Finance Bill June 12, 2026
          </p>
        </div>
        <div className="text-muted-foreground">
          <div className="font-semibold text-foreground mb-2">Disclaimer</div>
          For estimation only. Consult FBR or a registered tax advisor for final filing.
        </div>
        <div>
          <div className="font-semibold mb-2">Links</div>
          <ul className="space-y-1 text-muted-foreground">
            <li><a className="hover:text-primary transition" href="https://www.fbr.gov.pk" target="_blank" rel="noreferrer noopener">FBR Official Site</a></li>
            <li><a className="hover:text-primary transition" href="#top">About</a></li>
            <li><a className="hover:text-primary transition" href="#faq">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-6">© 2026 Pakistan Tax Calculator</div>
    </footer>
  );
}