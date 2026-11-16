import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { challengeDays } from '@/data/challenge';
import { CalendarCheck, Check, Lock, Trophy, Flame } from 'lucide-react';

export default function Challenge() {
  const { session } = useAuth();
  const [doneDays, setDoneDays] = useState<Set<number>>(new Set());
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase.from('challenge_progress').select('day');
      setDoneDays(new Set((data || []).map((d) => d.day)));
      setLoading(false);
    })();
  }, [session]);

  const toggleDay = async (day: number) => {
    if (!session) return;
    if (doneDays.has(day)) {
      await supabase.from('challenge_progress').delete().eq('day', day);
      setDoneDays((prev) => {
        const next = new Set(prev);
        next.delete(day);
        return next;
      });
    } else {
      await supabase.from('challenge_progress').insert({ day });
      setDoneDays((prev) => new Set(prev).add(day));
    }
  };

  const completed = doneDays.size;
  const pct = Math.round((completed / 30) * 100);

  if (!session) {
    return (
      <div className="max-w-md mx-auto card p-8 text-center page-enter">
        <CalendarCheck className="mx-auto text-rose-400" size={40} />
        <h1 className="font-display text-2xl mt-4">30-Day Challenge</h1>
        <p className="mt-2 text-sm text-stone-500">Войдите, чтобы сохранить прогресс челленджа и вернуться к нему в любой день.</p>
        <Link to="/login" className="btn-primary mt-6 w-full"><Lock size={15} /> Войти</Link>
      </div>
    );
  }

  if (loading) return <div className="py-24 text-center text-stone-400">Загружаем прогресс…</div>;

  return (
    <div className="space-y-8 page-enter">
      <header className="card p-6 sm:p-8 bg-gradient-to-br from-white via-blush-50 to-rose-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <h1 className="font-display text-3xl text-stone-800 flex items-center gap-3">
              <CalendarCheck className="text-rose-500" size={28} /> 30-Day Challenge
            </h1>
            <p className="mt-2 text-sm text-stone-500 max-w-lg leading-relaxed">
              Месяц маленьких стилевых побед. Отмечайте выполненные задания — календарь запоминает ваш путь.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-rose-200 flex items-center justify-center">
                <span className="font-display text-2xl text-rose-600">{pct}%</span>
              </div>
              <p className="text-xs text-stone-400 mt-1.5 font-medium">прогресс</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center">
                <span className="font-display text-2xl text-rose-600 flex items-center gap-1"><Flame size={18} />{completed}</span>
              </div>
              <p className="text-xs text-stone-400 mt-1.5 font-medium">дней</p>
            </div>
          </div>
        </div>
        {completed === 30 && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-100 to-rose-100 border border-amber-200 p-4">
            <Trophy className="text-amber-500" size={22} />
            <p className="text-sm font-semibold text-stone-700">Челлендж пройден полностью — вы потрясающая!</p>
          </div>
        )}
      </header>

      {/* Calendar */}
      <section>
        <h2 className="font-display text-2xl text-stone-800 mb-4">Календарь заданий</h2>
        <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-10 gap-2.5">
          {challengeDays.map(({ day }) => {
            const done = doneDays.has(day);
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all hover:-translate-y-0.5 active:scale-95 ${
                  done
                    ? 'bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-200'
                    : 'bg-white border-rose-100 text-stone-500 hover:border-rose-300'
                }`}
              >
                <span className="font-display text-lg leading-none">{day}</span>
                <span className="text-[10px] font-medium">{done ? <Check size={11} strokeWidth={3} /> : '·'}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active day detail */}
      {activeDay !== null && (() => {
        const info = challengeDays.find((d) => d.day === activeDay)!;
        const done = doneDays.has(activeDay);
        return (
          <section className="card p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-rose-100/60 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-widest text-rose-500 uppercase">День {info.day}</p>
                  <h3 className="font-display text-2xl text-stone-800 mt-1">{info.title}</h3>
                </div>
                <button onClick={() => setActiveDay(null)} className="btn-ghost !text-stone-400 !px-3">✕</button>
              </div>
              <p className="mt-3 text-sm text-stone-500 leading-relaxed max-w-lg">{info.description}</p>
              <button
                onClick={() => toggleDay(info.day)}
                className={`mt-5 ${done ? 'btn-secondary !text-emerald-600 !border-emerald-200 hover:!bg-emerald-50' : 'btn-primary'}`}
              >
                {done ? (<><Check size={15} /> Выполнено — отменить</>) : 'Отметить выполненным'}
              </button>
            </div>
          </section>
        );
      })()}

      {activeDay === null && (
        <p className="text-center text-sm text-stone-400">Выберите день в календаре, чтобы прочитать задание.</p>
      )}
    </div>
  );
}
