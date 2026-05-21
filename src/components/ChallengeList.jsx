import React, { useEffect, useState } from 'react';
import ChallengeCard from './ChallengeCard';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { listChallenges } from '../lib/backend/challengeService';

const ChallengeList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p className="text-center text-slate-400">Carregando desafios...</p>;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Desafios em Aberto</h2>
          <p className="text-slate-500">Problemas que precisam de uma solução científica.</p>
        </div>
        
        {/* Botão para postar novo desafio */}
        <Link to="/novo-desafio" className="flex items-center gap-2 bg-combinador-primary text-white px-4 py-2 rounded-xl font-bold hover:brightness-110 transition-all">
          <PlusCircle size={18} /> Novo Desafio
        </Link>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Nenhum desafio publicado ainda.</p>
          <Link to="/novo-desafio" className="text-combinador-primary font-bold hover:underline mt-2 inline-block">
            Seja o primeiro a postar um problema real.
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map(item => <ChallengeCard key={item.id} challenge={item} />)}
        </div>
      )}
    </div>
  );
};

export default ChallengeList;
