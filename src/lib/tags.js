export function normalizeTag(value) {
  return (value || '').toLowerCase().replace(/^#+/, '').trim();
}

export function normalizeTags(values) {
  const unique = new Set();
  for (const raw of values || []) {
    const tag = normalizeTag(raw);
    if (tag) unique.add(tag);
  }
  return Array.from(unique);
}
