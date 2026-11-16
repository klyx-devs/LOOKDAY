import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { hairstyles, faceShapeInfo, hairTypeInfo } from '@/data/hairstyles';
import { toggleFavorite } from '@/lib/favorites';
import { Scissors, Heart, Sparkles, Filter, Lock, Search } from 'lucide-react';

const maintenanceLabels: Record<string, string> = {
  low: 'лёгкий уход',
  medium: 'средний уход',
  high: 'требует укладки',
};

export default function HairStudio() {
  const { session, profile } = useAuth();
  const [face, setFace] = useState('');
  const [hairType, setHairType] = useState('');
  const [length, setLength] = useState('');
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data } = await supabase.from('favorites').select('item_key').eq('item_type', 'hairstyle');
      setFavs(new Set((data || []).map((d) => d.item_key)));
    })();
  }, [session]);

  // Load user's face shape from Style DNA onboarding question if stored
  const dnaAnswers = useMemo(() => (profile?.style_dna_completed ? true : false), [profile]);

  const filtered = hairstyles.filter((h) => {
    if (face && !h.faceShapes.includes(face)) return false;
    if (hairType && !h.hairTypes.includes(hairType)) return false;
    if (length && h.category !== length) return false;
    if (query && !h.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const handleFav = async (key: string, name: string, desc: string) => {
    if (!session) return;
    const res = await toggleFavorite({
      item_type: 'hairstyle',
      item_key: key,
      title: name,
      subtitle: desc,
      payload: { module: 'hair-studio' },
    });
    setFavs((prev) => {
      const next = new Set(prev);
      if (res === 'added') next.add(key);
      else next.delete(key);
      return next;
    });
  };

  return (
    <div className="space-y-8 page-enter">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-stone-800 flex items-center gap-3">
            <Scissors className="text-rose-500" size={28} /> Hair Studio
          </h1>
          <p className="mt-1.5 text-sm text-stone-500 max-w-xl leading-relaxed">
            Каталог причёсок с фильтрами. Найдите форму, которая подходит именно вам, и сохраните идеи в Избранное.
          </p>
        </div>
        {!session && (
          <Link to="/login" className="btn-secondary !py-2 shrink-0 text-xs">
            <Lock size={13} /> Войти, чтобы сохранять
          </Link>
        )}
      </header>

      {/* Filters */}
      <section className="card p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-stone-700 mb-4">
          <Filter size={15} className="text-rose-500" /> Фильтры
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label text-xs">Форма лица</label>
            <select className="input" value={face} onChange={(e) => setFace(e.target.value)}>
              <option value="">Любая</option>
              {Object.entries(faceShapeInfo).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-xs">Тип волос</label>
            <select className="input" value={hairType} onChange={(e) => setHairType(e.target.value)}>
              <option value="">Любой</option>
              {Object.entries(hairTypeInfo).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label text-xs">Длина</label>
            <select className="input" value={length} onChange={(e) => setLength(e.target.value)}>
              <option value="">Любая</option>
              <option value="short">Короткие</option>
              <option value="medium">Средние</option>
              <option value="long">Длинные</option>
              <option value="updo">Собранные</option>
            </select>
          </div>
          <div>
            <label className="label text-xs">Поиск</label>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input className="input !pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Название…" />
            </div>
          </div>
        </div>
        {(face || hairType || length || query) && (
          <button
            onClick={() => { setFace(''); setHairType(''); setLength(''); setQuery(''); }}
            className="mt-4 text-sm font-semibold text-rose-600 hover:text-rose-700"
          >
            Сбросить фильтры
          </button>
        )}
      </section>

      {/* Recommendations note */}
      {profile?.style_dna_completed ? (
        <section className="rounded-2xl bg-gradient-to-r from-rose-100 to-blush-100 border border-rose-200 p-5 flex items-start gap-3">
          <Sparkles className="text-rose-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-stone-700 leading-relaxed">
            Ваш Style DNA уже учтён: посмотрите сначала стрижки с пометкой «лёгкий уход», они лучше всего
            сочетаются с вашим архетипом. Для AI-примерки сделайте фото по желанию — оно не сохраняется без вашего действия.
          </p>
        </section>
      ) : (
        <Link to="/style-dna" className="block rounded-2xl bg-blush-50 border border-rose-200 p-5 text-sm text-stone-600 hover:bg-rose-50 transition-colors">
          <Sparkles size={16} className="inline text-rose-500 mr-2" />
          Пройдите Style DNA, чтобы получать персональные рекомендации причёсок
        </Link>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-center text-stone-400 py-12">Ничего не найдено — попробуйте изменить фильтры.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((h) => (
            <article key={h.key} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl text-stone-800">{h.name}</h3>
                  <span className="text-xs font-medium text-rose-500">{maintenanceLabels[h.maintenance]}</span>
                </div>
                <button
                  onClick={() => handleFav(h.key, h.name, h.description)}
                  className={`p-2 rounded-full transition-colors ${favs.has(h.key) ? 'text-rose-500 bg-rose-50' : 'text-stone-300 hover:text-rose-400 hover:bg-rose-50'}`}
                  title={favs.has(h.key) ? 'Убрать из избранного' : 'В избранное'}
                >
                  <Heart size={18} fill={favs.has(h.key) ? 'currentColor' : 'none'} />
                </button>
              </div>
              <p className="mt-3 text-sm text-stone-500 leading-relaxed flex-1">{h.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {h.faceShapes.slice(0, 3).map((f) => (
                  <span key={f} className="rounded-full bg-blush-50 border border-rose-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-500">
                    {faceShapeInfo[f]}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
