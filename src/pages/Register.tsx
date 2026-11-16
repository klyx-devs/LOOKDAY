import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Sparkles, Mail, Lock, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Пароль должен быть не короче 6 символов');
      return;
    }
    setBusy(true);
    const { data, error: err } = await supabase.auth.signUp({ email, password });
    setBusy(false);
    if (err) {
      if (err.code === 'weak_password') {
        setError('Этот пароль слишком простой и легко подбирается. Придумайте другой — добавьте цифры, заглавные буквы или символ.');
      } else if (err.code === 'user_already_exists' || err.message === 'User already registered') {
        setError('Пользователь с таким email уже зарегистрирован');
      } else {
        setError('Не удалось создать аккаунт. Попробуйте ещё раз.');
      }
      return;
    }
    if (data.session) {
      navigate('/onboarding');
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div className="card max-w-md w-full p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={48} />
        <h1 className="font-display text-2xl mt-4 text-stone-800">Подтвердите email</h1>
        <p className="mt-3 text-sm text-stone-500 leading-relaxed">
          Мы отправили письмо со ссылкой подтверждения на <b>{email}</b>.
          После подтверждения войдите в свой аккаунт.
        </p>
        <Link to="/login" className="btn-primary mt-6 w-full">Перейти ко входу</Link>
      </div>
    );
  }

  return (
    <div className="card max-w-md w-full p-8">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-rose-500" size={22} />
        <span className="font-display text-xl font-semibold">LOOKDAY</span>
      </div>
      <h1 className="font-display text-3xl text-stone-800">Создать аккаунт</h1>
      <p className="mt-2 text-sm text-stone-500">Ваш персональный стилист ждёт вас</p>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="name">Имя</label>
          <div className="relative">
            <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input id="name" className="input pl-10" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя" required />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input id="email" type="email" className="input pl-10" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" required />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="password">Пароль</label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input id="password" type="password" className="input pl-10" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов" required minLength={6} />
          </div>
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? 'Создаём аккаунт…' : 'Зарегистрироваться'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-700">Войти</Link>
      </p>
    </div>
  );
}
