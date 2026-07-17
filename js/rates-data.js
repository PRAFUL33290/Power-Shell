/**
 * Données d’usage / rate limits — Claude · Codex · Grok
 * Synthèse indicative (mi-2026). Les plafonds officiels bougent : croise toujours la console.
 */

const RATES_DATE = "17/07/2026";

const PROVIDERS = {
  claude: {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    product: "Claude Code · API Messages",
    color: "claude",
    icon: "claude",
    tagline: "Fenêtres 5 h côté app · RPM/TPM stricts côté API",
    // Relative scores 0–10 for “pouvoir refaire des requêtes vite”
    scores: {
      throughput: 7,
      latency: 7,
      resetSpeed: 6,
      volumeDay: 7,
      agentLoop: 7,
      transparency: 8,
    },
    latencyNote: "~40–80 tok/s selon modèle (Haiku plus rapide, Fable plus lent)",
    resetNote: "API : minute (RPM/ITPM/OTPM). Claude Code : fenêtre glissante ~5 h + cap hebdo.",
    bestFor: "Qualité pro, mais un 429 ou un cap 5 h freine les relances en rafale.",
    worstFor: "Boucles agent très agressives sur bas tier ou abonnement Code saturé.",
  },
  codex: {
    id: "codex",
    name: "Codex",
    vendor: "OpenAI",
    product: "Codex CLI / app · pool ChatGPT",
    color: "codex",
    icon: "openai",
    tagline: "Quota tokens + fenêtre ~5 h (pas un simple RPM)",
    scores: {
      throughput: 6,
      latency: 7.5,
      resetSpeed: 4,
      volumeDay: 6,
      agentLoop: 6,
      transparency: 7,
    },
    latencyNote: "Rapide en mode mini/fast ; les modes reasoning grignotent fort le quota 5 h",
    resetNote: "Messages locaux & cloud tasks : fenêtre partagée ~5 h + limites hebdo possibles.",
    bestFor: "Sessions de code dans l’écosystème ChatGPT / Codex.",
    worstFor: "Enchaîner des dizaines de gros prompts d’affilée (le % 5 h tombe vite).",
  },
  grok: {
    id: "grok",
    name: "Grok",
    vendor: "xAI / SpaceXAI",
    product: "API · Grok Build CLI · app",
    color: "grok",
    icon: "bolt",
    tagline: "API haut débit (RPS/TPM) · pay-as-you-go pour relancer",
    scores: {
      throughput: 9.5,
      latency: 9,
      resetSpeed: 9,
      volumeDay: 9,
      agentLoop: 9.5,
      transparency: 7,
    },
    latencyNote: "Souvent ~80–120+ tok/s sur 4.5 — bon pour itérer vite",
    resetNote: "API : limites continues RPS/TPM (pas de cap 5 h type Codex). App : fenêtres 2 h.",
    bestFor: "Refaire des requêtes en boucle (agents, CLI, volume).",
    worstFor: "App gratuite / SuperGrok : plafonds messages par fenêtre (≠ API).",
  },
};

const SCORE_LABELS = {
  throughput: "Débit requêtes",
  latency: "Vitesse génération",
  resetSpeed: "Récup après limite",
  volumeDay: "Volume journalier",
  agentLoop: "Boucles agent",
  transparency: "Visibilité usage",
};

const SCORE_KEYS = Object.keys(SCORE_LABELS);

