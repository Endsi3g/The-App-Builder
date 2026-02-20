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
  Terminal
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
  };
  techStack: {
    recommended: string[];
    dependencies: string[];
    architectureDiagram?: string;
  };
  logic: {
    processSchema: string;
    dataFlow: string;
    integrations: string[];
  };
  guide: {
    steps: {
      title: string;
      description: string;
      code?: string;
      imagePlaceholder?: string;
    }[];
    validationChecklist: string[];
  };
  deployment: {
    vercelConfig: string;
    envVars: string[];
    rollback: string;
  };
  maintenance: {
    tasks: string[];
    metrics: string[];
    scalability: string;
  };
  vibePrompts: {
    title: string;
    prompts: string[];
  };
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
        replaces: "Trello (Gratuit), Asana (Gratuit), Notion (Usage complexe)"
      },
      techStack: {
        recommended: ["React", "Supabase (Database)", "Tailwind CSS", "dnd-kit (Drag & Drop)"],
        dependencies: ["@supabase/supabase-js", "@dnd-kit/core"],
        architectureDiagram: "Client (React) <-> Supabase Edge Functions <-> PostgreSQL"
      },
      logic: {
        processSchema: "Lead signé -> Création Projet (Auto) -> Tâches générées par template -> Assignation",
        dataFlow: "Les statuts des tâches mettent à jour la progression du projet global visible par le client (si portail activé).",
        integrations: ["HubSpot (Nouveau deal = Nouveau projet)", "Discord (Notif fin de tâche)"]
      },
      guide: {
        steps: [
          {
            title: "Configuration de la Base de Données Supabase",
            description: "Créer les tables 'projects' et 'tasks' avec les relations appropriées.",
            code: `create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  status text default 'pending',
  client_id uuid references clients(id)
);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id),
  title text not null,
  status text default 'todo'
);`
          },
          {
            title: "Interface Kanban avec React",
            description: "Mise en place d'un board simple avec dnd-kit pour déplacer les tâches.",
            code: `// Exemple simplifié de composant Kanban
import { DndContext } from '@dnd-kit/core';

export function KanbanBoard({ tasks }) {
  return (
    <DndContext onDragEnd={handleDragEnd}>
      {/* Colonnes et Cartes */}
    </DndContext>
  );
}`
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
        rollback: "Vercel Instant Rollback si l'interface casse."
      },
      maintenance: {
        tasks: ["Archivage des vieux projets (tous les 6 mois)", "Review des indexes SQL"],
        metrics: ["Temps moyen de complétion d'une tâche"],
        scalability: "Ajout de vues 'Calendrier' et 'Timeline' quand l'équipe grandira."
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
        objective: "Gérer les relations clients et les pipelines de vente sans la complexité d'un gros CRM.",
        useCase: "Suivi des leads entrants (site web) et gestion des abonnements récurrents (150$/mois).",
        customVsFreemium: "HubSpot gratuit est limité en automatisation. Un mini-CRM custom permet d'automatiser 100% du flux : Lead -> Contrat -> Facturation -> Onboarding.",
        replaces: "HubSpot (CRM Gratuit), Pipedrive, Feuilles Excel"
      },
      techStack: {
        recommended: ["React", "Supabase Auth & DB", "Resend (Emails)", "Stripe API"],
        dependencies: ["stripe", "resend"],
        architectureDiagram: "Formulaire Web -> Supabase -> Webhook -> Email Auto"
      },
      logic: {
        processSchema: "Nouveau Lead -> Email de bienvenue -> Création fiche client -> Proposition envoyée",
        dataFlow: "Données synchronisées entre le dashboard agence et les métadonnées Stripe.",
        integrations: ["Gmail (via API ou lien mailto)", "Stripe (Abonnements)"]
      },
      guide: {
        steps: [
          {
            title: "Modélisation des Données Clients",
            description: "Table 'clients' enrichie avec statuts et infos contact.",
            code: `create table clients (
  id uuid primary key default uuid_generate_v4(),
  company_name text,
  contact_email text,
  status text check (status in ('lead', 'active', 'churned')),
  monthly_revenue numeric
);`
          },
          {
            title: "Vue Liste & Filtres",
            description: "Créer une table React performante pour lister les clients avec recherche.",
          }
        ],
        validationChecklist: [
          "Ajout d'un client manuel",
          "Modification du statut client",
          "Affichage correct du revenu mensuel total"
        ]
      },
      deployment: {
        vercelConfig: "Standard.",
        envVars: ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "STRIPE_SECRET_KEY (Backend only)"],
        rollback: "Backup des données clients avant migration majeure."
      },
      maintenance: {
        tasks: ["Nettoyage des leads froids", "Vérification des webhooks Stripe"],
        metrics: ["MRR (Monthly Recurring Revenue)", "Taux de conversion"],
        scalability: "Ajout d'un portail client pour qu'ils voient leurs factures."
      },
      vibePrompts: {
        title: "Vibe Coding: Mini CRM",
        prompts: [
          "Génère une interface de CRM moderne. À gauche une sidebar de navigation, au centre une table de clients avec colonnes: Nom, Email, Statut (badge coloré), Revenu Mensuel.",
          "Connecte cette table à Supabase. Ajoute une fonction de recherche en temps réel et des filtres par statut (Lead, Actif, Churned).",
          "Crée un formulaire 'Ajouter Client' dans une modale. Quand on soumet, ça doit aussi envoyer un email de bienvenue via l'API Resend (simulé pour l'instant).",
          "Ajoute une vue 'Analytics' simple en haut de la page qui montre le MRR total (somme des revenus des clients actifs) et le nombre de nouveaux leads ce mois-ci."
        ]
      }
    }
  },
  {
    id: 'agency-cli',
    title: 'Agency CLI',
    icon: Terminal,
    content: {
      overview: {
        objective: "Accélérer le démarrage des nouveaux projets clients en automatisant la configuration initiale.",
        useCase: "Lancer un nouveau projet React/Supabase avec toutes les configs de l'agence (ESLint, Tailwind, Auth) en une commande.",
        customVsFreemium: "Les 'Create React App' génériques demandent 2h de config manuelle après installation. Notre CLI fait tout en 30 secondes.",
        replaces: "Setup manuel, Copier-coller d'anciens projets, Checklists de démarrage"
      },
      techStack: {
        recommended: ["Node.js", "Commander.js", "Inquirer (Prompts)", "Chalk (Couleurs)", "Degit (Clonage)"],
        dependencies: ["commander", "inquirer", "chalk", "degit"],
        architectureDiagram: "Terminal -> CLI -> Clone Template GitHub -> Install Deps -> Init .env"
      },
      logic: {
        processSchema: "uprising create <nom> -> Choix du Type (Site/App) -> Clone Repo -> Setup Env",
        dataFlow: "Inputs utilisateur -> Configuration locale de fichiers.",
        integrations: ["GitHub API (Templates)", "Vercel CLI (Auto-deploy optionnel)"]
      },
      guide: {
        steps: [
          {
            title: "Initialisation du Projet CLI",
            description: "Créer un nouveau projet Node.js pour l'outil en ligne de commande.",
            code: `mkdir uprising-cli && cd uprising-cli
npm init -y
npm install commander inquirer chalk degit
# Ajouter "bin": { "uprising": "./index.js" } dans package.json`
          },
          {
            title: "Création de la commande 'create'",
            description: "Logique pour cloner le template de l'agence.",
            code: `#!/usr/bin/env node
import { program } from 'commander';
import inquirer from 'inquirer';
import degit from 'degit';

program
  .command('create <project-name>')
  .description('Créer un nouveau projet client')
  .action(async (name) => {
    const { type } = await inquirer.prompt([{
      type: 'list',
      name: 'type',
      message: 'Quel type de projet ?',
      choices: ['Site Vitrine (Framer)', 'App Custom (React)']
    }]);
    
    console.log(\`Création de \${name} (\${type})...\`);
    // Logique de clonage ici
  });

program.parse(process.argv);`
          },
          {
            title: "Lien Global (Symlink)",
            description: "Rendre la commande disponible partout sur la machine.",
            code: `npm link
# Maintenant vous pouvez taper 'uprising create mon-client' n'importe où`
          }
        ],
        validationChecklist: [
          "La commande 'uprising' est reconnue dans le terminal",
          "Le template est correctement cloné dans le dossier cible",
          "Les fichiers .git du template sont supprimés pour repartir à neuf"
        ]
      },
      deployment: {
        vercelConfig: "N/A (Outil local). Peut être publié sur npm privé si besoin.",
        envVars: ["GITHUB_TOKEN (si templates privés)"],
        rollback: "Revenir à la version précédente via npm install."
      },
      maintenance: {
        tasks: ["Mettre à jour les templates clonés par le CLI", "Ajouter de nouvelles options (ex: Next.js)"],
        metrics: ["Temps gagné par projet (estimé à 2h/projet)"],
        scalability: "Ajouter une commande 'uprising deploy' qui configure Vercel et Supabase automatiquement."
      },
      vibePrompts: {
        title: "Vibe Coding: CLI Tool",
        prompts: [
          "Crée un script Node.js exécutable avec 'commander'. Il doit avoir une commande 'create <name>'.",
          "Ajoute un prompt interactif avec 'inquirer' qui demande à l'utilisateur de choisir entre 'React App' et 'Next.js App'.",
          "Utilise 'degit' pour cloner un repo GitHub spécifique (ex: 'user/react-template') dans le dossier <name> en fonction du choix précédent.",
          "Ajoute des logs colorés avec 'chalk' pour indiquer les étapes : 'Cloning...', 'Installing dependencies...', 'Done!'."
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
        replaces: "Emails interminables, WeTransfer, Commentaires PDF, Loom (partiellement)"
      },
      techStack: {
        recommended: ["Framer (Embeds)", "React", "Supabase Storage (Images)"],
        dependencies: ["react-medium-image-zoom"],
        architectureDiagram: "Upload Image/Lien -> Génération Lien de Review -> Commentaire Client"
      },
      logic: {
        processSchema: "Upload Maquette -> Lien envoyé au client -> Client commente -> Notif Discord",
        dataFlow: "Les commentaires sont stockés dans Supabase liés à l'ID du projet.",
        integrations: ["Framer (iFrame)", "Discord (Notifs)"]
      },
      guide: {
        steps: [
          {
            title: "Système d'Upload et Galerie",
            description: "Utiliser Supabase Storage pour héberger les assets à valider.",
            code: `const uploadFile = async (file) => {
  const { data, error } = await supabase.storage
    .from('design-assets')
    .upload(\`public/\${file.name}\`, file);
};`
          },
          {
            title: "Interface de Feedback",
            description: "Une vue simple où le client peut voir l'image et ajouter un commentaire texte.",
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
        rollback: "Aucun risque majeur."
      },
      maintenance: {
        tasks: ["Suppression des vieux assets validés pour économiser le stockage"],
        metrics: ["Temps de validation client"],
        scalability: "Annotations visuelles directes sur l'image (canvas)."
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
        replaces: "Config manuelle Webpack/Vite, FTP, Gestion manuelle des DNS"
      },
      techStack: {
        recommended: ["Vite", "TypeScript", "Tailwind", "ESLint", "Prettier"],
        dependencies: ["standard-version (pour le versioning)"],
        architectureDiagram: "Git Push -> Vercel Build -> Preview URL -> Prod"
      },
      logic: {
        processSchema: "Setup Repo (Template) -> Dev -> PR -> Merge -> Deploy",
        dataFlow: "Code source -> Git -> Vercel",
        integrations: ["GitHub", "Vercel"]
      },
      guide: {
        steps: [
          {
            title: "Création du Template Agence",
            description: "Un repo GitHub 'template' avec React, Tailwind, et les configs Supabase pré-faites.",
            code: `// Structure recommandée
/src
  /components (UI Kit)
  /hooks (Auth, Data)
  /lib (Supabase client)
  /types`
          },
          {
            title: "Pipeline CI/CD Vercel",
            description: "Configurer les déploiements automatiques sur la branche main.",
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
        rollback: "Git revert."
      },
      maintenance: {
        tasks: ["Mise à jour des dépendances du template (mensuel)"],
        metrics: ["Temps de setup d'un nouveau projet"],
        scalability: "Création d'un CLI interne pour scafolder les projets."
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
        replaces: "Zapier (Payant), Make (Payant), Copier-coller manuel de données"
      },
      techStack: {
        recommended: ["Supabase Edge Functions", "Webhooks", "Fetch API"],
        dependencies: ["Deno (pour Edge Functions)"],
        architectureDiagram: "Event (Webhook) -> Edge Function -> Action (API Call)"
      },
      logic: {
        processSchema: "Trigger (ex: Formulaire) -> Validation -> Transformation -> Load (Destination)",
        dataFlow: "JSON payloads entre services.",
        integrations: ["Discord Webhooks", "Slack", "Email"]
      },
      guide: {
        steps: [
          {
            title: "Création d'une Edge Function Supabase",
            description: "Une fonction qui écoute les webhooks (ex: nouveau lead) et notifie Discord.",
            code: `// supabase/functions/notify-discord/index.ts
serve(async (req) => {
  const { record } = await req.json();
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({ content: \`Nouveau lead: \${record.email}\` })
  });
  return new Response('OK');
});`
          },
          {
            title: "Configuration des Triggers Database",
            description: "Déclencher la fonction à chaque INSERT dans la table 'leads'.",
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
        envVars: ["DISCORD_WEBHOOK_URL"],
        rollback: "Redéploiement de la fonction précédente via CLI."
      },
      maintenance: {
        tasks: ["Vérification des logs d'erreur", "Mise à jour des URLs de webhook si changement"],
        metrics: ["Taux d'échec des automatisations"],
        scalability: "Passer à n8n si les workflows deviennent trop complexes pour du code pur."
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
  }
];
