import { supabase } from '../supabaseClient';

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Check VITE_SUPABASE_URL and publishable key.');
  }
}

function toMatchModel(row) {
  return {
    id: row.id,
    challengeId: row.challenge_id,
    managerId: row.manager_id,
    leadResearcherId: row.lead_researcher_id,
    participantIds: row.participant_ids || [],
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toEventModel(row) {
  return {
    id: row.id,
    matchId: row.match_id,
    challengeId: row.challenge_id,
    type: row.type,
    content: row.content,
    tags: row.tags || [],
    attachment: row.attachment || null,
    isPublic: row.is_public,
    authorId: row.author_id,
    createdAt: row.created_at,
  };
}

function toSolutionModel(row) {
  return {
    id: row.id,
    challengeId: row.challenge_id,
    challengeTitle: row.challenge_title,
    summary: row.summary,
    repoUrl: row.repo_url,
    apiDocsUrl: row.api_docs_url,
    licenseCode: row.license_code,
    licenseData: row.license_data,
    managerId: row.manager_id,
    leadResearcherId: row.lead_researcher_id,
    participantIds: row.participant_ids || [],
    publishedAt: row.published_at,
  };
}

function toJoinRequestModel(row) {
  return {
    id: row.id,
    matchId: row.match_id,
    challengeId: row.challenge_id,
    requesterId: row.requester_id,
    message: row.message,
    managerApproved: row.manager_approved,
    leadApproved: row.lead_approved,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listPublicEventsByChallenge(challengeId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('match_events')
    .select('*')
    .eq('challenge_id', challengeId)
    .eq('is_public', true)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(toEventModel);
}

export async function getFirstMatchByChallenge(challengeId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('challenge_id', challengeId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? toMatchModel(data) : null;
}

export async function getMatchById(matchId) {
  assertSupabase();
  const { data, error } = await supabase.from('matches').select('*').eq('id', matchId).maybeSingle();
  if (error) throw error;
  return data ? toMatchModel(data) : null;
}

export async function listMatchEvents(matchId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('match_events')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(toEventModel);
}

export async function listJoinRequestsByMatch(matchId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('match_join_requests')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toJoinRequestModel);
}

export async function listMatchesForParticipant(userId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .contains('participant_ids', [userId])
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toMatchModel);
}

export async function getMyJoinRequest(matchId, requesterId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('match_join_requests')
    .select('*')
    .eq('match_id', matchId)
    .eq('requester_id', requesterId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? toJoinRequestModel(data) : null;
}

export async function createInitialContact(payload) {
  assertSupabase();
  // Participant list starts with manager + lead researcher and grows as requests are approved.
  const participantIds = [payload.managerId, payload.leadResearcherId].filter(Boolean);

  const { data: match, error: matchError } = await supabase
    .from('matches')
    .insert({
      challenge_id: payload.challengeId,
      manager_id: payload.managerId,
      lead_researcher_id: payload.leadResearcherId,
      participant_ids: participantIds,
      status: 'contato_inicial',
    })
    .select('*')
    .single();
  if (matchError) throw matchError;

  const { error: eventError } = await supabase.from('match_events').insert({
    match_id: match.id,
    challenge_id: payload.challengeId,
    type: 'mensagem_inicial',
    content: payload.message,
    is_public: false,
    author_id: payload.authorId,
  });
  if (eventError) throw eventError;

  return toMatchModel(match);
}

export async function createJoinRequest(payload) {
  assertSupabase();
  const { data, error } = await supabase
    .from('match_join_requests')
    .insert({
      match_id: payload.matchId,
      challenge_id: payload.challengeId,
      requester_id: payload.requesterId,
      message: payload.message,
      manager_approved: false,
      lead_approved: false,
      status: 'pending',
    })
    .select('*')
    .single();
  if (error) throw error;
  return toJoinRequestModel(data);
}

export async function cancelJoinRequest(joinRequestId) {
  assertSupabase();
  const { error } = await supabase
    .from('match_join_requests')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', joinRequestId);
  if (error) throw error;
}

export async function addMatchEvent(payload) {
  assertSupabase();
  const { data, error } = await supabase
    .from('match_events')
    .insert({
      match_id: payload.matchId,
      challenge_id: payload.challengeId,
      type: payload.type,
      content: payload.content,
      tags: payload.tags || [],
      attachment: payload.attachment || null,
      is_public: Boolean(payload.isPublic),
      author_id: payload.authorId,
    })
    .select('*')
    .single();
  if (error) throw error;
  return toEventModel(data);
}

export async function updateJoinRequest(joinRequestId, patch) {
  assertSupabase();
  // Partial patch keeps role approvals independent and avoids overwriting unrelated fields.
  const payload = { updated_at: new Date().toISOString() };
  if (typeof patch.status !== 'undefined') payload.status = patch.status;
  if (typeof patch.managerApproved !== 'undefined') payload.manager_approved = patch.managerApproved;
  if (typeof patch.leadApproved !== 'undefined') payload.lead_approved = patch.leadApproved;

  const { data, error } = await supabase
    .from('match_join_requests')
    .update(payload)
    .eq('id', joinRequestId)
    .select('*')
    .single();
  if (error) throw error;
  return toJoinRequestModel(data);
}

export async function updateMatch(matchId, patch) {
  assertSupabase();
  const payload = { updated_at: new Date().toISOString() };
  if (typeof patch.status !== 'undefined') payload.status = patch.status;
  if (typeof patch.participantIds !== 'undefined') payload.participant_ids = patch.participantIds;

  const { data, error } = await supabase
    .from('matches')
    .update(payload)
    .eq('id', matchId)
    .select('*')
    .single();
  if (error) throw error;
  return toMatchModel(data);
}

export async function publishSolution(payload) {
  assertSupabase();
  // FAIR-critical metadata is stored with each solution for downstream filtering/export.
  const { data, error } = await supabase
    .from('solutions')
    .insert({
      challenge_id: payload.challengeId,
      challenge_title: payload.challengeTitle,
      summary: payload.summary,
      repo_url: payload.repoUrl,
      api_docs_url: payload.apiDocsUrl,
      license_code: payload.licenseCode,
      license_data: payload.licenseData,
      manager_id: payload.managerId,
      lead_researcher_id: payload.leadResearcherId,
      participant_ids: payload.participantIds || [],
    })
    .select('*')
    .single();
  if (error) throw error;
  return toSolutionModel(data);
}

export async function listSolutions() {
  assertSupabase();
  const { data, error } = await supabase
    .from('solutions')
    .select('*')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toSolutionModel);
}
