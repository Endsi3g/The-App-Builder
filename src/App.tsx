import React, { useState } from 'react';
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
  Wand2
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

export default function App() {
  const [docs, setDocs] = useState<DocSection[]>(DOC_DATA);
  const [activeSectionId, setActiveSectionId] = useState<string>(DOC_DATA[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Replicator State
  const [replicatorUrl, setReplicatorUrl] = useState('');
  const [isReplicating, setIsReplicating] = useState(false);

  const activeSection = docs.find(s => s.id === activeSectionId) || docs[0];

  const handleReplicate = () => {
    if (!replicatorUrl) return;
    setIsReplicating(true);
    
    // Simulate AI Analysis
    setTimeout(() => {
      const newDoc: DocSection = {
        id: `replicated-${Date.now()}`,
        title: `Clone: ${new URL(replicatorUrl).hostname}`,
        icon: Sparkles,
        content: {
          overview: {
            objective: `Répliquer les fonctionnalités clés de ${replicatorUrl} pour un usage interne.`,
            useCase: "Création d'une alternative propriétaire sans frais récurrents.",
            customVsFreemium: "Possession totale des données et personnalisation illimitée.",
            replaces: `Abonnement ${replicatorUrl}`
          },
          techStack: {
            recommended: ["React", "Supabase", "Tailwind"],
            dependencies: ["Analyse en cours..."],
            architectureDiagram: "Reverse Engineering..."
          },
          logic: {
            processSchema: "Analyse UX -> Modélisation DB -> Dev Frontend",
            dataFlow: "TBD",
            integrations: ["TBD"]
          },
          guide: {
            steps: [
              {
                title: "Analyse des Fonctionnalités",
                description: "L'IA a identifié les modules principaux à cloner.",
                code: "// Génération du plan de développement..."
              }
            ],
            validationChecklist: ["MVP fonctionnel"]
          },
          deployment: {
            vercelConfig: "Standard",
            envVars: [],
            rollback: "Git"
          },
          maintenance: {
            tasks: [],
            metrics: [],
            scalability: "TBD"
          }
        }
      };
      
      setDocs([...docs, newDoc]);
      setActiveSectionId(newDoc.id);
      setReplicatorUrl('');
      setIsReplicating(false);
    }, 2000);
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
        md:translate-x-0 md:static md:h-screen md:sticky md:top-0
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
            return (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSectionId(section.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="truncate">{section.title}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto text-indigo-400" />}
              </button>
            );
          })}
        </nav>

        {/* App Replicator UI */}
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            App Replicator
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
          <header className="space-y-4 border-b border-slate-200 pb-8">
            <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 mb-2">
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
                    <div>
                      <div className="text-slate-500 mb-2 uppercase text-xs tracking-wider">Stack Recommandée</div>
                      <ul className="space-y-2">
                        {activeSection.content.techStack.recommended.map((tech, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-slate-500 mb-2 uppercase text-xs tracking-wider">Flux de Données</div>
                      <div className="p-3 bg-slate-800 rounded border border-slate-700 text-xs leading-relaxed">
                        {activeSection.content.techStack.architectureDiagram}
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
                  {activeSection.content.guide.steps.map((step, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="font-bold text-slate-900 text-lg">{step.title}</h3>
                          <p className="text-slate-600 leading-relaxed">{step.description}</p>
                          {step.code && (
                            <div className="mt-4 relative group/code">
                              <div className="absolute right-2 top-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                <CopyButton code={step.code} />
                              </div>
                              <div className="bg-slate-900 rounded-lg border border-slate-800 p-4 overflow-x-auto">
                                <pre className="text-sm font-mono text-emerald-400">
                                  <code>{step.code}</code>
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {index < activeSection.content.guide.steps.length - 1 && (
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
                      <div className="mt-0.5 w-4 h-4 rounded border border-emerald-400 flex-shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 7. Vibe Coding Prompts */}
              {activeSection.content.vibePrompts && (
                <section className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-6 border border-indigo-500/30 text-white shadow-xl overflow-hidden relative">
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
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold mt-0.5">
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
    </div>
  );
}
