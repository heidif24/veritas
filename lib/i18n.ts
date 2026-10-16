import { EXTRA_EN, EXTRA_ES } from "./i18n-extra";
import { AUDIENCE_EN, AUDIENCE_ES } from "./i18n-audience";
import { FULL_FR } from "./i18n-fr";
import { FULL_DE } from "./i18n-de";
import { FULL_IT } from "./i18n-it";

export type Locale =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ar"
  | "zh"
  | "hi"
  | "sw"
  | "ja";

export const LOCALES: Array<{ code: Locale; label: string; native: string; dir?: "ltr" | "rtl" }> = [
  { code: "en", label: "English", native: "English" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "fr", label: "French", native: "Français" },
  { code: "de", label: "German", native: "Deutsch" },
  { code: "it", label: "Italian", native: "Italiano" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "sw", label: "Swahili", native: "Kiswahili" },
  { code: "ja", label: "Japanese", native: "日本語" },
];

type Dict = Record<string, string>;

const enBase: Dict = {
  "nav.product": "Product",
  "nav.universities": "Universities",
  "nav.authors": "Authors",
  "nav.publishers": "Publishers",
  "nav.pricing": "Pricing",
  "nav.verify": "Verify",
  "nav.signin": "Sign in",
  "nav.getstarted": "Contact support",
  "nav.contactSupport": "Contact support",
  "home.badge": "Universities · Process · Seal",
  "home.hero": "Academic integrity, licensed to universities.",
  "home.sub":
    "Veritas records how students write, supports instructor review, and seals submissions with cryptographic proof — sold only to universities that customize it for campus.",
  "home.cta.start": "Contact support",
  "home.cta.verify": "Verify a sealed package",
  "home.v1.title": "Process is the missing layer",
  "home.v1.body":
    "Scores alone leave doubt. Veritas keeps a living composition record — how the draft was built — so review is grounded in process, not guesswork.",
  "home.v2.title": "Integrity checks that fit review",
  "home.v2.body":
    "Plagiarism and AI signals sit beside the composition trail. Faculty see evidence they can discuss, not a single opaque label.",
  "home.v3.title": "Seal and safeguard the result",
  "home.v3.body":
    "When work is ready, export a signed package. The content hash and seal travel with the document so authenticity holds after submission.",
  "home.stat.institutions": "Universities",
  "home.stat.documents": "Documents processed",
  "home.stat.accuracy": "Integrity accuracy",
  "home.stat.speed": "Average verification",
  "home.who.label": "Built for campus",
  "home.who.title": "Students, instructors, institutions.",
  "home.role.students": "Students",
  "home.role.students.detail": "Write with a clear record and fair review — free under a campus licence.",
  "home.role.faculty": "Instructors",
  "home.role.faculty.detail": "Review process and outcome together on assignments and submissions.",
  "home.role.institutions": "Universities",
  "home.role.institutions.detail": "License, brand, and provision access for your campus.",
  "home.role.publishers": "Publishers",
  "home.role.publishers.detail": "Retired — universities only.",
  "home.cta.title": "Bring Veritas to your university",
  "home.cta.body":
    "Contact support to license access codes. Your institution customizes branding and policy; students and instructors use the established writing and submission workflows.",
  "home.cta.account": "Contact support",
  "home.cta.contact": "Contact support",
  "home.cta.pricing": "View licensing",
  "footer.tagline":
    "Process evidence, integrity checks, and sealed results — licensed exclusively to universities.",
  "footer.product": "Product",
  "footer.solutions": "Solutions",
  "footer.company": "Company",
  "footer.platform": "Platform",
  "footer.faculty": "Instructors",
  "footer.onboarding": "Onboarding",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.rights": "© 2026 Veritas. All rights reserved.",
  "pricing.title": "University licensing only",
  "pricing.subtitle": "Students at onboarded universities write free. Access is sold only to institutions.",
  "pricing.individual": "Individual",
  "pricing.publisher": "Publishing house",
  "pricing.institution": "University & institution",
  "pricing.contact": "Contact support",
  "pricing.start": "Contact support",
  "pricing.studentfree":
    "Students with an institutional email at an onboarded university get free unlimited access automatically.",
};

