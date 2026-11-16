import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

export function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-blush-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin" />
        <p className="text-sm text-stone-500 font-medium tracking-wide">LOOKDAY</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <FullScreenLoader />;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
