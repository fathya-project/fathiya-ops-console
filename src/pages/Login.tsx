import { useState } from 'react';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { hasSupabaseConfig, supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';
import { PublicLearningBadge } from '../components/AgenticLearningPanel';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasSupabaseConfig) {
      setError('بيئة تسجيل الدخول غير مربوطة حالياً. افتح /command-center لوضع التشغيل الآمن.');
      return;
    }

    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('بيانات الدخول غير صحيحة.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-gold-500/20 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 rounded-xl bg-ink-950 border border-gold-600/40 flex items-center justify-center">
              <Logo size={44} />
            </div>
          </div>
          <div className="font-mono text-[10px] tracking-[0.35em] text-gold-400/80 mb-1">FATHIYA · OPS</div>
          <div className="text-xl font-bold gold-gradient-text">المنشأة السيادية الذكية</div>
          <div className="font-mono text-[10px] tracking-[0.2em] text-gold-600/60 mt-1">SOVEREIGN INTELLIGENCE LAB</div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-gold-700/30 bg-ink-900/70 backdrop-blur overflow-hidden">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gold-700/20">
            <div className="w-7 h-7 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
              <Lock size={13} className="text-gold-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-100">تسجيل الدخول</div>
              <div className="font-mono text-[10px] text-gold-600/70 tracking-wider">SECURE ACCESS · AGENT RUNTIME</div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-ink-950 border border-gold-700/25 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/10 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-300 mb-1.5">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ink-950 border border-gold-700/25 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500/60 focus:ring-2 focus:ring-gold-500/10 transition"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-rose-300 bg-rose-500/8 border border-rose-500/20 rounded-lg px-3.5 py-2.5">
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 group relative inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:from-gold-200 hover:via-gold-300 hover:to-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold-600/20 hover:shadow-gold-400/30"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> جاري التحقق…</> : <><Lock size={15} /> دخول آمن</>}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-stone-600 mt-6">
          فتحية تنفذ العمل الداخلي عبر الوكلاء، وتطلب الموافقة فقط عندما يكون الإجراء حساسًا أو خارجيًا.
        </p>
        <PublicLearningBadge />
      </div>
    </div>
  );
}
