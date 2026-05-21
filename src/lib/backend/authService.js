import { supabase } from '../supabaseClient';

function mapUser(user) {
  if (!user) return null;
  return {
    ...user,
    uid: user.id,
  };
}

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Check VITE_SUPABASE_URL and publishable key.');
  }
}

export function subscribeToAuthChanges(callback) {
  assertSupabase();
  supabase.auth.getSession().then(({ data }) => {
    callback(mapUser(data.session?.user || null));
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapUser(session?.user || null));
  });

  return () => subscription.unsubscribe();
}

export async function loginWithEmail(email, password) {
  assertSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: mapUser(data.user) };
}

export async function registerWithEmail(email, password) {
  assertSupabase();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return { user: mapUser(data.user) };
}

export async function logout() {
  assertSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function getCurrentUser() {
  assertSupabase();
  return supabase.auth.getUser().then(({ data }) => mapUser(data.user));
}
