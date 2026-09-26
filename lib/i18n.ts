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

const en: Dict = {
  "nav.product": "Product",
  "nav.universities": "Universities",
  "nav.authors": "Authors",
  "nav.publishers": "Publishers",
  "nav.pricing": "Pricing",
  "nav.verify": "Verify",
  "nav.signin": "Sign in",
  "nav.getstarted": "Get started",
  "pricing.title": "Pricing that matches how integrity work is funded",
  "pricing.subtitle": "Students at onboarded institutions write free. Everyone else gets a clear plan.",
  "pricing.individual": "Individual",
  "pricing.publisher": "Publishing house",
  "pricing.institution": "University & institution",
  "pricing.contact": "Contact sales",
  "pricing.start": "Start writing",
  "pricing.studentfree": "Students with an institutional email at an onboarded university get free unlimited access automatically.",
};

const dictionaries: Record<Locale, Dict> = {
  en,
  es: { ...en, "nav.product": "Producto", "nav.universities": "Universidades", "nav.authors": "Autores", "nav.publishers": "Editoriales", "nav.pricing": "Precios", "nav.verify": "Verificar", "nav.signin": "Iniciar sesión", "nav.getstarted": "Empezar", "pricing.title": "Precios alineados con cómo se financia la integridad académica", "pricing.subtitle": "Los estudiantes de instituciones integradas escriben gratis.", "pricing.individual": "Individual", "pricing.publisher": "Editorial", "pricing.institution": "Universidad e institución", "pricing.contact": "Contactar ventas", "pricing.start": "Empezar a escribir", "pricing.studentfree": "Los estudiantes con correo institucional de una universidad integrada obtienen acceso ilimitado gratuito automáticamente." },
  fr: { ...en, "nav.product": "Produit", "nav.universities": "Universités", "nav.authors": "Auteurs", "nav.publishers": "Éditeurs", "nav.pricing": "Tarifs", "nav.verify": "Vérifier", "nav.signin": "Connexion", "nav.getstarted": "Commencer", "pricing.title": "Des tarifs adaptés au financement de l'intégrité", "pricing.subtitle": "Les étudiants des établissements intégrés écrivent gratuitement.", "pricing.contact": "Contacter les ventes", "pricing.start": "Commencer à écrire", "pricing.studentfree": "Les étudiants avec un e-mail institutionnel d'une université intégrée ont un accès illimité gratuit." },
  de: { ...en, "nav.product": "Produkt", "nav.universities": "Universitäten", "nav.authors": "Autoren", "nav.publishers": "Verlage", "nav.pricing": "Preise", "nav.verify": "Prüfen", "nav.signin": "Anmelden", "nav.getstarted": "Loslegen", "pricing.contact": "Vertrieb kontaktieren", "pricing.start": "Schreiben beginnen" },
  pt: { ...en, "nav.product": "Produto", "nav.universities": "Universidades", "nav.authors": "Autores", "nav.publishers": "Editoras", "nav.pricing": "Preços", "nav.verify": "Verificar", "nav.signin": "Entrar", "nav.getstarted": "Começar" },
  ar: { ...en, "nav.product": "المنتج", "nav.universities": "الجامعات", "nav.authors": "المؤلفون", "nav.publishers": "الناشرون", "nav.pricing": "الأسعار", "nav.verify": "تحقق", "nav.signin": "تسجيل الدخول", "nav.getstarted": "ابدأ" },
  zh: { ...en, "nav.product": "产品", "nav.universities": "高校", "nav.authors": "作者", "nav.publishers": "出版机构", "nav.pricing": "价格", "nav.verify": "验证", "nav.signin": "登录", "nav.getstarted": "开始使用" },
  hi: { ...en, "nav.product": "उत्पाद", "nav.universities": "विश्वविद्यालय", "nav.authors": "लेखक", "nav.publishers": "प्रकाशक", "nav.pricing": "मूल्य", "nav.verify": "सत्यापित करें", "nav.signin": "साइन इन", "nav.getstarted": "शुरू करें" },
  sw: { ...en, "nav.product": "Bidhaa", "nav.universities": "Vyuo vikuu", "nav.authors": "Waandishi", "nav.publishers": "Wachapishaji", "nav.pricing": "Bei", "nav.verify": "Thibitisha", "nav.signin": "Ingia", "nav.getstarted": "Anza" },
  ja: { ...en, "nav.product": "製品", "nav.universities": "大学", "nav.authors": "著者", "nav.publishers": "出版社", "nav.pricing": "料金", "nav.verify": "検証", "nav.signin": "ログイン", "nav.getstarted": "始める" },
};

export function t(locale: Locale, key: string): string {
  return dictionaries[locale]?.[key] ?? dictionaries.en[key] ?? key;
}

export function getLocaleFromCookie(cookieHeader?: string | null): Locale {
  const match = cookieHeader?.match(/(?:^|;\s*)veritas_locale=([a-z]{2})/);
  const code = (match?.[1] || "en") as Locale;
  return LOCALES.some((l) => l.code === code) ? code : "en";
}
