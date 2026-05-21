//import { useState } from 'react';
import { PlusCircle, ClipboardList  } from 'lucide-react'; // Faltava essa importação!
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="text-center py-20 animate-in fade-in duration-700">
      <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">
        Ciência e Gestão Pública juntas.
      </h1>
      <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
        O Combinador conecta os problemas reais das prefeituras às soluções científicas desenvolvidas nas universidades.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link to="/desafios" className="bg-combinador-primary text-white px-8 py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-slate-300/50 flex items-center justify-center gap-2">
          <ClipboardList size={20}/> Ver Desafios
        </Link>
        <Link to="/novo-desafio" className="bg-combinador-secondary border border-combinador-secondary text-white px-8 py-4 rounded-2xl font-bold hover:brightness-95 transition-all flex items-center justify-center gap-2">
          <PlusCircle size={20}/> Postar Problema
        </Link>
      </div>
    </div>
  );
}
export default Home;
