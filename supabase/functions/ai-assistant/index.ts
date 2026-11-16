// LOOKDAY AI Assistant — proxies a real LLM API with the user's style context.
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the caller is an authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Требуется вход в аккаунт' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const userId = userData.user.id;

    const { messages } = (await req.json()) as { messages?: ChatMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Пустой запрос' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    // Keep only the last 16 messages, validate shape
    const history: ChatMessage[] = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.length <= 4000)
      .slice(-16);

    // Build personalized system context from the user's own data (service role, bypass RLS read)
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    const [dnaRes, profileRes] = await Promise.all([
      admin.from('style_dna_results').select('archetype, color_palette, style_keywords').eq('user_id', userId).maybeSingle(),
      admin.from('profiles').select('display_name').eq('id', userId).maybeSingle(),
    ]);

    const archetypeNames: Record<string, string> = {
      classic: 'Икона классики', romantic: 'Нежная романтика', sporty: 'Энергичный спорт',
      bold: 'Смелый statement', minimal: 'Тихий минимализм',
    };

    let styleContext = 'Результаты теста Style DNA пока не заполнены.';
    if (dnaRes.data) {
      const a = archetypeNames[dnaRes.data.archetype] ?? dnaRes.data.archetype;
      styleContext = `Архетип: ${a}. Палитра: ${dnaRes.data.color_palette}. Ключевые слова: ${(dnaRes.data.style_keywords ?? []).join(', ')}.`;
    }
    const name = profileRes.data?.display_name || 'пользователь';

    const systemPrompt = `Ты — стилист-помощник платформы LOOKDAY. Тёплый, поддерживающий, даёшь конкретные практичные советы о стиле, причёсках, уходе и гардеробе. Отвечай ТОЛЬКО на русском языке, кратко (до 150 слов), дружелюбно, без оценок внешности и без требования фотографий. Персональный контекст: имя ${name}; ${styleContext} Никогда не давай медицинских диагнозов. Если вопрос не о стиле/красоте/уходе — вежливо верни разговор к теме стиля.`;

    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) {
      return new Response(
        JSON.stringify({ error: 'AI-провайдер не настроен: добавьте секрет OPENAI_API_KEY для этой функции' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: systemPrompt }, ...history],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error('LLM error', aiRes.status, errText.slice(0, 500));
      return new Response(JSON.stringify({ error: 'Сервис AI временно недоступен' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiJson = await aiRes.json();
    const reply = aiJson?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply) {
      return new Response(JSON.stringify({ error: 'Пустой ответ модели' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('assistant error', err);
    return new Response(JSON.stringify({ error: 'Внутренняя ошибка сервиса' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
