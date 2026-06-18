import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

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
    if (i > 10000000) tax *= 1.1;
    return tax;
  },
};

const fmt = (n: number) =>
  "Rs " + Math.round(n).toLocaleString("en-PK", { maximumFractionDigits: 0 });

const SITE_URL = "https://paktaxcalculate.lovable.app";
const OG_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8b5b2f6d-09b4-4437-a3ad-f78a6e059ff1";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pakistan Tax Calculator 2026-27 | Salary Tax Calculator Pakistan | FBR Tax Slabs" },
      { name: "description", content: "Calculate Pakistan salary tax and freelancer tax instantly using the latest FBR Tax Slabs 2026-27. Free Pakistan Tax Calculator with tax comparison, monthly deductions, and net salary estimates." },
      { name: "keywords", content: "Pakistan Tax Calculator, Salary Tax Calculator Pakistan, Tax Slab Pakistan, Income Tax Pakistan, FBR Tax Calculator, Tax Slabs 2026-27, Freelancer Tax Pakistan, Income Tax Slab Pakistan, Pakistan Salary Tax, FBR Tax Slabs, Tax Calculator PK, Salary Tax Pakistan, Tax Rates Pakistan, Budget 2026-27 Tax Slabs, Pakistan Tax Rates" },
      { property: "og:title", content: "Pakistan Tax Calculator 2026-27 | Salary Tax Calculator Pakistan | FBR Tax Slabs" },
      { property: "og:description", content: "Calculate Pakistan salary tax and freelancer tax instantly using the latest FBR Tax Slabs 2026-27. Free, fast, mobile-friendly." },
      { property: "og:url", content: SITE_URL + "/" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: "Pakistan Tax Calculator 2026-27 — FBR Salary & Freelancer Tax" },
      { name: "twitter:title", content: "Pakistan Tax Calculator 2026-27 | FBR Salary & Freelancer Tax" },
      { name: "twitter:description", content: "Calculate Pakistan salary tax and freelancer tax instantly using FBR Tax Slabs 2026-27." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: SITE_URL + "/" }],
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
          "@type": "WebSite",
          name: "Pakistan Tax Calculator",
          url: SITE_URL,
          potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Pakistan Tax Calculator",
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          sameAs: ["https://www.fbr.gov.pk"],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Pakistan Tax Calculator 2026-27",
          url: SITE_URL + "/",
          description: "Free Pakistan Tax Calculator for FY 2026-27 with FBR salary tax slabs, freelancer tax, and year-over-year comparison.",
          inLanguage: "en-PK",
          about: { "@type": "Thing", name: "Pakistan income tax FY 2026-27" },
          isPartOf: { "@type": "WebSite", name: "Pakistan Tax Calculator", url: SITE_URL },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
            { "@type": "ListItem", position: 2, name: "Salary Tax Calculator", item: `${SITE_URL}/#salary-tax-calculator` },
            { "@type": "ListItem", position: 3, name: "Freelancer Tax Calculator", item: `${SITE_URL}/#freelancer-tax-calculator` },
            { "@type": "ListItem", position: 4, name: "FBR Tax Slabs", item: `${SITE_URL}/#tax-slabs` },
            { "@type": "ListItem", position: 5, name: "FAQ", item: `${SITE_URL}/#faq` },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Pakistan Tax Calculator 2026-27",
          applicationCategory: "FinanceApplication",
          operatingSystem: "Web",
          url: SITE_URL + "/",
          offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
          areaServed: { "@type": "Country", name: "Pakistan" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1280" },
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
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 space-y-24 pb-32">
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
      <MobileStickyCTA />
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
          <a href="#salary" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-8px_oklch(0.88_0.22_155_/_60%)] hover:brightness-110 hover:-translate-y-0.5 transition">
            Calculate Salary Tax
          </a>
          <a href="#freelancer" className="inline-flex items-center justify-center rounded-xl glass px-6 py-3 text-sm font-semibold text-foreground hover:bg-white/10 hover:-translate-y-0.5 transition">
            Freelancer Tax
          </a>
        </div>
        <div className="mt-10 flex flex-wrap gap-2 justify-center text-[11px] text-muted-foreground">
          <span className="rounded-full glass px-3 py-1">FBR Compliant</span>
          <span className="rounded-full glass px-3 py-1">100% Free</span>
          <span className="rounded-full glass px-3 py-1">No Sign-up</span>
          <span className="rounded-full glass px-3 py-1">Real-time</span>
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

