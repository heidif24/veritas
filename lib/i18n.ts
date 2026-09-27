import { EXTRA_EN, EXTRA_ES } from "./i18n-extra";

export type Locale =
  | "en"
  | "es"
  | "fr"
  | "de"
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
  "nav.getstarted": "Get started",
  "home.badge": "Authorship verified",
  "home.hero": "Write with confidence. Prove it was you.",
  "home.sub": "Veritas is the trusted workspace for academic and professional writing — with clear provenance, originality checks, and sealed submissions.",
  "home.cta.start": "Start free",
  "home.cta.verify": "Verify a document",
  "home.v1.title": "Original work, clearly shown",
  "home.v1.body": "Every draft carries a living record of how it was written — so reviewers can trust the result.",
  "home.v2.title": "Sealed and portable",
  "home.v2.body": "Export a signed package that stays verifiable offline, for institutions, publishers, and external reviewers.",
  "home.v3.title": "Built for real workflows",
  "home.v3.body": "Students, faculty, and administrators share one platform with roles, policy, and audit trails that fit campus life.",
  "home.stat.institutions": "Institutions & teams",
  "home.stat.documents": "Documents processed",
  "home.stat.accuracy": "Integrity accuracy",
  "home.stat.speed": "Average verification",
  "home.who.label": "Who uses Veritas",
  "home.who.title": "One platform. Clear roles.",
  "home.role.students": "Students",
  "home.role.students.detail": "Draft, cite, and submit with confidence.",
  "home.role.faculty": "Faculty",
  "home.role.faculty.detail": "Review work with clear evidence.",
  "home.role.institutions": "Institutions",
  "home.role.institutions.detail": "Policy, onboarding, and oversight.",
  "home.role.publishers": "Publishers",
  "home.role.publishers.detail": "Validate before you publish.",
  "home.cta.title": "Ready for trusted writing?",
  "home.cta.body": "Join institutions and teams that already use Veritas for integrity, review, and secure export.",
  "home.cta.account": "Create account",
  "home.cta.pricing": "View pricing",
  "footer.tagline": "The trusted platform for verified academic and professional writing.",
  "footer.product": "Product",
  "footer.solutions": "Solutions",
  "footer.company": "Company",
  "footer.platform": "Platform",
  "footer.faculty": "Faculty",
  "footer.onboarding": "Onboarding",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.rights": "© 2026 Veritas. All rights reserved.",
  "pricing.title": "Pricing that matches how integrity work is funded",
  "pricing.subtitle": "Students at onboarded institutions write free. Everyone else gets a clear plan.",
  "pricing.individual": "Individual",
  "pricing.publisher": "Publishing house",
  "pricing.institution": "University & institution",
  "pricing.contact": "Contact sales",
  "pricing.start": "Start writing",
  "pricing.studentfree": "Students with an institutional email at an onboarded university get free unlimited access automatically.",
};

const en: Dict = { ...enBase, ...EXTRA_EN };

function partial(overrides: Dict): Dict {
  return { ...en, ...overrides };
}

