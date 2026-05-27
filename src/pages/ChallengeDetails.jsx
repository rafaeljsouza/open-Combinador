import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCurrentUser } from '../lib/backend/authService';
import { getChallengeById } from '../lib/backend/challengeService';
import {
  cancelJoinRequest,
  createInitialContact,
  createJoinRequest,
  getFirstMatchByChallenge,
  getMyJoinRequest,
  listPublicEventsByChallenge,
} from '../lib/backend/collaborationService';

export default function ChallengeDetails() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeMatch, setActiveMatch] = useState(null);
  const [myJoinRequest, setMyJoinRequest] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);

      const challengeData = await getChallengeById(id);
      setChallenge(challengeData);

      const eventsData = await listPublicEventsByChallenge(id);
      setEvents(eventsData);

      const firstMatch = await getFirstMatchByChallenge(id);
      setActiveMatch(firstMatch);

      if (user?.uid && firstMatch) {
        const request = await getMyJoinRequest(firstMatch.id, user.uid);
        setMyJoinRequest(request);
      } else {
        setMyJoinRequest(null);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do desafio:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleInitialContact = async () => {
    if (!currentUser) {
      alert('Por favor, inicie sessao para propor uma solucao.');
      return;
    }
    if (!message.trim()) {
      alert('A mensagem nao pode estar vazia.');
      return;
    }

    try {
      if (!activeMatch) {
        const managerId = challenge.authorId || null;
        await createInitialContact({
          challengeId: id,
          managerId,
          leadResearcherId: currentUser.uid,
          authorId: currentUser.uid,
          message,
        });

        alert('Contato inicial criado. Agora voce e o gestor ja possuem um ambiente colaborativo.');
      } else {
        const alreadyParticipant = (activeMatch.participantIds || []).includes(currentUser.uid);
        if (alreadyParticipant) {
          alert('Voce ja participa deste esforco. Acesse o ambiente de trabalho.');
          return;
        }

        await createJoinRequest({
          matchId: activeMatch.id,
          challengeId: id,
          requesterId: currentUser.uid,
          message,
        });

        alert('Pedido de entrada enviado. O gestor e o pesquisador lider precisam aprovar.');
      }

      setMessage('');
      await fetchData();
    } catch (error) {
      console.error('Erro ao enviar contacto:', error);
      alert('Ocorreu um erro ao registar o contacto.');
    }
  };

  const handleCancelRequest = async () => {
    if (!myJoinRequest) return;
    try {
      await cancelJoinRequest(myJoinRequest.id);
      alert('Pedido cancelado.');
      await fetchData();
    } catch (error) {
      console.error('Erro ao cancelar pedido:', error);
      alert('Nao foi possivel cancelar o pedido.');
    }
  };

  if (loading) return <div>A carregar informacoes...</div>;
  if (!challenge) return <div>Desafio nao encontrado.</div>;

  const iAmParticipant = currentUser && activeMatch?.participantIds?.includes(currentUser.uid);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{challenge.title}</h1>
      <p className="text-gray-700 mb-6">{challenge.description}</p>
      {Array.isArray(challenge.tags) && challenge.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {challenge.tags.map((tag) => (
            <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {activeMatch && (
        <div className="mb-6 p-4 rounded-lg border bg-slate-50">
          <p className="text-sm text-slate-700">
            Esta iniciativa ja possui um workspace colaborativo com {(activeMatch.participantIds || []).length} participantes.
          </p>
          {iAmParticipant && (
            <Link to={`/conexao/${activeMatch.id}`} className="inline-block mt-3 text-sm font-bold text-combinador-primary hover:underline">
              Acessar workspace colaborativo
            </Link>
          )}
          {myJoinRequest && (
            <div className="mt-2">
              <p className="text-xs text-amber-700 font-semibold">Seu pedido atual: {myJoinRequest.status}</p>
              {myJoinRequest.status === 'pending' && (
                <button
                  onClick={handleCancelRequest}
                  className="mt-2 text-xs font-bold text-red-600 hover:underline"
                >
                  Cancelar pedido
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <hr className="my-8" />

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Linha do Tempo Publica</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">Nenhum evento publico registado ate ao momento.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((ev) => (
              <li key={ev.id} className="p-4 bg-gray-50 rounded shadow">
                <span className="font-bold block text-sm text-combinador-primary">{ev.type.replace('_', ' ').toUpperCase()}</span>
                <p className="mt-2">{ev.content}</p>
                <small className="text-gray-400 mt-2 block">
                  {ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : 'Data nao disponivel'}
                </small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="my-8" />

      <div className="bg-combinador-base p-6 rounded-lg border border-combinador-secondary/30">
        <h2 className="text-2xl font-semibold mb-2">Quero colaborar</h2>
        <p className="mb-4 text-sm text-gray-600">
          {activeMatch
            ? 'Envie um pedido para entrar no workspace. O gestor e o pesquisador lider precisam aprovar.'
            : 'Inicie o primeiro contato para criar o workspace desta pesquisa.'}
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Descreva sua linha de pesquisa, contribuicao e motivacao para entrar no desafio..."
          className="w-full p-3 border rounded mb-4"
          rows={4}
        />
        <button onClick={handleInitialContact} className="bg-combinador-primary text-white px-6 py-2 rounded hover:brightness-110 font-bold">
          {activeMatch ? 'Solicitar entrada' : 'Criar workspace'}
        </button>
      </div>
    </div>
  );
}