const en: Dict = { ...enBase, ...EXTRA_EN, ...AUDIENCE_EN };

function partial(overrides: Dict): Dict {
  return { ...en, ...overrides };
}

const dictionaries: Record<Locale, Dict> = {
  en,
  es: partial({ ...EXTRA_ES, ...AUDIENCE_ES }),
  fr: partial(FULL_FR),
  de: partial(FULL_DE),
  it: partial(FULL_IT),
  pt: partial({
    "nav.product": "Produto",
    "nav.universities": "Universidades",
    "nav.pricing": "Preços",
    "nav.verify": "Verificar",
    "nav.signin": "Entrar",
    "nav.getstarted": "Contactar suporte",
    "nav.contactSupport": "Contactar suporte",
    "home.hero": "Integridade académica, licenciada a universidades.",
    "login.title": "Entrar no Veritas",
    "login.submit": "Entrar",
  }),
  ar: partial({
    "nav.product": "المنتج",
    "nav.universities": "الجامعات",
    "nav.pricing": "الأسعار",
    "nav.verify": "تحقق",
    "nav.signin": "تسجيل الدخول",
    "nav.getstarted": "تواصل مع الدعم",
    "nav.contactSupport": "تواصل مع الدعم",
    "home.hero": "النزاهة الأكاديمية، مرخصة للجامعات.",
    "login.title": "تسجيل الدخول إلى فيريتاس",
    "login.submit": "تسجيل الدخول",
  }),
  zh: partial({
    "nav.product": "产品",
    "nav.universities": "高校",
    "nav.pricing": "价格",
    "nav.verify": "验证",
    "nav.signin": "登录",
    "nav.getstarted": "联系支持",
    "nav.contactSupport": "联系支持",
    "home.hero": "学术诚信，仅授权给高校。",
    "login.title": "登录 Veritas",
    "login.submit": "登录",
  }),
  hi: partial({
    "nav.product": "उत्पाद",
    "nav.universities": "विश्वविद्यालय",
    "nav.pricing": "मूल्य",
    "nav.verify": "सत्यापित करें",
    "nav.signin": "साइन इन",
    "nav.getstarted": "सहायता से संपर्क करें",
    "nav.contactSupport": "सहायता से संपर्क करें",
    "home.hero": "शैक्षणिक ईमानदारी, केवल विश्वविद्यालयों के लिए लाइसेंस।",
    "login.title": "Veritas में साइन इन करें",
    "login.submit": "साइन इन",
  }),
  sw: partial({
    "nav.product": "Bidhaa",
    "nav.universities": "Vyuo vikuu",
    "nav.pricing": "Bei",
    "nav.verify": "Thibitisha",
    "nav.signin": "Ingia",
    "nav.getstarted": "Wasiliana na msaada",
    "nav.contactSupport": "Wasiliana na msaada",
    "home.hero": "Uaminifu wa kitaaluma, leseni kwa vyuo vikuu pekee.",
    "login.title": "Ingia Veritas",
    "login.submit": "Ingia",
  }),
  ja: partial({
    "nav.product": "製品",
    "nav.universities": "大学",
    "nav.pricing": "料金",
    "nav.verify": "検証",
    "nav.signin": "ログイン",
    "nav.getstarted": "サポートに連絡",
    "nav.contactSupport": "サポートに連絡",
    "home.hero": "学術的誠実性。大学向けライセンスのみ。",
    "login.title": "Veritasにログイン",
    "login.submit": "ログイン",
  }),
};

export function t(locale: Locale, key: string): string {
  return dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
}

export function getLocaleFromCookie(cookieHeader?: string | null): Locale {
  const match = cookieHeader?.match(/(?:^|;\s*)veritas_locale=([a-z]{2})/);
  const code = (match?.[1] || "en") as Locale;
  return LOCALES.some((l) => l.code === code) ? code : "en";
}
