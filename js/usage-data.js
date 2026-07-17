/**
 * Quotas Grok / xAI — valeurs indicatives (2026)
 * Les limites officielles bougent : tu peux tout personnaliser sur la page.
 */

const USAGE_PRESETS = {
  consumer: {
    label: "Grok app / web (consommateur)",
    icon: "chat",
    plans: {
      free: {
        label: "Grok Free",
        note: "Limites approximatives — fenêtre glissante selon les périodes.",
        meters: [
          { id: "msg_2h", label: "Messages chat", unit: "req", period: "toutes les 2 h", limit: 20 },
          { id: "think", label: "Mode Think / reasoning", unit: "req", period: "par 24 h", limit: 10 },
          { id: "deepsearch", label: "DeepSearch", unit: "req", period: "par 24 h", limit: 10 },
          { id: "images", label: "Images", unit: "img", period: "par jour", limit: 0 },
        ],
      },
      super: {
        label: "SuperGrok",
        note: "Estimations communautaires / guides 2026 — non officielles garanties.",
        meters: [
          { id: "msg_2h", label: "Messages chat", unit: "req", period: "toutes les 2 h", limit: 100 },
          { id: "think", label: "Mode Think / reasoning", unit: "req", period: "toutes les 2 h", limit: 30 },
          { id: "deepsearch", label: "DeepSearch", unit: "req", period: "par jour", limit: 100 },
          { id: "images", label: "Images", unit: "img", period: "par jour", limit: 50 },
          { id: "videos", label: "Vidéos", unit: "vid", period: "par jour", limit: 10 },
          { id: "voice_min", label: "Mode vocal", unit: "min", period: "par jour", limit: 60 },
          { id: "tokens_day", label: "Tokens texte (approx.)", unit: "tok", period: "par jour", limit: 2_000_000 },
        ],
      },
      heavy: {
        label: "SuperGrok Heavy",
        note: "Plus de marge (≈ 3× SuperGrok selon les guides). Soft caps possibles.",
        meters: [
          { id: "msg_2h", label: "Messages chat", unit: "req", period: "toutes les 2 h", limit: 500 },
          { id: "think", label: "Mode Think / reasoning", unit: "req", period: "toutes les 2 h", limit: 100 },
          { id: "deepsearch", label: "DeepSearch", unit: "req", period: "par jour", limit: 500 },
          { id: "images", label: "Images", unit: "img", period: "par jour", limit: 200 },
          { id: "videos", label: "Vidéos", unit: "vid", period: "par jour", limit: 30 },
          { id: "voice_min", label: "Mode vocal", unit: "min", period: "par jour", limit: 240 },
          { id: "tokens_day", label: "Tokens texte (approx.)", unit: "tok", period: "par jour", limit: 10_000_000 },
        ],
      },
    },
  },
  api: {
    label: "API xAI (développeur)",
    icon: "bolt",
    plans: {
      t0: {
        label: "API Tier 0",
        note: "RPS / TPM par modèle — d’après la doc rate limits xAI (valeurs types Grok 4.3 / Build).",
        meters: [
          { id: "rps", label: "Requêtes / seconde (RPS)", unit: "rps", period: "continu", limit: 37 },
          { id: "tpm", label: "Tokens / minute (TPM)", unit: "tok/min", period: "continu", limit: 10_000_000 },
          { id: "credits", label: "Crédits API (budget)", unit: "USD", period: "mois", limit: 150 },
        ],
      },
      t1: {
        label: "API Tier 1",
        note: "Après dépenses cumulées (ex. seuil ~50 USD selon la doc tiers).",
        meters: [
          { id: "rps", label: "Requêtes / seconde (RPS)", unit: "rps", period: "continu", limit: 50 },
          { id: "tpm", label: "Tokens / minute (TPM)", unit: "tok/min", period: "continu", limit: 15_000_000 },
          { id: "credits", label: "Crédits API (budget)", unit: "USD", period: "mois", limit: 500 },
        ],
      },
      t2: {
        label: "API Tier 2",
        note: "Volumes plus élevés pour prod légère.",
        meters: [
          { id: "rps", label: "Requêtes / seconde (RPS)", unit: "rps", period: "continu", limit: 75 },
          { id: "tpm", label: "Tokens / minute (TPM)", unit: "tok/min", period: "continu", limit: 25_000_000 },
          { id: "credits", label: "Crédits API (budget)", unit: "USD", period: "mois", limit: 2000 },
        ],
      },
      custom: {
        label: "Budget perso (API)",
        note: "Définis ton plafond mensuel en $ et le montant déjà consommé.",
        meters: [
          { id: "credits", label: "Budget API", unit: "USD", period: "mois", limit: 100 },
          { id: "tokens_month", label: "Tokens ce mois", unit: "tok", period: "mois", limit: 10_000_000 },
        ],
      },
    },
  },
  build: {
    label: "Grok Build / IDE",
    icon: "tools",
    plans: {
      beta: {
        label: "Grok Build (session)",
        note: "Les plafonds Build changent souvent. Saisis ce que tu vois dans l’UI.",
        meters: [
          { id: "prompts", label: "Prompts / messages agent", unit: "req", period: "fenêtre", limit: 100 },
          { id: "tokens_session", label: "Tokens session", unit: "tok", period: "session", limit: 500_000 },
        ],
      },
    },
  },
};

const USAGE_TIPS = [
  {
    num: "01",
    title: "Où voir mon usage réel ?",
    body: "Grok web / app : regarde les messages d’erreur « rate limit » ou l’indicateur d’usage s’il est affiché. API : console xAI → usage / billing.",
  },
  {
    num: "02",
    title: "Pourquoi des chiffres approximatifs ?",
    body: "xAI ajuste les plafonds (charge serveur, plan, région). Cette page sert de compteur perso, pas de facture officielle.",
  },
  {
    num: "03",
    title: "Comment renseigner « utilisé » ?",
    body: "Si Grok dit « 12 / 100 messages », mets limite 100 et utilisé 12. Le % restant se calcule tout seul.",
  },
  {
    num: "04",
    title: "API ≠ SuperGrok",
    body: "Les quotas chat (app) et les rate limits API sont séparés. Choisis le bon onglet en haut.",
  },
  {
    num: "05",
    title: "Reset des fenêtres",
    body: "Beaucoup de limites se réinitialisent toutes les 2 h ou chaque jour. Clique « Reset usage » quand ta fenêtre repart à zéro.",
  },
  {
    num: "06",
    title: "Données locales",
    body: "Tout est stocké dans ton navigateur (localStorage). Rien n’est envoyé sur un serveur.",
  },
];
