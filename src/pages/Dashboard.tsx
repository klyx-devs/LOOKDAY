import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles, Scissors, Shirt, Droplets, CalendarCheck, Bot,
  ArrowRight, User as UserIcon,
} from 'lucide-react';

const modules = [
  { to: '/style-dna', icon: Sparkles, title: 'Style DNA', desc: 'Ваш стилевой архетип и палитра', tint: 'from-rose-100 to-blush-100 text-rose-600' },
  { to: '/hair-studio', icon: Scissors, title: 'Hair Studio', desc: 'Причёски под вашу форму лица', tint: 'from-amber-100 to-rose-100 text-amber-700' },
  { to: '/outfit-creator', icon: Shirt, title: 'Outfit Creator', desc: 'Соберите образ на любой случай', tint: 'from-sky-100 to-rose-100 text-sky-700' },
  { to: '/care-planner', icon: Droplets, title: 'Care Planner', desc: 'План ухода на каждый день', tint: 'from-teal-100 to-sky-100 text-teal-700' },
  { to: '/challenge', icon: CalendarCheck, title: '30-Day Challenge', desc: 'Месяц стилевых заданий', tint: 'from-violet-100 to-rose-100 text-violet-700' },
  { to: '/assistant', icon: Bot, title: 'AI Assistant', desc: 'Советы по стилю в чате', tint: 'from-blush-100 to-rose-200 text-blush-700' },
];

export default function Dashboard() {
  const { profile } = useAuth();
  const [challengeCount, setChallengeCount] = useState(0);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    (async () => {
      const { count: c1 } = await supabase.from('challenge_progress').select('*', { count: 'exact', head: true });
      const { count: c2 } = await supabase.from('favorites').select('*', { count: 'exact', head: true });
      setChallengeCount(c1 ?? 0);
      setFavCount(c2 ?? 0);
    })();
  }, []);

  const firstName = profile?.display_name?.split(' ')[0] || 'красавица';
  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 6 ? 'Доброй ночи' : greetingHour < 12 ? 'Доброе утро' : greetingHour < 18 ? 'Добрый день' : 'Добрый вечер';

  return (
    <div className="space-y-8">
      <section className="card relative overflow-hidden p-8 bg-gradient-to-br from-white via-blush-50 to-rose-100">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-200/50 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm text-stone-500">{greeting},</p>
          <h1 className="font-display text-3xl lg:text-4xl text-stone-800 mt-1">{firstName}!</h1>
          <p className="mt-3 max-w-xl text-sm text-stone-500 leading-relaxed">
            {profile?.style_dna_completed
              ? 'Ваш Style DNA готов — продолжайте исследовать модули и собирать любимые образы.'
              : 'Начните с теста Style DNA — так все рекомендации станут персональными.'}
          </p>
          {!profile?.style_dna_completed && (
            <Link to="/style-dna" className="btn-primary mt-5">
              Пройти Style DNA <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-stone-800 mb-4">Модули платформы</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ to, icon: Icon, title, desc, tint }) => (
            <Link key={to} to={to} className="card group p-5 hover:-translate-y-1">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center ${tint} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <h3 className="mt-3 font-semibold text-stone-800">{title}</h3>
              <p className="mt-1 text-sm text-stone-500">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-stone-500">Дней челленджа пройдено</p>
          <p className="font-display text-3xl text-rose-600 mt-1">{challengeCount} <span className="text-lg text-stone-400">/ 30</span></p>
          <Link to="/challenge" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700">
            Продолжить <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm text-stone-500">В избранном</p>
          <p className="font-display text-3xl text-rose-600 mt-1">{favCount}</p>
          <Link to="/favorites" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-rose-600 hover:text-rose-700">
            Смотреть <ArrowRight size={14} />
          </Link>
        </div>
        <div className="card p-5">
          <p className="text-sm text-stone-500">Профиль</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={18} className="text-rose-500" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-stone-800 truncate">{profile?.display_name || 'Заполните профиль'}</p>
              <Link to="/profile" className="text-sm font-semibold text-rose-600 hover:text-rose-700">Редактировать</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
