import { supabase } from '../supabaseClient';
import { normalizeTags } from '../tags';

function assertSupabase() {
  if (!supabase) {
    throw new Error('Supabase client is not configured. Check VITE_SUPABASE_URL and publishable key.');
  }
}

export async function listTagCatalog() {
  assertSupabase();
  const { data, error } = await supabase
    .from('tag_catalog')
    .select('tag')
    .order('usage_count', { ascending: false })
    .limit(300);
  if (error) throw error;
  return (data || []).map((row) => row.tag).filter(Boolean);
}

export async function bumpTagCatalog(tags) {
  assertSupabase();
  const normalized = normalizeTags(tags);
  if (normalized.length === 0) return;

  for (const tag of normalized) {
    const { data, error } = await supabase
      .from('tag_catalog')
      .select('usage_count')
      .eq('tag', tag)
      .maybeSingle();
    if (error) throw error;

    if (!data) {
      const { error: insertError } = await supabase.from('tag_catalog').insert({ tag, usage_count: 1 });
      if (insertError) throw insertError;
      continue;
    }

    const { error: updateError } = await supabase
      .from('tag_catalog')
      .update({ usage_count: (data.usage_count || 0) + 1, updated_at: new Date().toISOString() })
      .eq('tag', tag);
    if (updateError) throw updateError;
  }
}
