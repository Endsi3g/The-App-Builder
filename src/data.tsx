import { 
  LayoutDashboard, 
  KanbanSquare, 
  Users, 
  Palette, 
  Code2, 
  Workflow, 
  BookOpen,
  Menu,
  X,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Terminal,
  Rocket
} from 'lucide-react';

export type DocSection = {
  id: string;
  title: string;
  icon: any;
  content: DocContent;
};

export type DocContent = {
  overview: {
    objective: string;
    useCase: string;
    customVsFreemium: string;
    replaces: string;
    coreFeatures: string[];
    complexity: 'Faible' | 'Moyenne' | 'Élevée';
  };
  techStack: {
    frontend: string;
    backend: string;
    database: string;
    auth: string;
    hosting: string;
    dependencies: string[];
    architectureDiagram?: string;
  };
  logic: {
    processSchema: string;
    dataFlow: string;
    dataModels: string;
    businessLogic: string;
    integrations: string[];
  };
  guide: {
    phases: {
      title: string;
      description: string;
      steps: string[];
      code?: string;
    }[];
    validationChecklist: string[];
  };
  deployment: {
    vercelConfig: string;
    envVars: string[];
    cicd: string;
    dns: string;
    monitoring: string;
    backup: string;
    rollback: string;
  };
  maintenance: {
    tasks: string[];
    metrics: string[];
    updates: string;
    support: string;
    costs: string;
    scalability: string;
  };
  estimation: {
    time: string;
    skillLevel: string;
    infraCosts: string;
    roi: string;
  };
  vibePrompts: {
    title: string;
    prompts: string[];
  };
  alternatives?: {
    name: string;
    url: string;
    description: string;
    stars?: string;
  }[];
};

