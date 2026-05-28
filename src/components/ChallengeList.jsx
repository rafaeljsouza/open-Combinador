import React, { useEffect, useMemo, useState } from 'react';
import ChallengeCard from './ChallengeCard';
import { Link, useSearchParams } from 'react-router-dom';
import { PlusCircle, Search } from 'lucide-react';
import { listChallenges } from '../lib/backend/challengeService';
import { filterChallenges } from '../lib/filtering';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
  const [areaFilter, setAreaFilter] = useState(() => searchParams.get('area') || 'all');
  const [statusFilter, setStatusFilter] = useState(() => searchParams.get('status') || 'all');
  const [selectedTags, setSelectedTags] = useState(() => {
    const raw = searchParams.get('tags');
    return raw ? raw.split(',').filter(Boolean) : [];
  });

  useEffect(() => {
    async function loadChallenges() {
      try {
        const data = await listChallenges();
        setChallenges(data);
      } catch (error) {
        console.error('Erro ao carregar desafios:', error);
      } finally {
        setLoading(false);
      }
    }

    loadChallenges();
  }, []);

  const availableAreas = useMemo(() => {
    const values = Array.from(new Set(challenges.map((item) => item.area).filter(Boolean)));
    return values.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [challenges]);

  const availableStatuses = useMemo(() => {
    const values = Array.from(new Set(challenges.map((item) => item.status).filter(Boolean)));
    return values.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [challenges]);

  const availableTags = useMemo(() => {
    const tags = new Set();
    for (const challenge of challenges) {
      for (const tag of challenge.tags || []) tags.add(tag);
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [challenges]);

  const filteredChallenges = useMemo(() => {
    return filterChallenges(challenges, {
      term: searchTerm,
      area: areaFilter,
      status: statusFilter,
      tags: selectedTags,
    });
  }, [challenges, searchTerm, areaFilter, statusFilter, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAreaFilter('all');
    setStatusFilter('all');
    setSelectedTags([]);
  };

  useEffect(() => {
    const next = {};
    if (searchTerm.trim()) next.q = searchTerm.trim();
    if (areaFilter !== 'all') next.area = areaFilter;
    if (statusFilter !== 'all') next.status = statusFilter;
    if (selectedTags.length > 0) next.tags = selectedTags.join(',');
    setSearchParams(next, { replace: true });
  }, [searchTerm, areaFilter, statusFilter, selectedTags, setSearchParams]);

  const prettyStatus = (value) => {
    if (!value) return 'Sem status';
    return value.replaceAll('_', ' ').replace(/^\w/, (c) => c.toUpperCase());
  };

  const challengeCountLabel = `${filteredChallenges.length} ${filteredChallenges.length === 1 ? 'desafio encontrado' : 'desafios encontrados'}`;

  if (loading) return <p className="text-center text-slate-400">Carregando desafios...</p>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Desafios</h2>
          <p className="text-slate-500">Problemas que precisam de uma solução científica.</p>
        </div>
        
        {/* Botão para postar novo desafio */}
        <Link to="/novo-desafio" className="flex items-center gap-2 bg-combinador-primary text-white px-4 py-2 rounded-xl font-bold hover:brightness-110 transition-all">
          <PlusCircle size={18} /> Novo Desafio
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_180px_auto] gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Buscar por título, área, descrição ou tag..."
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-full focus:ring-2 focus:ring-combinador-primary outline-none transition-all"
            />
          </div>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-combinador-primary outline-none"
          >
            <option value="all">Todas as áreas</option>
            {availableAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-combinador-primary outline-none"
          >
            <option value="all">Todos os status</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>{prettyStatus(status)}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            Limpar filtros
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tags</span>
          {availableTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${active ? 'bg-combinador-primary text-white border-combinador-primary' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500">{challengeCountLabel}</p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Nenhum desafio publicado ainda.</p>
          <Link to="/novo-desafio" className="text-combinador-primary font-bold hover:underline mt-2 inline-block">
            Seja o primeiro a postar um problema real.
          </Link>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">Nenhum desafio encontrado com esses filtros.</p>
          <button type="button" onClick={clearFilters} className="text-combinador-primary font-bold hover:underline mt-2 inline-block">
            Limpar filtros e tentar novamente
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(item => <ChallengeCard key={item.id} challenge={item} />)}
        </div>
      )}
    </div>
  );
};

export default ChallengeList;
