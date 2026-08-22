import React, { useEffect, useState } from 'react';
import { registerWithEmail } from '../lib/backend/authService';
import { createInitialProfile } from '../lib/backend/profileService';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Building2 } from 'lucide-react';
import TagSelector from '../components/TagSelector';
import { listTagCatalog } from '../lib/backend/tagService';

const Register = () => {
  const [userType, setUserType] = useState('pesquisador'); // 'pesquisador' ou 'gestor'
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', institution: '',
    avatarUrl: '',
    lattes: '',
    governmentLink: '',
    website: '',
    linkedin: '',
    github: '',
    instagram: '',
    bio: '',
    researchLine: '',
    privateEmail: '',
    privatePhone: '',
    privateWhatsapp: '',
    privateNotes: '',
    sharePrivateWithResearchers: false,
    sharePrivateWithManagers: true,
    interestTags: [],
  });
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    listTagCatalog().then(setTagSuggestions).catch(() => setTagSuggestions([]));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Nome completo é obrigatório.');
      return;
    }

    if (!formData.privateEmail.trim()) {
      alert('Email de contato é obrigatório.');
      return;
    }

    if (!formData.privatePhone.trim()) {
      alert('Telefone é obrigatório.');
      return;
    }

    if (userType === 'pesquisador' && !formData.lattes.trim()) {
      alert('Link do Currículo Lattes é obrigatório para pesquisadores.');
      return;
    }

    if (userType === 'gestor' && !formData.governmentLink.trim()) {
      alert('Link da secretaria/órgão é obrigatório para gestores.');
      return;
    }

    try {
      const userCredential = await registerWithEmail(formData.email, formData.password);
      const user = userCredential.user;
      if (!user?.uid) {
        throw new Error('Falha ao criar usuario no Supabase Auth.');
      }

      await createInitialProfile(user.uid, {
        publicProfile: {
          uid: user.uid,
          userType,
          email: formData.email,
          name: formData.name,
          institution: formData.institution,
          avatarUrl: formData.avatarUrl,
          lattes: userType === 'pesquisador' ? formData.lattes : '',
          governmentLink: userType === 'gestor' ? formData.governmentLink : '',
          social: {
            website: formData.website,
            linkedin: formData.linkedin,
            github: formData.github,
            instagram: formData.instagram,
          },
          bio: formData.bio,
          interestTags: formData.interestTags,
          notifyEmailEnabled: false,
          notifyEmailFrequency: 'daily',
          sharePrivateWithResearchers: formData.sharePrivateWithResearchers,
          sharePrivateWithManagers: formData.sharePrivateWithManagers,
          createdAt: new Date(),
        },
        privateProfile: {
          ownerId: user.uid,
          email: formData.privateEmail,
          phone: formData.privatePhone,
          whatsapp: formData.privateWhatsapp,
          notes: formData.privateNotes,
          updatedAt: new Date(),
        },
      });

      alert("Conta criada com sucesso! Verifique seu e-mail para confirmar a conta antes de entrar.");
      navigate('/');
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Criar sua conta</h2>
      
      {/* Seletor de Tipo */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
        <button 
          onClick={() => setUserType('pesquisador')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${userType === 'pesquisador' ? 'bg-white text-combinador-primary shadow-sm' : 'text-slate-500'}`}
        >
          Pesquisador
        </button>
        <button 
          onClick={() => setUserType('gestor')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all ${userType === 'gestor' ? 'bg-white text-combinador-primary shadow-sm' : 'text-slate-500'}`}
        >
          Gestor Público
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="Nome Completo" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none" 
          onChange={e => setFormData({...formData, name: e.target.value})} />

        <input type="url" placeholder="URL da sua foto (opcional)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
          onChange={e => setFormData({...formData, avatarUrl: e.target.value})} />
        
        <input type="email" placeholder="E-mail Institucional" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
          onChange={e => setFormData({...formData, email: e.target.value})} />
        
        <input type="password" placeholder="Senha" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
          onChange={e => setFormData({...formData, password: e.target.value})} />

        <div className="relative">
          <div className="absolute left-3 top-3 text-slate-400">
            {userType === 'pesquisador' ? <BookOpen size={18}/> : <Building2 size={18}/>}
          </div>
          <input type="text" placeholder={userType === 'pesquisador' ? "Universidade / Laboratório" : "Órgão Público / Secretaria"} required 
            className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
            onChange={e => setFormData({...formData, institution: e.target.value})} />
        </div>

        {userType === 'pesquisador' ? (
          <input type="url" required placeholder="Link do Currículo Lattes *" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
            onChange={e => setFormData({...formData, lattes: e.target.value})} />
        ) : (
          <input type="url" required placeholder="Link da secretaria/órgão *" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
            onChange={e => setFormData({...formData, governmentLink: e.target.value})} />
        )}

        <input type="url" placeholder="Website (opcional)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
          onChange={e => setFormData({...formData, website: e.target.value})} />

        <input type="url" placeholder="LinkedIn (opcional)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
          onChange={e => setFormData({...formData, linkedin: e.target.value})} />

        <input type="url" placeholder="GitHub (opcional)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
          onChange={e => setFormData({...formData, github: e.target.value})} />

        <input type="url" placeholder="Instagram (opcional)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
          onChange={e => setFormData({...formData, instagram: e.target.value})} />

        <textarea placeholder="Breve biografia" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none" rows="3"
          onChange={e => setFormData({...formData, bio: e.target.value})} />

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
          <p className="text-sm font-bold text-slate-700">Contato privado</p>
          <p className="text-xs font-bold text-slate-500">Obrigatório para o cadastro, mas o compartilhamento é opcional.</p>

          <input type="email" placeholder="Email privado *" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
            onChange={e => setFormData({...formData, privateEmail: e.target.value})} />

          <input type="text" placeholder="Telefone *" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
            onChange={e => setFormData({...formData, privatePhone: e.target.value})} />

          <input type="text" placeholder="WhatsApp" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
            onChange={e => setFormData({...formData, privateWhatsapp: e.target.value})} />

          <textarea placeholder="Observações de contato" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none" rows="2"
            onChange={e => setFormData({...formData, privateNotes: e.target.value})} />

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.sharePrivateWithResearchers}
              onChange={e => setFormData({...formData, sharePrivateWithResearchers: e.target.checked})}
            />
            Compartilhar com pesquisadores
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={formData.sharePrivateWithManagers}
              onChange={e => setFormData({...formData, sharePrivateWithManagers: e.target.checked})}
            />
            Compartilhar com gestores
          </label>
        </div>
        {userType === 'pesquisador' && (
          <>
            <input 
              type="text" 
              placeholder="Resumo de sua principal Linha de Pesquisa"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-combinador-primary outline-none"
              onChange={e => setFormData({...formData, researchLine: e.target.value})} 
            />
            <TagSelector
              label="Tags de interesse"
              placeholder="Ex: logistica"
              selectedTags={formData.interestTags}
              onChange={(tags) => setFormData({ ...formData, interestTags: tags })}
              suggestions={tagSuggestions}
            />
          </>
        )}
        <button type="submit" className="w-full bg-combinador-primary hover:brightness-110 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-200">
          Finalizar Cadastro
        </button>
      </form>
    </div>
  );
};

export default Register;
