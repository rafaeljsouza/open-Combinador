import { supabase } from '../supabaseClient';

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Check VITE_SUPABASE_URL and publishable key.');
  }
}

function toChallengeModel(row) {
  return {
    id: row.id,
    title: row.title,
    area: row.area,
    description: row.description,
    authorId: row.author_id,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listChallenges() {
  assertSupabase();
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toChallengeModel);
}

export async function getChallengeById(challengeId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', challengeId)
    .maybeSingle();
  if (error) throw error;
  return data ? toChallengeModel(data) : null;
}

export async function createChallenge(payload) {
  assertSupabase();

  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .insert({
      title: payload.title,
      area: payload.area,
      description: payload.description,
      author_id: payload.authorId,
      status: 'aberto',
    })
    .select('*')
    .single();

  if (challengeError) throw challengeError;

  const { error: detailsError } = await supabase.from('challenge_details').insert({
    challenge_id: challenge.id,
    private_details: payload.privateDetails || '',
    author_id: payload.authorId,
  });

  if (detailsError) throw detailsError;

  return toChallengeModel(challenge);
}
