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

## Structure

```
├── index.html          # guide shell
├── tokens.html         # prix API / tokens
├── usage.html          # suivi usage Grok (% restant)
├── Token               # source des tarifs (17/07/2026)
├── css/style.css
├── css/tokens.css
├── css/usage.css
├── js/data.js          # commandes Linux ↔ Windows
├── js/app.js
├── js/tokens-data.js   # prix modèles
├── js/tokens-app.js    # tableau + estimateur
├── js/usage-data.js    # presets de quotas
└── js/usage-app.js     # compteurs + localStorage
```

## Les 2 terminaux

| Terminal              | Comment l’ouvrir                          |
|-----------------------|-------------------------------------------|
| Linux (Bash)          | Terminal sous Linux / macOS               |
| CMD Windows           | Win + R → `cmd` ou recherche « Invite de commandes » |

Bon apprentissage.
