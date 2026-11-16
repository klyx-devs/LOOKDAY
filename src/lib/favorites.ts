import { supabase } from '@/lib/supabase';

export async function toggleFavorite(item: {
  item_type: string;
  item_key: string;
  title: string;
  subtitle?: string;
  image_url?: string | null;
  payload?: Record<string, unknown>;
}): Promise<'added' | 'removed'> {
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('item_type', item.item_type)
    .eq('item_key', item.item_key)
    .maybeSingle();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    return 'removed';
  }
  await supabase.from('favorites').insert({
    item_type: item.item_type,
    item_key: item.item_key,
    title: item.title,
    subtitle: item.subtitle ?? '',
    image_url: item.image_url ?? null,
    payload: item.payload ?? {},
  });
  return 'added';
}

export async function isFavorite(itemType: string, itemKey: string): Promise<boolean> {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('item_type', itemType)
    .eq('item_key', itemKey)
    .maybeSingle();
  return !!data;
}
