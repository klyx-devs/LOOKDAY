import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { outfitItems, styleInfo, categoryInfo, outfitOccasions } from '@/data/outfits';
import type { OutfitItem } from '@/data/outfits';
import { toggleFavorite } from '@/lib/favorites';
import { Shirt, Heart, Plus, Trash2, Sparkles, Lightbulb, Lock, Save } from 'lucide-react';

interface SavedOutfit {
  id: string;
  name: string;
  occasion: string;
  items: OutfitItem[];
}

export default function OutfitCreator() {
  const { session, profile } = useAuth();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [occasion, setOccasion] = useState('');
  const [outfitName, setOutfitName] = useState('');
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!session) return;
    (async () => {
      const [{ data: outfits }, { data: favData }] = await Promise.all([
        supabase.from('outfits').select('*').order('created_at', { ascending: false }),
        supabase.from('favorites').select('item_key').eq('item_type', 'outfit-item'),
      ]);
      setSavedOutfits(outfits || []);
      setFavs(new Set((favData || []).map((d) => d.item_key)));
    })();
  }, [session]);

  const toggleItem = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectedItems = outfitItems.filter((i) => selected.has(i.key));

  const handleSaveOutfit = async () => {
    if (!session) return;
    if (!outfitName.trim() || selected.size === 0) return;
    const { data, error } = await supabase
      .from('outfits')
      .insert({ name: outfitName.trim(), occasion, items: selectedItems })
      .select()
      .maybeSingle();
    if (error || !data) {
      setNotice('Не удалось сохранить образ');
      return;
    }
    setSavedOutfits((prev) => [data, ...prev]);
    setOutfitName('');
    setNotice('Образ сохранён в ваш гардероб');
  };

  const handleDeleteOutfit = async (id: string) => {
    await supabase.from('outfits').delete().eq('id', id);
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  const handleFavItem = async (item: OutfitItem) => {
    if (!session) return;
    const res = await toggleFavorite({
      item_type: 'outfit-item',
      item_key: item.key,
      title: item.name,
      subtitle: `${categoryInfo[item.category]} · ${item.colorNote}`,
      payload: { module: 'outfit-creator', emoji: item.emoji },
    });
    setFavs((prev) => {
      const next = new Set(prev);
      if (res === 'added') next.add(item.key);
      else next.delete(item.key);
      return next;
    });
  };

  const occasionHint = outfitOccasions.find((o) => o.key === occasion)?.hint;

  return (
    <div className="space-y-8 page-enter">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-stone-800 flex items-center gap-3">
            <Shirt className="text-rose-500" size={28} /> Outfit Creator
          </h1>
          <p className="mt-1.5 text-sm text-stone-500 max-w-xl leading-relaxed">
            Выбирайте вещи из каталога и собирайте готовые образы. Сохраняйте их в гардероб или в Избранное.
          </p>
        </div>
        {!session && (
          <Link to="/login" className="btn-secondary !py-2 shrink-0 text-xs">
            <Lock size={13} /> Войти, чтобы сохранять
          </Link>
        )}
      </header>

      {notice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700">{notice}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Catalog */}
        <section className="space-y-5">
          {Object.entries(categoryInfo).map(([cat, label]) => {
            const items = outfitItems.filter((i) => i.category === cat);
            return (
              <div key={cat}>
                <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400 mb-3">{label}</h3>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      onClick={() => toggleItem(item.key)}
                      className={`card p-4 cursor-pointer select-none transition-all ${selected.has(item.key) ? 'ring-2 ring-rose-400 shadow-md' : 'hover:-translate-y-0.5'}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-2xl">{item.emoji}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleFavItem(item); }}
                          className={`p-1.5 rounded-full transition-colors ${favs.has(item.key) ? 'text-rose-500 bg-rose-50' : 'text-stone-300 hover:text-rose-400'}`}
                          title="В избранное"
                        >
                          <Heart size={15} fill={favs.has(item.key) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <h4 className="mt-2 text-sm font-semibold text-stone-800">{item.name}</h4>
                      <p className="mt-0.5 text-xs text-stone-400">{item.colorNote}</p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.styles.map((s) => (
                          <span key={s} className="rounded-full bg-blush-50 border border-rose-100 px-2 py-0.5 text-[10px] font-medium text-rose-500">
                            {styleInfo[s] || s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        {/* Builder panel */}
        <aside className="lg:sticky lg:top-8 space-y-4 self-start">
          <div className="card p-5">
            <h3 className="font-display text-xl text-stone-800 flex items-center gap-2">
              <Sparkles size={17} className="text-rose-500" /> Ваш образ
              <span className="text-xs font-sans font-semibold text-stone-400 ml-auto">{selected.size} вещей</span>
            </h3>
            {selectedItems.length === 0 ? (
              <p className="mt-3 text-sm text-stone-400">Пока пусто — нажмите на вещи в каталоге слева.</p>
            ) : (
              <ul className="mt-3 space-y-1.5">
                {selectedItems.map((i) => (
                  <li key={i.key} className="flex items-center gap-2 text-sm text-stone-600">
                    <span>{i.emoji}</span>
                    <span className="flex-1">{i.name}</span>
                    <button onClick={() => toggleItem(i.key)} className="p-1 rounded text-stone-300 hover:text-red-400">
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {occasionHint && (
              <div className="mt-4 rounded-xl bg-blush-50 border border-rose-100 p-3 flex items-start gap-2">
                <Lightbulb size={14} className="text-rose-500 mt-0.5 shrink-0" />
                <p className="text-xs text-stone-600 leading-relaxed">{occasionHint}</p>
              </div>
            )}

            {session ? (
              <>
                <input className="input mt-4" value={outfitName} onChange={(e) => setOutfitName(e.target.value)} placeholder="Название образа…" />
                <select className="input mt-2" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                  <option value="">Случай (необязательно)</option>
                  {outfitOccasions.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
                <button onClick={handleSaveOutfit} disabled={!outfitName.trim() || selected.size === 0} className="btn-primary w-full mt-3">
                  <Save size={15} /> Сохранить образ
                </button>
              </>
            ) : (
              <p className="mt-4 text-xs text-stone-400 text-center">Войдите, чтобы сохранять образы в гардероб</p>
            )}
          </div>

          {profile?.style_dna_completed && (
            <div className="rounded-2xl bg-gradient-to-br from-rose-100 to-blush-100 border border-rose-200 p-4 text-xs text-stone-600 leading-relaxed">
              <b className="text-stone-700">Подсказка Style DNA:</b> выбирайте вещи с ярлыками вашего архетипа — так образ получится гармоничным без лишних усилий.
            </div>
          )}
        </aside>
      </div>

      {/* Saved outfits */}
      {session && savedOutfits.length > 0 && (
        <section>
          <h2 className="font-display text-2xl text-stone-800 mb-4">Мой гардероб образов</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedOutfits.map((o) => (
              <article key={o.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-lg text-stone-800">{o.name}</h3>
                  <button onClick={() => handleDeleteOutfit(o.id)} className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 transition-colors" title="Удалить образ">
                    <Trash2 size={15} />
                  </button>
                </div>
                {o.occasion && <p className="text-xs font-medium text-rose-500">{outfitOccasions.find((x) => x.key === o.occasion)?.label}</p>}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(o.items || []).map((i) => (
                    <span key={i.key} className="rounded-full bg-blush-50 border border-rose-100 px-2.5 py-1 text-xs text-stone-600">
                      {i.emoji} {i.name}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {savedOutfits.length === 0 && session && (
        <Link to="/favorites" className="block text-center text-sm font-semibold text-rose-600 hover:text-rose-700">
          Посмотреть избранные вещи <Plus size={14} className="inline" />
        </Link>
      )}
    </div>
  );
}
