import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { User, GraduationCap, ArrowRight, Search } from 'lucide-react';
import { listResearchers } from '../lib/backend/profileService';
import { filterResearchers } from '../lib/filtering';

const ResearchersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || '');
  const [institutionFilter, setInstitutionFilter] = useState(() => searchParams.get('institution') || 'all');
  const [selectedTags, setSelectedTags] = useState(() => {
    const raw = searchParams.get('tags');
    return raw ? raw.split(',').filter(Boolean) : [];
  });

  useEffect(() => {
    const fetchResearchers = async () => {
      try {
        const list = await listResearchers();
        setResearchers(list);
      } catch (error) {
        console.error("Erro ao buscar pesquisadores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResearchers();
  }, []);

  const availableInstitutions = useMemo(() => {
    const names = Array.from(new Set(researchers.map((r) => r.institution).filter(Boolean)));
    return names.sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [researchers]);

  const availableTags = useMemo(() => {
    const tags = new Set();
    for (const researcher of researchers) {
      for (const tag of researcher.interestTags || []) tags.add(tag);
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [researchers]);

  const filtered = useMemo(() => {
    return filterResearchers(researchers, {
      term: searchTerm,
      institution: institutionFilter,
      tags: selectedTags,
    });
  }, [researchers, searchTerm, institutionFilter, selectedTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setInstitutionFilter('all');
    setSelectedTags([]);
  };

  useEffect(() => {
    const next = {};
    if (searchTerm.trim()) next.q = searchTerm.trim();
    if (institutionFilter !== 'all') next.institution = institutionFilter;
    if (selectedTags.length > 0) next.tags = selectedTags.join(',');
    setSearchParams(next, { replace: true });
  }, [searchTerm, institutionFilter, selectedTags, setSearchParams]);

  const researcherCountLabel = `${filtered.length} ${filtered.length === 1 ? 'pesquisador encontrado' : 'pesquisadores encontrados'}`;

  if (loading) return <div className="p-20 text-center text-slate-500">Carregando pesquisadores...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Pesquisadores</h2>
          <p className="text-slate-500">Cientistas prontos para colaborar com a gestão pública.</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_240px_auto] gap-3 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                placeholder="Buscar por nome, instituição, linha ou bio..."
                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-full focus:ring-2 focus:ring-combinador-primary outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-combinador-primary outline-none"
            >
              <option value="all">Todas as instituições</option>
              {availableInstitutions.map((name) => (
                <option key={name} value={name}>{name}</option>
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
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Tags de interesse</span>
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

          <p className="text-xs text-slate-500">{researcherCountLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((res) => (
          <div key={res.id} className="bg-white border border-slate-200 p-6 rounded-2xl hover:shadow-lg hover:border-combinador-secondary transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-combinador-base p-3 rounded-xl text-combinador-primary group-hover:bg-combinador-primary group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">{res.name}</h3>
                <p className="text-xs text-combinador-primary font-semibold flex items-center gap-1">
                  <GraduationCap size={12} /> {res.institution}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 h-10">
              {res.bio || "Pesquisador focado em inovação e desenvolvimento científico."}
            </p>

            {(res.interestTags || []).length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {(res.interestTags || []).slice(0, 4).map((tag) => (
                  <span key={tag} className="text-[11px] px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">#{tag}</span>
                ))}
              </div>
            )}

            <Link 
              to={`/perfil/${res.uid}`} 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-900 hover:text-white transition-all"
            >
              Ver Perfil Completo <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-8 text-center bg-white border border-dashed border-slate-300 rounded-2xl py-10 px-4">
          <p className="text-slate-600 font-medium">Nenhum pesquisador encontrado com esses filtros.</p>
          <button type="button" onClick={clearFilters} className="mt-3 text-combinador-primary font-bold hover:underline">
            Limpar filtros e tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default ResearchersList;
