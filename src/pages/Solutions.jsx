import React, { useState, useEffect } from 'react';
import SolutionCard from '../components/SolutionCard';
import { listSolutions } from '../lib/backend/collaborationService';

export default function Solutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="p-10 text-center">A carregar catálogo de soluções...</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-900 mb-4">Catálogo Open Source</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Soluções desenvolvidas através da colaboração entre gestores públicos e investigadores académicos.
        </p>
      </div>

      {solutions.length === 0 ? (
        <div className="text-center p-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">Ainda não existem soluções publicadas. Seja o primeiro a resolver um desafio!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map(sol => (
            <SolutionCard key={sol.id} solution={sol} />
          ))}
        </div>
      )}
    </div>
  );
}
