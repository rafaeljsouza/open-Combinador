import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../lib/backend/authService';
import { getChallengeById } from '../lib/backend/challengeService';
import { getProfilesByIds } from '../lib/backend/profileService';
import { addMatchEvent, getMatchById, listJoinRequestsByMatch, listMatchEvents, publishSolution, updateJoinRequest, updateMatch } from '../lib/backend/collaborationService';

export default function MatchWorkspace() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [challenge, setChallenge] = useState(null);
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  const [profilesById, setProfilesById] = useState({});
  const [message, setMessage] = useState('');
  const [eventTags, setEventTags] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentLabel, setAttachmentLabel] = useState('');
  const [makePublic, setMakePublic] = useState(false);
  const [eventType, setEventType] = useState('atualizacao_desenvolvimento');
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [repoLink, setRepoLink] = useState('');
  const [apiDocsUrl, setApiDocsUrl] = useState('');
  const [licenseCode, setLicenseCode] = useState('');
  const [licenseData, setLicenseData] = useState('');
  const [finalSummary, setFinalSummary] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');
  const [recentExports, setRecentExports] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  async function loadWorkspace() {
    const user = await getCurrentUser();
    setCurrentUser(user);
    if (!user?.uid) return;

    const match = await getMatchById(matchId);
    if (!match) return;

    const participantIds = match.participantIds || [];
    if (!participantIds.includes(user.uid)) {
      alert('Acesso negado. Apenas participantes podem visualizar esta página.');
      navigate('/');
      return;
    }

    setMatchData(match);

    const challengeData = await getChallengeById(match.challengeId);
    if (challengeData) setChallenge(challengeData);

    const eventsList = await listMatchEvents(matchId);
    setEvents(eventsList);

    const reqList = await listJoinRequestsByMatch(matchId);
    setJoinRequests(reqList);

    const profileIds = new Set([
      ...participantIds,
      ...eventsList.map((ev) => ev.authorId).filter(Boolean),
      ...reqList.map((req) => req.requesterId).filter(Boolean),
    ]);
    const profileMap = await getProfilesByIds(Array.from(profileIds));
    setProfilesById(profileMap);

    const participantProfiles = participantIds.map((uid) => ({
      uid,
      ...(profileMap[uid] || { name: 'Usuario' }),
    }));
    setParticipants(participantProfiles);
  }

  useEffect(() => {
    loadWorkspace();
  }, [matchId, navigate]);

  const handleSendUpdate = async () => {
    if (!message.trim()) return;
    try {
      await addMatchEvent({
        matchId,
        challengeId: matchData.challengeId,
        type: eventType,
        content: message,
        tags: eventTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        attachment: attachmentUrl.trim()
          ? {
              url: attachmentUrl.trim(),
              label: attachmentLabel.trim() || 'Anexo'
            }
          : null,
        isPublic: makePublic,
        authorId: currentUser.uid,
      });
      setMessage('');
      setEventTags('');
      setAttachmentUrl('');
      setAttachmentLabel('');
      await loadWorkspace();
    } catch (error) {
      console.error('Erro ao enviar:', error);
    }
  };

  const handleDecision = async (requestItem, key, value) => {
    try {
      const next = { [key]: value };
      const managerApproved = key === 'managerApproved' ? value : requestItem.managerApproved;
      const leadApproved = key === 'leadApproved' ? value : requestItem.leadApproved;

      if (managerApproved && leadApproved) {
        next.status = 'approved';

        const nextParticipants = Array.from(new Set([...(matchData.participantIds || []), requestItem.requesterId]));
        await updateMatch(matchId, { participantIds: nextParticipants });

        await addMatchEvent({
          matchId,
          challengeId: matchData.challengeId,
          type: 'novo_participante_aprovado',
          content: 'Novo pesquisador aprovado para o workspace colaborativo.',
          isPublic: false,
          authorId: currentUser.uid,
        });
      }

      await updateJoinRequest(requestItem.id, next);
      await loadWorkspace();
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
    }
  };

  const handleRejectRequest = async (requestItem) => {
    try {
      await updateJoinRequest(requestItem.id, { status: 'rejected' });
      await loadWorkspace();
    } catch (error) {
      console.error('Erro ao rejeitar pedido:', error);
    }
  };

  const filteredEvents = events.filter((ev) => {
    const byVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'public' && ev.isPublic) ||
      (visibilityFilter === 'private' && !ev.isPublic);

    const byType = typeFilter === 'all' || ev.type === typeFilter;

    const byText =
      !searchTerm.trim() ||
      ev.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ev.tags || []).some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    return byVisibility && byType && byText;
  });

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);

    setRecentExports((prev) => [
      {
        fileName,
        generatedAt: new Date().toLocaleString(),
        eventsCount: filteredEvents.length
      },
      ...prev
    ].slice(0, 5));
  };

  const exportTimelineTxt = () => {
    const lines = [];
    lines.push(`Timeline de Pesquisa - ${challenge?.title || 'Desafio'}`);
    lines.push(`Workspace: ${matchId}`);
    lines.push(`Gerado em: ${new Date().toLocaleString()}`);
    lines.push('');

    for (const ev of filteredEvents) {
      const when = ev.createdAt ? new Date(ev.createdAt).toLocaleString() : 'Sem data';
      const vis = ev.isPublic ? 'PUBLICO' : 'PRIVADO';
      const authorName = profilesById[ev.authorId]?.name || ev.authorId || 'Autor desconhecido';
      lines.push(`[${when}] [${vis}] [${ev.type}] [${authorName}]`);
      if (ev.tags?.length) lines.push(`Tags: ${ev.tags.join(', ')}`);
      if (ev.attachment?.url) lines.push(`Anexo: ${ev.attachment.label || 'Anexo'} - ${ev.attachment.url}`);
      lines.push(ev.content || '');
      lines.push('');
    }

    downloadFile(lines.join('\n'), `timeline-${matchId}.txt`, 'text/plain;charset=utf-8');
  };

  const exportTimelineMarkdown = () => {
    const lines = [];
    lines.push(`# Timeline de Pesquisa`);
    lines.push('');
    lines.push(`- Desafio: ${challenge?.title || 'Desafio'}`);
    lines.push(`- Workspace: ${matchId}`);
    lines.push(`- Gerado em: ${new Date().toLocaleString()}`);
    lines.push('');

    for (const ev of filteredEvents) {
      const when = ev.createdAt ? new Date(ev.createdAt).toLocaleString() : 'Sem data';
      const vis = ev.isPublic ? 'PUBLICO' : 'PRIVADO';
      const authorName = profilesById[ev.authorId]?.name || ev.authorId || 'Autor desconhecido';
      lines.push(`## ${ev.type.replaceAll('_', ' ')}`);
      lines.push(`- Data: ${when}`);
      lines.push(`- Visibilidade: ${vis}`);
      lines.push(`- Autor: ${authorName}`);
      lines.push(`- Tags: ${(ev.tags || []).join(', ') || 'sem tags'}`);
      lines.push(`- Anexo: ${ev.attachment?.url ? `[${ev.attachment.label || 'Anexo'}](${ev.attachment.url})` : 'sem anexo'}`);
      lines.push('');
      lines.push(ev.content || '');
      lines.push('');
    }

    downloadFile(lines.join('\n'), `timeline-${matchId}.md`, 'text/markdown;charset=utf-8');
  };

  const exportTimelineCsv = () => {
    const rows = [];
    rows.push('data,visibilidade,tipo,autor,tags,anexo,conteudo');
    for (const ev of filteredEvents) {
      const when = ev.createdAt ? new Date(ev.createdAt).toISOString() : '';
      const vis = ev.isPublic ? 'PUBLICO' : 'PRIVADO';
      const authorName = profilesById[ev.authorId]?.name || ev.authorId || 'Autor desconhecido';
      const tags = (ev.tags || []).join('|');
      const content = (ev.content || '').replaceAll('"', '""');
      const attachment = `${ev.attachment?.label || ''} ${ev.attachment?.url || ''}`.trim().replaceAll('"', '""');
      rows.push(`"${when}","${vis}","${ev.type}","${authorName}","${tags}","${attachment}","${content}"`);
    }

    downloadFile(rows.join('\n'), `timeline-${matchId}.csv`, 'text/csv;charset=utf-8');
  };

  const handlePublishSolution = async () => {
    if (!finalSummary.trim() || !repoLink.trim() || !apiDocsUrl.trim() || !licenseCode.trim() || !licenseData.trim()) {
      alert('Preencha resumo, repositorio, documentacao da API e licencas.');
      return;
    }
    try {
      await publishSolution({
        challengeId: matchData.challengeId,
        challengeTitle: challenge.title,
        summary: finalSummary,
        repoUrl: repoLink,
        apiDocsUrl,
        licenseCode,
        licenseData,
        managerId: matchData.managerId,
        leadResearcherId: matchData.leadResearcherId,
        participantIds: matchData.participantIds || [],
      });

      await addMatchEvent({
        matchId,
        challengeId: matchData.challengeId,
        type: 'solucao_bem_sucedida',
        content: `Solucao finalizada. Resumo: ${finalSummary}. Repositorio: ${repoLink}`,
        isPublic: true,
        authorId: currentUser.uid,
      });

      await updateMatch(matchId, { status: 'bem_sucedido' });
      alert('Solucao publicada com sucesso.');
      navigate('/solucoes');
    } catch (error) {
      console.error('Erro ao publicar solução:', error);
    }
  };

  if (!matchData || !challenge) return <div className="p-8 text-center">A carregar ambiente de trabalho...</div>;

  const isManager = currentUser?.uid === matchData.managerId;
  const isLead = currentUser?.uid === matchData.leadResearcherId;
  const visibleRequests = joinRequests.filter((req) => requestStatusFilter === 'all' || req.status === requestStatusFilter);
  const pendingRequests = joinRequests.filter((req) => req.status === 'pending');
  const citeTitle = challenge?.title || 'Desafio';
  const citeYear = new Date().getFullYear();
  const citeAuthors = Array.from(new Set(filteredEvents.map((ev) => profilesById[ev.authorId]?.name).filter(Boolean))).join('; ') || 'Equipe do projeto';
  const citeUrl = repoLink || 'URL do repositorio/resultado';

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1 bg-white p-6 rounded-xl border shadow-sm h-fit space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Desafio</h2>
          <p className="font-semibold text-slate-800 mb-2">{challenge.title}</p>
          <span className="bg-combinador-base text-combinador-primary text-xs font-bold px-2 py-1 rounded uppercase">
            Status: {matchData.status.replace('_', ' ')}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Equipe</h3>
          <div className="space-y-2">
            {participants.map((p) => (
              <div key={p.uid} className="text-sm bg-slate-50 border rounded p-2">
                <p className="font-semibold text-slate-800">{p.name || p.uid}</p>
                <p className="text-xs text-slate-500">{p.userType || 'participante'}</p>
              </div>
            ))}
          </div>
        </div>

        {matchData.status !== 'bem_sucedido' && (
          <div>
            <button
              onClick={() => setShowSolutionForm(!showSolutionForm)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium"
            >
              Publicar Solucao Final
            </button>
          </div>
        )}
      </div>

      <div className="md:col-span-2 space-y-6">
        {(isManager || isLead) && pendingRequests.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="text-lg font-bold text-amber-900 mb-3">Pedidos para entrar no workspace</h3>
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div key={req.id} className="bg-white border rounded p-3">
                  <p className="text-sm text-slate-800 mb-2">{req.message}</p>
                  <p className="text-xs text-slate-500 mb-3">Solicitante: {profilesById[req.requesterId]?.name || req.requesterId}</p>
                  <div className="flex flex-wrap gap-2">
                    {isManager && (
                      <button
                        onClick={() => handleDecision(req, 'managerApproved', true)}
                        className="px-3 py-1.5 text-xs rounded bg-combinador-primary text-white"
                      >
                        Aprovar como gestor
                      </button>
                    )}
                    {isLead && (
                      <button
                        onClick={() => handleDecision(req, 'leadApproved', true)}
                        className="px-3 py-1.5 text-xs rounded bg-combinador-primary text-white"
                      >
                        Aprovar como pesquisador lider
                      </button>
                    )}
                    {(isManager || isLead) && (
                      <button
                        onClick={() => handleRejectRequest(req)}
                        className="px-3 py-1.5 text-xs rounded bg-rose-600 text-white"
                      >
                        Rejeitar pedido
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showSolutionForm && matchData.status !== 'bem_sucedido' && (
          <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Registo de Solucao Bem Sucedida</h3>
            <label className="block mb-2 font-medium">Link do Repositorio</label>
            <input
              type="url"
              className="w-full p-2 border rounded mb-4"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
              placeholder="https://github.com/..."
            />
            <label className="block mb-2 font-medium">Documentacao da Open API</label>
            <input
              type="url"
              className="w-full p-2 border rounded mb-4"
              value={apiDocsUrl}
              onChange={(e) => setApiDocsUrl(e.target.value)}
              placeholder="https://... (Swagger, Postman, OpenAPI)"
            />
            <label className="block mb-2 font-medium">Resumo técnico</label>
            <textarea className="w-full p-2 border rounded mb-4" rows="4" value={finalSummary} onChange={(e) => setFinalSummary(e.target.value)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block mb-2 font-medium">Licenca do codigo</label>
                <select
                  className="w-full p-2 border rounded"
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="MIT">MIT</option>
                  <option value="Apache-2.0">Apache-2.0</option>
                  <option value="GPL-3.0">GPL-3.0</option>
                  <option value="BSD-3-Clause">BSD-3-Clause</option>
                  <option value="Proprietaria">Proprietaria</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 font-medium">Licença de dados e documentos</label>
                <select
                  className="w-full p-2 border rounded"
                  value={licenseData}
                  onChange={(e) => setLicenseData(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="CC-BY-4.0">CC-BY-4.0</option>
                  <option value="CC-BY-SA-4.0">CC-BY-SA-4.0</option>
                  <option value="CC0-1.0">CC0-1.0</option>
                  <option value="Restrita">Restrita</option>
                </select>
              </div>
            </div>
            <button onClick={handlePublishSolution} className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 font-bold">
              Confirmar e Publicar
            </button>
          </div>
        )}

        <div className="bg-slate-50 border rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <h3 className="text-xl font-bold">Linha do Tempo da Pesquisa</h3>
            <div className="flex items-center gap-2">
              <button onClick={exportTimelineTxt} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded">TXT</button>
              <button onClick={exportTimelineMarkdown} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded">MD</button>
              <button onClick={exportTimelineCsv} className="text-sm bg-slate-900 text-white px-3 py-1.5 rounded">CSV</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
            <select className="p-2 border rounded" value={visibilityFilter} onChange={(e) => setVisibilityFilter(e.target.value)}>
              <option value="all">Visibilidade: todas</option>
              <option value="public">Somente publicos</option>
              <option value="private">Somente privados</option>
            </select>

            <select className="p-2 border rounded" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="all">Tipo: todos</option>
              <option value="mensagem_inicial">Mensagem inicial</option>
              <option value="atualizacao_desenvolvimento">Atualizacao de desenvolvimento</option>
              <option value="experimento">Experimento</option>
              <option value="analise_dados">Análise de dados</option>
              <option value="decisao_metodologica">Decisão metodológica</option>
              <option value="reuniao">Reunião</option>
              <option value="novo_participante_aprovado">Novo participante aprovado</option>
              <option value="solucao_bem_sucedida">Solucao bem sucedida</option>
            </select>

            <input
              className="p-2 border rounded md:col-span-2"
              placeholder="Buscar por texto ou tipo de evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-4 mb-8">
            {filteredEvents.map((ev) => (
              <div key={ev.id} className={`p-4 rounded-lg border ${ev.isPublic ? 'bg-white border-combinador-secondary/40' : 'bg-gray-100 border-gray-200'}`}>
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-sm text-slate-700">{ev.type.replace('_', ' ').toUpperCase()}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-200">{ev.isPublic ? 'PUBLICO' : 'PRIVADO'}</span>
                </div>
                <p className="text-slate-800">{ev.content}</p>
                {ev.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ev.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700">#{tag}</span>
                    ))}
                  </div>
                )}
                {ev.attachment?.url && (
                  <a
                    href={ev.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-xs font-semibold text-combinador-primary hover:underline"
                  >
                    Anexo: {ev.attachment.label || 'Abrir link'}
                  </a>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : 'Sem data'}
                </p>
                <p className="text-xs text-slate-500">
                  Autor: {profilesById[ev.authorId]?.name || ev.authorId || 'Autor desconhecido'}
                </p>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum evento encontrado com os filtros atuais.</p>
            )}
          </div>

          {matchData.status !== 'bem_sucedido' && (
            <div className="mt-6 border-t pt-6">
              <h4 className="font-bold mb-2">Novo Evento de Pesquisa</h4>
              <select className="w-full p-2 border rounded mb-3" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="atualizacao_desenvolvimento">Atualizacao de desenvolvimento</option>
                <option value="experimento">Experimento</option>
                <option value="analise_dados">Análise de dados</option>
                <option value="decisao_metodologica">Decisão metodológica</option>
                <option value="reuniao">Reunião</option>
              </select>
              <textarea
                className="w-full p-3 border rounded mb-3"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva o evento para manter histórico de pesquisa completo..."
              />
              <input
                className="w-full p-2 border rounded mb-3"
                value={eventTags}
                onChange={(e) => setEventTags(e.target.value)}
                placeholder="Tags do evento (separadas por vírgula): experimento A/B, regressão, reunião"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                <input
                  className="w-full p-2 border rounded"
                  value={attachmentLabel}
                  onChange={(e) => setAttachmentLabel(e.target.value)}
                  placeholder="Nome do anexo (opcional)"
                />
                <input
                  className="w-full p-2 border rounded"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="URL de anexo (dataset, notebook, PDF...)"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={makePublic} onChange={(e) => setMakePublic(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm font-medium text-slate-700">Tornar público no desafio</span>
                </label>
                <button onClick={handleSendUpdate} className="bg-combinador-primary text-white px-6 py-2 rounded hover:brightness-110 font-bold">
                  Registar evento
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-slate-900">Histórico de pedidos de participação</h3>
            <select className="p-2 border rounded" value={requestStatusFilter} onChange={(e) => setRequestStatusFilter(e.target.value)}>
              <option value="all">Todos os status</option>
              <option value="pending">Pendentes</option>
              <option value="approved">Aprovados</option>
              <option value="rejected">Rejeitados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          <div className="space-y-3">
            {visibleRequests.map((req) => (
              <div key={req.id} className="border rounded p-3 bg-slate-50">
                <p className="text-sm font-semibold text-slate-800">{profilesById[req.requesterId]?.name || req.requesterId}</p>
                <p className="text-xs text-slate-500 mb-1">Status: {req.status}</p>
                <p className="text-sm text-slate-700">{req.message || 'Sem mensagem'}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Gestor: {req.managerApproved ? 'aprovou' : 'pendente'} | Lider: {req.leadApproved ? 'aprovou' : 'pendente'}
                </p>
              </div>
            ))}
            {visibleRequests.length === 0 && <p className="text-sm text-slate-500">Nenhum pedido neste filtro.</p>}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Exportacoes recentes</h3>
          <div className="space-y-2">
            {recentExports.map((item, idx) => (
              <div key={`${item.fileName}-${idx}`} className="text-sm bg-slate-50 border rounded p-2">
                <p className="font-semibold text-slate-800">{item.fileName}</p>
                <p className="text-xs text-slate-500">{item.generatedAt} - {item.eventsCount} eventos</p>
              </div>
            ))}
            {recentExports.length === 0 && <p className="text-sm text-slate-500">Nenhuma exportação nesta sessão.</p>}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Formato para citacao (rascunho)</h3>
          <div className="space-y-3 text-sm">
            <div className="bg-slate-50 border rounded p-3">
              <p className="text-xs font-bold text-slate-500 mb-1">ABNT (rascunho)</p>
              <p className="text-slate-800">{citeAuthors}. {citeTitle}. Combinador, {citeYear}. Disponivel em: {citeUrl}. Acesso em: {new Date().toLocaleDateString()}.</p>
            </div>
            <div className="bg-slate-50 border rounded p-3">
              <p className="text-xs font-bold text-slate-500 mb-1">APA (rascunho)</p>
              <p className="text-slate-800">{citeAuthors} ({citeYear}). {citeTitle}. Combinador. {citeUrl}</p>
            </div>
            <p className="text-xs text-slate-500">Ajuste final recomendado conforme o padrao oficial da revista/programa.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
