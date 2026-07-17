# Shell Guide — Linux → Windows CMD

**Design by Grok · xAI**

Page interactive pour apprendre l’**invite de commandes Windows (CMD)** en partant des commandes du **terminal Linux (Bash)**.

## Contenu

- Tableau de correspondance **Linux / Bash → CMD Windows** (2 colonnes)
- ~80 commandes en 8 catégories
- Recherche + filtres
- Clic pour copier la commande Windows
- Mémo des commandes indispensables
- Astuces pour basculer de Linux vers CMD

## Lancer

Ouvre `index.html` dans ton navigateur :

```bash
xdg-open index.html
```

Aucun serveur ni dépendance (HTML / CSS / JS pur).

## Pages

| Page | Fichier | Contenu |
|------|---------|---------|
| Shell Linux → Windows | `index.html` | Commandes Bash ↔ CMD |
| Prix & tokens API | `tokens.html` | Tarifs Grok / OpenAI / Claude / Vibe + estimateur |
| Usage Grok | `usage.html` | Quotas, consommé, % restant (local) |
| Grok CLI | `grok-cli.html` | Vitrine / mérites du CLI Grok Build |
| Comparer IA | `compare.html` | Grok 4.5 vs GPT-5.6 vs Claude Fable 5 |
| Rate limits | `rates.html` | Claude vs Codex vs Grok — qui relance le plus vite |

## Layout partagé (sidebar + footer)

Toutes les pages utilisent la **même barre latérale gauche** via `js/layout.js` :
catégories en grand, sous-menus indentés à droite.

Pour une **nouvelle page** :

```html
<body>
  <div class="bg-grid" aria-hidden="true"></div>
  <div id="site-header"></div>

  <main>…</main>

  <div id="site-footer"></div>
  <script src="js/layout.js"></script>
  <!-- scripts de la page -->
</body>
```

Pour **ajouter un lien** : édite le tableau `NAV` dans `js/layout.js`
(catégorie + `items`), et ajoute le fichier dans `FILE_TO_ID`.

## Structure

```
├── index.html          # guide shell
├── tokens.html         # prix API / tokens
├── usage.html          # suivi usage Grok (% restant)
├── grok-cli.html       # vitrine Grok CLI
├── compare.html        # Grok 4.5 vs GPT vs Claude Fable
├── rates.html          # rate limits Claude / Codex / Grok
├── Token               # source des tarifs (17/07/2026)
├── css/style.css       # styles globaux + header/footer
├── css/tokens.css
├── css/usage.css
├── css/grok-cli.css
├── css/compare.css
├── css/rates.css
├── js/layout.js        # header + footer partagés
├── js/data.js
├── js/app.js
├── js/tokens-data.js
├── js/tokens-app.js
├── js/usage-data.js
├── js/usage-app.js
├── js/compare-data.js
├── js/compare-app.js
├── js/rates-data.js
└── js/rates-app.js
```

## Les 2 terminaux

| Terminal              | Comment l’ouvrir                          |
|-----------------------|-------------------------------------------|
| Linux (Bash)          | Terminal sous Linux / macOS               |
| CMD Windows           | Win + R → `cmd` ou recherche « Invite de commandes » |

Bon apprentissage.
