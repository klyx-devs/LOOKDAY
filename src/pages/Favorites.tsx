import { useEffect, useState, useCallback } from 'react';
import { Trash2, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import EmptyState from '@/components/EmptyState';

interface FavoriteItem {
  id: string;
  item_type: string;
  item_key: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  created_at: string;
}

const typeLabels: Record<string, string> = {
  hairstyle: 'Причёска',
  outfit_item: 'Вещь',
  outfit: 'Образ',
};

export default function Favorites() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('favorites')
      .select('id, item_type, item_key, title, subtitle, image_url, created_at')
      .order('created_at', { ascending: false });
    if (err) {
      setError('Не удалось загрузить избранное. Попробуйте ещё раз.');
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const { error: err } = await supabase.from('favorites').delete().eq('id', id);
    if (err) {
      setError('Не удалось удалить элемент. Обновите страницу.');
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-stone-800">Избранное</h1>
        <p className="mt-1 text-sm text-stone-500">
          Всё, что вы сохранили из модулей платформы — причёски, вещи и готовые образы.
        </p>
      </div>

      {error && (
        <div className="card border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      )}

      {items.length === 0 ? (
        <EmptyState
          title="Пока пусто"
          subtitle="Сохраняйте понравившиеся причёски в Hair Studio и вещи в Outfit Creator — они появятся здесь."
          action="Открыть Hair Studio"
          to="/hair-studio"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="card group overflow-hidden hover:-translate-y-1">
              {item.image_url ? (
                <div className="aspect-[4/3] w-full overflow-hidden bg-rose-50">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-gradient-to-br from-rose-50 to-blush-100">
                  <Heart size={32} className="text-rose-300" />
                </div>
              )}
              <div className="p-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-rose-500">
                  {typeLabels[item.item_type] ?? 'Сохранённое'}
                </span>
                <h3 className="mt-1 font-semibold text-stone-800">{item.title}</h3>
                {item.subtitle && (
                  <p className="mt-0.5 text-sm text-stone-500 line-clamp-2">{item.subtitle}</p>
                )}
                <button
                  onClick={() => remove(item.id)}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 size={15} /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
