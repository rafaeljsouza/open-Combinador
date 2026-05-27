import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getPrivateProfileById,
  getProfileById,
  updateProfile,
} from '../lib/backend/profileService';
import { User, ExternalLink, GraduationCap, Building, Edit3, Save, X, Globe, Linkedin, Github, Instagram } from 'lucide-react';
import TagSelector from '../components/TagSelector';
import { listTagCatalog } from '../lib/backend/tagService';

const Profile = ({ currentUser }) => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewerProfile, setViewerProfile] = useState(null);
  const [privateContact, setPrivateContact] = useState({});
  const [showRequiredWarning, setShowRequiredWarning] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  const isOwner = currentUser?.uid === id;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const raw = await getProfileById(id);
      if (raw) {
        const data = {
          ...raw,
          email: raw.email || currentUser?.email || '',
          social: {
            website: raw.social?.website || raw.website || '',
            linkedin: raw.social?.linkedin || '',
            github: raw.social?.github || '',
            instagram: raw.social?.instagram || ''
          },
          sharePrivateWithResearchers: raw.sharePrivateWithResearchers || false,
          sharePrivateWithManagers: raw.sharePrivateWithManagers ?? true
        };
        setProfile(data);
        setEditData(data); // Prepara os dados para edição
      }

      if (currentUser?.uid) {
        const viewer = await getProfileById(currentUser.uid);
        if (viewer) setViewerProfile(viewer);
      }

      try {
        const privateData = await getPrivateProfileById(id);
        setPrivateContact(privateData || {});
      } catch (error) {
        setPrivateContact({});
      }

      setLoading(false);
    };
    fetchProfile();
    listTagCatalog().then(setTagSuggestions).catch(() => setTagSuggestions([]));
  }, [id, currentUser]);

  const handleSave = async () => {
    const roleType = profile?.userType || editData.userType;

    const missingRequired = {
      name: !editData.name?.trim(),
      roleLink: roleType === 'pesquisador' ? !editData.lattes?.trim() : !editData.governmentLink?.trim(),
      email: !privateContact.email?.trim(),
      phone: !privateContact.phone?.trim()
    };

    if (missingRequired.name || missingRequired.roleLink || missingRequired.email || missingRequired.phone) {
      setShowRequiredWarning(true);
      const missingLabels = [];
      if (missingRequired.name) missingLabels.push('nome');
      if (missingRequired.roleLink) missingLabels.push(roleType === 'pesquisador' ? 'link do Lattes' : 'link da secretaria/orgao');
      if (missingRequired.email) missingLabels.push('email privado');
      if (missingRequired.phone) missingLabels.push('telefone');
      alert(`Faltam informacoes obrigatorias: ${missingLabels.join(', ')}`);
      return;
    }

    try {
      const publicPayload = {
        ...editData,
        email: editData.email || currentUser?.email || profile?.email || '',
        sharePrivateWithResearchers: editData.sharePrivateWithResearchers || false,
        sharePrivateWithManagers: editData.sharePrivateWithManagers ?? true
      };

      await updateProfile(id, publicPayload, privateContact, isOwner);

      setProfile(editData);
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar: " + error.message);
    }
  };

  const viewerType = isOwner ? profile?.userType : viewerProfile?.userType;
  const canViewPrivate = Boolean(
    isOwner ||
    (viewerType === 'pesquisador' && profile?.sharePrivateWithResearchers) ||
    (viewerType === 'gestor' && profile?.sharePrivateWithManagers)
  );

  const hasPrivateContact = Boolean(
    privateContact?.email ||
    privateContact?.phone ||
    privateContact?.whatsapp ||
    privateContact?.notes
  );

  if (loading) return <div className="p-20 text-center text-slate-500 italic">Carregando dados do servidor...</div>;
  if (!profile) return <div className="p-20 text-center">Perfil não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto my-10 px-4">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        
        {/* Botão Editar (Apenas para o dono) */}
        {isOwner && !isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 flex items-center gap-2 text-sm font-bold text-combinador-primary bg-combinador-base px-4 py-2 rounded-xl hover:brightness-95 transition-all"
          >
            <Edit3 size={16}/> Editar Perfil
          </button>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="bg-slate-100 p-6 rounded-3xl">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <User size={80} className="text-slate-400" />
            )}
          </div>
          
          <div className="flex-1 w-full">
            {isEditing ? (
              /* MODO EDIÇÃO */
                <div className="space-y-4">
                  {showRequiredWarning && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      Campos com <strong>*</strong> sao obrigatorios. Preencha os campos destacados em vermelho.
                    </div>
                  )}
                  <p className="text-xs text-slate-500">Campos obrigatorios: <span className="text-red-600 font-bold">*</span></p>
                  <input 
                    className={`text-2xl font-bold w-full border-b-2 outline-none ${!editData.name?.trim() ? 'border-red-500 bg-red-50/40' : 'border-combinador-primary'}`}
                    value={editData.name} 
                    onChange={e => setEditData({...editData, name: e.target.value})}
                    placeholder="Nome completo *"
                  />
                <input
                  className="w-full p-2 border rounded"
                  placeholder="URL da foto"
                  value={editData.avatarUrl || ''}
                  onChange={e => setEditData({ ...editData, avatarUrl: e.target.value })}
                />
                <input 
                  className="w-full p-2 border rounded"
                  placeholder="Instituicao"
                  value={editData.institution} 
                  onChange={e => setEditData({...editData, institution: e.target.value})}
                />
                {profile.userType === 'pesquisador' ? (
                  <input
                    className={`w-full p-2 border rounded ${!editData.lattes?.trim() ? 'border-red-500 bg-red-50/40' : ''}`}
                    placeholder="Link do Lattes *"
                    value={editData.lattes || ''}
                    onChange={e => setEditData({ ...editData, lattes: e.target.value })}
                  />
                ) : (
                  <input
                    className={`w-full p-2 border rounded ${!editData.governmentLink?.trim() ? 'border-red-500 bg-red-50/40' : ''}`}
                    placeholder="Link da secretaria/orgao *"
                    value={editData.governmentLink || ''}
                    onChange={e => setEditData({ ...editData, governmentLink: e.target.value })}
                  />
                )}
                <textarea 
                  className="w-full p-2 border rounded" 
                  placeholder="Bio"
                  rows="3"
                  value={editData.bio} 
                  onChange={e => setEditData({...editData, bio: e.target.value})}
                />
                {profile.userType === 'pesquisador' && (
                  <>
                    <input 
                      className="w-full p-2 border border-purple-200 rounded" 
                      placeholder="Linha de Pesquisa"
                      value={editData.researchLine} 
                      onChange={e => setEditData({...editData, researchLine: e.target.value})}
                    />
                    <TagSelector
                      label="Tags de interesse"
                      placeholder="Ex: filas"
                      selectedTags={editData.interestTags || []}
                      onChange={(tags) => setEditData({ ...editData, interestTags: tags })}
                      suggestions={tagSuggestions}
                    />
                  </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Website"
                    value={editData.social?.website || ''}
                    onChange={e => setEditData({ ...editData, social: { ...editData.social, website: e.target.value } })}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="LinkedIn"
                    value={editData.social?.linkedin || ''}
                    onChange={e => setEditData({ ...editData, social: { ...editData.social, linkedin: e.target.value } })}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="GitHub"
                    value={editData.social?.github || ''}
                    onChange={e => setEditData({ ...editData, social: { ...editData.social, github: e.target.value } })}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="Instagram"
                    value={editData.social?.instagram || ''}
                    onChange={e => setEditData({ ...editData, social: { ...editData.social, instagram: e.target.value } })}
                  />
                </div>

                <div className="bg-slate-50 border rounded p-3 space-y-2">
                  <p className="text-sm font-bold text-slate-700">Contato privado</p>
                  <input
                    className={`w-full p-2 border rounded ${!privateContact.email?.trim() ? 'border-red-500 bg-red-50/40' : ''}`}
                    placeholder="Email privado *"
                    value={privateContact.email || ''}
                    onChange={e => setPrivateContact({ ...privateContact, email: e.target.value })}
                  />
                  <input
                    className={`w-full p-2 border rounded ${!privateContact.phone?.trim() ? 'border-red-500 bg-red-50/40' : ''}`}
                    placeholder="Telefone *"
                    value={privateContact.phone || ''}
                    onChange={e => setPrivateContact({ ...privateContact, phone: e.target.value })}
                  />
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="WhatsApp"
                    value={privateContact.whatsapp || ''}
                    onChange={e => setPrivateContact({ ...privateContact, whatsapp: e.target.value })}
                  />
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Notas"
                    rows="2"
                    value={privateContact.notes || ''}
                    onChange={e => setPrivateContact({ ...privateContact, notes: e.target.value })}
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editData.sharePrivateWithResearchers || false}
                      onChange={e => setEditData({ ...editData, sharePrivateWithResearchers: e.target.checked })}
                    />
                    Compartilhar com pesquisadores
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editData.sharePrivateWithManagers || false}
                      onChange={e => setEditData({ ...editData, sharePrivateWithManagers: e.target.checked })}
                    />
                    Compartilhar com gestores
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={editData.notifyEmailEnabled || false}
                      onChange={e => setEditData({ ...editData, notifyEmailEnabled: e.target.checked })}
                    />
                    Receber digest por email (quando habilitado no servidor)
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    value={editData.notifyEmailFrequency || 'daily'}
                    onChange={(e) => setEditData({ ...editData, notifyEmailFrequency: e.target.value })}
                  >
                    <option value="daily">Frequencia diaria</option>
                    <option value="twice_daily">Frequencia 2x ao dia</option>
                    <option value="weekly">Frequencia semanal</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold"><Save size={16}/> Salvar</button>
                  <button onClick={() => setIsEditing(false)} className="bg-slate-200 text-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 font-bold"><X size={16}/> Cancelar</button>
                </div>
              </div>
            ) : (
              /* MODO VISUALIZAÇÃO */
              <>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-black text-slate-900 leading-tight">{profile.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${profile.userType === 'pesquisador' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'}`}>
                    {profile.userType}
                  </span>
                </div>
                
                <p className="flex items-center gap-2 text-slate-500 font-medium mb-4 italic">
                  {profile.userType === 'pesquisador' ? <GraduationCap size={18}/> : <Building size={18}/>}
                  {profile.institution}
                </p>

                {profile.researchLine && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linha de Pesquisa</span>
                    <p className="text-combinador-primary font-semibold">{profile.researchLine}</p>
                  </div>
                )}

                {Array.isArray(profile.interestTags) && profile.interestTags.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tags de Interesse</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.interestTags.map((tag) => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferencia de Notificacao por Email</span>
                  <p className="text-sm text-slate-600 mt-1">
                    {profile.notifyEmailEnabled ? `Ativado (${profile.notifyEmailFrequency || 'daily'})` : 'Desativado'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {profile.userType === 'pesquisador' && profile.lattes && (
                    <a href={profile.lattes} target="_blank" rel="noopener noreferrer" className="text-xs bg-combinador-primary text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <ExternalLink size={12} /> Lattes
                    </a>
                  )}
                  {profile.userType === 'gestor' && profile.governmentLink && (
                    <a href={profile.governmentLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <ExternalLink size={12} /> Órgão público
                    </a>
                  )}
                  {profile.social?.website && (
                    <a href={profile.social.website} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Globe size={12} /> Website
                    </a>
                  )}
                  {profile.social?.linkedin && (
                    <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Linkedin size={12} /> LinkedIn
                    </a>
                  )}
                  {profile.social?.github && (
                    <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Github size={12} /> GitHub
                    </a>
                  )}
                  {profile.social?.instagram && (
                    <a href={profile.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Instagram size={12} /> Instagram
                    </a>
                  )}
                </div>

                <p className="text-slate-700 leading-relaxed mb-8 bg-slate-50 p-5 rounded-2xl">
                  {profile.bio || "Este usuário ainda não adicionou uma biografia."}
                </p>

                {/* Área de Contato Protegida */}
                <div className="flex flex-wrap gap-4 p-4 bg-combinador-base rounded-2xl border border-combinador-secondary/30">
                  {currentUser ? (
                    <>
                      {profile.lattes && (
                        <a href={profile.lattes} target="_blank" className="flex items-center gap-2 text-sm bg-combinador-primary text-white px-5 py-2.5 rounded-xl hover:brightness-110 transition-all font-bold shadow-md shadow-slate-300/40">
                          <ExternalLink size={16}/> Currículo Lattes
                        </a>
                      )}
                      {profile.governmentLink && (
                        <a href={profile.governmentLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-amber-600 text-white px-5 py-2.5 rounded-xl hover:bg-amber-700 transition-all font-bold shadow-md shadow-amber-100">
                          <ExternalLink size={16}/> Órgão/Secretaria
                        </a>
                      )}
                      <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-sm bg-white border border-combinador-secondary text-combinador-primary px-5 py-2.5 rounded-xl hover:bg-combinador-base transition-all font-bold">
                        Enviar E-mail
                      </a>
                    </>
                  ) : (
                    <div className="w-full text-center py-2">
                      <p className="text-sm text-combinador-primary font-medium mb-2 italic">
                        Informacoes de contato protegidas.
                      </p>
                      <Link to="/cadastro" className="text-combinador-primary font-bold hover:underline">
                        Faça login para conectar-se.
                      </Link>
                    </div>
                  )}
                </div>

                {hasPrivateContact && (
                  <div className="mt-5 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Contato privado</p>
                    {canViewPrivate ? (
                      <div className="space-y-1 text-sm text-slate-700">
                        {privateContact?.email && <p><strong>Email:</strong> {privateContact.email}</p>}
                        {privateContact?.phone && <p><strong>Telefone:</strong> {privateContact.phone}</p>}
                        {privateContact?.whatsapp && <p><strong>WhatsApp:</strong> {privateContact.whatsapp}</p>}
                        {privateContact?.notes && <p><strong>Notas:</strong> {privateContact.notes}</p>}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Este contato é privado e não está liberado para o seu tipo de usuário.</p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
