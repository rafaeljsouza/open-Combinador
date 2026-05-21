import React, { useState } from 'react';
import { loginWithEmail } from '../lib/backend/authService';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate('/'); // Volta para a home após logar
    } catch (error) {
        console.error("Erro detalhado do Firebase:", error.code);
        alert("Erro ao entrar: Verifique e-mail e senha.");
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="bg-combinador-primary w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-300/60">
          <LogIn className="text-white" size={24} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Bem-vindo de volta</h2>
        <p className="text-slate-500 text-sm">Acesse sua conta no Combinador</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input 
            type="email" 
            placeholder="Seu e-mail" 
            required 
            className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-combinador-primary outline-none transition-all"
            onChange={e => setEmail(e.target.value)} 
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
          <input 
            type="password" 
            placeholder="Sua senha" 
            required 
            className="w-full p-3 pl-10 border border-slate-200 rounded-xl focus:ring-2 focus:ring-combinador-primary outline-none transition-all"
            onChange={e => setPassword(e.target.value)} 
          />
        </div>

        <button type="submit" className="w-full bg-combinador-primary hover:brightness-110 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-slate-200">
          Entrar no Sistema
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-slate-500">
        Ainda não tem conta? <Link to="/cadastro" className="text-combinador-primary font-bold hover:underline">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default Login;
