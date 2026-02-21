import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import db from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import fetch from 'node-fetch';

dotenv.config();
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Simple Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    db: db ? 'connected' : 'error'
  });
});

// Init Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'dummy-key' });

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

app.delete('/api/blueprints/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM blueprints WHERE id = ?');
    const result = stmt.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Blueprint not found' });
    }
    
    // Also cleanup tool state
    db.prepare('DELETE FROM tool_states WHERE id = ?').run(id);
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete blueprint' });
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

// Generate Blueprint with Gemini or Ollama Fallback
app.post('/api/replicate', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const useGemini = !!process.env.GEMINI_API_KEY;
  
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
    "objective": "Un objectif clair pour l'agence.",
    "useCase": "Cas d'usage interne.",
    "customVsFreemium": "Pourquoi le refaire en interne ?",
    "replaces": "${capitalizedAppName}",
    "coreFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    "complexity": "Moyenne"
  },
  "techStack": {
    "frontend": "React, Tailwind",
    "backend": "SQLite, Express",
    "database": "SQLite",
    "auth": "JWT simple",
    "hosting": "Vercel",
    "dependencies": ["lucide-react"],
    "architectureDiagram": "Client -> Server -> DB"
  },
  "logic": {
    "processSchema": "Workflow utilisateur",
    "dataFlow": "Flux de données",
    "dataModels": "Entités DB",
    "businessLogic": "Règles métier",
    "integrations": []
  },
  "guide": {
    "phases": [
      {
        "title": "Phase 1: Setup",
        "description": "Initialisation",
        "steps": ["Step 1"],
        "code": "// console.log('hello')"
      }
    ],
    "validationChecklist": ["Vérification 1"]
  },
  "deployment": {
    "vercelConfig": "Standard",
    "envVars": ["PORT"],
    "cicd": "Git",
    "dns": "uprising.agency",
    "monitoring": "Simple",
    "backup": "Script",
    "rollback": "Git"
  },
  "maintenance": {
    "tasks": ["Maj dependencies"],
    "metrics": ["Uptime"],
    "updates": "Hebdo",
    "support": "Interne",
    "costs": "0",
    "scalability": "Vertical"
  },
  "estimation": {
    "time": "10h",
    "skillLevel": "Intermédiaire",
    "infraCosts": "0",
    "roi": "Gain de temps"
  },
  "vibePrompts": {
    "title": "Vibe Coding",
    "prompts": ["Prompt 1"]
  }
}
`;

    let text;
    if (useGemini) {
      console.log("Using Gemini for generation...");
      const result = await ai.getGenerativeModel({ model: 'gemini-1.5-flash' }).generateContent(prompt);
      text = result.response.text();
    } else {
      console.log("Gemini API key missing. Falling back to Ollama (llama3)...");
      try {
        const ollamaRes = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          body: JSON.stringify({
            model: 'llama3',
            prompt: prompt + "\n\nRenvoie UNIQUEMENT le JSON.",
            stream: false
          })
        });
        const ollamaData = await ollamaRes.json();
        text = ollamaData.response;
      } catch (ollamaErr) {
        throw new Error('Ni Gemini ni Ollama ne sont disponibles. Assurez-vous d\'avoir une clé API ou Ollama lancé avec llama3.');
      }
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(text);
    } catch (e) {
      // Cleanup backticks
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedContent = JSON.parse(clean);
    }

    const newDoc = {
      id: `replicated-${Date.now()}`,
      title: `Clone: ${capitalizedAppName}`,
      icon: 'Sparkles',
      content: parsedContent
    };

    // Save generated blueprint
    const stmt = db.prepare('INSERT INTO blueprints (id, title, icon, content) VALUES (?, ?, ?, ?)');
    stmt.run(newDoc.id, newDoc.title, newDoc.icon, JSON.stringify(newDoc.content));

    res.json(newDoc);
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: error.message || 'Erreur lors de la génération.' });
  }
});

// Serve static files in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log("Serving static files from dist...");
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
