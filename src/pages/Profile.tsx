import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, Link2, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.display_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    setSaved(false);
    setError('');
    const { error: err } = await supabase
      .from('profiles')
      .update({ display_name: name.trim(), avatar_url: avatarUrl.trim() || null })
      .eq('id', user.id);
    setBusy(false);
    if (err) {
      setError('Не удалось сохранить профиль');
      return;
    }
    await refreshProfile();
    setSaved(true);
  };

  const handleRemovePhoto = async () => {
    setAvatarUrl('');
    if (!user) return;
    await supabase.from('profiles').update({ avatar_url: null }).eq('id', user.id);
    await refreshProfile();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="font-display text-3xl text-stone-800">Профиль</h1>

      <div className="card p-6 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Аватар" className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <UserIcon size={34} className="text-rose-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl text-stone-800 truncate">{profile?.display_name || 'Без имени'}</p>
          <p className="text-sm text-stone-400 truncate">{profile?.email}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-stone-500">
            <Link2 size={12} /> Фото загружается по ссылке и хранится, только пока вы этого хотите
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={16} /> Профиль сохранён
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <div>
          <label className="label" htmlFor="name">Имя</label>
          <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" required />
        </div>
        <div>
          <label className="label" htmlFor="avatar">Ссылка на фото (по желанию)</label>
          <input id="avatar" className="input" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg" />
          <p className="mt-1.5 text-xs text-stone-400">
            Фотография нужна только для вас — например, чтобы визуализировать причёску или образ. Её можно удалить в любой момент.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={busy} className="btn-primary">
            {busy ? 'Сохраняем…' : 'Сохранить'}
          </button>
          {avatarUrl && (
            <button type="button" onClick={handleRemovePhoto} className="btn-secondary !text-red-500 !border-red-200 hover:!bg-red-50">
              <Trash2 size={15} /> Удалить фото
            </button>
          )}
        </div>
      </form>

      <button onClick={() => navigate('/settings')} className="btn-ghost">
        Перейти в настройки
      </button>
    </div>
  );
}
