/**
 * Prix API par 1M tokens (USD) — au 17/07/2026
 * Source : fichier Token du projet
 */
const TOKEN_PRICING = [
  {
    provider: "xAI (Grok)",
    providerKey: "xai",
    model: "Grok 4.5",
    input: 2.0,
    output: 6.0,
    comment: "Modèle phare récent, 500k contexte, très axé code/agents.",
    badge: "Phare",
  },
  {
    provider: "xAI (Grok)",
    providerKey: "xai",
    model: "Grok 4.3",
    input: 1.25,
    output: 2.5,
    comment: "Modèle général “value”, contexte 1M, bon rapport perf/prix.",
    badge: "Value",
  },
  {
    provider: "OpenAI (ChatGPT)",
    providerKey: "openai",
    model: "GPT-4o-mini",
    input: 0.15,
    output: 0.6,
    comment: "Modèle low-cost très utilisé pour chat et tâches générales.",
    badge: "Éco",
  },
  {
    provider: "OpenAI (ChatGPT)",
    providerKey: "openai",
    model: "GPT-4.1",
    input: 2.0,
    output: 8.0,
    comment: "Modèle frontier généraliste, contexte jusqu’à 1M tokens.",
    badge: "Frontier",
  },
  {
    provider: "Anthropic (Claude)",
    providerKey: "anthropic",
    model: "Claude Sonnet 4.6",
    input: 3.0,
    output: 15.0,
    comment: "Modèle Claude standard/flagship pour usage pro.",
    badge: "Pro",
  },
  {
    provider: "Anthropic (Claude)",
    providerKey: "anthropic",
    model: "Claude Haiku 4.5",
    input: 1.0,
    output: 5.0,
    comment: "Modèle plus léger/éco pour gros volumes.",
    badge: "Léger",
  },
  {
    provider: "Vibe (Vibe AI)",
    providerKey: "vibe",
    model: "N/A (bundle)",
    input: null,
    output: null,
    comment: "Plans Pro 25 USD/mois et Max 99 USD/mois — pas de tarif token public.",
    badge: "Abonnement",
    plans: [
      { name: "Pro", price: 25 },
      { name: "Max", price: 99 },
    ],
  },
];

const TOKEN_SOURCES = [
  { id: 1, title: "Grok 4.5 vs Claude Opus 4.8 vs ChatGPT-4o", url: "https://www.bleap.finance/fr-fr/blog/grok-4-5-explained" },
  { id: 2, title: "Grok 4.5: 500K Context, $2/$6 Pricing", url: "https://hokai.io/hub/models/grok-4.5" },
  { id: 3, title: "Introducing Grok 4.5", url: "https://x.ai/news/grok-4-5" },
  { id: 6, title: "Grok API Pricing (July 2026)", url: "https://benchlm.ai/xai/api-pricing" },
  { id: 7, title: "xAI Grok API Pricing Guide 2026", url: "https://www.getapipulse.com/xai.html" },
  { id: 9, title: "OpenAI API Pricing Guide 2026", url: "https://www.burnwise.io/blog/openai-pricing-guide-2026" },
  { id: 10, title: "OpenAI API Pricing 2026", url: "https://www.burnwise.io/ai-pricing/openai" },
  { id: 11, title: "Claude API Pricing 2026", url: "https://www.metacto.com/blogs/anthropic-api-pricing-a-full-breakdown-of-costs-and-integration" },
  { id: 12, title: "Anthropic Claude API Pricing 2026", url: "https://www.aipricing.guru/anthropic-pricing/" },
  { id: 13, title: "Vibe AI Pricing & Plans", url: "https://vibe.us/vibe-ai/pricing/" },
  { id: 14, title: "Pricing — VibeBrowser Co-Pilot", url: "https://www.vibebrowser.app/pricing" },
];

const PROVIDERS = {
  all: { label: "Tous", icon: "✦" },
  xai: { label: "xAI Grok", icon: "⚡" },
  openai: { label: "OpenAI", icon: "◎" },
  anthropic: { label: "Anthropic", icon: "◆" },
  vibe: { label: "Vibe", icon: "◇" },
};
