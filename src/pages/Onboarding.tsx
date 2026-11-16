import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { User as UserIcon, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    await supabase.from('profiles').update({ display_name: name.trim(), onboarding_completed: true }).eq('id', user.id);
    await refreshProfile();
    setBusy(false);
    navigate('/style-dna?welcome=1');
  };

  return (
    <div className="card max-w-md w-full p-8">
      <span className="text-xs font-bold tracking-widest text-rose-500 uppercase">Шаг 1 из 2</span>
      <h1 className="font-display text-3xl text-stone-800 mt-2">Как вас называть?</h1>
      <p className="mt-2 text-sm text-stone-500">Имя будет видеть только вы — LOOKDAY ваш личный инструмент.</p>
      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div className="relative">
          <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input className="input pl-10" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Например, Алиса" required autoFocus />
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Сохраняем…' : 'Продолжить'} <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
