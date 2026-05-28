import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SolutionCard from '../components/SolutionCard';
import { listSolutions } from '../lib/backend/collaborationService';
import { filterSolutions } from '../lib/filtering';

const OPEN_CODE_LICENSES = ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause'];
const OPEN_DATA_LICENSES = ['CC-BY-4.0', 'CC-BY-SA-4.0', 'CC0-1.0'];

function getFairScore(solution) {
  const hasFindable = Boolean(solution.challengeId && (solution.title || solution.challengeTitle));
  const hasAccessible = Boolean(solution.summary || solution.problem);
  const hasInteroperable = Boolean(solution.apiDocsUrl);
  const hasReusable = Boolean(solution.licenseCode && solution.licenseData);
  return [hasFindable, hasAccessible, hasInteroperable, hasReusable].filter(Boolean).length;
}

export default function Solutions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fairFilter, setFairFilter] = useState(() => searchParams.get('fair') || 'all');
  const [onlyOpenApi, setOnlyOpenApi] = useState(() => searchParams.get('openApi') === '1');
  const [onlyOpenLicenses, setOnlyOpenLicenses] = useState(() => searchParams.get('openLicenses') === '1');
  const [sortBy, setSortBy] = useState(() => searchParams.get('sort') || 'recent');

  const activeFilters = [];
  if (fairFilter !== 'all') {
    if (fairFilter === 'high') activeFilters.push({ key: 'fair', label: 'FAIR alto' });
    if (fairFilter === 'partial') activeFilters.push({ key: 'fair', label: 'FAIR parcial' });
    if (fairFilter === 'low') activeFilters.push({ key: 'fair', label: 'FAIR baixo' });
  }
  if (onlyOpenApi) activeFilters.push({ key: 'api', label: 'Open API' });
  if (onlyOpenLicenses) activeFilters.push({ key: 'license', label: 'Licenças abertas' });

  const clearFilters = () => {
    setFairFilter('all');
    setOnlyOpenApi(false);
    setOnlyOpenLicenses(false);
  };

  const removeFilter = (key) => {
    if (key === 'fair') setFairFilter('all');
    if (key === 'api') setOnlyOpenApi(false);
    if (key === 'license') setOnlyOpenLicenses(false);
  };

  useEffect(() => {
    async function fetchSolutions() {
      try {
        const sols = await listSolutions();
        setSolutions(sols);
      } catch (error) {
        console.error("Erro ao procurar soluções:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSolutions();
  }, []);

  useEffect(() => {
    const next = {};
    if (fairFilter !== 'all') next.fair = fairFilter;
    if (onlyOpenApi) next.openApi = '1';
    if (onlyOpenLicenses) next.openLicenses = '1';
    if (sortBy !== 'recent') next.sort = sortBy;
    setSearchParams(next, { replace: true });
  }, [fairFilter, onlyOpenApi, onlyOpenLicenses, sortBy, setSearchParams]);

  const filteredSolutions = filterSolutions(solutions, {
    fairFilter,
    onlyOpenApi,
    onlyOpenLicenses,
    getFairScore,
    openCodeLicenses: OPEN_CODE_LICENSES,
    openDataLicenses: OPEN_DATA_LICENSES,
  });

  const sortedSolutions = [...filteredSolutions].sort((a, b) => {
    if (sortBy === 'fair_desc') return getFairScore(b) - getFairScore(a);
    if (sortBy === 'fair_asc') return getFairScore(a) - getFairScore(b);
    if (sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (loading) return <div className="p-10 text-center">A carregar catálogo de soluções...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Catálogo Open Source</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Soluções desenvolvidas através da colaboração entre gestores públicos e investigadores académicos.
        </p>
      </div>

      <div className="mb-8 bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Filtros FAIR e Interoperabilidade</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            className="p-2 border rounded"
            value={fairFilter}
            onChange={(e) => setFairFilter(e.target.value)}
          >
            <option value="all">FAIR: todos</option>
            <option value="high">FAIR alto (4/4)</option>
            <option value="partial">FAIR parcial (2-3/4)</option>
            <option value="low">FAIR baixo (0-1/4)</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={onlyOpenApi}
              onChange={(e) => setOnlyOpenApi(e.target.checked)}
            />
            Somente com Open API
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={onlyOpenLicenses}
              onChange={(e) => setOnlyOpenLicenses(e.target.checked)}
            />
            Somente com licenças abertas
          </label>

          <select
            className="p-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Ordem: mais recentes</option>
            <option value="oldest">Ordem: mais antigas</option>
            <option value="fair_desc">FAIR: maior primeiro</option>
            <option value="fair_asc">FAIR: menor primeiro</option>
          </select>
        </div>

        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => removeFilter(filter.key)}
                  className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 hover:bg-slate-200"
                >
                  {filter.label} x
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-combinador-primary hover:underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {sortedSolutions.length === 0 ? (
        <div className="text-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">Nenhuma solução encontrada com os filtros atuais.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedSolutions.map(sol => (
            <SolutionCard key={sol.id} solution={sol} />
          ))}
        </div>
      )}
    </div>
  );
}
