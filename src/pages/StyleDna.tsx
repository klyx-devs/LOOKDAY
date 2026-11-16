import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { dnaQuestions, dnaArchetypes, computeDna } from '@/data/styleDna';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';

export default function StyleDna() {
  const { session, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fromOnboarding = params.get('welcome') === '1';

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<{ archetype: string; keywords: string[]; palette: string } | null>(null);
  const [saving, setSaving] = useState(false);

  // load existing result
  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase
        .from('style_dna_results')
        .select('archetype, answers, style_keywords, color_palette')
        .maybeSingle();
      if (data) {
        setSaved({ archetype: data.archetype, keywords: data.style_keywords, palette: data.color_palette });
        setAnswers((data.answers as Record<string, string>) || {});
      }
    })();
  }, [session]);

  const total = dnaQuestions.length;
  const current = dnaQuestions[step];
  const progress = Math.round(((step) / total) * 100);

  const liveResult = useMemo(() => {
    if (Object.keys(answers).length < total) return null;
    const { archetype } = computeDna(answers);
    return archetype;
  }, [answers, total]);

  const choose = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const handleFinish = async () => {
    if (!session) {
      navigate('/register');
      return;
    }
    const { archetype } = computeDna(answers);
    const info = dnaArchetypes[archetype];
    setSaving(true);
    await supabase.from('style_dna_results').upsert({
      user_id: session.user.id,
      archetype,
      color_palette: info.palette,
      style_keywords: info.keywords,
      answers,
    });
    await supabase.from('profiles').update({ style_dna_completed: true, onboarding_completed: true }).eq('id', session.user.id);
    await refreshProfile();
    setSaved({ archetype, keywords: info.keywords, palette: info.palette });
    setSaving(false);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setSaved(null);
  };

  if (saved) {
    const info = dnaArchetypes[saved.archetype] || Object.values(dnaArchetypes)[0];
    return (
      <div className="max-w-2xl mx-auto space-y-6 page-enter">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-rose-100 via-blush-100 to-white p-8 text-center">
            <Sparkles className="mx-auto text-rose-500" size={36} />
            <p className="mt-3 text-xs font-bold tracking-widest text-rose-500 uppercase">Ваш Style DNA</p>
            <h1 className="font-display text-4xl text-stone-800 mt-2">{info.name}</h1>
            <p className="mt-4 text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">{info.description}</p>
          </div>
          <div className="p-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-blush-50 border border-rose-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Ваша палитра</p>
              <p className="mt-1.5 text-sm text-stone-700 leading-relaxed">{saved.palette || info.palette}</p>
            </div>
            <div className="rounded-2xl bg-blush-50 border border-rose-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Ключевые слова</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(saved.keywords?.length ? saved.keywords : info.keywords).map((k) => (
                  <span key={k} className="rounded-full bg-white border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600">{k}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 pb-6 flex flex-wrap gap-3">
            <Link to="/hair-studio" className="btn-primary">Подобрать причёску <ArrowRight size={15} /></Link>
            <Link to="/outfit-creator" className="btn-secondary">Собрать образ</Link>
            <button onClick={restart} className="btn-ghost !text-stone-400">
              <RotateCcw size={15} /> Пройти заново
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto page-enter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-stone-800">Style DNA</h1>
          <p className="text-sm text-stone-500 mt-1">
            {fromOnboarding ? 'Последний шаг настройки — и всё готово' : '8 вопросов, чтобы узнать свой стилевой архетип'}
          </p>
        </div>
        <span className="text-sm font-semibold text-rose-600">{Math.min(step + 1, total)} / {total}</span>
      </div>

      <div className="h-2 rounded-full bg-rose-100 overflow-hidden mb-8">
        <div className="h-full bg-gradient-to-r from-rose-400 to-blush-500 transition-all duration-500" style={{ width: `${Math.max(progress, liveResult ? 100 : 0)}%` }} />
      </div>

      <div className="card p-6 sm:p-8">
        <h2 className="font-display text-2xl text-stone-800 leading-snug">{current.question}</h2>
        <div className="mt-6 space-y-3">
          {current.options.map((opt) => {
            const selected = answers[current.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => choose(opt.value)}
                className={`w-full text-left rounded-2xl border-2 px-5 py-4 text-sm transition-all active:scale-[0.99] ${
                  selected
                    ? 'border-rose-400 bg-rose-50 text-rose-800 shadow-sm'
                    : 'border-rose-100 bg-white text-stone-600 hover:border-rose-300 hover:bg-rose-50/50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-rose-500 bg-rose-500' : 'border-stone-300'}`}>
                    {selected && <CheckCircle2 size={12} className="text-white" />}
                  </span>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-ghost disabled:opacity-0"
          >
            <ArrowLeft size={16} /> Назад
          </button>
          {step < total - 1 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!answers[current.id]} className="btn-primary">
              Далее <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={handleFinish} disabled={!answers[current.id] || saving} className="btn-primary">
              {saving ? 'Сохраняем…' : 'Завершить тест'} <Sparkles size={15} />
            </button>
          )}
        </div>
      </div>

      {!session && (
        <p className="mt-4 text-center text-xs text-stone-400">
          Чтобы сохранить результат, нужен аккаунт —{' '}
          <Link to="/register" className="font-semibold text-rose-600">создайте его бесплатно</Link>.
        </p>
      )}
    </div>
  );
}
