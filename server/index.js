import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();
dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

// Init Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Routes for Blueprints
app.get('/api/blueprints', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM blueprints').all();
    const blueprints = rows.map(r => ({
      ...r,
      content: JSON.parse(r.content)
    }));
    res.json(blueprints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch blueprints' });
  }
});

app.post('/api/blueprints', (req, res) => {
  try {
    const { id, title, icon, content } = req.body;
    const stmt = db.prepare('INSERT INTO blueprints (id, title, icon, content) VALUES (?, ?, ?, ?)');
    stmt.run(id, title, icon, JSON.stringify(content));
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save blueprint' });
  }
});

app.post('/api/blueprints/bulk', (req, res) => {
  try {
    const blueprints = req.body;
    const stmt = db.prepare('INSERT OR IGNORE INTO blueprints (id, title, icon, content) VALUES (?, ?, ?, ?)');
    const insertMany = db.transaction((bps) => {
      for (const bp of bps) {
        stmt.run(bp.id, bp.title, bp.icon ? bp.icon.name || bp.icon : 'AppWindow', JSON.stringify(bp.content));
      }
    });
    insertMany(blueprints);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to bulk save blueprints' });
  }
});

// Routes for Tool States
app.get('/api/tool-states', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM tool_states').all();
    const states = {};
    rows.forEach(r => {
      states[r.id] = { status: r.status, assignee: r.assignee };
    });
    res.json(states);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tool states' });
  }
});

app.post('/api/tool-states', (req, res) => {
  try {
    const { id, status, assignee } = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO tool_states (id, status, assignee) VALUES (?, ?, ?)');
    stmt.run(id, status, assignee);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save tool state' });
  }
});

// Generate Blueprint with Gemini
app.post('/api/replicate', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'La clé API Gemini (GEMINI_API_KEY) n\'est pas configurée.' });
  }

  try {
    let hostname = 'unknown-app';
    try {
      hostname = new URL(url).hostname;
    } catch (e) {
      hostname = url.replace(/https?:\/\//, '').split('/')[0];
    }
    const appName = hostname.split('.')[0] === 'www' ? hostname.split('.')[1] : hostname.split('.')[0];
    const capitalizedAppName = appName.charAt(0).toUpperCase() + appName.slice(1);

    const prompt = `Tu es un expert en conception de produits logiciels (Vibe Coding) pour une agence. 
Ton objectif est de générer un Blueprint (JSON complet et strictement formaté) pour recréer une application interne à l'agence qui clone et simplifie l'application trouvable à ce lien/nom : ${url} (Application ciblée : ${capitalizedAppName}).

Ce blueprint doit s'intégrer directement dans notre application React. Rédige tout en français.
Le format final de la réponse doit être UNIQUEMENT un objet JSON valide, sans balises markdowns ni texte avant ou après.

Voici la structure JSON attendue :
{
  "overview": {
    "objective": "Un objectif clair pour l'agence (Remplacer SaaS tierce).",
    "useCase": "Cas d'usage interne.",
    "customVsFreemium": "Pourquoi le refaire en interne ?",
    "replaces": "Nom exact de l'app visée",
    "coreFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    "complexity": "Faible" / "Moyenne" / "Élevée"
  },
  "techStack": {
    "frontend": "React, Tailwind CSS, Lucide Icons",
    "backend": "Supabase (PostgreSQL, Auth)",
    "database": "PostgreSQL",
    "auth": "Supabase Auth",
    "hosting": "Vercel",
    "dependencies": ["@supabase/supabase-js", "react-router-dom"],
    "architectureDiagram": "Client (React) <-> API <-> DB"
  },
  "logic": {
    "processSchema": "Étapes clés du flux utilisateur",
    "dataFlow": "Flux de données",
    "dataModels": "Liste des entités principales",
    "businessLogic": "Règles métier",
    "integrations": ["API externes possibles"]
  },
  "guide": {
    "phases": [
      {
        "title": "Phase 1: Nom de phase",
        "description": "Description",
        "steps": ["Étape 1", "Étape 2", "Étape 3"],
        "code": "// snippet optionnel de code"
      }
    ],
    "validationChecklist": ["Check 1", "Check 2", "Check 3"]
  },
  "deployment": {
    "vercelConfig": "Standard React App",
    "envVars": ["VAR_1", "VAR_2"],
    "cicd": "GitHub Actions",
    "dns": "${appName}.uprising.agency",
    "monitoring": "Vercel Analytics",
    "backup": "Supabase PITR",
    "rollback": "Git Revert"
  },
  "maintenance": {
    "tasks": ["Tâche de maintenance 1", "Tâche 2"],
    "metrics": ["Métrique 1", "Métrique 2"],
    "updates": "Mensuelles",
    "support": "Interne",
    "costs": "Minimes",
    "scalability": "Horizontal"
  },
  "estimation": {
    "time": "XX heures",
    "skillLevel": "Intermédiaire",
    "infraCosts": "0$",
    "roi": "Description du ROI"
  },
  "vibePrompts": {
    "title": "Vibe Coding: ${capitalizedAppName} Clone",
    "prompts": [
      "Prompt IA 1 pour initier la structure",
      "Prompt IA 2 pour la BD",
      "Prompt IA 3 pour le composant central",
      "Prompt IA 4"
    ]
  }
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text();
    let parsedContent;
    try {
      parsedContent = JSON.parse(text);
    } catch (e) {
      // Nettoyer si jamais il y a des backticks
      const clean = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      parsedContent = JSON.parse(clean);
    }

    const newDoc = {
      id: \`replicated-\${Date.now()}\`,
      title: \`Clone: \${capitalizedAppName}\`,
      icon: 'Sparkles',
      content: parsedContent
    };

    // Save generated blueprint
    const stmt = db.prepare('INSERT INTO blueprints (id, title, icon, content) VALUES (?, ?, ?, ?)');
    stmt.run(newDoc.id, newDoc.title, newDoc.icon, JSON.stringify(newDoc.content));

    res.json(newDoc);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: 'Erreur lors de la génération avec Gemini. Vérifiez que la GEMINI_API_KEY est valide.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});