export const DOC_DATA: DocSection[] = [
  {
    id: 'project-management',
    title: 'Gestion Projets',
    icon: KanbanSquare,
    content: {
      overview: {
        objective: "Centraliser la gestion des tâches et des projets clients dans une interface unique adaptée aux sprints de l'agence.",
        useCase: "Suivi des mandats de sites web (Framer) et création de contenu mensuelle.",
        customVsFreemium: "Notion est excellent mais peut devenir chaotique. Un dashboard custom sur Supabase permet d'avoir des vues strictes (Kanban/Liste) connectées directement aux données clients sans distraction.",
        replaces: "Trello (Gratuit), Asana (Gratuit), Notion (Usage complexe)",
        coreFeatures: ["Tableau Kanban", "Liste de tâches", "Gestion des statuts", "Assignation membres", "Vues par Client"],
        complexity: 'Moyenne'
      },
      techStack: {
        frontend: "React, Tailwind CSS, dnd-kit",
        backend: "Supabase (PostgreSQL, Edge Functions)",
        database: "PostgreSQL (Supabase)",
        auth: "Supabase Auth",
        hosting: "Vercel",
        dependencies: ["@supabase/supabase-js", "@dnd-kit/core", "lucide-react", "date-fns"],
        architectureDiagram: "Client (React) <-> Supabase Edge Functions <-> PostgreSQL"
      },
      logic: {
        processSchema: "Lead signé -> Création Projet (Auto) -> Tâches générées par template -> Assignation",
        dataFlow: "Les statuts des tâches mettent à jour la progression du projet global visible par le client (si portail activé).",
        dataModels: "Projects (id, name, client_id, status), Tasks (id, project_id, title, status, assignee)",
        businessLogic: "Si toutes les tâches d'une phase sont 'Done', la phase du projet avance automatiquement.",
        integrations: ["HubSpot (Nouveau deal = Nouveau projet)", "Discord (Notif fin de tâche)"]
      },
      guide: {
        phases: [
          {
            title: "Phase 1: Configuration & DB",
            description: "Mise en place du projet et de la base de données.",
            steps: ["Init Vite project", "Install Supabase client", "Create SQL Tables"],
            code: `create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  status text default 'pending',
  client_id uuid references clients(id)
);`
          },
          {
            title: "Phase 2: Interface Kanban",
            description: "Création du board interactif.",
            steps: ["Setup dnd-kit context", "Create Column component", "Create TaskCard component"],
            code: `// KanbanBoard.tsx
<DndContext onDragEnd={handleDragEnd}>
  <div className="flex gap-4">
    {columns.map(col => <Column key={col.id} tasks={col.tasks} />)}
  </div>
</DndContext>`
          }
        ],
        validationChecklist: [
          "Création d'un projet test",
          "Déplacement d'une tâche d'une colonne à l'autre",
          "Persistance des données dans Supabase"
        ]
      },
      deployment: {
        vercelConfig: "Build standard React/Vite. Aucune config serveur spéciale requise.",
        envVars: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
        cicd: "GitHub Actions ou Vercel Git Integration sur push main",
        dns: "projects.agence.com (CNAME Vercel)",
        monitoring: "Vercel Analytics + Supabase Logs",
        backup: "Supabase Point-in-Time Recovery (PITR)",
        rollback: "Vercel Instant Rollback si l'interface casse."
      },
      maintenance: {
        tasks: ["Archivage des vieux projets (tous les 6 mois)", "Review des indexes SQL"],
        metrics: ["Temps moyen de complétion d'une tâche"],
        updates: "Dépendances npm mensuelles",
        support: "Interne (CTO Agence)",
        costs: "0$ (Free Tier Vercel/Supabase)",
        scalability: "Ajout de vues 'Calendrier' et 'Timeline' quand l'équipe grandira."
      },
      estimation: {
        time: "12 heures",
        skillLevel: "Intermédiaire",
        infraCosts: "< 5$/mois",
        roi: "Élevé (Gain de productivité immédiat)"
      },
      vibePrompts: {
        title: "Vibe Coding: Project Manager",
        prompts: [
          "Crée une application React avec Supabase. Je veux un dashboard de gestion de projet style 'Linear' mais simplifié. Utilise Tailwind pour le style (sombre, accent indigo).",
          "Ajoute une vue Kanban avec dnd-kit. Les colonnes sont: 'À faire', 'En cours', 'Review', 'Terminé'. Connecte-le à une table Supabase 'tasks'.",
          "Crée un formulaire 'Nouveau Projet' qui ajoute une entrée dans la table 'projects' et génère automatiquement 5 tâches par défaut (Design, Dev, Review, etc.).",
          "Ajoute une page de détail pour chaque projet qui liste les tâches associées et affiche une barre de progression basée sur le % de tâches terminées."
        ]
      }
    }
  },
  {
    id: 'crm',
    title: 'CRM & Clients',
    icon: Users,
    content: {
      overview: {
        objective: "Centraliser la gestion des relations clients, des pipelines de vente et des abonnements dans une interface unique et automatisée.",
        useCase: "Suivi des leads entrants depuis le site web, conversion en clients, gestion des contrats et facturation récurrente.",
        customVsFreemium: "HubSpot gratuit est excellent mais limite l'automatisation et l'accès aux données brutes. Une solution custom sur Supabase offre une flexibilité totale (ex: portail client sur mesure) et évite les coûts par utilisateur.",
        replaces: "HubSpot (CRM Gratuit), Pipedrive, Google Sheets, Typeform",
        coreFeatures: ["Gestion Contacts & Entreprises", "Pipeline Visuel (Kanban)", "Suivi Activités (Email/Notes)", "Calcul Automatique MRR", "Intégration Stripe"],
        complexity: 'Moyenne'
      },
      techStack: {
        frontend: "React, Tailwind CSS, TanStack Table, Recharts",
        backend: "Supabase (PostgreSQL, Auth, Edge Functions)",
        database: "PostgreSQL",
        auth: "Supabase Auth (Rôles: Admin, Sales)",
        hosting: "Vercel",
        dependencies: ["@supabase/supabase-js", "@tanstack/react-table", "recharts", "stripe", "resend", "zod", "react-hook-form"],
        architectureDiagram: "Web Form -> Supabase -> Edge Function -> Stripe/Resend -> Dashboard"
      },
      logic: {
        processSchema: "Lead (Form Site) -> Création Contact (Statut: Nouveau) -> Qualification -> Proposition -> Client (Stripe) -> Onboarding",
        dataFlow: "Les formulaires publics alimentent la table 'leads'. Une Edge Function synchronise les clients 'gagnés' vers Stripe pour la facturation.",
        dataModels: "Contacts (id, email, name, company_id, status), Companies (id, name, domain), Deals (id, contact_id, amount, stage, expected_close_date), Activities (id, type, note, contact_id)",
        businessLogic: "Un contact ne peut avoir qu'un seul Deal ouvert à la fois. Le changement de stade d'un Deal met à jour le statut du Contact.",
        integrations: ["Stripe (Paiements)", "Resend (Emails Transactionnels)", "Gmail (Logs via BCC)", "Slack/Discord (Notifs Nouveaux Leads)"]
      },
      guide: {
        phases: [
          {
            title: "Phase 1: Modélisation des Données",
            description: "Création du schéma SQL robuste pour gérer les relations complexes.",
            steps: ["Créer table 'companies'", "Créer table 'contacts' liée à companies", "Créer table 'deals' liée à contacts", "Configurer RLS (Row Level Security)"],
            code: `create table contacts (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  first_name text,
  last_name text,
  company_id uuid references companies(id),
  status text default 'lead',
  created_at timestamptz default now()
);`
          },
          {
            title: "Phase 2: Interface de Gestion (Liste & Détail)",
            description: "Développement des vues principales pour les commerciaux.",
            steps: ["Setup TanStack Table pour la liste des contacts (filtres, tri)", "Créer page détail contact (infos + timeline activités)", "Formulaire d'ajout/édition avec React Hook Form"],
            code: `// ContactTable.tsx
const columns = [
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('status', { header: 'Statut', cell: StatusBadge }),
  columnHelper.accessor('deals.amount', { header: 'Valeur Potentielle' }),
];`
          },
          {
            title: "Phase 3: Pipeline de Vente Visuel",
            description: "Vue Kanban pour gérer l'avancement des deals.",
            steps: ["Implémenter Drag & Drop (dnd-kit) pour les stades de vente", "Connecter le drop à l'update Supabase", "Calculer les totaux par colonne"],
            code: `// DealBoard.tsx
const onDragEnd = async (event) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    await updateDealStage(active.id, over.id); // over.id est l'ID de la colonne (stage)
  }
};`
          },
          {
            title: "Phase 4: Automatisations Backend",
            description: "Logique serveur pour Stripe et Notifications.",
            steps: ["Edge Function pour créer client Stripe au succès du deal", "Webhook Stripe pour mettre à jour le statut abonnement", "Email de bienvenue via Resend"],
            code: `// supabase/functions/handle-won-deal/index.ts
if (record.stage === 'won' && old_record.stage !== 'won') {
  const customer = await stripe.customers.create({ email: record.email });
  await supabase.from('contacts').update({ stripe_id: customer.id }).eq('id', record.contact_id);
}`
          }
        ],
        validationChecklist: [
          "Création d'un contact depuis le formulaire public",
          "Déplacement d'un deal de 'Nouveau' à 'Gagné'",
          "Vérification de la création du client dans le dashboard Stripe Test",
          "Réception de l'email de bienvenue"
        ]
      },
      deployment: {
        vercelConfig: "Build standard. Vérifier les limites de temps d'exécution pour les API routes si utilisées.",
        envVars: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "STRIPE_SECRET_KEY", "RESEND_API_KEY"],
        cicd: "Vercel Git Integration. Tests E2E recommandés (Playwright) pour le flux critique de vente.",
        dns: "crm.agence.com",
        monitoring: "Sentry (Frontend), Supabase Dashboard (Database Health), Stripe Dashboard (Logs Paiements)",
        backup: "Supabase PITR (Point-in-Time Recovery) activé. Export CSV hebdomadaire automatique.",
        rollback: "Instantané via Vercel. Migrations DB inversables via Supabase CLI."
      },
      maintenance: {
        tasks: ["Nettoyage des doublons contacts", "Archivage des deals perdus > 6 mois", "Revue des logs d'erreur Webhooks"],
        metrics: ["Taux de conversion Lead -> Client", "Durée moyenne cycle de vente", "MRR (Monthly Recurring Revenue)"],
        updates: "Mise à jour API Stripe (attention aux breaking changes)",
        support: "Interne. Documentation des processus de vente obligatoire.",
        costs: "Supabase: ~25$/mois (si Pro requis pour PITR/Edge Functions), Resend: Gratuit (<3000 mails), Vercel: Gratuit.",
        scalability: "Séparation de la base de données 'Analytics' si le volume d'activités explose."
      },
      estimation: {
        time: "25 heures",
        skillLevel: "Intermédiaire +",
        infraCosts: "0 - 25$/mois",
        roi: "Très Élevé (Centralisation, Automatisation facturation, Données propriétaires)"
      },
      vibePrompts: {
        title: "Vibe Coding: CRM Complet",
        prompts: [
          "Génère un schéma SQL Supabase pour un CRM. Tables : contacts, companies, deals, activities. Ajoute les clés étrangères et des index sur les emails et statuts.",
          "Crée une interface React avec Sidebar (Dashboard, Contacts, Pipeline, Settings). Utilise Lucide React pour les icônes et Tailwind pour un look 'SaaS B2B' propre.",
          "Implémente une vue 'Liste des Contacts' avec TanStack Table. Colonnes triables : Nom, Entreprise, Dernier Contact, Statut. Ajoute une pagination serveur via Supabase.",
          "Crée un composant 'DealPipeline' type Kanban. Colonnes : Lead, Contacté, Démo, Proposition, Négociation, Gagné, Perdu. Les cartes doivent être draggables.",
          "Écris une fonction Supabase (RPC) pour calculer les statistiques du Dashboard : Nombre de nouveaux leads ce mois, Valeur totale du pipeline, Taux de conversion.",
          "Crée un formulaire d'ajout de contact avec React Hook Form et Zod. Validation : Email requis et format valide, Nom requis. Si l'entreprise n'existe pas, propose de la créer à la volée.",
          "Code une Edge Function Supabase qui écoute les inserts sur la table 'deals'. Si le montant > 1000$, envoie une notification sur un channel Discord via Webhook.",
          "Intègre l'API Resend pour envoyer un email transactionnel simple 'Bienvenue' quand un contact passe au statut 'Client'. Utilise un template HTML basique.",
          "Crée une page 'Fiche Contact' qui affiche les infos à gauche et une timeline des activités (notes, emails, changements de statut) à droite, triée par date décroissante."
        ]
      }
    }
  },
  {
    id: 'agency-cli',
    title: 'Agency CLI (uprising-cli)',
    icon: Terminal,
    content: {
      overview: {
        objective: "Automatiser la création et la maintenance de l'écosystème d'outils de l'agence.",
        useCase: "Générer de nouvelles documentations d'outils, lier des apps existantes, et scafolder des fonctionnalités spécifiques.",
        customVsFreemium: "Une solution sur-mesure pour orchestrer notre propre documentation et nos processus de dev, là où des outils génériques manqueraient de contexte métier.",
        replaces: "Création manuelle de fichiers, Copier-coller de documentation, Gestion éparse des liens d'outils",
        coreFeatures: ["Génération de Docs (Doc Gen)", "Liaison d'Apps (App Link)", "Ajout de Features (Feature Add)", "Scaffolding de Projet"],
        complexity: 'Moyenne'
      },
      techStack: {
        frontend: "CLI (Node.js)",
        backend: "N/A",
        database: "Local JSON / Markdown",
        auth: "N/A",
        hosting: "NPM (Privé) ou Local",
        dependencies: ["commander", "inquirer", "chalk", "fs-extra", "axios (pour API IA optionnelle)"],
        architectureDiagram: "User Command -> CLI Parser -> Template Engine -> File System Generation"
      },
      logic: {
        processSchema: "uprising doc gen <tool> -> Questions Interactives -> Génération Page Doc",
        dataFlow: "Inputs CLI -> Templates Handlebars/JS -> Fichiers .tsx/.md",
        dataModels: "DocTemplate, ToolConfig, FeatureBlueprint",
        businessLogic: "Le CLI force le respect de la structure standardisée (Overview, Tech Stack, Guide...) pour toute nouvelle documentation.",
        integrations: ["OpenAI/Gemini API (pour générer du contenu intelligent)", "Système de fichiers local"]
      },
      guide: {
        phases: [
          {
            title: "Phase 1: Structure du CLI",
            description: "Mise en place de la commande de base 'uprising'.",
            steps: ["Setup projet Node + TypeScript", "Config Commander.js", "Définir commande 'help'"],
            code: `// bin/uprising.ts
import { Command } from 'commander';
const program = new Command();
program
  .name('uprising')
  .description('CLI pour gérer l\\'écosystème Uprising')
  .version('1.0.0');`
          },
          {
            title: "Phase 2: Générateur de Documentation",
            description: "Commande 'doc gen' pour créer une nouvelle page.",
            steps: ["Créer commande 'doc gen [name]'", "Prompt pour les détails (Objectif, Stack...)", "Générer fichier data.tsx partiel"],
            code: `program.command('doc gen <name>')
  .action(async (name) => {
    const answers = await inquirer.prompt([/* questions */]);
    generateDocFile(name, answers);
  });`
          },
          {
            title: "Phase 3: Liaison d'Apps",
            description: "Commande 'link' pour intégrer un outil existant.",
            steps: ["Analyser URL fournie", "Scraper métadonnées (optionnel)", "Créer entrée 'External Tool' dans la doc"],
            code: `program.command('link <url>')
  .description('Lier une app existante à la doc')
  .action((url) => { /* logic */ });`
          }
        ],
        validationChecklist: [
          "La commande 'uprising --help' affiche les options",
          "'uprising doc gen test-tool' crée un fichier valide",
          "Le fichier généré respecte le type TypeScript DocContent"
        ]
      },
      deployment: {
        vercelConfig: "N/A",
        envVars: ["OPENAI_API_KEY (si génération IA)"],
        cicd: "N/A",
        dns: "N/A",
        monitoring: "Logs locaux",
        backup: "Git",
        rollback: "Git revert"
      },
      maintenance: {
        tasks: ["Mise à jour des templates de documentation", "Refactoring si le format de données change"],
        metrics: ["Nombre de docs générées", "Temps gagné vs rédaction manuelle"],
        updates: "Au besoin",
        support: "Dev Interne",
        costs: "0$",
        scalability: "Intégration profonde avec l'API de l'App Builder pour mettre à jour la DB directement."
      },
      estimation: {
        time: "12 heures",
        skillLevel: "Intermédiaire",
        infraCosts: "0$",
        roi: "Élevé (Standardisation et vitesse)"
      },
      vibePrompts: {
        title: "Vibe Coding: Uprising CLI",
        prompts: [
          "Crée un CLI Node.js avec TypeScript et Commander.js nommé 'uprising'. Ajoute une commande par défaut qui affiche un ASCII art du logo.",
          "Implémente une commande 'doc gen <name>' qui utilise 'inquirer' pour poser 5 questions : Titre, Objectif, Stack Frontend, Stack Backend, Complexité.",
          "Crée une fonction qui prend les réponses d'inquirer et génère un objet JSON conforme à l'interface 'DocContent' de notre projet React.",
          "Ajoute une commande 'feature add <featureName>' qui demande à l'utilisateur de décrire la fonctionnalité, puis utilise une API LLM (mockée pour l'instant) pour générer une liste d'étapes d'implémentation.",
          "Crée une commande 'link <url>' qui permet d'ajouter une référence à un outil externe (ex: Trello) dans la documentation, en demandant simplement le nom et la catégorie.",
          "Assure-toi que le CLI utilise 'chalk' pour afficher les succès en vert et les erreurs en rouge."
        ]
      }
    }
  },
  {
    id: 'design',
    title: 'Design & Contenu',
    icon: Palette,
    content: {
      overview: {
        objective: "Fluidifier le processus de validation des designs et contenus.",
        useCase: "Validation des maquettes Framer et des calendriers de contenu social.",
        customVsFreemium: "Les emails de feedback sont dispersés. Un outil centralisé 'Design Review' permet aux clients de commenter directement sur des liens.",
        replaces: "Emails interminables, WeTransfer, Commentaires PDF, Loom (partiellement)",
        coreFeatures: ["Upload Drag&Drop", "Commentaires sur image", "Partage par lien public", "Notifications"],
        complexity: 'Moyenne'
      },
      techStack: {
        frontend: "React, Framer Motion",
        backend: "Supabase Storage & Database",
        database: "PostgreSQL",
        auth: "Supabase Auth (Admin) + Public Access (Clients)",
        hosting: "Vercel",
        dependencies: ["react-medium-image-zoom", "react-dropzone"],
        architectureDiagram: "Upload Image/Lien -> Génération Lien de Review -> Commentaire Client"
      },
      logic: {
        processSchema: "Upload Maquette -> Lien envoyé au client -> Client commente -> Notif Discord",
        dataFlow: "Les commentaires sont stockés dans Supabase liés à l'ID du projet.",
        dataModels: "Assets (id, url, project_id), Comments (id, asset_id, x, y, text, author)",
        businessLogic: "Les clients n'ont pas besoin de compte pour commenter (accès par token URL).",
        integrations: ["Framer (iFrame)", "Discord (Notifs)"]
      },
      guide: {
        phases: [
          {
            title: "Phase 1: Storage",
            description: "Configuration du bucket Supabase.",
            steps: ["Create 'assets' bucket", "Set public policies", "Create upload component"],
            code: `const { data, error } = await supabase.storage
  .from('assets')
  .upload(\`public/\${file.name}\`, file);`
          },
          {
            title: "Phase 2: Interface Commentaire",
            description: "Overlay de commentaires sur l'image.",
            steps: ["Create ImageCanvas component", "Handle click coordinates", "Display comment markers"],
            code: `// OnClick Image
const addMarker = (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // Save x, y to DB
}`
          }
        ],
        validationChecklist: [
          "Upload d'une image PNG/JPG",
          "Accès via lien public",
          "Ajout d'un commentaire test"
        ]
      },
      deployment: {
        vercelConfig: "Attention aux limites de taille de fichier (serverless functions).",
        envVars: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"],
        cicd: "Standard Vercel",
        dns: "review.agence.com",
        monitoring: "Supabase Storage Usage",
        backup: "N/A (Assets peuvent être redownloadés)",
        rollback: "Aucun risque majeur."
      },
      maintenance: {
        tasks: ["Suppression des vieux assets validés pour économiser le stockage"],
        metrics: ["Temps de validation client"],
        updates: "Trimestrielles",
        support: "Interne",
        costs: "Storage Supabase (si > 1GB)",
        scalability: "Annotations visuelles directes sur l'image (canvas)."
      },
      estimation: {
        time: "16 heures",
        skillLevel: "Intermédiaire/Avancé",
        infraCosts: "0-5$ (Storage)",
        roi: "Moyen (Qualité de vie)"
      },
      vibePrompts: {
        title: "Vibe Coding: Design Review Tool",
        prompts: [
          "Crée une interface d'upload d'images (drag & drop) connectée à un bucket Supabase Storage 'designs'.",
          "Crée une page de visualisation d'image. À droite, ajoute une sidebar de commentaires. Les commentaires doivent être stockés dans une table 'comments' liée à l'image.",
          "Permets de cliquer n'importe où sur l'image pour ajouter un marqueur (point rouge) et ouvrir la boîte de commentaire associée à ce point (coordonnées x,y).",
          "Génère un lien de partage unique pour chaque image qui permet aux utilisateurs non connectés (clients) de voir et commenter."
        ]
      }
    }
  },
  {
    id: 'development',
    title: 'Dev & Déploiement',
    icon: Code2,
    content: {
      overview: {
        objective: "Standardiser les environnements de dev et les déploiements.",
        useCase: "Déploiement des sites clients et des outils internes.",
        customVsFreemium: "Vercel est parfait. La doc ici sert à standardiser le 'Starter Kit' de l'agence pour ne pas réinventer la roue à chaque projet.",
        replaces: "Config manuelle Webpack/Vite, FTP, Gestion manuelle des DNS",
        coreFeatures: ["Template GitHub", "Config ESLint/Prettier", "CI/CD Vercel", "Env Vars Standard"],
        complexity: 'Faible'
      },
      techStack: {
        frontend: "Vite, React",
        backend: "N/A",
        database: "N/A",
        auth: "N/A",
        hosting: "Vercel",
        dependencies: ["standard-version", "eslint", "prettier", "husky"],
        architectureDiagram: "Git Push -> Vercel Build -> Preview URL -> Prod"
      },
      logic: {
        processSchema: "Setup Repo (Template) -> Dev -> PR -> Merge -> Deploy",
        dataFlow: "Code source -> Git -> Vercel",
        dataModels: "N/A",
        businessLogic: "Branch protection rules: require review before merge to main.",
        integrations: ["GitHub", "Vercel"]
      },
      guide: {
        phases: [
          {
            title: "Phase 1: Template GitHub",
            description: "Création du repository modèle.",
            steps: ["Init React project", "Add Tailwind", "Add ESLint/Prettier configs", "Push to GitHub as Template"],
            code: `// .eslintrc.json
{
  "extends": ["react-app", "prettier"],
  "plugins": ["prettier"],
  "rules": { "prettier/prettier": "error" }
}`
          },
          {
            title: "Phase 2: Config Vercel",
            description: "Standards de déploiement.",
            steps: ["Connect GitHub Repo", "Set Output Directory (dist)", "Add Environment Variables"],
            code: "N/A (Config UI Vercel)"
          }
        ],
        validationChecklist: [
          "Clone du template",
          "npm install && npm run dev fonctionne",
          "Déploiement test sur Vercel réussi"
        ]
      },
      deployment: {
        vercelConfig: "Framework Preset: Vite.",
        envVars: ["Toutes les clés API nécessaires au projet"],
        cicd: "Vercel for Git",
        dns: "*.agence.com",
        monitoring: "Vercel Analytics",
        backup: "Git History",
        rollback: "Git revert."
      },
      maintenance: {
        tasks: ["Mise à jour des dépendances du template (mensuel)"],
        metrics: ["Temps de setup d'un nouveau projet"],
        updates: "Mensuelles",
        support: "Interne",
        costs: "0$",
        scalability: "Création d'un CLI interne pour scafolder les projets."
      },
      estimation: {
        time: "4 heures",
        skillLevel: "Intermédiaire",
        infraCosts: "0$",
        roi: "Élevé (Standardisation)"
      },
      vibePrompts: {
        title: "Vibe Coding: Dev Environment",
        prompts: [
          "Crée un fichier 'vite.config.ts' optimisé pour React avec des alias de chemin (@/*) et le plugin Tailwind.",
          "Configure ESLint et Prettier pour qu'ils fonctionnent ensemble. Ajoute une règle pour trier automatiquement les imports.",
          "Crée un script GitHub Actions qui lance les tests et le linter à chaque Pull Request.",
          "Écris un fichier README.md template qui explique comment lancer le projet, les variables d'environnement requises et la structure des dossiers."
        ]
      }
    }
  },
  {
    id: 'automation',
    title: 'Automatisation',
    icon: Workflow,
    content: {
      overview: {
        objective: "Connecter tous les outils entre eux pour réduire la saisie manuelle.",
        useCase: "Sync Lead HubSpot -> Supabase, Notifs Discord.",
        customVsFreemium: "Zapier devient cher. n8n (self-hosted ou cloud) ou des Edge Functions Supabase sont beaucoup plus économiques et flexibles.",
        replaces: "Zapier (Payant), Make (Payant), Copier-coller manuel de données",
        coreFeatures: ["Webhooks Listener", "Data Transformation", "API Requests", "Scheduled Tasks (Cron)"],
        complexity: 'Élevée'
      },
      techStack: {
        frontend: "N/A",
        backend: "Supabase Edge Functions (Deno)",
        database: "PostgreSQL (Logs)",
        auth: "Service Role Key",
        hosting: "Supabase",
        dependencies: ["Deno Standard Library"],
        architectureDiagram: "Event (Webhook) -> Edge Function -> Action (API Call)"
      },
      logic: {
        processSchema: "Trigger (ex: Formulaire) -> Validation -> Transformation -> Load (Destination)",
        dataFlow: "JSON payloads entre services.",
        dataModels: "AutomationLogs (id, function_name, status, payload, error)",
        businessLogic: "Retry logic: si une API externe échoue, réessayer 3 fois avec backoff exponentiel.",
        integrations: ["Discord Webhooks", "Slack", "Email", "HubSpot API"]
      },
      guide: {
        phases: [
          {
            title: "Phase 1: Setup Edge Functions",
            description: "Environnement Deno local.",
            steps: ["Install Supabase CLI", "supabase functions new notify-discord", "Serve locally"],
            code: `supabase functions new my-function
supabase start
supabase functions serve my-function --no-verify-jwt`
          },
          {
            title: "Phase 2: Code de la fonction",
            description: "Logique de fetch.",
            steps: ["Parse request body", "Fetch Discord Webhook", "Return response"],
            code: `serve(async (req) => {
  const { record } = await req.json();
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({ content: \`New Lead: \${record.email}\` })
  });
  return new Response('OK');
});`
          }
        ],
        validationChecklist: [
          "Simulation d'un événement",
          "Réception de la notification Discord",
          "Logs d'exécution dans Supabase"
        ]
      },
      deployment: {
        vercelConfig: "N/A (Hébergé sur Supabase)",
        envVars: ["DISCORD_WEBHOOK_URL", "HUBSPOT_API_KEY"],
        cicd: "GitHub Actions deploy to Supabase",
        dns: "N/A",
        monitoring: "Supabase Dashboard (Functions)",
        backup: "Git",
        rollback: "Redéploiement de la fonction précédente via CLI."
      },
      maintenance: {
        tasks: ["Vérification des logs d'erreur", "Mise à jour des URLs de webhook si changement"],
        metrics: ["Taux d'échec des automatisations"],
        updates: "Au besoin",
        support: "Dev interne",
        costs: "0$ (Inclus dans Supabase Free Tier)",
        scalability: "Passer à n8n si les workflows deviennent trop complexes pour du code pur."
      },
      estimation: {
        time: "8 heures",
        skillLevel: "Avancé",
        infraCosts: "0$",
        roi: "Élevé (Automatisation invisible)"
      },
      vibePrompts: {
        title: "Vibe Coding: Automation Scripts",
        prompts: [
          "Écris une Edge Function Supabase (Deno) qui reçoit un webhook de Stripe (paiement réussi) et met à jour le statut d'un client dans la table 'clients'.",
          "Crée un script qui écoute les nouveaux enregistrements dans la table 'leads' et envoie une notification formatée à un channel Discord via webhook.",
          "Écris une fonction qui s'exécute tous les jours à minuit (cron) pour archiver les tâches terminées depuis plus de 30 jours.",
          "Crée un endpoint API simple qui reçoit des données de formulaire, les valide (Zod), et les insère dans Supabase."
        ]
      }
    }
  },
  {
    id: 'meta-uprising',
    title: 'Meta: Uprising OS',
    icon: Rocket,
    content: {
      overview: {
        objective: "Documenter, standardiser et accélérer le développement des outils internes de l'agence Uprising.",
        useCase: "Point d'entrée unique pour Kael & Xavier. Sert de 'Cerveau' technique et de roadmap pour l'indépendance SaaS.",
        customVsFreemium: "Ce n'est pas juste un wiki, c'est un générateur d'applications. Il incarne la philosophie 'Vibe Coding' de l'agence.",
        replaces: "Notion (Wiki), Google Docs (Specs), Jira (Backlog simplifié)",
        coreFeatures: ["Générateur de PRD Markdown", "Suivi d'avancement par outil", "Blueprints techniques standards", "Simulateur de Clone"],
        complexity: 'Faible'
      },
      techStack: {
        frontend: "React 18, Vite, Tailwind CSS",
        backend: "Local Storage (Actuel) -> Supabase (Futur)",
        database: "JSON (Actuel) -> PostgreSQL (Futur)",
        auth: "Aucune (Actuel) -> Supabase Auth (Futur)",
        hosting: "Vercel",
        dependencies: ["lucide-react", "framer-motion", "clsx"],
        architectureDiagram: "App (React) -> LocalStorage -> Clipboard (PRD)"
      },
      logic: {
        processSchema: "Idée -> Blueprint -> PRD (Markdown) -> Copier -> Coller dans Cursor -> App Fonctionnelle",
        dataFlow: "Flux unidirectionnel : La doc nourrit l'IA qui écrit le code.",
        dataModels: "DocSection, ToolState (Status, Assignee)",
        businessLogic: "L'application doit être 'Self-Hosting' : elle contient sa propre documentation et les plans pour s'améliorer.",
        integrations: ["Presse-papier système", "LocalStorage"]
      },
      guide: {
        phases: [
          {
            title: "Phase 1: Persistance Réelle",
            description: "Migrer du LocalStorage vers Supabase pour la collaboration temps réel.",
            steps: ["Init Supabase Project", "Créer table 'tool_states'", "Sync React State <-> DB"],
            code: `// Future implementation
const { data } = await supabase
  .from('tool_states')
  .select('*');`
          },
          {
            title: "Phase 2: Intelligence Artificielle",
            description: "Connecter une vraie API LLM pour générer les docs.",
            steps: ["Setup OpenAI API Key", "Créer Edge Function 'generate-doc'", "Remplacer le mock 'App Replicator'"],
            code: `const completion = await openai.chat.completions.create({
  messages: [{ role: "user", content: "Génère un blueprint pour..." }],
});`
          }
        ],
        validationChecklist: [
          "Les états (En cours/Prod) sont synchronisés entre Kael et Xavier",
          "Le générateur de PRD produit du markdown valide",
          "L'interface est responsive mobile pour consultation rapide"
        ]
      },
      deployment: {
        vercelConfig: "Standard Vite App",
        envVars: ["VITE_SUPABASE_URL (Futur)", "OPENAI_API_KEY (Futur)"],
        cicd: "Auto-deploy sur commit main",
        dns: "os.uprising.agency",
        monitoring: "Vercel Analytics",
        backup: "Git Repo",
        rollback: "Instant Vercel"
      },
      maintenance: {
        tasks: ["Ajouter les nouveaux outils découverts", "Raffiner les prompts Vibe Coding"],
        metrics: ["Nombre d'outils passés en 'Prod'", "Temps de génération d'un nouvel outil"],
        updates: "Hebdomadaire",
        support: "Kael & Xavier",
        costs: "0$ (Hébergé sur Vercel Hobby)",
        scalability: "Transformation en SaaS 'Agency OS' pour d'autres agences ?"
      },
      estimation: {
        time: "Continue",
        skillLevel: "Méta",
        infraCosts: "0$",
        roi: "Infini (C'est le moteur de croissance)"
      },
      vibePrompts: {
        title: "Vibe Coding: Améliorer Uprising OS",
        prompts: [
          "Ajoute une authentification Supabase simple pour que Kael et Xavier aient chacun leurs préférences d'affichage.",
          "Crée un éditeur Markdown intégré pour pouvoir modifier les blueprints directement dans l'app sans toucher au code.",
          "Intègre une vue 'Roadmap Globale' qui agrège tous les statuts des outils dans une timeline visuelle.",
          "Ajoute un bouton 'Deploy to Vercel' qui utilise l'API Vercel pour déployer automatiquement le code généré par l'IA."
        ]
      }
    }
  }
];
