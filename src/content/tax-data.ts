export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
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

export const SITE_URL = "https://paktaxcalculate.lovable.app";
export const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/8b5b2f6d-09b4-4437-a3ad-f78a6e059ff1";

export const SLAB_ROWS = [
  { range: "0 – 600,000", old: "0%", neu: "0%", diff: "—" },
  { range: "600,001 – 1,200,000", old: "5% over 600k", neu: "1% over 600k", diff: "−4%" },
  { range: "1,200,001 – 2,200,000", old: "30,000 + 15%", neu: "6,000 + 11%", diff: "Lower" },
  { range: "2,200,001 – 3,200,000", old: "180,000 + 25%", neu: "116,000 + 23%", diff: "Lower" },
  { range: "3,200,001 – 4,100,000", old: "430,000 + 30%", neu: "346,000 + 30%", diff: "Lower base" },
  { range: "Above 4,100,000", old: "700,000 + 35% (+surcharge)", neu: "616,000 + 35%", diff: "Surcharge removed" },
];