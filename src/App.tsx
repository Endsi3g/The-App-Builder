import React, { useState, useEffect } from 'react';
import { DOC_DATA, DocSection } from './data';
import { 
  Menu, 
  X, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb,
  ArrowRight,
  Terminal,
  Sparkles,
  Plus,
  RefreshCw,
  Wand2,
  UserPlus,
  CircleDashed,
  Loader2,
  CheckCircle,
  Trash2,
  Info,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="px-2 py-1 bg-slate-700 text-slate-300 rounded hover:bg-slate-600 hover:text-white text-xs transition-colors"
    >
      {copied ? 'Copié !' : 'Copier'}
    </button>
  );
}

type ToolStatus = 'backlog' | 'building' | 'live';
type ToolState = {
  status: ToolStatus;
  assignee: string | null;
};

const STATUS_CONFIG = {
  backlog: { label: 'À Faire', icon: CircleDashed, color: 'text-slate-400', bg: 'bg-slate-100' },
  building: { label: 'En Cours', icon: Loader2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  live: { label: 'En Prod', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
};

const TEAM_MEMBERS = ['Non assigné', 'Kael', 'Xavier Tardif'];

export default function App() {
  const [docs, setDocs] = useState<DocSection[]>(DOC_DATA);
  const [activeSectionId, setActiveSectionId] = useState<string>(DOC_DATA[0]?.id || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toolStates, setToolStates] = useState<Record<string, ToolState>>({});
  
  // UI State
  const [notifications, setNotifications] = useState<{id: string, message: string, type: 'success' | 'error'}[]>([]);
  
  const addNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };
  
  // Replicator State
  const [replicatorUrl, setReplicatorUrl] = useState('');
  const [isReplicating, setIsReplicating] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch Blueprints
        let res = await fetch('/api/blueprints');
        let data = await res.json();
        
        if (data.length === 0) {
          // Seed the database with initial DOC_DATA
          await fetch('/api/blueprints/bulk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(DOC_DATA)
          });
          res = await fetch('/api/blueprints');
          data = await res.json();
        }
        
        if (data.length > 0) {
          setDocs(data);
          setActiveSectionId(data[0].id);
        }

        // Fetch Tool States
        const statesRes = await fetch('/api/tool-states');
        const statesData = await statesRes.json();
        setToolStates(statesData);
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };
    initData();
  }, []);

  const updateToolState = async (id: string, updates: Partial<ToolState>) => {
    const newState = { ...(toolStates[id] || { status: 'backlog', assignee: null }), ...updates };
    
    // Optimistic update
    setToolStates(prev => ({ ...prev, [id]: newState }));

    try {
      const res = await fetch('/api/tool-states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...newState })
      });
      if (!res.ok) throw new Error();
    } catch (error) {
      console.error("Failed to update tool state:", error);
      addNotification("Erreur de sauvegarde de l'état", "error");
    }
  };

  const handleDeleteBlueprint = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Voulez-vous vraiment supprimer ce blueprint ?')) return;

    try {
      const res = await fetch(`/api/blueprints/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();

      setDocs(prev => prev.filter(d => d.id !== id));
      if (activeSectionId === id) {
        setActiveSectionId(docs.find(d => d.id !== id)?.id || '');
      }
      addNotification("Blueprint supprimé");
    } catch (error) {
      addNotification("Erreur lors de la suppression", "error");
    }
  };

  const activeSection = docs.find(s => s.id === activeSectionId) || docs[0];
  const currentToolState = toolStates[activeSectionId] || { status: 'backlog', assignee: null };

  const generateMarkdown = (doc: DocSection) => {
    const c = doc.content;
    return `# ${doc.title}

## Vue d'ensemble
**Objectif:** ${c.overview.objective}
**Cas d'usage:** ${c.overview.useCase}
**Remplace:** ${c.overview.replaces}
**Complexité:** ${c.overview.complexity}

## Stack Technique
- **Frontend:** ${c.techStack.frontend}
- **Backend:** ${c.techStack.backend}
- **Database:** ${c.techStack.database}
- **Auth:** ${c.techStack.auth}
- **Hosting:** ${c.techStack.hosting}

## Logique Métier
**Processus:** ${c.logic.processSchema}
**Flux de données:** ${c.logic.dataFlow}
**Modèles:** ${c.logic.dataModels}

## Guide d'Implémentation
${c.guide.phases.map(p => `### ${p.title}
${p.description}
${p.steps.map(s => `- ${s}`).join('\n')}
${p.code ? `\`\`\`typescript
${p.code}
\`\`\`` : ''}`).join('\n\n')}

## Déploiement
**Config Vercel:** ${c.deployment.vercelConfig}
**Env Vars:** ${c.deployment.envVars.join(', ')}

## Maintenance
${c.maintenance.tasks.map(t => `- ${t}`).join('\n')}
`;
  };

  const generatePRD = (doc: DocSection) => {
    return `# PRD: ${doc.title}
> Document de Référence Produit pour l'Agence Uprising

## 1. Contexte & Vision
Nous souhaitons internaliser cet outil pour réduire notre dépendance aux SaaS tiers et adapter les workflows à notre équipe (Kael & Xavier).
**Cible:** Équipe interne (2 personnes).
**Contrainte:** Budget < 50$/mois, Dev < 20h.

## 2. Règles de "Vibe Coding"
Pour le développement assisté par IA (Cursor/Windsurf), suivre ces directives :
1. **Keep it Simple:** Pas de sur-ingénierie. Une seule fonctionnalité à la fois.
2. **Stack Strict:** React + Vite + Tailwind + Supabase. Pas de nouvelles libs sans validation.
3. **UI First:** Toujours valider l'interface avant la logique complexe.
4. **Typescript:** Typage strict obligatoire pour la maintenabilité.
5. **Dry Run:** Demander à l'IA d'expliquer son plan avant de générer le code.

## 3. Spécifications Techniques
${generateMarkdown(doc)}

## 4. Prompts de Démarrage
${doc.content.vibePrompts?.prompts.map(p => `- ${p}`).join('\n')}
`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié dans le presse-papier !');
  };

  const handleReplicate = async () => {
    if (!replicatorUrl) return;
    setIsReplicating(true);
    
    try {
      const res = await fetch('/api/replicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: replicatorUrl })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate blueprint');
      }

      const newDoc = await res.json();
      
      setDocs(prevDocs => [...prevDocs, newDoc]);
      setActiveSectionId(newDoc.id);
      setReplicatorUrl('');
      addNotification("Blueprint généré avec succès !");
    } catch (error: any) {
      console.error("Replication error:", error);
      addNotification(error.message || 'Erreur lors de la génération.', "error");
    } finally {
      setIsReplicating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Terminal className="w-5 h-5 text-indigo-600" />
          <span>Uprising</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out flex flex-col
        md:translate-x-0 md:sticky md:top-0 md:h-screen
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-2 font-bold text-xl text-slate-800">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Terminal className="w-5 h-5" />
          </div>
          Uprising
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-4">Blueprints</div>
          {docs.map((section) => {
            const Icon = section.icon;
            const isActive = activeSectionId === section.id;
            const state = toolStates[section.id] || { status: 'backlog' };
            const StatusIcon = STATUS_CONFIG[state.status].icon;

            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSectionId(section.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors group relative
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="truncate flex-1 text-left">{section.title}</span>
                
                {/* Delete/Status controls */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${state.status === 'live' ? 'bg-emerald-400' : state.status === 'building' ? 'bg-indigo-400' : 'bg-slate-200'}`} />
                  <button 
                    onClick={(e) => handleDeleteBlueprint(section.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </button>
            );
          })}
        </nav>

        {/* App Replicator UI */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Lier une App & Générer Blueprint
          </div>
          <div className="space-y-2">
            <input 
              type="url" 
              placeholder="https://app-to-clone.com"
              value={replicatorUrl}
              onChange={(e) => setReplicatorUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button 
              onClick={handleReplicate}
              disabled={!replicatorUrl || isReplicating}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {isReplicating ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Analysing...
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  Generate Blueprint
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen scroll-smooth bg-white md:bg-slate-50">
        <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-12">
          
          {/* Header Section */}
          <header className="space-y-6 border-b border-slate-200 pb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                  <span className="bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider text-xs">Guide Technique</span>
                  <span className="text-slate-300">•</span>
                  <span>{activeSection.title}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  {activeSection.title}
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  {activeSection.content.overview.objective}
                </p>
              </div>

              {/* Team Assignment Controls */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm min-w-[280px] space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">État du Projet</span>
                  <div className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${STATUS_CONFIG[currentToolState.status].bg} ${STATUS_CONFIG[currentToolState.status].color}`}>
                    {React.createElement(STATUS_CONFIG[currentToolState.status].icon, { className: "w-3 h-3" })}
                    {STATUS_CONFIG[currentToolState.status].label}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Statut</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      {(Object.keys(STATUS_CONFIG) as ToolStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateToolState(activeSectionId, { status })}
                          className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                            currentToolState.status === status 
                              ? 'bg-white text-slate-900 shadow-sm' 
                              : 'text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          {STATUS_CONFIG[status].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Assigné à</label>
                    <div className="relative">
                      <select
                        value={currentToolState.assignee || ''}
                        onChange={(e) => updateToolState(activeSectionId, { assignee: e.target.value })}
                        className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {TEAM_MEMBERS.map(member => (
                          <option key={member} value={member}>{member}</option>
                        ))}
                      </select>
                      <UserPlus className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(generateMarkdown(activeSection))}
                      className="flex-1 py-2 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <BookOpen className="w-3 h-3" />
                      Copier Doc
                    </button>
                    <button 
                      onClick={() => copyToClipboard(generatePRD(activeSection))}
                      className="flex-1 py-2 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Wand2 className="w-3 h-3" />
                      Générer PRD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSectionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-12"
            >
              {/* 1. Overview Grid */}
              <section className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Cas d'usage
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {activeSection.content.overview.useCase}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    Pourquoi Custom ?
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {activeSection.content.overview.customVsFreemium}
                  </p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                  <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <RefreshCw className="w-4 h-4 text-indigo-500" />
                    Remplace
                  </h3>
                  <p className="text-indigo-700 text-sm leading-relaxed font-medium">
                    {activeSection.content.overview.replaces}
                  </p>
                </div>
              </section>

              {/* 1.5 Estimation & Complexity */}
              {activeSection.content.estimation && (
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Temps Est.</div>
                    <div className="font-bold text-slate-900">{activeSection.content.estimation.time}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Niveau</div>
                    <div className="font-bold text-slate-900">{activeSection.content.estimation.skillLevel}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Coût Infra</div>
                    <div className="font-bold text-slate-900">{activeSection.content.estimation.infraCosts}</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">ROI</div>
                    <div className="font-bold text-emerald-600">{activeSection.content.estimation.roi}</div>
                  </div>
                </section>
              )}

              {/* 2. Tech Stack */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    <Terminal className="w-4 h-4" />
                  </div>
                  Architecture Technique
                </h2>
                <div className="bg-slate-900 text-slate-200 rounded-xl p-6 font-mono text-sm shadow-lg overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <div className="text-slate-500 mb-1 uppercase text-xs tracking-wider">Frontend</div>
                        <div className="text-white">{activeSection.content.techStack.frontend}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1 uppercase text-xs tracking-wider">Backend</div>
                        <div className="text-white">{activeSection.content.techStack.backend}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1 uppercase text-xs tracking-wider">Database</div>
                        <div className="text-white">{activeSection.content.techStack.database}</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-slate-500 mb-1 uppercase text-xs tracking-wider">Auth</div>
                        <div className="text-white">{activeSection.content.techStack.auth}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1 uppercase text-xs tracking-wider">Hosting</div>
                        <div className="text-white">{activeSection.content.techStack.hosting}</div>
                      </div>
                      <div>
                        <div className="text-slate-500 mb-1 uppercase text-xs tracking-wider">Flux de Données</div>
                        <div className="p-2 bg-slate-800 rounded border border-slate-700 text-xs leading-relaxed text-slate-300">
                          {activeSection.content.techStack.architectureDiagram}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Logic & Process */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Logique Métier</h2>
                <div className="relative pl-8 border-l-2 border-slate-200 space-y-8">
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-2 border-indigo-600"></div>
                    <h3 className="font-semibold text-slate-900 mb-2">Processus</h3>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {activeSection.content.logic.processSchema}
                    </p>
                  </div>
                  {activeSection.content.logic.dataModels && (
                    <div className="relative">
                      <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-2 border-slate-300"></div>
                      <h3 className="font-semibold text-slate-900 mb-2">Modèles de Données</h3>
                      <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 font-mono text-xs">
                        {activeSection.content.logic.dataModels}
                      </p>
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-2 border-slate-300"></div>
                    <h3 className="font-semibold text-slate-900 mb-2">Intégrations</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeSection.content.logic.integrations.map((integ, i) => (
                        <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-sm text-slate-600">
                          {integ}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Step-by-Step Guide */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Guide de Création</h2>
                <div className="space-y-8">
                  {activeSection.content.guide.phases.map((phase, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="font-bold text-slate-900 text-lg">{phase.title}</h3>
                          <p className="text-slate-600 leading-relaxed">{phase.description}</p>
                          
                          {/* Steps List */}
                          {phase.steps && (
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 ml-1">
                              {phase.steps.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          )}

                          {phase.code && (
                            <div className="mt-4 relative group/code">
                              <div className="absolute right-2 top-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                <CopyButton code={phase.code} />
                              </div>
                              <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-emerald-400">
                                  <code>{phase.code}</code>
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < activeSection.content.guide.phases.length - 1 && (
                        <div className="ml-4 pl-4 border-l border-slate-200 h-8 my-2"></div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Validation Checklist */}
              <section className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Validation Pré-Lancement
                </h3>
                <ul className="space-y-3">
                  {activeSection.content.guide.validationChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-emerald-800 text-sm">
                      <div className="mt-0.5 w-4 h-4 rounded border border-emerald-400 shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 7. Vibe Coding Prompts */}
              {activeSection.content.vibePrompts && (
                <section className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-xl p-6 border border-indigo-500/30 text-white shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32" />
                  </div>
                  <h3 className="font-bold text-xl mb-6 flex items-center gap-2 relative z-10">
                    <Wand2 className="w-5 h-5 text-indigo-400" />
                    {activeSection.content.vibePrompts.title}
                  </h3>
                  <div className="space-y-4 relative z-10">
                    {activeSection.content.vibePrompts.prompts.map((prompt, i) => (
                      <div key={i} className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold mt-0.5">
                            {i + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-300 text-sm leading-relaxed font-mono">
                              {prompt}
                            </p>
                            <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              <CopyButton code={prompt} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 6. Deployment & Maintenance */}
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                <section>
                  <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Déploiement</h3>
                  <div className="space-y-4 text-sm text-slate-600">
                    <div>
                      <span className="font-semibold text-slate-900">Config Vercel:</span>
                      <p className="mt-1">{activeSection.content.deployment.vercelConfig}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Variables d'env:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {activeSection.content.deployment.envVars.map((v, i) => (
                          <code key={i} className="px-2 py-1 bg-slate-100 rounded text-slate-700 text-xs border border-slate-200">{v}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
                <section>
                  <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Maintenance</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {activeSection.content.maintenance.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-slate-400 mt-0.5" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <footer className="pt-12 pb-6 text-center text-slate-400 text-sm">
            <p>© {new Date().getFullYear()} Uprising: The App Builder</p>
          </footer>
        </div>
      </main>

      {/* Notifications Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md ${
                n.type === 'error' 
                  ? 'bg-red-50/90 border-red-100 text-red-800' 
                  : 'bg-white/90 border-white text-slate-800'
              }`}
            >
              {n.type === 'error' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
              <span className="text-sm font-medium">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
