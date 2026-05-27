import { supabase } from '../supabaseClient';

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Check VITE_SUPABASE_URL and publishable key.');
  }
}

function toNotificationModel(row) {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    message: row.message,
    payload: row.payload || {},
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

export async function listMyNotifications(userId) {
  assertSupabase();
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data || []).map(toNotificationModel);
}

export async function getUnreadNotificationCount(userId) {
  assertSupabase();
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) throw error;
  return count || 0;
}

export async function markNotificationAsRead(notificationId, userId) {
  assertSupabase();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);
  if (error) throw error;
}

export async function markAllNotificationsAsRead(userId) {
  assertSupabase();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) throw error;
}
