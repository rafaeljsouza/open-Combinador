import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChallengeCard = ({ challenge }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="bg-combinador-base text-combinador-primary text-xs font-semibold px-2.5 py-0.5 rounded-full border border-combinador-secondary/30">
          Novo Desafio
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-800 mb-2">{challenge.title}</h3>
      
      <div className="flex items-center text-slate-500 text-sm mb-4">
        <Building2 size={16} className="mr-2" />
        {challenge.area || 'Area nao informada'}
      </div>

      <p className="text-slate-600 text-sm mb-4 line-clamp-2">
        {challenge.description}
      </p>

      {Array.isArray(challenge.tags) && challenge.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {challenge.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <Link to={`/desafio/${challenge.id}`} className="button-class-here">
        Ver Detalhes e Solucionar
      </Link>
    </div>
  );
};

export default ChallengeCard;
