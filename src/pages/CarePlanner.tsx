import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Droplets, Plus, Trash2, Check, Lock, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';

interface CareTask {
  id: string;
  category: string;
  title: string;
  description: string;
  frequency: string;
}

const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

const starterTasks = [
  { category: 'skin', title: 'Очищение кожи утром и вечером', description: 'Мягкое средство дважды в день', frequency: 'daily' },
  { category: 'skin', title: 'Увлажняющий крем', description: 'После каждого очищения', frequency: 'daily' },
  { category: 'hair', title: 'Расчёсывание с массажем головы', description: '2–3 минуты для кровообращения', frequency: 'daily' },
  { category: 'body', title: 'Вода — 8 стаканов', description: 'Гидратация изнутри', frequency: 'daily' },
  { category: 'hair', title: 'Маска для волос', description: 'Глубокое питание', frequency: 'weekly' },
];

export default function CarePlanner() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState<CareTask[]>([]);
  const [completions, setCompletions] = useState<Record<string, Set<string>>>({}); // taskId -> set of dates
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const dow = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - dow);
    return d;
  });
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('skin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    (async () => {
      const [{ data: t }, { data: c }] = await Promise.all([
        supabase.from('care_tasks').select('*').order('sort_order'),
        supabase.from('care_task_completions').select('task_id, completed_on')
          .gte('completed_on', isoDate(new Date(Date.now() - 30 * 864e5))),
      ]);
      if (!t || t.length === 0) {
        // seed starter plan
        const { data: seeded } = await supabase
          .from('care_tasks')
          .insert(starterTasks.map((s, i) => ({ ...s, sort_order: i })))
          .select();
        setTasks(seeded || []);
      } else {
        setTasks(t);
      }
      const map: Record<string, Set<string>> = {};
      for (const row of c || []) {
        if (!map[row.task_id]) map[row.task_id] = new Set();
        map[row.task_id].add(row.completed_on);
      }
      setCompletions(map);
      setLoading(false);
    })();
  }, [session]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [weekStart]);

  const isDone = (taskId: string, date: Date) => completions[taskId]?.has(isoDate(date)) ?? false;

  const toggle = async (taskId: string, date: Date) => {
    if (!session) return;
    const ds = isoDate(date);
    const done = isDone(taskId, date);
    if (done) {
      await supabase.from('care_task_completions').delete().eq('task_id', taskId).eq('completed_on', ds);
      setCompletions((prev) => {
        const next = { ...prev, [taskId]: new Set(prev[taskId]) };
        next[taskId].delete(ds);
        return next;
      });
    } else {
      await supabase.from('care_task_completions').insert({ task_id: taskId, completed_on: ds });
      setCompletions((prev) => {
        const next = { ...prev, [taskId]: new Set(prev[taskId]) };
        next[taskId].add(ds);
        return next;
      });
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newTitle.trim()) return;
    const { data } = await supabase
      .from('care_tasks')
      .insert({ title: newTitle.trim(), category: newCategory, frequency: 'daily', sort_order: tasks.length })
      .select()
      .maybeSingle();
    if (data) {
      setTasks((prev) => [...prev, data]);
      setNewTitle('');
    }
  };

  const deleteTask = async (id: string) => {
    await supabase.from('care_tasks').delete().eq('id', id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const today = new Date();
  const todayIs = isoDate(today);
  const doneToday = tasks.filter((t) => isDone(t.id, today)).length;

  if (!session) {
    return (
      <div className="max-w-md mx-auto card p-8 text-center page-enter">
        <Droplets className="mx-auto text-rose-400" size={40} />
        <h1 className="font-display text-2xl mt-4">Care Planner</h1>
        <p className="mt-2 text-sm text-stone-500">Войдите, чтобы построить свой план ухода и отмечать выполнение.</p>
        <Link to="/login" className="btn-primary mt-6 w-full"><Lock size={15} /> Войти</Link>
      </div>
    );
  }

  if (loading) return <div className="py-24 text-center text-stone-400">Загружаем план…</div>;

  return (
    <div className="space-y-8 page-enter">
      <header>
        <h1 className="font-display text-3xl text-stone-800 flex items-center gap-3">
          <Droplets className="text-rose-500" size={28} /> Care Planner
        </h1>
        <p className="mt-1.5 text-sm text-stone-500 max-w-xl leading-relaxed">
          Индивидуальный план ухода. Отмечайте выполнение — прогресс сохраняется и помогает видеть результат.
        </p>
      </header>

      {/* Today's summary */}
      <section className="card p-5 flex items-center justify-between gap-4 bg-gradient-to-r from-white to-blush-50">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Сегодня</p>
          <p className="font-display text-xl text-stone-800 mt-0.5">
            {doneToday} из {tasks.length} задач{doneToday === tasks.length && tasks.length > 0 ? ' — всё выполнено!' : ''}
          </p>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-rose-100 flex items-center justify-center shrink-0">
          <span className="font-display text-lg text-rose-600">
            {tasks.length ? Math.round((doneToday / tasks.length) * 100) : 0}%
          </span>
        </div>
      </section>

      {/* Week grid */}
      <section className="card p-4 sm:p-5 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-stone-700 flex items-center gap-2 text-sm">
            <CalendarDays size={15} className="text-rose-500" /> Неделя
          </h3>
          <div className="flex gap-1">
            <button onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); }}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400"><ChevronLeft size={18} /></button>
            <button onClick={() => setWeekStart((() => { const d = new Date(); const dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); return d; })())}
              className="px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg">Сегодня</button>
            <button onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); }}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400"><ChevronRight size={18} /></button>
          </div>
        </div>
        <table className="w-full min-w-[560px]">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-stone-400 pb-2">Задача</th>
              {weekDays.map((d, i) => (
                <th key={i} className={`pb-2 text-xs font-medium w-12 ${isoDate(d) === todayIs ? 'text-rose-600' : 'text-stone-400'}`}>
                  {dayNames[i]}<br /><span className="text-[10px]">{d.getDate()}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => (
              <tr key={t.id} className="border-t border-rose-50">
                <td className="py-2.5 pr-3">
                  <p className="text-sm font-medium text-stone-700">{t.title}</p>
                  {t.description && <p className="text-xs text-stone-400">{t.description}</p>}
                </td>
                {weekDays.map((d, i) => {
                  const future = isoDate(d) > todayIs;
                  return (
                    <td key={i} className="text-center py-2.5">
                      <button
                        onClick={() => !future && toggle(t.id, d)}
                        disabled={future}
                        className={`w-7 h-7 rounded-full border-2 inline-flex items-center justify-center transition-all ${
                          isDone(t.id, d)
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : future
                            ? 'border-stone-100 bg-stone-50 cursor-default'
                            : 'border-rose-200 hover:border-rose-400 bg-white'
                        }`}
                      >
                        {isDone(t.id, d) && <Check size={13} strokeWidth={3} />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Add task */}
      <section className="card p-5">
        <h3 className="font-semibold text-stone-700 text-sm mb-3 flex items-center gap-2">
          <Plus size={15} className="text-rose-500" /> Добавить задачу
        </h3>
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3">
          <input className="input flex-1" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Например, вечерний крем для рук" required />
          <select className="input sm:w-40" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
            <option value="skin">Кожа</option>
            <option value="hair">Волосы</option>
            <option value="body">Тело</option>
            <option value="general">Другое</option>
          </select>
          <button type="submit" className="btn-primary shrink-0">Добавить</button>
        </form>
      </section>

      {/* Task management */}
      {tasks.length > 0 && (
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-400 mb-3">Мои задачи</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {tasks.map((t) => (
              <div key={t.id} className="card p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{t.title}</p>
                  <span className="text-[11px] font-medium text-rose-500">
                    {{ skin: 'Кожа', hair: 'Волосы', body: 'Тело', general: 'Другое' }[t.category] || t.category}
                  </span>
                </div>
                <button onClick={() => deleteTask(t.id)} className="p-2 rounded-lg text-stone-300 hover:text-red-500 transition-colors" title="Удалить">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
