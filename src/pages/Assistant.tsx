import { useEffect, useRef, useState } from 'react';
import { Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const suggestions = [
  'Какие цвета мне подойдут?',
  'Собери образ на деловую встречу',
  'Как ухаживать за волосами зимой?',
  'Что надеть на свидание?',
];

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setSending(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ messages: nextMessages.slice(-16) }),
        }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error || 'Ассистент временно недоступен. Попробуйте позже.');
      } else if (typeof json?.reply === 'string' && json.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: json.reply }]);
      } else {
        setError('Получен неожиданный ответ. Попробуйте ещё раз.');
      }
    } catch {
      setError('Нет связи с ассистентом. Проверьте интернет и попробуйте снова.');
    }
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col lg:h-[calc(100vh-8.5rem)]">
      <div className="flex items-center gap-3 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-blush-600 flex items-center justify-center text-white">
          <Bot size={20} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-stone-800 leading-tight">AI Стилист</h1>
          <p className="text-xs text-stone-500">Советы с учётом вашего Style DNA</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto card p-4 sm:p-6 space-y-4">
        {messages.length === 0 && !sending && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center">
              <Sparkles size={24} className="text-rose-500" />
            </div>
            <div>
              <h3 className="font-display text-xl text-stone-800">Спросите стилиста</h3>
              <p className="mt-1 max-w-sm text-sm text-stone-500 leading-relaxed">
                Я знаю ваши результаты Style DNA и подскажу, что надеть и как ухаживать за собой.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm text-rose-700 transition-colors hover:bg-rose-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-600'
              }`}
            >
              {m.role === 'user' ? <UserIcon size={15} /> : <Bot size={15} />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-rose-500 text-white rounded-tr-sm'
                  : 'bg-rose-50 text-stone-800 rounded-tl-sm'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <Bot size={15} />
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-rose-50 px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-300 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.3s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="mt-3 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Спросите про стиль, уход или образ…"
          className="flex-1 rounded-xl border border-rose-100 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition-colors focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="btn-primary rounded-xl px-4 disabled:opacity-50"
          aria-label="Отправить"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
