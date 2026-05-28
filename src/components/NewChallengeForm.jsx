import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChallenge } from '../lib/backend/challengeService';
import { getCurrentUser } from '../lib/backend/authService';
import TagSelector from './TagSelector';
import { listTagCatalog } from '../lib/backend/tagService';

export default function NewChallengeForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Campos Públicos
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState(''); // Resumo público
  const [tags, setTags] = useState([]);

  // Campos Privados
  const [privateDetails, setPrivateDetails] = useState(''); // Detalhes restritos
  const [tagSuggestions, setTagSuggestions] = useState([]);

  useEffect(() => {
    listTagCatalog().then(setTagSuggestions).catch(() => setTagSuggestions([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      alert("É necessário iniciar sessão para publicar um desafio.");
      return;
    }

    if (!title.trim() || !description.trim() || !area.trim()) {
      alert("Por favor, preencha todos os campos públicos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      const challenge = await createChallenge({
        title,
        area,
        description,
        privateDetails,
        tags,
        authorId: currentUser.uid,
      });

      alert("Desafio publicado com sucesso!");
      navigate(`/desafio/${challenge.id}`);
    } catch (error) {
      console.error("Erro ao publicar o desafio:", error);
      alert("Ocorreu um erro. Verifique a sua conexão e permissões.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Publicar Novo Desafio</h2>
        <p className="text-slate-600 mb-8">
          Descreva o problema que a sua gestão enfrenta. Separe o que pode ser visto por todos do que deve ser mantido em sigilo até a formação da parceria.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SESSÃO PÚBLICA */}
          <div className="bg-combinador-base p-6 rounded-lg border border-combinador-secondary/30">
            <h3 className="font-bold text-combinador-primary mb-4 uppercase text-sm tracking-wider">Informações Públicas</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título do Desafio *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-combinador-primary focus:border-combinador-primary outline-none"
                  placeholder="Ex: Otimização da Rota de Merenda Escolar"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Área de Conhecimento *</label>
                <select 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
                >
                  <option value="">Selecione uma área...</option>
                  <option value="Logística">Logística</option>
                  <option value="Educação">Educação</option>
                  <option value="Saúde Pública">Saúde Pública</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Tecnologia da Informação">Tecnologia da Informação</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Resumo do Problema (Público) *</label>
                <p className="text-xs text-slate-500 mb-2">Este texto será visto por todos os pesquisadores no mural de desafios. Não inclua dados sensíveis.</p>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none h-32 resize-none"
                  placeholder="Descreva o contexto geral do problema..."
                />
              </div>

              <TagSelector
                label="Tags do desafio"
                placeholder="Ex: eficiencia"
                selectedTags={tags}
                onChange={setTags}
                suggestions={tagSuggestions}
              />
            </div>
          </div>

          {/* SESSÃO PRIVADA */}
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider flex items-center gap-2">
              Informações Restritas
              <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded">Apenas para conexões</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Detalhes Internos / Dados Sensíveis</label>
              <p className="text-xs text-slate-500 mb-2">Este conteúdo não aparecerá no mural. Será revelado ao pesquisador apenas após o contato inicial ser estabelecido no Painel de Conexões.</p>
              <textarea 
                value={privateDetails}
                onChange={(e) => setPrivateDetails(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 outline-none h-32 resize-none"
                placeholder="Ex: O gargalo atual ocorre na planilha X, operada por 2 servidores. Os dados brutos contêm nomes de pacientes..."
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-combinador-primary hover:brightness-110'}`}
            >
              {loading ? 'A publicar desafio...' : 'Publicar Desafio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
