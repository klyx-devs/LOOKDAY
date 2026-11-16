import { Link } from 'react-router-dom';
import {
  Sparkles, Scissors, Shirt, Droplets, CalendarCheck, Bot,
  ArrowRight, Heart, Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const features = [
  { to: '/style-dna', icon: Sparkles, title: 'Style DNA', text: 'Тест из 8 вопросов определит ваш стилевой архетип, палитру и ключевые слова образа.' },
  { to: '/hair-studio', icon: Scissors, title: 'Hair Studio', text: 'Каталог причёсок с фильтрами по форме лица и типу волос, с персональными рекомендациями.' },
  { to: '/outfit-creator', icon: Shirt, title: 'Outfit Creator', text: 'Собирайте образы из каталога вещей под ваш стиль и сохраняйте их в гардероб.' },
  { to: '/care-planner', icon: Droplets, title: 'Care Planner', text: 'Индивидуальный план ухода с отметками выполнения каждый день.' },
  { to: '/challenge', icon: CalendarCheck, title: '30-Day Challenge', text: 'Месяц стилевых заданий с календарём прогресса и сохранением результатов.' },
  { to: '/assistant', icon: Bot, title: 'AI Assistant', text: 'Умный помощник, который отвечает на вопросы о стиле на основе вашего профиля.' },
];

export default function Home() {
  const { session, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blush-50 via-white to-rose-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-rose-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-rose-500" size={24} />
            <span className="font-display text-2xl font-semibold text-stone-800 tracking-wide">LOOKDAY</span>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link to="/dashboard" className="btn-primary !py-2.5">
                {profile?.display_name ? `Мой кабинет` : 'Личный кабинет'}
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary !py-2.5 hidden sm:inline-flex">Войти</Link>
                <Link to="/register" className="btn-primary !py-2.5">Начать</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-24 w-80 h-80 bg-blush-200/50 rounded-full blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-rose-200 px-4 py-1.5 text-xs font-semibold text-rose-600 shadow-sm">
            <Heart size={12} /> Персональный стилист онлайн
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-800 mt-6 leading-tight">
            Твой стиль.
            <br />
            <span className="bg-gradient-to-r from-rose-500 to-blush-600 bg-clip-text text-transparent">
              Твои правила.
            </span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-base sm:text-lg text-stone-500 leading-relaxed">
            LOOKDAY — платформа, которая узнаёт ваш стиль, подбирает причёски и образы,
            строит план ухода и ведёт вас к лучшей версии себя 30 дней подряд.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to={session ? '/dashboard' : '/register'} className="btn-primary !px-8 !py-3.5">
              {session ? 'В личный кабинет' : 'Создать аккаунт бесплатно'} <ArrowRight size={17} />
            </Link>
            <Link to="/style-dna" className="btn-secondary !px-8 !py-3.5">
              Узнать свой Style DNA
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-stone-500">
            {['Без оценок внешности', 'Фото только по желанию', 'Ваши данные — только ваши'].map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <Check size={15} className="text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ to, icon: Icon, title, text }, i) => (
            <Link
              key={to}
              to={to}
              className="card group p-6 hover:-translate-y-1"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-100 to-blush-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-xl text-stone-800 mt-4">{title}</h3>
              <p className="mt-2 text-sm text-stone-500 leading-relaxed">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-rose-600">
                Открыть <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-rose-100 bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-400">
          <span className="font-display text-lg text-stone-600">LOOKDAY</span>
          <span>© 2026 · Ваш стиль начинается здесь</span>
        </div>
      </footer>
    </div>
  );
}
