# test-prod.ps1 - Uprising OS Production Test Script
# Ce script vérifie l'environnement, lance Ollama si besoin, et démarre l'application en mode production.

Write-Host "--- Uprising OS: Production Readiness Check ---" -ForegroundColor Indigo

# 1. Vérification de Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js n'est pas installé. Veuillez l'installer avant de continuer."
    exit
}
Write-Host "[OK] Node.js est présent."

# 2. Vérification des fichiers d'environnement
if (!(Test-Path ".env") -and !(Test-Path ".env.local")) {
    Write-Warning "Aucun fichier .env ou .env.local trouvé. Création d'un .env par défaut..."
    "PORT=3001" | Out-File -FilePath ".env"
}
Write-Host "[OK] Fichier d'environnement détecté."

# 3. Vérification des dépendances
if (!(Test-Path "node_modules")) {
    Write-Host "Installation des dépendances npm..."
    npm install
}

# 4. Gestion d'Ollama
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Write-Host "Vérification d'Ollama..."
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -ErrorAction Stop
        Write-Host "[OK] Ollama est déjà en cours d'exécution."
    } catch {
        Write-Host "Ollama n'est pas lancé. Tentative de démarrage..." -ForegroundColor Yellow
        Start-Process "ollama" -ArgumentList "serve" -WindowStyle Hidden
        Start-Sleep -Seconds 5
        Write-Host "[OK] Ollama a été démarré en arrière-plan."
    }
} else {
    Write-Warning "Ollama n'est pas installé. Le fallback local ne fonctionnera pas (Gemini requis)."
}

# 5. Build et Lancement
Write-Host "Lancement du build de production et démarrage..." -ForegroundColor Green
npm run build:test
