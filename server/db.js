import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data.db');
const db = new Database(dbPath);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS blueprints (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    icon TEXT,
    content TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tool_states (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    assignee TEXT
  );
`);

export default db;
