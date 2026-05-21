import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, GraduationCap, ArrowRight, Search } from 'lucide-react';
import { listResearchers } from '../lib/backend/profileService';

const ResearchersList = () => {
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Filtro simples por nome ou instituição
  const filtered = researchers.filter(r => 
    r.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.institution?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-20 text-center text-slate-500">Carregando pesquisadores...</div>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Pesquisadores</h2>
          <p className="text-slate-500">Cientistas prontos para colaborar com a gestão pública.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou universidade..."
            className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl w-full md:w-80 focus:ring-2 focus:ring-combinador-primary outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            
            <p className="text-sm text-slate-600 line-clamp-2 mb-6 h-10">
              {res.bio || "Pesquisador focado em inovação e desenvolvimento científico."}
            </p>

            <Link 
              to={`/perfil/${res.uid}`} 
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-900 hover:text-white transition-all"
            >
              Ver Perfil Completo <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResearchersList;
