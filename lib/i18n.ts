import { EXTRA_EN, EXTRA_ES } from "./i18n-extra";
import { AUDIENCE_EN, AUDIENCE_ES } from "./i18n-audience";

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

  "home.badge": "Process · Integrity · Seal",
  "home.hero": "Trust the process. Safeguard the result.",
  "home.sub":
    "Veritas records how work is written, checks plagiarism and AI signals, then seals the outcome so reviewers can trust both the process and the final document.",
  "home.cta.start": "Start writing",
  "home.cta.verify": "Verify a sealed package",
  "home.v1.title": "Process is the missing layer",
  "home.v1.body":
    "Scores alone leave doubt. Veritas keeps a living composition record — how the draft was built — so review is grounded in process, not guesswork.",
  "home.v2.title": "Integrity checks that fit review",
  "home.v2.body":
    "Plagiarism and AI signals sit beside the composition trail. Faculty and editors see evidence they can discuss, not a single opaque label.",
  "home.v3.title": "Seal and safeguard the result",
  "home.v3.body":
    "When work is ready, export a signed package. The content hash and seal travel with the document so authenticity holds after submission.",
  "home.stat.institutions": "Institutions & teams",
  "home.stat.documents": "Documents processed",
  "home.stat.accuracy": "Integrity accuracy",
  "home.stat.speed": "Average verification",
  "home.who.label": "Who uses Veritas",
  "home.who.title": "One platform. Clear roles.",
  "home.role.students": "Students",
  "home.role.students.detail": "Write with a clear record and fair review.",
  "home.role.faculty": "Faculty",
  "home.role.faculty.detail": "Review process and outcome together.",
  "home.role.institutions": "Institutions",
  "home.role.institutions.detail": "Policy, onboarding, and oversight.",
  "home.role.publishers": "Publishers",
  "home.role.publishers.detail": "Validate before you publish.",
  "home.cta.title": "Ready to trust the process?",
  "home.cta.body":
    "Join institutions and teams that use Veritas for composition evidence, integrity review, and sealed export — not detection theater.",
  "home.cta.account": "Create account",
  "home.cta.pricing": "View pricing",

  "footer.tagline":
    "Process evidence, integrity checks, and sealed results — for academic and professional writing.",
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
  "pricing.studentfree":
    "Students with an institutional email at an onboarded university get free unlimited access automatically.",
};

const en: Dict = { ...enBase, ...EXTRA_EN, ...AUDIENCE_EN };

function partial(overrides: Dict): Dict {
  return { ...en, ...overrides };
}

const dictionaries: Record<Locale, Dict> = {
  en,
  es: partial({
    ...EXTRA_ES,
    ...AUDIENCE_ES,
    "nav.product": "Producto",
    "nav.universities": "Universidades",
    "nav.authors": "Autores",
    "nav.publishers": "Editoriales",
    "nav.pricing": "Precios",
    "nav.verify": "Verificar",
    "nav.signin": "Iniciar sesión",
    "nav.getstarted": "Empezar",
    "home.badge": "Proceso · Integridad · Sello",
    "home.hero": "Confía en el proceso. Protege el resultado.",
    "home.sub":
      "Veritas registra cómo se escribe el trabajo, revisa plagio y señales de IA, y sella el resultado para que revisores confíen en el proceso y el documento final.",
    "home.cta.start": "Empezar a escribir",
    "home.cta.verify": "Verificar un paquete sellado",
    "home.v1.title": "El proceso es la capa que faltaba",
    "home.v1.body":
      "Las puntuaciones solas dejan duda. Veritas guarda un registro vivo de composición — cómo se construyó el borrador.",
    "home.v2.title": "Controles de integridad útiles para revisar",
    "home.v2.body": "Plagio y señales de IA junto al rastro de composición. Evidencia para conversar, no una etiqueta opaca.",
    "home.v3.title": "Sella y protege el resultado",
    "home.v3.body": "Exporta un paquete firmado. El sello viaja con el documento tras la entrega.",
    "home.who.title": "Una plataforma. Roles claros.",
    "home.cta.title": "¿Listo para confiar en el proceso?",
    "home.cta.account": "Crear cuenta",
    "home.cta.pricing": "Ver precios",
    "footer.tagline": "Evidencia de proceso, integridad y resultados sellados — para escritura académica y profesional.",
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
    "home.badge": "Processus · Intégrité · Sceau",
    "home.hero": "Faites confiance au processus. Protégez le résultat.",
    "home.cta.start": "Commencer à écrire",
    "home.cta.verify": "Vérifier un paquet scellé",
    "home.cta.title": "Prêt à faire confiance au processus ?",
    "login.title": "Connexion à Veritas",
    "login.submit": "Connexion",
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
    "home.badge": "Prozess · Integrität · Siegel",
    "home.hero": "Vertrauen Sie dem Prozess. Sichern Sie das Ergebnis.",
    "login.title": "Bei Veritas anmelden",
    "login.submit": "Anmelden",
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
    "home.hero": "Confie no processo. Proteja o resultado.",
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
    "home.hero": "ثق بالعملية. احمِ النتيجة.",
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
    "home.hero": "信任过程。守护结果。",
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
    "home.hero": "प्रक्रिया पर भरोसा करें। परिणाम सुरक्षित रखें।",
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
    "home.hero": "Amini mchakato. Linda matokeo.",
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
    "home.hero": "プロセスを信頼する。結果を守る。",
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
