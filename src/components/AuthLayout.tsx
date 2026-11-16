import { Link, Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blush-50 via-white to-rose-100 flex flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <Sparkles className="text-rose-500" size={26} />
        <span className="font-display text-3xl font-semibold text-stone-800 tracking-wide">LOOKDAY</span>
      </Link>
      <Outlet />
      <p className="mt-8 text-xs text-stone-400">© 2026 LOOKDAY · Ваш стиль начинается здесь</p>
    </div>
  );
}