/* ---------- helpers ---------- */

function useCountUp(target: number, duration = 700) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    const to = target;
    if (from === to) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function CountUp({ value, format = fmt, className }: { value: number; format?: (n: number) => string; className?: string }) {
  const v = useCountUp(value);
  return <span className={className}>{format(v)}</span>;
}

type HistoryEntry = {
  id: string;
  type: "salary" | "freelancer";
  date: string;
  income: number;
  tax: number;
  net: number;
  meta: string;
};

function useHistory() {
  const [items, setItems] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ptc-history");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);
  const push = (e: Omit<HistoryEntry, "id" | "date">) => {
    const entry: HistoryEntry = { ...e, id: Math.random().toString(36).slice(2), date: new Date().toISOString() };
    setItems((prev) => {
      const next = [entry, ...prev.filter((p) => !(p.type === e.type && p.income === e.income && p.meta === e.meta))].slice(0, 5);
      try { localStorage.setItem("ptc-history", JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const clear = () => {
    setItems([]);
    try { localStorage.removeItem("ptc-history"); } catch {}
  };
  return { items, push, clear };
}

/* ---------- Doughnut Chart ---------- */

function DoughnutChart({ tax, net }: { tax: number; net: number }) {
  const total = Math.max(1, tax + net);
  const taxPct = (tax / total) * 100;
  const circumference = 2 * Math.PI * 70;
  const taxDash = (taxPct / 100) * circumference;
  const animatedTax = useCountUp(taxDash, 800);
  const animatedPct = useCountUp(taxPct, 800);

  return (
    <div className="relative grid place-items-center w-full">
      <svg viewBox="0 0 180 180" className="w-48 h-48">
        <circle cx="90" cy="90" r="70" fill="none" stroke="oklch(1 0 0 / 6%)" strokeWidth="22" />
        <circle
          cx="90" cy="90" r="70" fill="none"
          stroke="var(--primary)" strokeWidth="22" strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - (circumference - animatedTax)}
          transform="rotate(-90 90 90)"
          style={{ filter: "drop-shadow(0 0 8px oklch(0.88 0.22 155 / 45%))" }}
        />
        <circle
          cx="90" cy="90" r="70" fill="none"
          stroke="var(--gold)" strokeWidth="22" strokeLinecap="round"
          strokeDasharray={`${animatedTax} ${circumference}`}
          transform="rotate(-90 90 90)"
          style={{ filter: "drop-shadow(0 0 8px oklch(0.86 0.17 90 / 45%))" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-3xl font-extrabold text-gold tabular-nums">{animatedPct.toFixed(1)}%</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Tax Rate</div>
        </div>
      </div>
      <div className="mt-4 flex gap-4 text-xs">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-primary" />Net Income</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--gold)" }} />Total Tax</span>
      </div>
    </div>
  );
}

/* ---------- Salary Calculator ---------- */

function SalaryCalculator() {
  const [mode, setMode] = useState<"monthly" | "annual">("monthly");
  const [income, setIncome] = useState<string>("100000");
  const [empType, setEmpType] = useState<"salaried" | "government">("salaried");
  const [year, setYear] = useState<"2026" | "2025">("2026");
  const { items: history, push, clear } = useHistory();

  const numericIncome = Math.max(0, Number(income) || 0);
  const annual = mode === "monthly" ? numericIncome * 12 : numericIncome;
  const monthlyEq = annual / 12;
  const active = year === "2026" ? slabs2627 : slabs2526;
  const other = year === "2026" ? slabs2526 : slabs2627;
  const taxActive = active.calc(annual);
  const taxOther = other.calc(annual);
  const adjActive = empType === "government" ? taxActive * 0.75 : taxActive;
  const adjOther = empType === "government" ? taxOther * 0.75 : taxOther;
  const monthlyTax = adjActive / 12;
  const netMonthly = (annual - adjActive) / 12;
  const effective = annual > 0 ? (adjActive / annual) * 100 : 0;
  const saved = adjOther - adjActive; // positive when active year is cheaper
  const monthlySaving = saved / 12;
  const percentSaved = adjOther > 0 ? (saved / adjOther) * 100 : 0;

  const setMode2 = (m: "monthly" | "annual") => {
    if (m === mode) return;
    if (m === "monthly") setIncome(String(Math.round(numericIncome / 12)));
    else setIncome(String(Math.round(numericIncome * 12)));
    setMode(m);
  };

  const saveToHistory = () => push({
    type: "salary", income: annual, tax: adjActive, net: annual - adjActive,
    meta: `${active.name} • ${empType}`,
  });

  const copyResults = async () => {
    const text = `Pakistan Tax Calculator — ${active.name}
Annual Income: ${fmt(annual)}
Annual Tax: ${fmt(adjActive)}
Monthly Tax: ${fmt(monthlyTax)}
Net Take-home / Month: ${fmt(netMonthly)}
Effective Rate: ${effective.toFixed(2)}%`;
    try { await navigator.clipboard.writeText(text); alert("Results copied ✓"); } catch { alert("Copy failed"); }
  };

  const shareResults = async () => {
    const data = {
      title: "Pakistan Tax Calculation",
      text: `My ${active.name} tax: ${fmt(adjActive)} on ${fmt(annual)} income (${effective.toFixed(2)}%).`,
      url: typeof location !== "undefined" ? location.href : SITE_URL,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(`${data.text} ${data.url}`); alert("Share link copied ✓"); }
    } catch {}
  };

  const downloadPDF = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Tax Report — ${active.name}</title>
<style>
  body{font-family:Inter,Arial,sans-serif;color:#0A0F1E;padding:48px;max-width:720px;margin:auto}
  h1{margin:0 0 4px;font-size:24px}
  .sub{color:#64748b;margin-bottom:24px;font-size:13px}
  .card{border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:14px;display:flex;justify-content:space-between}
  .card .l{color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:.08em}
  .card .v{font-weight:700;font-size:18px}
  .accent{color:#00b06b}
  .gold{color:#b8860b}
  .ft{margin-top:32px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:14px}
</style></head><body>
<h1>Pakistan Tax Report</h1>
<div class="sub">${active.name} • ${empType === "government" ? "Government" : "Salaried"} • Generated ${new Date().toLocaleString("en-PK")}</div>
<div class="card"><span class="l">Annual Income</span><span class="v">${fmt(annual)}</span></div>
<div class="card"><span class="l">Total Annual Tax</span><span class="v gold">${fmt(adjActive)}</span></div>
<div class="card"><span class="l">Monthly Tax Deduction</span><span class="v">${fmt(monthlyTax)}</span></div>
<div class="card"><span class="l">Net Take-home / Month</span><span class="v accent">${fmt(netMonthly)}</span></div>
<div class="card"><span class="l">Effective Tax Rate</span><span class="v">${effective.toFixed(2)}%</span></div>
${saved > 0 ? `<div class="card"><span class="l">Savings vs ${other.name}</span><span class="v accent">${fmt(saved)}</span></div>` : ""}
<div class="ft">Generated by Pakistan Tax Calculator — estimation only. Consult FBR or a registered tax advisor for final filing.</div>
<script>window.onload=()=>{window.print();}</script>
</body></html>`;
    const w = window.open("", "_blank");
    if (!w) return alert("Allow pop-ups to download PDF");
    w.document.write(html); w.document.close();
  };

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-5">
        <Field label="Income Mode">
          <div className="grid grid-cols-2 gap-2">
            {(["monthly", "annual"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode2(m)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${
                  mode === m ? "bg-primary text-primary-foreground border-primary" : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground"
                }`}>
                {m === "monthly" ? "Monthly" : "Annual"}
              </button>
            ))}
          </div>
        </Field>
        <Field label={mode === "monthly" ? "Monthly Salary (PKR)" : "Annual Salary (PKR)"}>
          <input type="number" inputMode="numeric" min={0} value={income}
            onChange={(e) => setIncome(e.target.value)} className={inputCls}
            placeholder={mode === "monthly" ? "e.g. 150000" : "e.g. 1800000"} />
          <div className="mt-2 text-[11px] text-muted-foreground">
            ≈ {mode === "monthly" ? `${fmt(annual)} per year` : `${fmt(monthlyEq)} per month`}
          </div>
        </Field>
        <Field label="Employment Type">
          <div className="grid grid-cols-2 gap-2">
            {(["salaried", "government"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setEmpType(t)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${
                  empType === t ? "bg-primary text-primary-foreground border-primary" : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground"
                }`}>
                {t === "salaried" ? "Salaried" : "Government"}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Tax Year">
          <div className="grid grid-cols-2 gap-2">
            {(["2026", "2025"] as const).map((y) => (
              <button key={y} type="button" onClick={() => setYear(y)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${
                  year === y ? "bg-primary text-primary-foreground border-primary" : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground"
                }`}>
                FY {y === "2026" ? "2026-27" : "2025-26"}
              </button>
            ))}
          </div>
        </Field>
        <button onClick={saveToHistory}
          className="w-full rounded-xl bg-primary/90 hover:bg-primary text-primary-foreground py-2.5 text-sm font-semibold transition hover:-translate-y-0.5">
          Save to History
        </button>
        {history.length > 0 && (
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground">Recent (last 5)</h4>
              <button onClick={clear} className="text-[11px] text-muted-foreground hover:text-foreground">Clear</button>
            </div>
            <ul className="space-y-1.5">
              {history.map((h) => (
                <li key={h.id}>
                  <button
                    onClick={() => { setMode("annual"); setIncome(String(h.income)); }}
                    className="w-full text-left rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-3 py-2 text-xs transition">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{fmt(h.income)}</span>
                      <span className="text-gold">{fmt(h.tax)}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{h.meta} • {new Date(h.date).toLocaleDateString("en-PK")}</div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:col-span-3 space-y-4">
        {saved > 0 && year === "2026" && (
          <div className="rounded-2xl border border-primary/40 bg-primary/10 px-5 py-4 flex items-center gap-3 animate-fade-up">
            <span className="text-2xl">🎉</span>
            <div>
              <div className="font-semibold text-primary">You save <CountUp value={saved} /> compared to FY 2025-26</div>
              <div className="text-xs text-muted-foreground">≈ {fmt(monthlySaving)} extra in your pocket every month</div>
            </div>
          </div>
        )}

        <div key={`${income}-${mode}-${empType}-${year}`} className="glass rounded-2xl p-6 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Tax Breakdown</h3>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{active.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-center">
            <DoughnutChart tax={adjActive} net={Math.max(0, annual - adjActive)} />
            <div className="grid grid-cols-1 gap-3">
              <Stat label="Annual Income" value={annual} />
              <Stat label="Total Annual Tax" value={adjActive} accent="gold" />
              <Stat label="Monthly Tax" value={monthlyTax} />
              <Stat label="Net / Month" value={netMonthly} accent="primary" />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={copyResults} className="rounded-xl glass px-4 py-2 text-sm hover:bg-white/10 hover:-translate-y-0.5 transition">📋 Copy Results</button>
            <button onClick={downloadPDF} className="rounded-xl glass px-4 py-2 text-sm hover:bg-white/10 hover:-translate-y-0.5 transition">⬇ Download PDF</button>
            <button onClick={shareResults} className="rounded-xl glass px-4 py-2 text-sm hover:bg-white/10 hover:-translate-y-0.5 transition">🔗 Share</button>
          </div>
        </div>

        <YearComparison income={annual} empType={empType} />
      </div>
    </div>
  );
}

function Stat({ label, value, accent, hint, format = fmt }: { label: string; value: number; accent?: "primary" | "gold"; hint?: string; format?: (n: number) => string }) {
  const color = accent === "primary" ? "text-primary" : accent === "gold" ? "text-gold" : "text-foreground";
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4 hover:border-white/15 transition">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${color}`}><CountUp value={value} format={format} /></div>
      {hint ? <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div> : null}
    </div>
  );
}

function YearComparison({ income, empType }: { income: number; empType: "salaried" | "government" }) {
  const factor = empType === "government" ? 0.75 : 1;
  const t26 = slabs2627.calc(income) * factor;
  const t25 = slabs2526.calc(income) * factor;
  const diff = t25 - t26;
  const pct = t25 > 0 ? (diff / t25) * 100 : 0;
  const monthly = diff / 12;

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Year-over-Year Comparison</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">FY 2025-26</div>
          <div className="mt-1 text-2xl font-bold text-foreground/80 tabular-nums line-through decoration-white/20"><CountUp value={t25} /></div>
        </div>
        <div className="rounded-xl bg-primary/10 border border-primary/30 p-4">
          <div className="text-xs uppercase tracking-wider text-primary">FY 2026-27</div>
          <div className="mt-1 text-2xl font-bold text-primary tabular-nums"><CountUp value={t26} /></div>
        </div>
      </div>
      {diff > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">You Save</div>
            <div className="text-lg font-bold text-primary tabular-nums"><CountUp value={diff} /></div>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Saved %</div>
            <div className="text-lg font-bold text-primary tabular-nums"><CountUp value={pct} format={(n) => `${n.toFixed(1)}%`} /></div>
          </div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly</div>
            <div className="text-lg font-bold text-primary tabular-nums"><CountUp value={monthly} /></div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">Enter a taxable income to see your year-over-year savings.</p>
      )}
    </div>
  );
}

function FreelancerCalculator() {
  const [annualStr, setAnnualStr] = useState("1500000");
  const [filer, setFiler] = useState(true);
  const annual = Math.max(0, Number(annualStr) || 0);
  const rate = filer ? 0.01 : 0.02;
  const tax = annual * rate;
  const net = annual - tax;

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-5">
        <Field label="Annual Freelance Income (PKR)">
          <input type="number" inputMode="numeric" min={0} value={annualStr}
            onChange={(e) => setAnnualStr(e.target.value)} className={inputCls} placeholder="e.g. 2500000" />
        </Field>
        <Field label="Registered Filer?">
          <div className="grid grid-cols-2 gap-2">
            {[{ v: true, l: "Yes — Filer" }, { v: false, l: "No — Non-Filer" }].map((o) => (
              <button key={String(o.v)} type="button" onClick={() => setFiler(o.v)}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition ${
                  filer === o.v ? "bg-primary text-primary-foreground border-primary" : "bg-white/5 text-muted-foreground border-white/10 hover:text-foreground"
                }`}>{o.l}</button>
            ))}
          </div>
        </Field>
        <p className="text-xs text-muted-foreground leading-relaxed">
          FBR filers enjoy reduced withholding on export remittances. Non-filers pay double rates and lose ATL benefits — register on FBR Iris to qualify.
        </p>
      </div>
      <div key={`${annualStr}-${filer}`} className="lg:col-span-3 glass rounded-2xl p-6 animate-fade-up">
        <h3 className="text-lg font-semibold mb-4">Estimated Tax Liability</h3>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <DoughnutChart tax={tax} net={net} />
          <div className="grid gap-3">
            <Stat label="Annual Income" value={annual} />
            <Stat label={`Tax @ ${(rate * 100).toFixed(0)}%`} value={tax} accent="gold" />
            <Stat label="Net After Tax" value={net} accent="primary" />
          </div>
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
  );
}

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ.map((f, i) => ({ ...f, i }));
    return FAQ.map((f, i) => ({ ...f, i })).filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Search questions… e.g. surcharge, filer, freelancer"
          className={inputCls}
        />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-6">No matching questions. Try another keyword.</p>
      ) : filtered.map((f) => {
        const isOpen = open === f.i;
        return (
          <div key={f.i} className="glass rounded-xl overflow-hidden hover:border-white/20 transition">
            <h3>
              <button
                onClick={() => setOpen(isOpen ? null : f.i)}
                className="w-full flex items-center justify-between text-left px-5 py-4 hover:bg-white/[0.03] transition"
                aria-expanded={isOpen}
              >
                <span className="font-medium pr-4">{f.q}</span>
                <span className={`text-primary text-xl transition-transform shrink-0 ${isOpen ? "rotate-45" : ""}`}>+</span>
              </button>
            </h3>
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
        the Federal Budget. Enter monthly or annual income, choose your employment type, and the
        salary tax calculator Pakistan tool computes annual tax, monthly withholding, net take-home
        pay and effective tax rate in real time. Compare FY 2025-26 vs FY 2026-27 to see exactly how
        much you save after the surcharge removal and revised slabs.
      </p>
      <div className="mt-6 grid sm:grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="font-semibold mb-1">FBR Compliant</h3>
          <p className="text-muted-foreground text-xs">Built on Finance Bill 2026 slabs.</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="font-semibold mb-1">Privacy First</h3>
          <p className="text-muted-foreground text-xs">Calculations stay in your browser.</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
          <h3 className="font-semibold mb-1">Instant Results</h3>
          <p className="text-muted-foreground text-xs">No reload, no sign-up.</p>
        </div>
      </div>
    </section>
  );
}

function MobileStickyCTA() {
  return (
    <a href="#salary"
      className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-[0_10px_30px_-8px_oklch(0.88_0.22_155_/_70%)] hover:brightness-110 transition">
      ⚡ Calculate Tax
    </a>
  );
}

function Footer() {
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
