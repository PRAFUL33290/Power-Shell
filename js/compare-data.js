/**
 * Comparaison frontier AI — juillet 2026
 * Grok 4.5 · GPT-5.6 Sol (ChatGPT) · Claude Fable 5
 * Prix / 1M tokens en USD. Notes = synthèse publique, pas un bench labo.
 */

const COMPARE_DATE = "17/07/2026";

const MODELS = {
  grok: {
    id: "grok",
    name: "Grok 4.5",
    vendor: "xAI / SpaceXAI",
    tagline: "Flagship code & agents — rapport perf/prix agressif",
    badge: "Phare xAI",
    released: "8 juillet 2026",
    context: "500K",
    input: 2.0,
    output: 6.0,
    cached: 0.5,
    color: "grok",
    strengths: [
      "Très bon rapport qualité / coût API",
      "Vitesse et efficacité tokens (moins de blabla)",
      "Pensé pour coding agents + Grok Build CLI",
      "Raisonnement configurable (effort)",
      "Intégrations Cursor / terminal natives",
    ],
    weaknesses: [
      "Contexte 500K (vs 1M+ chez certains rivaux)",
      "Écosystème pro moins large qu’OpenAI",
      "Multimodal / computer-use moins matures que GPT",
    ],
    bestFor: "Agents de code, volume API, CLI, itérations rapides",
    scores: {
      coding: 9,
      agents: 9,
      reasoning: 8.5,
      speed: 9,
      value: 10,
      context: 7,
      ecosystem: 7.5,
      safety: 7,
    },
  },
  gpt: {
    id: "gpt",
    name: "GPT-5.6 Sol",
    vendor: "OpenAI · ChatGPT",
    tagline: "Flagship ChatGPT — plateforme + computer use",
    badge: "ChatGPT 2026",
    released: "9 juillet 2026 (rollout Sol)",
    context: "~1M+",
    input: 2.5,
    output: 10.0,
    cached: null,
    color: "gpt",
    notePrice: "Ordre de grandeur API / agrégateurs 2026 — vérifie le rate card OpenAI.",
    strengths: [
      "Écosystème le plus complet (ChatGPT, API, Copilot, Codex)",
      "Computer use & agents multi-outils matures",
      "Router Instant / Thinking selon la tâche",
      "Multimodal (texte, image, voix) très intégré",
      "Idéal équipes déjà sur stack OpenAI",
    ],
    weaknesses: [
      "Prix souvent au-dessus de Grok pour un volume agent",
      "Qualité “pic” parfois derrière Fable sur benches codage",
      "Moins “brut terminal” que Grok Build out-of-the-box",
    ],
    bestFor: "Produit ChatGPT, agents pro, computer use, boîtes OpenAI-first",
    scores: {
      coding: 8.5,
      agents: 9.5,
      reasoning: 9,
      speed: 8,
      value: 7,
      context: 9,
      ecosystem: 10,
      safety: 8.5,
    },
  },
  fable: {
    id: "fable",
    name: "Claude Fable 5",
    vendor: "Anthropic",
    tagline: "Classe Mythos grand public — pic de qualité",
    badge: "Mythos public",
    released: "9 juin 2026",
    context: "1M",
    input: 10.0,
    output: 50.0,
    cached: null,
    color: "fable",
    strengths: [
      "Souvent #1 sur benches codage / précision “frontier”",
      "Contexte 1M au tarif standard",
      "Excellent knowledge work, long docs, review pro",
      "Disponible cloud (AWS, GCP, Azure) + Claude Platform",
      "Garde-fous safety (routage sensible → Opus)",
    ],
    weaknesses: [
      "Prix premium ($10 / $50) — 5× l’entrée Grok 4.5",
      "Sortie très chère pour agents bavards",
      "Moins “cheap volume” pour boucles d’itération",
    ],
    bestFor: "Quand la qualité max prime sur le coût (review, hard SE, recherche)",
    scores: {
      coding: 10,
      agents: 8.5,
      reasoning: 9.5,
      speed: 7,
      value: 5,
      context: 9.5,
      ecosystem: 8,
      safety: 10,
    },
  },
};

const SCORE_LABELS = {
  coding: "Codage",
  agents: "Agents / outils",
  reasoning: "Raisonnement",
  speed: "Vitesse",
  value: "Rapport prix",
  context: "Contexte long",
  ecosystem: "Écosystème",
  safety: "Safety / garde-fous",
};

const DIMENSIONS = Object.keys(SCORE_LABELS);

const VERDICTS = [
  {
    title: "Meilleur rapport perf / prix",
    winner: "grok",
    why: "À ~$2/$6, Grok 4.5 reste le challenger coût pour le coding agent à volume.",
  },
  {
    title: "Pic de qualité codage",
    winner: "fable",
    why: "Fable 5 (Mythos public) mène souvent les scorecards SWE / précision publiées.",
  },
  {
    title: "Meilleure plateforme produit",
    winner: "gpt",
    why: "ChatGPT + API + computer use + Copilot : l’intégration métier la plus large.",
  },
  {
    title: "Agents de code / CLI",
    winner: "grok",
    why: "Grok Build, Cursor, tool-calling agentique et efficacité tokens.",
  },
  {
    title: "Docs longs & knowledge work",
    winner: "fable",
    why: "1M de contexte + force pro sur analyse et rédaction technique.",
  },
  {
    title: "Équipe déjà sur OpenAI",
    winner: "gpt",
    why: "Moins de friction stack, outils et process déjà en place.",
  },
];

const NEWS = [
  {
    model: "grok",
    title: "Grok 4.5 débarque (juil. 2026)",
    body: "Flagship xAI/SpaceXAI pour code & agents, contexte 500K, API $2/$6, raison configurable. Branché Grok Build + Cursor.",
  },
  {
    model: "gpt",
    title: "GPT-5.6 Sol dans ChatGPT",
    body: "Rollout du flagship Sol pour coding, recherche, science, cyber, computer use et design — plans payants ChatGPT.",
  },
  {
    model: "fable",
    title: "Claude Fable 5 = Mythos public",
    body: "1re version grand public de la classe Mythos (juin 2026). Tarif premium $10/$50. Mythos 5 reste restreint (ex. cyberdéfense).",
  },
  {
    model: "gpt",
    title: "Lignée GPT-5 → 5.5 → 5.6",
    body: "Depuis GPT-5 (août 2025) : système unifié Instant/Thinking, agents, multimodal. 5.6 Sol pousse le haut de gamme pro.",
  },
];

const SCENARIOS = [
  {
    id: "agent-code",
    label: "Agent de code en boucle",
    desc: "Beaucoup d’appels API, tests, patches",
    pick: "grok",
  },
  {
    id: "hard-review",
    label: "Review / refactor critique",
    desc: "Qualité max, budget secondaire",
    pick: "fable",
  },
  {
    id: "product",
    label: "Produit chat + computer use",
    desc: "App métier, voix, outils bureau",
    pick: "gpt",
  },
  {
    id: "mixed",
    label: "Stack mixte intelligente",
    desc: "Volume sur Grok, hard tasks sur Fable, UX sur GPT",
    pick: "mixed",
  },
];
