export interface DnaQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; scores: Record<string, number> }[];
}

export interface DnaArchetype {
  key: string;
  name: string;
  palette: string;
  keywords: string[];
  description: string;
}

// 8 questions, each option adds points to style axes:
// classic, romantic, sporty, bold, minimal
export const dnaQuestions: DnaQuestion[] = [
  {
    id: 'q1',
    question: 'Что вы чувствуете, открывая шкаф утром?',
    options: [
      { value: 'ready', label: 'Всё продумано — вещи сочетаются между собой', scores: { classic: 2 } },
      { value: 'mood', label: 'Одеваюсь по настроению, каждый день по-разному', scores: { bold: 2 } },
      { value: 'comfort', label: 'Главное — удобно и ничего не мешает', scores: { sporty: 2 } },
      { value: 'beauty', label: 'Хочу, чтобы образ был нежным и женственным', scores: { romantic: 2 } },
    ],
  },
  {
    id: 'q2',
    question: 'Какая палитра вам ближе?',
    options: [
      { value: 'neutral', label: 'Бежевый, белый, серый, чёрный', scores: { minimal: 2, classic: 1 } },
      { value: 'pastel', label: 'Пудровый, лавандовый, пудрово-розовый', scores: { romantic: 2 } },
      { value: 'bright', label: 'Фуксия, изумруд, яркий синий', scores: { bold: 2 } },
      { value: 'deep', label: 'Тёмно-синий, шоколад, бордо', scores: { classic: 2 } },
    ],
  },
  {
    id: 'q3',
    question: 'Ваш идеальный силуэт?',
    options: [
      { value: 'tailored', label: 'Приталенный, чёткие линии', scores: { classic: 2 } },
      { value: 'flowy', label: 'Струящийся, воздушный', scores: { romantic: 2 } },
      { value: 'oversized', label: 'Свободный, оверсайз', scores: { sporty: 1, minimal: 1 } },
      { value: 'statement', label: 'С акцентом — необычный крой, объёмные плечи', scores: { bold: 2 } },
    ],
  },
  {
    id: 'q4',
    question: 'Что для вас «удачная покупка»?',
    options: [
      { value: 'basic', label: 'Идеальная база, которая прослужит годы', scores: { classic: 1, minimal: 1 } },
      { value: 'unique', label: 'Вещь, которую ни у кого больше нет', scores: { bold: 2 } },
      { value: 'cozy', label: 'Мягкая, уютная, в которой как в обнимку', scores: { romantic: 1, sporty: 1 } },
      { value: 'versatile', label: 'Сочетается сразу со всем гардеробом', scores: { minimal: 2 } },
    ],
  },
  {
    id: 'q5',
    question: 'Ваш подход к аксессуарам?',
    options: [
      { value: 'few', label: 'Минимум: часы и тонкая цепочка', scores: { minimal: 2 } },
      { value: 'pearl', label: 'Жемчуг, изящные детали', scores: { romantic: 1, classic: 1 } },
      { value: 'statement', label: 'Крупные серьги, смелые украшения', scores: { bold: 2 } },
      { value: 'sport', label: 'Спортивные часы, рюкзак, кепка', scores: { sporty: 2 } },
    ],
  },
  {
    id: 'q6',
    question: 'Как вы готовитесь к важной встрече?',
    options: [
      { value: 'suit', label: 'Костюм или платье-футляр', scores: { classic: 2 } },
      { value: 'standout', label: 'Образ, который точно запомнят', scores: { bold: 2 } },
      { value: 'elegant', label: 'Струящееся платье и нежные оттенки', scores: { romantic: 2 } },
      { value: 'clean', label: 'Простой и безупречный минимализм', scores: { minimal: 2 } },
    ],
  },
  {
    id: 'q7',
    question: 'Выберите ткань для идеальной вещи:',
    options: [
      { value: 'wool', label: 'Плотная шерсть, держит форму', scores: { classic: 2 } },
      { value: 'silk', label: 'Шёлк, атлас, что-то струящееся', scores: { romantic: 2 } },
      { value: 'cotton', label: 'Дышащий хлопок, трикотаж', scores: { sporty: 1, casual: 1 } },
      { value: 'leather', label: 'Кожа, металлик, нестандартные фактуры', scores: { bold: 2 } },
    ],
  },
  {
    id: 'q8',
    question: 'Фраза, которая про вас:',
    options: [
      { value: ' timeless', label: '«Элегантность не выходит из моды»', scores: { classic: 2 } },
      { value: 'soft', label: '«Красота в нежности»', scores: { romantic: 2 } },
      { value: 'energy', label: '«Движение — моя форма красоты»', scores: { sporty: 2 } },
      { value: 'brave', label: '«Правила созданы, чтобы их нарушать»', scores: { bold: 2 } },
    ],
  },
];

export const dnaArchetypes: Record<string, DnaArchetype> = {
  classic: {
    key: 'classic', name: 'Икона классики', palette: 'Бежевый, белый, тёмно-синий, шоколад, бордо',
    keywords: ['элегантность', 'структура', 'вне времени', 'качество'],
    description: 'Вы выбираете вещи, которые служат годами и всегда выглядят безупречно. Ваша сила — в четких линиях, благородных тканях и сдержанной роскоши.',
  },
  romantic: {
    key: 'romantic', name: 'Нежная романтика', palette: 'Пудровый, лавандовый, жемчужный, пыльная роза',
    keywords: ['нежность', 'женственность', 'лёгкость', 'струящиеся ткани'],
    description: 'Ваш стиль — это воздух, мягкость и свет. Струящиеся ткани, нежные оттенки и изящные детали создают образ, в котором хочется растворяться.',
  },
  sporty: {
    key: 'sporty', name: 'Энергичный спорт', palette: 'Белый, графит, яркие акценты, деним',
    keywords: ['комфорт', 'динамика', 'свобода', 'функциональность'],
    description: 'Вы цените свободу движения и не жертвуете комфортом. Ваш гардероб — это продуманный кэжуал, где каждая вещь работает на вас.',
  },
  bold: {
    key: 'bold', name: 'СмелыйStatement', palette: 'Фуксия, изумруд, яркий синий, контрастный чёрный',
    keywords: ['смелость', 'индивидуальность', 'акцент', 'экспрессия'],
    description: 'Вы не боитесь внимания и используете моду как способ самовыражения. Необычный крой, яркие цвета и statement-детали — ваша территория.',
  },
  minimal: {
    key: 'minimal', name: 'Тихий минимализм', palette: 'Белый, серый, кремовый, графит',
    keywords: ['простота', 'качество', 'лаконичность', 'осознанность'],
    description: 'Ваш стиль говорит тихо, но уверенно. Идеальная посадка, чистые линии и ничего лишнего — в этом ваша сила.',
  },
};

export function computeDna(answers: Record<string, string>) {
  const scores: Record<string, number> = { classic: 0, romantic: 0, sporty: 0, bold: 0, minimal: 0 };
  for (const q of dnaQuestions) {
    const chosen = q.options.find((o) => o.value === (answers[q.id] || '').trim());
    if (chosen) {
      for (const [axis, pts] of Object.entries(chosen.scores)) {
        if (axis in scores) scores[axis] += pts;
      }
    }
  }
  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  return { archetype: top, scores };
}
