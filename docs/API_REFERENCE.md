# API Reference - Uprising OS Fullstack

Ce document détaille les endpoints disponibles sur le serveur backend (`http://localhost:3001`).

## 📡 Endpoints de Base

### `GET /api/health`
Vérifie l'état du serveur et de la base de données.
- **Réponse** : `{ "status": "ok", "uptime": number, "db": "connected" }`

## 📘 Blueprints

### `GET /api/blueprints`
Récupère la liste de tous les blueprints stockés.
- **Réponse** : Tableau d'objets `DocSection`.

### `POST /api/blueprints`
Ajoute un blueprint manuellement.
- **Corps** : `{ id: string, title: string, icon: string, content: object }`

### `POST /api/blueprints/bulk`
Ajoute plusieurs blueprints d'un coup (ignorer les doublons).
- **Corps** : Tableau d'objets `DocSection`.

### `DELETE /api/blueprints/:id`
Supprime un blueprint et ses métadonnées associées.
- **Paramètre** : `id` du blueprint.

## 🤖 Intelligence Artificielle

### `POST /api/replicate`
Génère un nouveau blueprint à partir d'une URL.
- **Corps** : `{ url: string }`
- **Logic** : Utilise Gemini (si `GEMINI_API_KEY` est présente) ou Ollama `llama3` en fallback local.
- **Réponse** : L'objet blueprint généré.

## 👥 Gestion d'Équipe

### `GET /api/tool-states`
Récupère l'état d'assignation et d'avancement de tous les outils.
- **Réponse** : Objet `{ [docId]: { status: string, assignee: string } }`

### `POST /api/tool-states`
Met à jour l'état d'un outil.
- **Corps** : `{ id: string, status: string, assignee: string }`
