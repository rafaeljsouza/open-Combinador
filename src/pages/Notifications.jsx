import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listMyNotifications, markAllNotificationsAsRead, markNotificationAsRead } from '../lib/backend/notificationService';
import { Info } from 'lucide-react';

export default function Notifications({ currentUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    if (!currentUser?.uid) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await listMyNotifications(currentUser.uid);
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar notificacoes:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  async function handleMarkAsRead(itemId) {
    if (!currentUser?.uid) return;
    await markNotificationAsRead(itemId, currentUser.uid);
    await loadNotifications();
  }

  async function handleMarkAllAsRead() {
    if (!currentUser?.uid) return;
    await markAllNotificationsAsRead(currentUser.uid);
    await loadNotifications();
  }

  if (!currentUser) return <div className="p-10 text-center">Inicie sessao para ver notificacoes.</div>;
  if (loading) return <div className="p-10 text-center">Carregando notificacoes...</div>;
  const unreadCount = items.filter((item) => !item.isRead).length;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900">Notificacoes</h1>
        <p className="text-slate-600">Alertas sobre desafios compativeis com suas tags.</p>
        <details className="mt-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
          <summary className="cursor-pointer text-sm font-semibold text-slate-700 inline-flex items-center gap-2">
            <Info size={14} /> Informacao sobre envio por email
          </summary>
          <p className="text-sm text-slate-600 mt-2">
            Notificacoes de interesses em comum implementado, mas ainda nao funcional por email para poupar custos.
          </p>
        </details>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className="mt-3 text-sm font-bold text-combinador-primary hover:underline">
            Marcar todas como lidas ({unreadCount})
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          Nenhuma notificacao por enquanto.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`bg-white border rounded-xl p-4 ${item.isRead ? 'border-slate-200' : 'border-combinador-secondary/60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{item.message}</p>
                  {Array.isArray(item.payload?.matchedTags) && item.payload.matchedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.payload.matchedTags.map((tag) => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">#{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{new Date(item.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {item.payload?.challengeId && (
                    <Link to={`/desafio/${item.payload.challengeId}`} className="text-sm font-bold text-combinador-primary hover:underline">
                      Abrir desafio
                    </Link>
                  )}
                  {!item.isRead && (
                    <button onClick={() => handleMarkAsRead(item.id)} className="text-xs px-2 py-1 rounded bg-slate-900 text-white">
                      Marcar como lida
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
