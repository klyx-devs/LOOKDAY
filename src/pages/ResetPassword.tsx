import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email);
    setBusy(false);
    if (err) {
      setError('Не удалось отправить письмо. Проверьте адрес.');
      return;
    }
    setSent(true);
  };

  return (
    <div className="card max-w-md w-full p-8">
      <h1 className="font-display text-3xl text-stone-800">Восстановление пароля</h1>
      <p className="mt-2 text-sm text-stone-500">Введите email — отправим ссылку для смены пароля</p>

      {sent ? (
        <div className="mt-6 text-center">
          <CheckCircle2 className="mx-auto text-emerald-500" size={44} />
          <p className="mt-4 text-sm text-stone-600 leading-relaxed">
            Письмо отправлено на <b>{email}</b>. Перейдите по ссылке в письме, чтобы задать новый пароль.
          </p>
          <Link to="/login" className="btn-secondary mt-6 w-full">Вернуться ко входу</Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <form onSubmit={handleReset} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                <input id="email" type="email" className="input pl-10" value={email}
                  onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
            </div>
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? 'Отправляем…' : 'Отправить ссылку'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-stone-500">
            <Link to="/login" className="font-semibold text-rose-600 hover:text-rose-700">Вернуться ко входу</Link>
          </p>
        </>
      )}
    </div>
  );
}
