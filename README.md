# Uprising OS - Agency Architecture Intelligence

**Uprising OS** est l'infrastructure centrale de l'agence pour le reverse-engineering et la planification accélérée d'applications. Conçu pour le **Vibe Coding**, cet outil transforme des concepts ou des produits existants en architectures techniques prêtes à l'emploi.

> [!NOTE]
> **Prompt Initial du Projet :**
> "Crée une application React pour l'agence Uprising nommée 'Uprising OS'. Cette application doit servir de hub central pour le 'Vibe Coding'. Elle doit permettre de saisir l'URL d'une application existante, en effectuer une capture visuelle automatisée (via Browserless), générer un blueprint technique complet (via Gemini AI) et proposer des alternatives open-source pertinentes. L'interface doit être premium, dynamique, et entièrement en français."

## 🎯 Raison d'être

L'objectif de **Uprising OS** est de réduire drastiquement le temps de conception technique. Au lieu de partir de zéro, les membres de l'agence utilisent l'IA pour extraire la substantifique moelle de n'importe quel SaaS et obtenir un plan de bataille complet : stack, flux de données, modèles et prompts de génération.

## 🚀 Comment ça fonctionne

### 1. Analyse Visuelle Haute Fidélité

L'application ne se contente pas de lire le texte d'une URL. Elle utilise une intégration **Browserless.io (Puppeteer)** pour effectuer un rendu complet de la page cible. Cela permet de capturer l'interface, les fonctionnalités et la structure réelle même sur des sites complexes (Single Page Apps, Dashboards).

### 2. Génération de Blueprints IA
Une fois la donnée capturée, le moteur IA (Gemini ou Fallback Ollama) génère un **Blueprint** structuré :

- **Stack Technique** : Frontend, Backend, Database et Hosting optimisés.
- **Logique Métier** : Schémas de processus et modèles de données.
- **Guide Pas à Pas** : Phases de développement avec exemples de code.
- **Vibe Prompts** : Une liste de prompts prête à être copiée dans Cursor ou Windsurf pour coder l'application.

### 3. Recherche d'Alternatives Open Source
Pour chaque blueprint, l'outil peut fouiller GitHub pour trouver des clones ou des alternatives open-source existantes. Cela permet à l'équipe de ne pas "réinventer la roue" en s'appuyant sur des bases de code solides déjà éprouvées.

### 4. Pilotage du Vibe Flow

- **Gestion des États** : Suivez l'avancement de chaque blueprint (Backlog, In Progress, Done).
- **Assignation Équipe** : Collaborez autour des projets (Kael, Xavier).
- **Exportation Professionnelle** : Générez des documents Markdown ou des PRD (Product Requirement Documents) en un clic pour vos clients ou vos développeurs.

## 🌊 Le Vibe Coding Flow

Le workflow standard recommandé par l'agence :

1. **Intelligence** : Identifiez une application cible et générez son blueprint.
2. **Review** : Analysez les alternatives open-source pour accélérer le démarrage.
3. **Prompting** : Utilisez les `Vibe Prompts` générés pour piloter votre assistant de code.
4. **Deploy** : Livrez des applications de qualité studio en une fraction du temps traditionnel.

## 🛠 Aperçu Technique

- **Frontend** : Interface premium sous React 19 et Tailwind CSS 4.
- **Backend Orchestrator** : Node.js gérant la file d'attente d'analyse et la base SQLite.
- **Moteur d'Analyse** : Puppeteer (via Browserless) + Gemini 1.5 Flash.
- **Base de Données** : Persistance locale via SQLite pour une portabilité maximale au sein de l'agence.

---
*Propriété exclusive de **Uprising Agency** - Dédié à la performance et à l'innovation logicielle.*
