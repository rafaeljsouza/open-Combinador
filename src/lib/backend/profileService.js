import { supabase } from '../supabaseClient';
import { normalizeTags } from '../tags';
import { bumpTagCatalog } from './tagService';

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Check VITE_SUPABASE_URL and publishable key.');
  }
}

function toProfileModel(row) {
  if (!row) return null;
  return {
    uid: row.id,
    userType: row.user_type,
    email: row.email,
    name: row.name,
    institution: row.institution,
    avatarUrl: row.avatar_url,
    lattes: row.lattes,
    governmentLink: row.government_link,
    bio: row.bio,
    researchLine: row.research_line,
    social: row.social || {},
    interestTags: row.interest_tags || [],
    sharePrivateWithResearchers: row.share_private_with_researchers,
    sharePrivateWithManagers: row.share_private_with_managers,
    notifyEmailEnabled: row.notify_email_enabled,
    notifyEmailFrequency: row.notify_email_frequency,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toPrivateProfileModel(row) {
  if (!row) return {};
  return {
    ownerId: row.owner_id,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    notes: row.notes,
    updatedAt: row.updated_at,
  };
}

function toProfileRow(profile) {
  return {
    id: profile.uid,
    user_type: profile.userType,
    email: profile.email,
    name: profile.name,
    institution: profile.institution,
    avatar_url: profile.avatarUrl || '',
    lattes: profile.lattes || '',
    government_link: profile.governmentLink || '',
    bio: profile.bio || '',
    research_line: profile.researchLine || '',
    social: profile.social || {},
    // Store canonical tags to keep matching and catalog stats stable across casing/spacing variants.
    interest_tags: normalizeTags(profile.interestTags || []),
    share_private_with_researchers: Boolean(profile.sharePrivateWithResearchers),
    share_private_with_managers: profile.sharePrivateWithManagers ?? true,
    notify_email_enabled: Boolean(profile.notifyEmailEnabled),
    notify_email_frequency: profile.notifyEmailFrequency || 'daily',
    updated_at: new Date().toISOString(),
  };
}

function toPrivateProfileRow(profile) {
  return {
    owner_id: profile.ownerId,
    email: profile.email || '',
    phone: profile.phone || '',
    whatsapp: profile.whatsapp || '',
    notes: profile.notes || '',
    updated_at: new Date().toISOString(),
  };
}

export async function createInitialProfile(userId, payload) {
  assertSupabase();
  const publicProfile = {
    ...payload.publicProfile,
    uid: userId,
  };
  const privateProfile = {
    ...payload.privateProfile,
    ownerId: userId,
  };

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(toProfileRow(publicProfile), { onConflict: 'id' });
  if (profileError) throw profileError;

  const { error: privateError } = await supabase
    .from('profile_private')
    .upsert(toPrivateProfileRow(privateProfile), { onConflict: 'owner_id' });
  if (privateError) throw privateError;

  await bumpTagCatalog(publicProfile.interestTags || []);
}

export async function getProfileById(userId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return toProfileModel(data);
}

export async function getPrivateProfileById(userId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('profile_private')
    .select('*')
    .eq('owner_id', userId)
    .maybeSingle();
  if (error) throw error;
  return toPrivateProfileModel(data);
}

export async function updateProfile(userId, publicPayload, privatePayload, shouldUpdatePrivate) {
  assertSupabase();

  const profileRow = toProfileRow({
    ...publicPayload,
    uid: userId,
  });

  const { error: profileError } = await supabase
    .from('profiles')
    .update(profileRow)
    .eq('id', userId);
  if (profileError) throw profileError;

  if (shouldUpdatePrivate) {
    // Private contact data is persisted separately so public profile reads never include sensitive fields.
    const privateRow = toPrivateProfileRow({
      ...privatePayload,
      ownerId: userId,
    });
    const { error: privateError } = await supabase
      .from('profile_private')
      .upsert(privateRow, { onConflict: 'owner_id' });
    if (privateError) throw privateError;
  }

  await bumpTagCatalog(publicPayload.interestTags || []);
}

export async function getProfilesByIds(userIds) {
  assertSupabase();
  if (!Array.isArray(userIds) || userIds.length === 0) return {};

  const { data, error } = await supabase.from('profiles').select('*').in('id', userIds);
  if (error) throw error;

  const profileMap = {};
  for (const row of data || []) {
    profileMap[row.id] = toProfileModel(row);
  }
  return profileMap;
}

export async function listResearchers() {
  assertSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'pesquisador')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toProfileModel);
}

export async function listResearchersByInterestTags(tags) {
  assertSupabase();
  const normalized = normalizeTags(tags);
  if (normalized.length === 0) return [];

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_type', 'pesquisador')
    .overlaps('interest_tags', normalized)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(toProfileModel);
}
