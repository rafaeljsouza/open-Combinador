// src/pages/ConnectionsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { getCurrentUser } from '../lib/backend/authService';
import { getProfileById } from '../lib/backend/profileService';
import { getChallengeById } from '../lib/backend/challengeService';
import { listMatchesForParticipant } from '../lib/backend/collaborationService';

export default function ConnectionsDashboard() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser?.uid) {
          setLoading(false);
          return;
        }

        const profileData = await getProfileById(currentUser.uid);
        if (!profileData) {
          setLoading(false);
          return;
        }
        setUserProfile(profileData);

        const matchesList = await listMatchesForParticipant(currentUser.uid);
        const matchesData = [];

        for (const matchInfo of matchesList) {
          const challengeData = await getChallengeById(matchInfo.challengeId);
          matchesData.push({
            id: matchInfo.id,
            ...matchInfo,
            challengeTitle: challengeData?.title || 'Desafio Removido',
            participantsCount: (matchInfo.participantIds || []).length,
          });
        }

        matchesData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setMatches(matchesData);

      } catch (error) {
        console.error("Erro ao carregar painel:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) return <div className="p-10 text-center">Carregando painel de conexoes...</div>;
  if (!userProfile) return <div className="p-10 text-center">Perfil não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Painel de Conexões</h1>
        <p className="text-slate-600">
          Gerencie suas propostas de pesquisa e soluções em andamento.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-lg font-medium text-slate-600">Nenhuma conexão iniciada ainda.</p>
          <Link to="/desafios" className="text-combinador-primary font-bold hover:underline mt-2 inline-block">
            Explorar desafios disponiveis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => (
            <div key={match.id} className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-combinador-primary bg-combinador-base px-2 py-1 rounded mb-2 inline-block">
                  Status: {match.status.replace('_', ' ')}
                </span>
                <h3 className="text-xl font-bold text-slate-800">{match.challengeTitle}</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Clock size={14} /> 
                  Iniciado em: {match.createdAt ? new Date(match.createdAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-slate-500 mt-1">Participantes: {match.participantsCount}</p>
              </div>
              
              <Link 
                to={`/conexao/${match.id}`}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors shrink-0"
              >
                Acessar Historico <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