/** Tableaux de plafonds (ordres de grandeur publiés / docs). */
const LIMIT_TABLES = {
  claude_api: {
    title: "Claude API (Messages) — ordres de grandeur",
    note: "RPM + ITPM + OTPM par modèle et par tier. Ex. Sonnet-class souvent cité.",
    columns: ["Tier", "Accès (approx.)", "RPM", "ITPM (entrée)", "OTPM (sortie)"],
    rows: [
      ["Tier 1", "~5 $ dépôt", "50", "30k", "8k"],
      ["Tier 2", "~40 $ cumulés", "1 000", "450k", "90k"],
      ["Tier 3", "~200 $", "2 000", "800k", "160k"],
      ["Tier 4", "~400 $", "4 000", "2M", "400k"],
    ],
  },
  claude_app: {
    title: "Claude Code / abonnement — style d’usage",
    note: "Pas le même modèle que l’API : compute sur fenêtre glissante.",
    columns: ["Mécanisme", "Fenêtre", "Effet si saturé", "Relance possible"],
    rows: [
      ["Session active", "~5 h glissantes", "Bloqué jusqu’au reset partiel", "Attendre la fenêtre"],
      ["Cap hebdo", "7 jours", "Moins de compute la semaine", "Attendre / monter de plan"],
      ["API pay-as-you-go", "par minute", "429 RPM/TPM", "Quelques secondes → 1 min"],
    ],
  },
  codex: {
    title: "OpenAI Codex — usage produit",
    note: "Depuis avr. 2026 : usage token-based. Local + cloud partagent souvent la fenêtre 5 h.",
    columns: ["Plan / mode (indicatif)", "Local msg / 5 h", "Nature", "Relance après cap"],
    rows: [
      ["Plus · modèles lourds", "~15–90", "Quota tokens/raisonnement", "Jusqu’à plusieurs heures"],
      ["Plus · mini / light", "~60–350", "Plus de petits tours", "Même fenêtre 5 h"],
      ["Pro (×5–×20 vs Plus)", "Beaucoup plus", "Même logique, plafond plus haut", "Toujours 5 h / hebdo"],
      ["API OpenAI pure", "RPM/TPM tier", "Pas le pool Codex chat", "Reset à la minute"],
    ],
  },
  grok_api: {
    title: "Grok API — RPS & TPM (ex. Grok 4.5 / flagship)",
    note: "Tiers liés aux dépenses API. Chiffres types docs rate-limits xAI (évolutifs).",
    columns: ["Tier", "Spend cumulé (approx.)", "RPS (ordre)", "TPM (ordre)"],
    rows: [
      ["T0 / entrée", "bas / nouveau", "~37–150", "~10M–50M"],
      ["T1", "~50 $", "↑", "↑"],
      ["T2", "~250 $", "↑", "↑"],
      ["T3–T4", "1k–5k $", "jusqu’à centaines RPS", "dizaines–centaines M TPM"],
      ["Grok 4.5 (flagship)", "selon tier", "jusqu’~150–500 RPS", "jusqu’~50M–100M TPM"],
    ],
  },
  grok_app: {
    title: "Grok app / SuperGrok (consommateur)",
    note: "Séparé de l’API. Fenêtres courtes = reset plus fréquent que Codex 5 h.",
    columns: ["Plan", "Messages (approx.)", "Fenêtre", "Relance"],
    rows: [
      ["Free", "~10–20", "2 h", "Assez vite (2 h max)"],
      ["SuperGrok", "~100 / fenêtre", "2 h", "Reset plus fréquent qu’un cap 5 h"],
      ["Heavy", "beaucoup plus", "2 h / jour features", "Meilleur burst app"],
      ["API (recommandé agents)", "pay-per-token", "continu", "Idéal pour refaire des req."],
    ],
  },
};

