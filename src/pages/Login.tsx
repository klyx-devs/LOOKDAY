import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (err) {
      setError(
        err.message.includes('Invalid login')
          ? 'Неверный email или пароль'
          : err.message.includes('Email not confirmed')
          ? 'Подтвердите email по ссылке из письма'
          : 'Не удалось войти. Попробуйте ещё раз.'
      );
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="card max-w-md w-full p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-rose-500" size={22} />
        <span className="font-display text-xl font-semibold">LOOKDAY</span>
      </div>
      <h1 className="font-display text-3xl text-stone-800">С возвращением</h1>
      <p className="mt-2 text-sm text-stone-500">Войдите, чтобы продолжить свой стиль-путь</p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input id="email" type="email" className="input pl-10" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="password">Пароль</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input id="password" type="password" className="input pl-10" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="Ваш пароль" required />
          </div>
        </div>
        <div className="text-right">
          <Link to="/reset-password" className="text-sm text-rose-600 hover:text-rose-700 font-medium">
            Забыли пароль?
          </Link>
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Входим…' : 'Войти'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Ещё нет аккаунта?{' '}
        <Link to="/register" className="font-semibold text-rose-600 hover:text-rose-700">Регистрация</Link>
      </p>
    </div>
  );
}