const dictionaries: Record<Locale, Dict> = {
  en,
  es: partial({
    ...EXTRA_ES,
    "nav.product": "Producto",
    "nav.universities": "Universidades",
    "nav.authors": "Autores",
    "nav.publishers": "Editoriales",
    "nav.pricing": "Precios",
    "nav.verify": "Verificar",
    "nav.signin": "Iniciar sesión",
    "nav.getstarted": "Empezar",
    "home.badge": "Autoría verificada",
    "home.hero": "Escribe con confianza. Demuestra que fuiste tú.",
    "home.sub": "Veritas es el espacio de trabajo de confianza para la escritura académica y profesional — con procedencia clara, controles de originalidad y entregas selladas.",
    "home.cta.start": "Empieza gratis",
    "home.cta.verify": "Verificar un documento",
    "home.v1.title": "Trabajo original, claramente visible",
    "home.v1.body": "Cada borrador lleva un registro vivo de cómo se escribió — para que los revisores puedan confiar en el resultado.",
    "home.v2.title": "Sellado y portable",
    "home.v2.body": "Exporta un paquete firmado que sigue siendo verificable sin conexión.",
    "home.v3.title": "Hecho para flujos reales",
    "home.v3.body": "Estudiantes, profesores y administradores comparten una plataforma con roles y auditorías.",
    "home.who.title": "Una plataforma. Roles claros.",
    "home.cta.title": "¿Listo para una escritura de confianza?",
    "home.cta.account": "Crear cuenta",
    "home.cta.pricing": "Ver precios",
    "footer.tagline": "La plataforma de confianza para escritura académica y profesional verificada.",
    "footer.rights": "© 2026 Veritas. Todos los derechos reservados.",
    "pricing.title": "Precios alineados con cómo se financia la integridad académica",
    "pricing.subtitle": "Los estudiantes de instituciones integradas escriben gratis.",
    "pricing.contact": "Contactar ventas",
    "pricing.start": "Empezar a escribir",
  }),
  fr: partial({
    "nav.product": "Produit",
    "nav.universities": "Universités",
    "nav.authors": "Auteurs",
    "nav.publishers": "Éditeurs",
    "nav.pricing": "Tarifs",
    "nav.verify": "Vérifier",
    "nav.signin": "Connexion",
    "nav.getstarted": "Commencer",
    "home.badge": "Paternité vérifiée",
    "home.hero": "Écrivez en confiance. Prouvez que c'était vous.",
    "home.cta.start": "Commencer gratuitement",
    "home.cta.verify": "Vérifier un document",
    "home.cta.title": "Prêt pour une écriture de confiance ?",
    "home.cta.account": "Créer un compte",
    "login.title": "Connexion à Veritas",
    "login.submit": "Connexion",
    "login.email": "E-mail",
    "login.password": "Mot de passe",
    "platform.title": "Tout ce qu'il faut pour une écriture de confiance",
    "verify.title": "Confirmer qu'un document est authentique",
  }),
  de: partial({
    "nav.product": "Produkt",
    "nav.universities": "Universitäten",
    "nav.authors": "Autoren",
    "nav.publishers": "Verlage",
    "nav.pricing": "Preise",
    "nav.verify": "Prüfen",
    "nav.signin": "Anmelden",
    "nav.getstarted": "Loslegen",
    "home.hero": "Schreiben Sie mit Vertrauen. Beweisen Sie, dass Sie es waren.",
    "login.title": "Bei Veritas anmelden",
    "login.submit": "Anmelden",
    "platform.title": "Alles für vertrauenswürdiges Schreiben",
    "verify.title": "Dokumentenauthentizität bestätigen",
  }),
  pt: partial({
    "nav.product": "Produto",
    "nav.universities": "Universidades",
    "nav.authors": "Autores",
    "nav.publishers": "Editoras",
    "nav.pricing": "Preços",
    "nav.verify": "Verificar",
    "nav.signin": "Entrar",
    "nav.getstarted": "Começar",
    "login.title": "Entrar no Veritas",
    "login.submit": "Entrar",
  }),
  ar: partial({
    "nav.product": "المنتج",
    "nav.universities": "الجامعات",
    "nav.authors": "المؤلفون",
    "nav.publishers": "الناشرون",
    "nav.pricing": "الأسعار",
    "nav.verify": "تحقق",
    "nav.signin": "تسجيل الدخول",
    "nav.getstarted": "ابدأ",
    "login.title": "تسجيل الدخول إلى فيريتاس",
    "login.submit": "تسجيل الدخول",
  }),
  zh: partial({
    "nav.product": "产品",
    "nav.universities": "高校",
    "nav.authors": "作者",
    "nav.publishers": "出版机构",
    "nav.pricing": "价格",
    "nav.verify": "验证",
    "nav.signin": "登录",
    "nav.getstarted": "开始使用",
    "login.title": "登录 Veritas",
    "login.submit": "登录",
  }),
  hi: partial({
    "nav.product": "उत्पाद",
    "nav.universities": "विश्वविद्यालय",
    "nav.authors": "लेखक",
    "nav.publishers": "प्रकाशक",
    "nav.pricing": "मूल्य",
    "nav.verify": "सत्यापित करें",
    "nav.signin": "साइन इन",
    "nav.getstarted": "शुरू करें",
    "login.title": "Veritas में साइन इन करें",
    "login.submit": "साइन इन",
  }),
  sw: partial({
    "nav.product": "Bidhaa",
    "nav.universities": "Vyuo vikuu",
    "nav.authors": "Waandishi",
    "nav.publishers": "Wachapishaji",
    "nav.pricing": "Bei",
    "nav.verify": "Thibitisha",
    "nav.signin": "Ingia",
    "nav.getstarted": "Anza",
    "login.title": "Ingia Veritas",
    "login.submit": "Ingia",
  }),
  ja: partial({
    "nav.product": "製品",
    "nav.universities": "大学",
    "nav.authors": "著者",
    "nav.publishers": "出版社",
    "nav.pricing": "料金",
    "nav.verify": "検証",
    "nav.signin": "ログイン",
    "nav.getstarted": "始める",
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
