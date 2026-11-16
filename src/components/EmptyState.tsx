import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  action?: string;
  to?: string;
}

export default function EmptyState({ title, subtitle, action, to }: Props) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-2xl">✦</div>
      <h3 className="font-display text-xl text-stone-800">{title}</h3>
      {subtitle && <p className="max-w-sm text-sm text-stone-500 leading-relaxed">{subtitle}</p>}
      {to && action && (
        <Link to={to} className="btn-primary mt-2">
          {action}
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
