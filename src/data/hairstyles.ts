export interface Hairstyle {
  key: string;
  name: string;
  category: 'short' | 'medium' | 'long' | 'updo';
  faceShapes: string[];
  hairTypes: string[];
  maintenance: 'low' | 'medium' | 'high';
  description: string;
  imageQuery: string;
}

export const hairstyles: Hairstyle[] = [
  { key: 'pixie', name: 'Пикси', category: 'short', faceShapes: ['oval', 'heart'], hairTypes: ['straight', 'wavy'], maintenance: 'low', description: 'Дерзкая короткая стрижка, открывающая лицо и подчёркивающая глаза и скулы.', imageQuery: 'woman pixie haircut' },
  { key: 'bob', name: 'Классическое каре', category: 'short', faceShapes: ['oval', 'square', 'round'], hairTypes: ['straight', 'wavy'], maintenance: 'medium', description: 'Гладкое каре до подбородка — универсальная стрижка, освежающая черты.', imageQuery: 'woman bob haircut' },
  { key: 'crop-fringe', name: 'Кроп с чёлкой', category: 'short', faceShapes: ['oval', 'long'], hairTypes: ['straight'], maintenance: 'low', description: 'Текстурный кроп с рваной чёлкой для смелого образа.', imageQuery: 'woman textured crop haircut' },
  { key: 'long-bob', name: 'Удлинённое боб-каре', category: 'medium', faceShapes: ['round', 'square', 'heart'], hairTypes: ['straight', 'wavy', 'curly'], maintenance: 'medium', description: 'Боб на уровне ключиц — вытягивает округлое лицо и смягчает квадратное.', imageQuery: 'woman long bob lob haircut' },
  { key: 'curtain-layers', name: 'Слои с чёлкой-шторкой', category: 'medium', faceShapes: ['round', 'square', 'long'], hairTypes: ['wavy', 'curly', 'straight'], maintenance: 'medium', description: 'Мягкие слои и чёлка-шторка обрамляют лицо и добавляют объём.', imageQuery: 'woman curtain bangs layers haircut' },
  { key: 'shag', name: 'Шэг', category: 'medium', faceShapes: ['oval', 'heart', 'long'], hairTypes: ['wavy', 'curly'], maintenance: 'low', description: 'Рваные многослойные края в стиле 70-х — эффектная лёгкость.', imageQuery: 'woman shag haircut' },
  { key: 'long-layers', name: 'Длинные слои', category: 'long', faceShapes: ['oval', 'round', 'square'], hairTypes: ['straight', 'wavy'], maintenance: 'high', description: 'Каскадные слои на длинных волосах — движение и объём без потери длины.', imageQuery: 'woman long layered hair' },
  { key: 'sleek-long', name: 'Гладкие длинные', category: 'long', faceShapes: ['oval', 'heart'], hairTypes: ['straight'], maintenance: 'high', description: 'Зеркально гладкие длинные волосы — элегантная классика.', imageQuery: 'woman long sleek straight hair' },
  { key: 'hollywood-waves', name: 'Голливудская волна', category: 'long', faceShapes: ['oval', 'square', 'long'], hairTypes: ['straight', 'wavy'], maintenance: 'high', description: 'Укладка боковыми волнами — вечерний гламур в стиле старого Голливуда.', imageQuery: 'woman hollywood waves hairstyle' },
  { key: 'ballerina-bun', name: 'Высокий пучок', category: 'updo', faceShapes: ['oval', 'round', 'heart', 'square', 'long'], hairTypes: ['straight', 'wavy', 'curly'], maintenance: 'low', description: 'Собранный высокий пучок — чистые линии, акцент на шею и скулы.', imageQuery: 'woman ballerina bun hairstyle' },
  { key: 'low-chignon', name: 'Низкой шиньон', category: 'updo', faceShapes: ['oval', 'square', 'long'], hairTypes: ['straight', 'wavy'], maintenance: 'low', description: 'Мягкий низкий пучок у шеи — романтично и уместно всегда.', imageQuery: 'woman low chignon hairstyle' },
  { key: 'braided-crown', name: 'Коса-корона', category: 'updo', faceShapes: ['oval', 'heart'], hairTypes: ['wavy', 'curly', 'straight'], maintenance: 'medium', description: 'Коса вокруг головы — нежная прическа для особых случаев.', imageQuery: 'woman braided crown hairstyle' },
];

export const faceShapeInfo: Record<string, string> = {
  oval: 'Овальное',
  round: 'Круглое',
  square: 'Квадратное',
  heart: 'Сердцевидное',
  long: 'Вытянутое',
};

export const hairTypeInfo: Record<string, string> = {
  straight: 'Прямые',
  wavy: 'Волнистые',
  curly: 'Кудрявые',
};
