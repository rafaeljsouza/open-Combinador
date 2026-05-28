import React from 'react';
import { Github, BarChart3, BookOpen, ExternalLink, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const SolutionCard = ({ solution }) => {
  const hasFindable = Boolean(solution.challengeId && (solution.title || solution.challengeTitle));
  const hasAccessible = Boolean(solution.summary || solution.problem);
  const hasInteroperable = Boolean(solution.apiDocsUrl);
  const hasReusable = Boolean(solution.licenseCode && solution.licenseData);

  const fairChecks = [
    { key: 'F', label: 'Findable', ok: hasFindable },
    { key: 'A', label: 'Accessible', ok: hasAccessible },
    { key: 'I', label: 'Interoperable', ok: hasInteroperable },
    { key: 'R', label: 'Reusable', ok: hasReusable },
  ];

  const fairScore = fairChecks.filter((item) => item.ok).length;
  const fairLevel = fairScore === 4 ? 'alto' : fairScore >= 2 ? 'parcial' : 'baixo';
  const fairLevelClass =
    fairLevel === 'alto'
      ? 'bg-emerald-100 text-emerald-700'
      : fairLevel === 'parcial'
      ? 'bg-amber-100 text-amber-700'
      : 'bg-rose-100 text-rose-700';

  const missingHints = [];
  if (!hasInteroperable) missingHints.push('adicionar URL da Open API');
  if (!solution.licenseCode) missingHints.push('definir licença de código');
  if (!solution.licenseData) missingHints.push('definir licença de dados');

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-combinador-secondary transition-all shadow-sm flex flex-col h-full">
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
            Open Source
          </span>
          {solution.apiDocsUrl && (
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              API Aberta
            </span>
          )}
          {solution.licenseCode && (
            <span className="bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Licenca: {solution.licenseCode}
            </span>
          )}
        </div>
        
        {/* Adicionamos fallbacks (||) para garantir compatibilidade com os nomes dos campos antigos e novos */}
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {solution.title || solution.challengeTitle}
        </h3>
        <p className="text-slate-600 text-sm mb-4">
          {solution.problem || solution.summary}
        </p>

        <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-2">Metadados FAIR</p>
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${fairLevelClass}`}>
              FAIR {fairLevel}
            </span>
            <span className="text-[11px] text-slate-500">{fairScore}/4 criterios</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {fairChecks.map((item) => (
              <span
                key={item.key}
                className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${item.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
              >
                {item.key} {item.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-600">API aberta: {solution.apiDocsUrl ? 'sim' : 'não informada'}</p>
          <p className="text-xs text-slate-600">Licença de código: {solution.licenseCode || 'não informada'}</p>
          <p className="text-xs text-slate-600">Licença de dados: {solution.licenseData || 'não informada'}</p>
          <p className="text-xs text-slate-600">Publicado em: {solution.publishedAt ? new Date(solution.publishedAt).toLocaleDateString() : 'não informado'}</p>
          {missingHints.length > 0 && (
            <p className="text-xs text-amber-700 mt-2">Para melhorar: {missingHints.join('; ')}.</p>
          )}
        </div>

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
          {solution.apiDocsUrl && (
            <a
              href={solution.apiDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ExternalLink size={16} /> Open API
            </a>
          )}
          
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
