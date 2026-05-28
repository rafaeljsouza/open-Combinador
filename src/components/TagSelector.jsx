import React, { useMemo, useState } from 'react';
import { normalizeTag } from '../lib/tags';

export default function TagSelector({
  label,
  placeholder,
  selectedTags,
  onChange,
  suggestions = [],
}) {
  const [draft, setDraft] = useState('');

  const filteredSuggestions = useMemo(() => {
    const term = normalizeTag(draft);
    return suggestions
      .filter((tag) => !selectedTags.includes(tag))
      .filter((tag) => !term || tag.includes(term))
      .slice(0, 20);
  }, [draft, selectedTags, suggestions]);

  const addTag = (raw) => {
    const tag = normalizeTag(raw);
    if (!tag || selectedTags.includes(tag)) return;
    onChange([...selectedTags, tag]);
    setDraft('');
  };

  const removeTag = (tag) => {
    onChange(selectedTags.filter((item) => item !== tag));
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
              e.preventDefault();
              addTag(draft);
            }
          }}
          placeholder={placeholder}
          className="w-full p-2 border rounded"
        />
        <button type="button" onClick={() => addTag(draft)} className="px-3 py-2 rounded bg-slate-900 text-white text-sm font-semibold">
          Adicionar
        </button>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className="text-xs bg-combinador-base text-combinador-primary border border-combinador-secondary/40 px-2 py-1 rounded"
            >
              #{tag} x
            </button>
          ))}
        </div>
      )}

      <div>
        <p className="text-xs text-slate-500 mb-1">Tags sugeridas</p>
        <div className="flex flex-wrap gap-2">
          {filteredSuggestions.length === 0 && <span className="text-xs text-slate-400">Sem sugestões para este filtro.</span>}
          {filteredSuggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 hover:bg-slate-200"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
