import { supabase } from '../supabaseClient';
import { normalizeTags } from '../tags';
import { bumpTagCatalog } from './tagService';
import { listResearchersByInterestTags } from './profileService';

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
    tags: row.tags || [],
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
  const challengeTags = normalizeTags(payload.tags || []);

  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .insert({
      title: payload.title,
      area: payload.area,
      description: payload.description,
      author_id: payload.authorId,
      status: 'aberto',
      tags: challengeTags,
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

  await bumpTagCatalog(challengeTags);

  const matches = await listResearchersByInterestTags(challengeTags);
  for (const researcher of matches) {
    const matchedTags = challengeTags.filter((tag) => (researcher.interestTags || []).includes(tag));

    const { data: existingNotification, error: existingError } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', researcher.uid)
      .eq('type', 'challenge_match')
      .contains('payload', { challengeId: challenge.id })
      .limit(1)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existingNotification) continue;

    const { data: createdNotification, error: notificationError } = await supabase.from('notifications').insert({
      user_id: researcher.uid,
      type: 'challenge_match',
      title: 'Novo desafio compativel com suas tags',
      message: `O desafio "${challenge.title}" pode ser relevante para voce.`,
      payload: {
        challengeId: challenge.id,
        matchedTags,
      },
      is_read: false,
    }).select('id').single();
    if (notificationError) throw notificationError;

    if (researcher.notifyEmailEnabled && createdNotification?.id) {
      const { error: queueError } = await supabase.from('notification_digest_queue').insert({
        user_id: researcher.uid,
        notification_id: createdNotification.id,
        status: 'pending',
      });
      if (queueError) throw queueError;
    }
  }

  return toChallengeModel(challenge);
}
