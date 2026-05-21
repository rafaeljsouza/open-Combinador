import React from 'react';
import { Github, BarChart3, BookOpen, ExternalLink, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const SolutionCard = ({ solution }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-combinador-secondary transition-all shadow-sm flex flex-col h-full">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Open Source
          </span>
        </div>
        
        {/* Adicionamos fallbacks (||) para garantir compatibilidade com os nomes dos campos antigos e novos */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {solution.title || solution.challengeTitle}
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          {solution.problem || solution.summary}
        </p>

        <div className="space-y-3 mb-6 flex-grow">
          {(solution.metrics) && (
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-combinador-base p-1 rounded text-combinador-primary shrink-0">
                <BarChart3 size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase">Impacto e Métricas</p>
                <p className="text-sm text-slate-600">{solution.metrics}</p>
              </div>
            </div>
          )}

          {(solution.manualSummary) && (
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-slate-50 p-1 rounded text-slate-600 shrink-0">
                <BookOpen size={14} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase">Implementação</p>
                <p className="text-sm text-slate-600">{solution.manualSummary}</p>
              </div>
            </div>
          )}
        </div>

        {/* Links Externos */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-slate-100 mt-auto">
          <a 
            href={solution.githubUrl || solution.repoUrl || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Github size={16} /> Repositório
          </a>
          
          {solution.challengeId && (
            <Link 
              to={`/desafio/${solution.challengeId}`}
              className="flex-1 flex items-center justify-center gap-2 bg-combinador-base text-combinador-primary border border-combinador-secondary/40 text-sm font-medium py-2 rounded-lg hover:brightness-95 transition-colors"
            >
              <History size={16} /> Histórico
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolutionCard;
