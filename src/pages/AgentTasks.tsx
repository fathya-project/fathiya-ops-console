import type { Session } from '@supabase/supabase-js';
import {
  Activity,
  AlertCircle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  Loader2,
  Play,
  RefreshCw,
  ShieldAlert,
  Square,
} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { agentApi } from '../lib/agent-api';
import type {
  AgentRiskClass,
  AgentTask,
  AgentTaskDetail,
  AgentTaskStatus,
  View,
} from '../types';

const ACTIVE = new Set<AgentTaskStatus>(['queued', 'running', 'awaiting_approval', 'stalled']);

const STATUS_LABELS: Record<AgentTaskStatus, string> = {
  queued: 'في الطابور',
  running: 'قيد التنفيذ',
  awaiting_approval: 'بانتظار الموافقة',
  completed: 'مكتملة',
  failed: 'فشلت',
  stalled: 'متوقفة',
  canceled: 'ملغاة',
};

export function AgentTasks({
  session,
  onNavigate,
}: {
  session?: Session | null;
  onNavigate: (view: View) => void;
}) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AgentTaskDetail | null>(null);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    if (!session) return;
    try {
      const data = await agentApi<{ tasks: AgentTask[] }>(session, '/api/agent/tasks');
      setTasks(data.tasks);
      setSelectedId((current) => current ?? data.tasks[0]?.id ?? null);
      setError('');
    } catch (loadError) {
      setError(String(loadError));
    }
  }, [session]);

  const loadDetail = useCallback(async () => {
    if (!session || !selectedId) {
      setDetail(null);
      return;
    }
    try {
      const data = await agentApi<AgentTaskDetail>(session, `/api/agent/tasks/${selectedId}`);
      setDetail(data);
      setTasks((current) => current.map((task) => (task.id === data.task.id ? data.task : task)));
      setError('');
    } catch (loadError) {
      setError(String(loadError));
    }
  }, [selectedId, session]);

  useEffect(() => {
    if (!session) return;
    void loadTasks();
    const timer = window.setInterval(() => void loadTasks(), 5000);
    return () => window.clearInterval(timer);
  }, [loadTasks, session]);

  useEffect(() => {
    if (!session || !selectedId) return;
    void loadDetail();
    const timer = window.setInterval(() => void loadDetail(), 2000);
    return () => window.clearInterval(timer);
  }, [loadDetail, selectedId, session]);

  async function createTask(event: FormEvent) {
    event.preventDefault();
    if (!session || !prompt.trim()) return;
    setCreating(true);
    setError('');
    try {
      const data = await agentApi<{ task: AgentTask }>(session, '/api/agent/tasks', {
        method: 'POST',
        body: JSON.stringify({ prompt: prompt.trim(), title: title.trim() || undefined }),
      });
      setPrompt('');
      setTitle('');
      setSelectedId(data.task.id);
      await loadTasks();
    } catch (createError) {
      setError(String(createError));
    } finally {
      setCreating(false);
    }
  }

  async function taskAction(action: 'approve' | 'cancel') {
    if (!session || !selectedId) return;
    setActing(true);
    setError('');
    try {
      await agentApi(session, `/api/agent/tasks/${selectedId}/${action}`, { method: 'POST' });
      await Promise.all([loadTasks(), loadDetail()]);
    } catch (actionError) {
      setError(String(actionError));
    } finally {
      setActing(false);
    }
  }

  const activeCount = useMemo(
    () => tasks.filter((task) => ACTIVE.has(task.status)).length,
    [tasks],
  );

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-6 pt-20 pb-16">
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-8 text-center">
          <ShieldAlert size={28} className="mx-auto mb-4 text-amber-400" />
          <h1 className="text-xl font-semibold text-stone-100 mb-2">تسجيل الدخول مطلوب</h1>
          <p className="text-sm text-stone-400 mb-5">
            افتح الموقع من المسار الرئيسي وسجّل الدخول لإرسال المهام ومشاهدة الإيصالات.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 rounded-md border border-gold-600/30 px-4 py-2 text-sm text-gold-200 hover:border-gold-400/60 transition"
          >
            <ChevronRight size={15} />
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
            <Bot size={14} />
            LOCAL AGENT RUNTIME · CONTROL PLANE
          </div>
          <h1 className="text-3xl font-bold gold-gradient-text mb-2">مهام وكلاء فتحية</h1>
          <p className="text-sm text-stone-400 max-w-2xl leading-7">
            أرسل العمل للمشغّل المحلي، تابع heartbeat والتقدم، واعتمد الإجراءات الحساسة فقط.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Metric label="نشطة" value={String(activeCount)} />
          <Metric label="الإجمالي" value={String(tasks.length)} />
          <button
            onClick={() => void loadTasks()}
            aria-label="تحديث المهام"
            className="w-10 h-10 rounded-md border border-gold-700/30 text-gold-300 flex items-center justify-center hover:border-gold-500/60 transition"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs text-rose-200 break-all">
          <AlertCircle size={15} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="rounded-xl border border-gold-700/25 bg-ink-900/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gold-700/20">
              <h2 className="text-sm font-semibold text-stone-100">مهمة جديدة</h2>
              <p className="text-[11px] text-stone-500 mt-1">
                الملفات والمستودعات المملوكة تبدأ تلقائيًا. المال والفحص الحي والحذف والنشر تنتظر الموافقة.
              </p>
            </div>
            <form className="p-5 space-y-4" onSubmit={createTask}>
              <label className="block">
                <span className="block text-xs text-stone-300 mb-1.5">العنوان</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={120}
                  placeholder="اختياري"
                  className="w-full rounded-lg border border-gold-700/25 bg-ink-950 px-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500/60"
                />
              </label>
              <label className="block">
                <span className="block text-xs text-stone-300 mb-1.5">الطلب</span>
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  maxLength={20_000}
                  rows={6}
                  required
                  placeholder="مثال: اعرض حالة المستودع وسجل إيصال التنفيذ"
                  className="w-full resize-y rounded-lg border border-gold-700/25 bg-ink-950 px-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-gold-500/60"
                />
              </label>
              <button
                type="submit"
                disabled={creating || !prompt.trim()}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 px-4 py-2.5 text-sm font-semibold text-ink-950 disabled:opacity-50"
              >
                {creating ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
                إرسال للمشغّل
              </button>
            </form>
          </section>

          <section className="rounded-xl border border-gold-700/25 bg-ink-900/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-gold-700/20">
              <h2 className="text-sm font-semibold text-stone-100">الطابور</h2>
            </div>
            <div className="max-h-[540px] overflow-y-auto divide-y divide-gold-700/15">
              {tasks.length === 0 ? (
                <p className="p-8 text-center text-xs text-stone-500">لا توجد مهام بعد.</p>
              ) : tasks.map((task) => (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => setSelectedId(task.id)}
                  className={`w-full p-4 text-right transition hover:bg-gold-600/5 ${
                    selectedId === task.id ? 'bg-gold-600/8' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-stone-100 line-clamp-2">{task.title}</span>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="h-1 rounded-full bg-ink-950 overflow-hidden mb-2">
                    <div className="h-full bg-gold-400 transition-all" style={{ width: `${task.progress}%` }} />
                  </div>
                  <p className="truncate text-[10px] text-stone-500">{task.current_step || 'لم يبدأ'}</p>
                </button>
              ))}
            </div>
          </section>
        </aside>

        <TaskDetail
          detail={detail}
          acting={acting}
          onApprove={() => void taskAction('approve')}
          onCancel={() => void taskAction('cancel')}
        />
      </div>
    </div>
  );
}

function TaskDetail({
  detail,
  acting,
  onApprove,
  onCancel,
}: {
  detail: AgentTaskDetail | null;
  acting: boolean;
  onApprove: () => void;
  onCancel: () => void;
}) {
  if (!detail) {
    return (
      <div className="min-h-[520px] rounded-xl border border-gold-700/20 bg-ink-900/40 flex items-center justify-center">
        <div className="text-center text-stone-500">
          <Activity size={28} className="mx-auto mb-3" />
          <p className="text-sm">اختر مهمة لعرض تقدمها وإيصالاتها.</p>
        </div>
      </div>
    );
  }

  const { task, events, receipts } = detail;
  return (
    <div className="space-y-5 min-w-0">
      <section className="rounded-xl border border-gold-700/25 bg-ink-900/60 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <StatusBadge status={task.status} />
              <RiskBadge risk={task.risk_class} />
            </div>
            <h2 className="text-lg font-semibold text-stone-100 break-words">{task.title}</h2>
            <p className="mt-2 text-xs text-stone-400 whitespace-pre-wrap leading-6">{task.prompt}</p>
          </div>
          <div className="flex items-center gap-2">
            {task.status === 'awaiting_approval' && (
              <button
                onClick={onApprove}
                disabled={acting}
                className="inline-flex items-center gap-2 rounded-md border border-gold-500/40 bg-gold-600/10 px-3 py-2 text-xs text-gold-200 disabled:opacity-50"
              >
                {acting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                موافقة
              </button>
            )}
            {ACTIVE.has(task.status) && (
              <button
                onClick={onCancel}
                disabled={acting}
                className="inline-flex items-center gap-2 rounded-md border border-rose-500/30 px-3 py-2 text-xs text-rose-200 disabled:opacity-50"
              >
                <Square size={13} />
                إلغاء
              </button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3 text-xs mb-2">
            <span className="text-stone-300">{task.current_step || 'لم يبدأ'}</span>
            <span className="font-mono text-gold-300">{task.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-ink-950 overflow-hidden">
            <div className="h-full bg-gold-400 transition-all" style={{ width: `${task.progress}%` }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <Info label="المشغّل" value={task.worker_id || 'لم يُستلم'} />
          <Info label="آخر heartbeat" value={formatDate(task.last_heartbeat_at)} />
          <Info label="بدأت" value={formatDate(task.started_at)} />
        </div>
        {task.error_message && (
          <div className="mt-4 rounded-lg border border-rose-500/25 bg-rose-500/5 p-3 text-xs text-rose-200">
            {task.error_message}
          </div>
        )}
      </section>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="rounded-xl border border-gold-700/25 bg-ink-900/60 overflow-hidden">
          <PanelTitle icon={<Clock3 size={14} />} title="سجل التقدم" />
          <div className="max-h-[430px] overflow-y-auto p-5 space-y-4">
            {events.length === 0 ? (
              <p className="text-xs text-stone-500">لا توجد أحداث بعد.</p>
            ) : events.map((event) => (
              <div key={event.id} className="border-b border-gold-700/15 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs text-stone-200 leading-5">{event.message}</p>
                  <span className="text-[9px] text-stone-600 shrink-0">{formatDate(event.created_at)}</span>
                </div>
                <p className="mt-1 text-[10px] font-mono text-gold-600/80">
                  {event.step || event.event_type}
                  {event.progress !== null ? ` · ${event.progress}%` : ''}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gold-700/25 bg-ink-900/60 overflow-hidden">
          <PanelTitle icon={<FileCheck2 size={14} />} title="الإيصالات والنتيجة" />
          <div className="max-h-[430px] overflow-y-auto p-5 space-y-4">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="rounded-lg border border-gold-600/25 bg-gold-600/5 p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] text-gold-300">{receipt.receipt_id}</span>
                  <span className="text-[9px] font-mono text-stone-500">{receipt.status}</span>
                </div>
                <p className="text-xs text-stone-300 whitespace-pre-wrap leading-5">{receipt.summary}</p>
                <JsonBlock value={receipt.evidence} />
              </div>
            ))}
            {task.result !== null && (
              <div>
                <p className="text-xs font-semibold text-stone-200 mb-2">النتيجة النهائية</p>
                <JsonBlock value={task.result} />
              </div>
            )}
            {receipts.length === 0 && task.result === null && (
              <p className="text-xs text-stone-500">سيظهر الإيصال هنا بعد اكتمال التنفيذ والتقييم.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-16 rounded-md border border-gold-700/25 bg-ink-900/60 px-3 py-2 text-center">
      <div className="font-mono text-sm text-gold-300">{value}</div>
      <div className="text-[9px] text-stone-500">{label}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-gold-700/15 bg-ink-950/50 p-3">
      <div className="text-[9px] text-stone-500 mb-1">{label}</div>
      <div className="text-[10px] text-stone-300 break-all">{value}</div>
    </div>
  );
}

function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-4 border-b border-gold-700/20 text-sm font-semibold text-stone-100">
      <span className="text-gold-400">{icon}</span>
      {title}
    </div>
  );
}

function JsonBlock({ value }: { value: unknown }) {
  return (
    <pre dir="ltr" className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-md border border-gold-700/15 bg-ink-950/70 p-3 text-left font-mono text-[9px] text-stone-400">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function StatusBadge({ status }: { status: AgentTaskStatus }) {
  const tone: Record<AgentTaskStatus, string> = {
    queued: 'border-gold-600/30 bg-gold-600/10 text-gold-300',
    running: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    awaiting_approval: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
    completed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    failed: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
    stalled: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    canceled: 'border-stone-600/30 bg-stone-700/20 text-stone-400',
  };
  return <span className={`shrink-0 rounded border px-2 py-0.5 text-[9px] font-mono ${tone[status]}`}>{STATUS_LABELS[status]}</span>;
}

function RiskBadge({ risk }: { risk: AgentRiskClass }) {
  const labels: Record<AgentRiskClass, string> = {
    internal_owned: 'داخلي مملوك',
    financial: 'مالي',
    live_security: 'فحص أمني حي',
    destructive: 'حذف أو تدمير',
    external: 'إجراء خارجي',
  };
  return <span className="rounded border border-stone-700 bg-stone-800/30 px-2 py-0.5 text-[9px] font-mono text-stone-400">{labels[risk]}</span>;
}

function formatDate(value: string | null) {
  if (!value) return '--';
  return new Intl.DateTimeFormat('ar-SA', { dateStyle: 'short', timeStyle: 'medium' }).format(new Date(value));
}
