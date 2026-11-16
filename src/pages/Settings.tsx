import { useEffect, useState } from 'react';
import { Bell, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Settings {
  notify_email: boolean;
  notify_push: boolean;
  weekly_summary: boolean;
}

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('user_settings')
        .select('notify_email, notify_push, weekly_summary')
        .maybeSingle();
      if (data) {
        setSettings(data);
      } else {
        const { data: created } = await supabase
          .from('user_settings')
          .insert({})
          .select('notify_email, notify_push, weekly_summary')
          .maybeSingle();
        setSettings(created ?? { notify_email: true, notify_push: false, weekly_summary: true });
      }
      setLoading(false);
    })();
  }, []);

  const saveSettings = async (next: Settings) => {
    setSettings(next);
    setSavingSettings(true);
    setSettingsSaved(false);
    const { error } = await supabase
      .from('user_settings')
      .upsert(next, { onConflict: 'user_id' });
    if (!error) {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    }
    setSavingSettings(false);
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword.length < 8) {
      setPasswordMsg({ ok: false, text: 'Пароль должен быть не короче 8 символов.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: 'Пароли не совпадают.' });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPasswordMsg({ ok: false, text: 'Не удалось изменить пароль. Попробуйте позже.' });
    } else {
      setPasswordMsg({ ok: true, text: 'Пароль обновлён.' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  const toggles: { key: keyof Settings; icon: typeof Bell; label: string; desc: string }[] = [
    { key: 'notify_email', icon: Mail, label: 'Email-уведомления', desc: 'Важные новости и напоминания на почту' },
    { key: 'notify_push', icon: Bell, label: 'Push-уведомления', desc: 'Напоминания о челлендже и уходе' },
    { key: 'weekly_summary', icon: CheckCircle2, label: 'Недельная сводка', desc: 'Краткий отчёт о вашем прогрессе' },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl text-stone-800">Настройки</h1>
        <p className="mt-1 text-sm text-stone-500">Уведомления и безопасность аккаунта.</p>
      </div>

      <section className="card p-6">
        <h2 className="font-display text-xl text-stone-800">Уведомления</h2>
        <div className="mt-4 space-y-3">
          {toggles.map(({ key, icon: Icon, label, desc }) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-4 rounded-xl border border-rose-100 px-4 py-3 transition-colors hover:bg-rose-50/50"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Icon size={17} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-stone-800">{label}</p>
                <p className="text-xs text-stone-500">{desc}</p>
              </div>
              <div className="relative shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings?.[key] ?? false}
                  disabled={savingSettings}
                  onChange={(e) => settings && saveSettings({ ...settings, [key]: e.target.checked })}
                />
                <div className="h-6 w-11 rounded-full bg-stone-200 transition-colors peer-checked:bg-rose-500" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
        {settingsSaved && <p className="mt-3 text-sm text-emerald-600">Настройки сохранены</p>}
      </section>

      <section className="card p-6">
        <h2 className="font-display text-xl text-stone-800">Смена пароля</h2>
        <p className="mt-1 text-sm text-stone-500">
          Аккаунт: <span className="font-medium text-stone-700">{user?.email}</span>
        </p>
        <form onSubmit={changePassword} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-stone-700">Новый пароль</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Минимум 8 символов"
              className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-stone-700">Повторите пароль</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
            />
          </div>
          {passwordMsg && (
            <p className={`text-sm ${passwordMsg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
              {passwordMsg.text}
            </p>
          )}
          <button type="submit" disabled={savingPassword} className="btn-primary disabled:opacity-60">
            <Lock size={16} />
            {savingPassword ? 'Сохраняем…' : 'Обновить пароль'}
          </button>
        </form>
      </section>
    </div>
  );
}
