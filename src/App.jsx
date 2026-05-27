import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Info, Lightbulb,
   ClipboardList, Users, Bell } from 'lucide-react';
import { logout, subscribeToAuthChanges } from './lib/backend/authService';
import { getUnreadNotificationCount } from './lib/backend/notificationService';

// Páginas
import NewChallengeForm from './components/NewChallengeForm';
import ChallengeList from './components/ChallengeList';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Solutions = lazy(() => import('./pages/Solutions'));
const About = lazy(() => import('./pages/About'));
const ResearchersList = lazy(() => import('./pages/ResearchersList'));
const Login = lazy(() => import('./pages/Login'));
const ChallengeDetails = lazy(() => import('./pages/ChallengeDetails'));
const ConnectionsDashboard = lazy(() => import('./pages/ConnectionsDashboard'));
const MatchWorkspace = lazy(() => import('./pages/MatchWorkspace'));
const HowItWorks = lazy(() => import('./pages/HowItWorks'));
const Notifications = lazy(() => import('./pages/Notifications'));

function App() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer;
    async function refreshUnread() {
      if (!user?.uid) {
        setUnreadNotifications(0);
        return;
      }
      try {
        const count = await getUnreadNotificationCount(user.uid);
        setUnreadNotifications(count);
      } catch {
        setUnreadNotifications(0);
      }
    }

    refreshUnread();
    if (user?.uid) timer = setInterval(refreshUnread, 30000);
    return () => clearInterval(timer);
  }, [user]);
  

  return (
    <Router>
      <div className="min-h-screen bg-combinador-base font-sans text-slate-900 flex flex-col">
      
      {/* HEADER */}
      <header className="bg-combinador-primary border-b border-combinador-primary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2 z-50">
            <img src="/icon.png" alt="Combinador" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-xl font-black text-white tracking-tight italic">Combinador</span>
          </Link>
          
          {/* Desktop Navigation (Esconde no celular) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/pesquisadores" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Pesquisadores</Link>
            <Link to="/desafios" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Desafios</Link>
            <Link to="/solucoes" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Soluções</Link>
            <Link to="/como-funciona" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Como funciona?</Link>
            <a href="https://forms.gle/tLLAuJkjpEzNqDie8" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-combinador-secondary hover:text-white transition-colors">Avaliar Plataforma</a>
            <Link to="/sobre" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Quem Somos</Link>
          </nav>

          {/* Botões Direitos (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={`/perfil/${user.uid}`} className="bg-white/10 p-2 rounded-full text-slate-100 hover:bg-white/20 transition-all">
                  <User size={20} />
                </Link>
                <Link to="/notificacoes" className="relative bg-white/10 p-2 rounded-full text-slate-100 hover:bg-white/20 transition-all">
                  <Bell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                      {unreadNotifications > 99 ? '99+' : unreadNotifications}
                    </span>
                  )}
                </Link>
                <Link to="/conexoes" className="text-sm font-bold text-combinador-secondary hover:text-white transition-colors">
                   Painel de Conexões
                   </Link>
                   <Link to={`/perfil/${user.uid}`} className="bg-white/10 p-2 rounded-full text-slate-100 hover:bg-white/20 transition-all"></Link>
                <button onClick={logout} className="text-slate-300 hover:text-red-300 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-bold text-slate-200 px-4 py-2 hover:text-white">Entrar</Link>
                <Link to="/cadastro" className="bg-combinador-secondary text-slate-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:brightness-95">Cadastrar</Link>
              </div>
            )}
          </div>

          {/* Botão Hamburger (Apenas Celular) */}
          <button 
            className="md:hidden p-2 text-slate-200 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* MENU MOBILE OVERLAY */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-white z-40 md:hidden flex flex-col p-8 pt-24 animate-in slide-in-from-right duration-300">
            <nav className="flex flex-col gap-6">
              <Link onClick={closeMenu} to="/pesquisadores" className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Users className="text-combinador-primary" /> Pesquisadores
              </Link>
              <Link onClick={closeMenu} to="/desafios" className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <ClipboardList className="text-combinador-primary" /> Desafios
              </Link>
              <Link onClick={closeMenu} to="/solucoes" className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Lightbulb className="text-combinador-primary" /> Soluções
              </Link>
              <Link onClick={closeMenu} to="/sobre" className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Info className="text-combinador-primary" /> Quem Somos
              </Link>
              <Link onClick={closeMenu} to="/como-funciona" className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Info className="text-combinador-primary" /> Como funciona?
              </Link>
              <a href="https://forms.gle/tLLAuJkjpEzNqDie8" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-combinador-primary flex items-center gap-3">
                <Info className="text-combinador-secondary" /> Avaliar Plataforma
              </a>
              
              <hr className="border-slate-100 my-4" />
              
              {user ? (
                <div className="space-y-6">
                  <Link onClick={closeMenu} to={`/perfil/${user.uid}`} className="flex items-center gap-3 text-xl font-bold text-slate-800 italic">
                    <User className="text-combinador-primary" /> Meu Perfil
                  </Link>
                  <Link to="/conexoes" className="text-sm font-bold text-combinador-primary hover:text-combinador-secondary transition-colors">
                  Painel de Conexões
                  </Link>
                  <Link to="/notificacoes" className="text-sm font-bold text-combinador-primary hover:text-combinador-secondary transition-colors">
                  Notificações {unreadNotifications > 0 ? `(${unreadNotifications})` : ''}
                  </Link>
                  <Link to={`/perfil/${user.uid}`} className="bg-slate-100 p-2 rounded-full text-combinador-primary hover:bg-slate-200 transition-all"></Link>
                  
                  <button onClick={() => { logout(); closeMenu(); }} className="flex items-center gap-3 text-xl font-bold text-red-500 italic">
                    <LogOut /> Sair
                  </button>
                  
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link onClick={closeMenu} to="/login" className="w-full text-center py-4 rounded-2xl bg-slate-100 font-bold">Entrar</Link>
                  <Link onClick={closeMenu} to="/cadastro" className="w-full text-center py-4 rounded-2xl bg-combinador-primary text-white font-bold">Cadastrar</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

        <main className="max-w-7xl mx-auto px-4 py-10 flex-1 w-full">
          <Suspense fallback={<div className="p-10 text-center text-slate-500">Carregando página...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cadastro" element={<Register />} />
              <Route path="/perfil/:id" element={<Profile currentUser={user} />} />
              <Route path="/desafios" element={<ChallengeList />} />
              <Route path="/solucoes" element={<Solutions />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/como-funciona" element={<HowItWorks />} />
              <Route path="/novo-desafio" element={<NewChallengeForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pesquisadores" element={<ResearchersList />} />
              <Route path="/desafio/:id" element={<ChallengeDetails />} />
              <Route path="/conexoes" element={<ConnectionsDashboard />} />
              <Route path="/conexao/:matchId" element={<MatchWorkspace />} />
              <Route path="/notificacoes" element={<Notifications currentUser={user} />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
