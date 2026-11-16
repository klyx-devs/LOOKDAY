export interface OutfitItem {
  key: string;
  name: string;
  category: 'top' | 'bottom' | 'dress' | 'outer' | 'shoes' | 'accessory';
  styles: string[];
  colorNote: string;
  emoji: string;
}

export const outfitItems: OutfitItem[] = [
  { key: 'silk-blouse', name: 'Шёлковая блуза', category: 'top', styles: ['classic', 'romantic'], colorNote: 'Пастельные и жемчужные оттенки', emoji: '👚' },
  { key: 'white-tee', name: 'Белая футболка из хлопка', category: 'top', styles: ['casual', 'sporty', 'classic'], colorNote: 'Белый — база любого гардероба', emoji: '👕' },
  { key: 'turtleneck', name: 'Тонкая водолазка', category: 'top', styles: ['classic', 'minimal'], colorNote: 'Кремовый, шоколад, чёрный', emoji: '🧣' },
  { key: 'crop-top', name: 'Укороченный топ', category: 'top', styles: ['sporty', 'bold'], colorNote: 'Яркие акценты сезона', emoji: '🎽' },
  { key: 'wide-trousers', name: 'Широкие брюки', category: 'bottom', styles: ['classic', 'minimal'], colorNote: 'Пудровые и графитовые тона', emoji: '👖' },
  { key: 'jeans', name: 'Прямые джинсы', category: 'bottom', styles: ['casual', 'sporty'], colorNote: 'Голубой деним, белые джинсы', emoji: '👖' },
  { key: 'pleated-skirt', name: 'Плиссированная юбка', category: 'bottom', styles: ['romantic', 'classic'], colorNote: 'Пыльная роза, серебро', emoji: '👗' },
  { key: 'slip-dress', name: 'Платье-комбинация', category: 'dress', styles: ['romantic', 'bold'], colorNote: 'Шампань, тёмный бордо', emoji: '👗' },
  { key: 'shirt-dress', name: 'Платье-рубашка', category: 'dress', styles: ['casual', 'classic', 'minimal'], colorNote: 'Нежная клетка, олива', emoji: '👗' },
  { key: 'blazer', name: 'Свободный блейзер', category: 'outer', styles: ['classic', 'minimal', 'bold'], colorNote: 'Карамель, белый, чёрный', emoji: '🧥' },
  { key: 'trench', name: 'Тренч', category: 'outer', styles: ['classic', 'casual'], colorNote: 'Бежевый — вечная классика', emoji: '🧥' },
  { key: 'oversized-cardigan', name: 'Оверсайз кардиган', category: 'outer', styles: ['casual', 'romantic'], colorNote: 'Молочный, лавандовый', emoji: '🧥' },
  { key: 'loafers', name: 'Лоферы', category: 'shoes', styles: ['classic', 'minimal', 'casual'], colorNote: 'Кожа коньячного цвета', emoji: '👠' },
  { key: 'white-sneakers', name: 'Белые кроссовки', category: 'shoes', styles: ['casual', 'sporty'], colorNote: 'Чистый белый', emoji: '👟' },
  { key: 'heeled-boots', name: 'Ботильоны на каблуке', category: 'shoes', styles: ['bold', 'classic', 'romantic'], colorNote: 'Чёрная или красная кожа', emoji: '👢' },
  { key: 'silk-scarf', name: 'Шёлковый платок', category: 'accessory', styles: ['classic', 'romantic'], colorNote: 'Цветочный принт', emoji: '🧣' },
  { key: 'gold-hoops', name: 'Золотые серьги-кольца', category: 'accessory', styles: ['bold', 'classic', 'romantic'], colorNote: 'Тёплое золото', emoji: '💎' },
  { key: 'belt-bag', name: 'Поясная сумка', category: 'accessory', styles: ['sporty', 'casual', 'minimal'], colorNote: 'Пудровый нейл или кожа', emoji: '👜' },
];

export const styleInfo: Record<string, string> = {
  classic: 'Классика',
  casual: 'Кэжуал',
  romantic: 'Романтика',
  sporty: 'Спорт',
  minimal: 'Минимализм',
  bold: 'Смелый',
};

export const categoryInfo: Record<string, string> = {
  top: 'Верх',
  bottom: 'Низ',
  dress: 'Платья',
  outer: 'Верхняя одежда',
  shoes: 'Обувь',
  accessory: 'Аксессуары',
};

export const outfitOccasions = [
  { key: 'work', label: 'Работа', hint: 'Соберите спокойный силуэт: блуза + широкие брюки + лоферы.' },
  { key: 'weekend', label: 'Выходной', hint: 'Деним, кроссовки и мягкий кардиган — комфорт без потери стиля.' },
  { key: 'evening', label: 'Вечер', hint: 'Платье-комбинация, ботильоны и золотые акценты.' },
  { key: 'date', label: 'Свидание', hint: 'Романтичный образ: юбка в складку, шёлковый платок, мягкие тона.' },
];
