import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import {
  Home, Sparkles, Scissors, Shirt, Droplets, CalendarCheck, Bot,
  Heart, Settings, User as UserIcon, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Личный кабинет', icon: Home },
  { to: '/style-dna', label: 'Style DNA', icon: Sparkles },
  { to: '/hair-studio', label: 'Hair Studio', icon: Scissors },
  { to: '/outfit-creator', label: 'Outfit Creator', icon: Shirt },
  { to: '/care-planner', label: 'Care Planner', icon: Droplets },
  { to: '/challenge', label: '30-Day Challenge', icon: CalendarCheck },
  { to: '/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/favorites', label: 'Избранное', icon: Heart },
  { to: '/profile', label: 'Профиль', icon: UserIcon },
  { to: '/settings', label: 'Настройки', icon: Settings },
];

export default function AppLayout() {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link to="/dashboard" className="flex items-center gap-2 px-6 py-6" onClick={() => setOpen(false)}>
        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-400 to-blush-600 flex items-center justify-center text-white font-bold">L</span>
        <span className="font-display text-2xl font-semibold text-stone-800 tracking-wide">LOOKDAY</span>
      </Link>
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-rose-100 text-rose-700 shadow-sm'
                  : 'text-stone-600 hover:bg-rose-50 hover:text-rose-600'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-rose-100 p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-rose-200 flex items-center justify-center overflow-hidden shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserIcon size={16} className="text-rose-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-stone-800">
              {profile?.display_name || 'Гость'}
            </p>
            <p className="truncate text-xs text-stone-400">{profile?.email}</p>
          </div>
          <button onClick={handleSignOut} title="Выйти" className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-rose-50">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-white/90 backdrop-blur border-b border-rose-100 px-4 py-3">
        <button onClick={() => setOpen(true)} className="p-2 -ml-2 rounded-lg text-stone-600 hover:bg-rose-50">
          <Menu size={22} />
        </button>
        <Link to="/dashboard" className="font-display text-xl font-semibold">LOOKDAY</Link>
        <Link to="/profile" className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center overflow-hidden">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <UserIcon size={14} className="text-rose-600" />
          )}
        </Link>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-stone-900/40" onClick={() => setOpen(false)} />
          <aside className="relative w-72 max-w-[85%] bg-white shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-5 right-4 p-1.5 rounded-lg text-stone-400 hover:bg-rose-50">
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white/80 backdrop-blur border-r border-rose-100 z-30">
        {sidebar}
      </aside>

      <main className="lg:pl-64">
        <div className="page-enter mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 py-6 lg:py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