const RETRY_SCENARIOS = [
  {
    id: "hit-minute",
    title: "Tu as pris un 429 (limite à la minute)",
    claude: { wait: "15–60 s", score: 8, detail: "RPM/ITPM/OTPM se rechargent en continu sur 60 s." },
    codex: { wait: "variable", score: 5, detail: "Si c’est l’API OpenAI : ~minute. Si c’est Codex 5 h : pas un 429 classique." },
    grok: { wait: "quelques s → 1 min", score: 9, detail: "RPS/TPM élevés : souvent tu ralentis un peu et tu repars." },
  },
  {
    id: "hit-5h",
    title: "Tu as vidé la fenêtre ~5 h (app / Codex / Claude Code)",
    claude: { wait: "jusqu’à ~5 h", score: 3, detail: "Claude Code : attendre le rolling window ou basculer sur l’API." },
    codex: { wait: "jusqu’à ~5 h", score: 3, detail: "Le % Usage regrimpe avec le temps ; gros prompts = drain rapide." },
    grok: { wait: "N/A (API)", score: 9, detail: "Sur l’API Grok : pas ce modèle 5 h. Sur l’app : plutôt 2 h." },
  },
  {
    id: "agent-loop",
    title: "Boucle agent : 30–100 appels d’affilée",
    claude: { wait: "tier-dépendant", score: 6, detail: "Tier 1 (50 RPM) limite fort. Tier 2+ tient mieux. OTPM peut tuer les longues sorties." },
    codex: { wait: "risque 5 h", score: 5, detail: "Chaque tour mange le pool. Fast/mini dure plus longtemps." },
    grok: { wait: "souvent OK", score: 9, detail: "Haut RPS + TPM + prix bas = le plus confortable pour relancer." },
  },
  {
    id: "same-day",
    title: "Même journée : itérer toute l’aprem",
    claude: { wait: "OK en API payante", score: 7, detail: "API scale avec le tier. Abonnement Code : hebdo + 5 h à surveiller." },
    codex: { wait: "surveiller %", score: 6, detail: "Plusieurs fenêtres 5 h dans la journée, mais le weekly peut coincer." },
    grok: { wait: "budget $", score: 9, detail: "Tu es limité par la facture tokens, rarement par un mur horaire API." },
  },
];

const VERDICTS = [
  {
    title: "Le plus rapide pour refaire des requêtes (API)",
    winner: "grok",
    why: "Haut RPS/TPM, pas de plafond 5 h type Codex, génération souvent plus rapide, coût bas pour multiplier les tours.",
  },
  {
    title: "Meilleure visibilité “il me reste X %”",
    winner: "codex",
    why: "Panneau Usage Codex (5 h + crédits) très lisible — tu vois le drain en direct.",
  },
  {
    title: "Meilleur si tu es déjà en qualité Claude",
    winner: "claude",
    why: "Passe par l’API pay-as-you-go pour éviter le mur 5 h de Claude Code quand tu veux spammer des retries.",
  },
  {
    title: "Le plus frustrant si tu “spamme” le chat code",
    winner: "codex",
    why: "La fenêtre 5 h + tokens de reasoning peut tomber en quelques gros prompts.",
    invert: true,
  },
];

const TIPS = [
  {
    num: "01",
    title: "Deux horloges différentes",
    body: "API = minute (RPM/TPM). Apps code (Codex, Claude Code) = souvent 5 h. Grok API se comporte plutôt comme une API “continue”.",
  },
  {
    num: "02",
    title: "Vitesse ≠ quota",
    body: "Un modèle ultra rapide peut vider plus vite un quota 5 h (plus de tokens/s). Grok gagne souvent sur les deux : vite + gros débit API.",
  },
  {
    num: "03",
    title: "Pour retester sans attendre",
    body: "Préfère une clé API (Grok / Claude / OpenAI) plutôt que le pool abonnement quand tu fais des boucles de debug.",
  },
  {
    num: "04",
    title: "Réduis la sortie",
    body: "OTPM Claude et le pool Codex aiment les réponses courtes. Demande des diffs ciblés, pas le fichier entier à chaque fois.",
  },
  {
    num: "05",
    title: "Monte de tier si 429",
    body: "Claude et Grok débloquent le débit avec le spend cumulé. Un petit dépôt peut passer de “50 RPM” à “1000 RPM”.",
  },
  {
    num: "06",
    title: "Surveille l’UI Usage",
    body: "Codex : Settings → Usage. Claude : indicateurs Code / console. Grok API : console xAI billing & rate limits.",
  },
];
