# Uprising OS - Agency App Builder

**Uprising OS** est un outil interne conçu pour l'agence afin de transformer rapidement des idées d'applications ou des SaaS existants en Blueprints techniques actionnables. L'objectif est de permettre un "Vibe Coding" rapide tout en conservant une structure technique solide basée sur React, Node.js et SQLite.

## ✨ Fonctionnalités

- **Dashboard de Blueprints** : Visualisez et gérez tous vos projets d'applications internes.
- **App Replicator (IA)** : Entrez une URL d'un SaaS existant, et l'IA Gemini génère instantanément un Blueprint complet (Stack, Logique, Guide d'implémentation, Prompts IA).
- **Persistance SQLite** : Toutes vos données (blueprints et états de développement) sont sauvegardées localement.
- **Suivi d'État** : Gérez le statut de chaque blueprint (À Faire, En Cours, En Prod) et assignez des membres de l'équipe (Kael, Xavier).
- **Export PRD & Markdown** : Générez des documents de spécifications produits (PRD) prêts à l'emploi.

## 🚀 Installation rapide

1. **Cloner le projet** :
   ```bash
   git clone <repo-url>
   cd The-App-Builder
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configuration de l'environnement** :
   Créez un fichier `.env` à la racine (ou utilisez `.env.local`) :

   ```env
   GEMINI_API_KEY=votre_cle_api_ici
   PORT=3001
   ```

4. **Lancer l'application (Développement)** :

   ```bash
   npm run dev
   ```

   L'application sera accessible sur `http://localhost:3000`.

## 🤖 Fallback IA (Ollama)

Si vous n'avez pas de clé API Gemini ou si vous souhaitez travailler en local :
1. Installez [Ollama](https://ollama.com/).
2. Lancez le modèle llama3 : `ollama run llama3`.
3. Supprimez (ou ne mettez pas) la clé `GEMINI_API_KEY` dans votre `.env`. L'application basculera automatiquement sur Ollama.

## 📦 Test de Production Local

Pour tester l'application telle qu'elle sera en production (build optimisé) :

```bash
npm run build:test
```

Cette commande compile le frontend dans `/dist` et lance le serveur Node qui servira les fichiers statiques sur le port `3001`.

## ☁️ Déploiement Vercel

Le fichier `vercel.json` est inclus. 
**Note importante** : SQLite est éphémère sur Vercel. Pour une persistence réelle en ligne, migrez `server/db.js` vers une base PostgreSQL (Supabase/Neon).

## 🛠 Stack Technique

- **Frontend** : React 19, Vite, Tailwind CSS 4, Framer Motion, Lucide Icons.
- **Backend** : Node.js (Express), SQLite (via `better-sqlite3`).
- **IA** : Google Gemini API (`gemini-1.5-flash`).

## 📁 Structure du Projet

- `/src` : Code source React (Composants, Layout, Styles).
- `/server` : Backend Express et gestion de la base de données.
- `/data.db` : Base de données SQLite locale.

## 📝 Licence

Propriété exclusive de **Uprising Agency**.
