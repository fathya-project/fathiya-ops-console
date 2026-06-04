import { useMemo, useState } from 'react';
import {
  Brain,
  CheckCircle2,
  Cpu,
  Database,
  GitBranch,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  agenticLearningStatus,
  buildUnderstandingReceipt,
  type UnderstandingReceipt,
} from '../data/agenticLearning';

const RECEIPT_KEY = 'fathiya.learningReceipts.v1';

function loadReceipts(): UnderstandingReceipt[] {
  try {
    const raw = localStorage.getItem(RECEIPT_KEY);
    return raw ? (JSON.parse(raw) as UnderstandingReceipt[]) : [];
  } catch {
    return [];
  }
}

function saveReceipts(receipts: UnderstandingReceipt[]) {
  try {
    localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipts));
  } catch {
    /* ignore local persistence failures */
  }
}

export function PublicLearningBadge() {
  return (
    <div className="mt-4 rounded-xl border border-gold-700/25 bg-ink-900/55 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Brain size={15} className="text-gold-300 shrink-0" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-stone-100 truncate">Learning Core</div>
            <div className="font-mono text-[10px] text-gold-500/80 truncate">
              {agenticLearningStatus.status}
            </div>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-mono text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 pulse-dot" />
          ACTIVE
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-5 text-stone-400">
        الوكلاء يسترجعون المعرفة ويخططون وينفذون العمل الداخلي؛ التداول الحقيقي والفحص الحي والإجراءات الخارجية تنتظر الموافقة.
      </p>
    </div>
  );
}

export function AgenticLearningPanel() {
  const [receipts, setReceipts] = useState<UnderstandingReceipt[]>(loadReceipts);
  const latestReceipt = useMemo(
    () => receipts[receipts.length - 1] ?? buildUnderstandingReceipt(new Date('2026-06-03T00:00:00Z')),
    [receipts],
  );

  function runUnderstandingCheck() {
    const receipt = buildUnderstandingReceipt();
    setReceipts((prev) => {
      const next = [...prev.slice(-5), receipt];
      saveReceipts(next);
      return next;
    });
  }

  return (
    <section className="rounded-2xl border border-gold-700/30 bg-ink-900/55 overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 border-b border-gold-700/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gold-600/10 border border-gold-600/40 flex items-center justify-center shrink-0">
            <Brain size={18} className="text-gold-300" />
          </div>
          <div>
            <h2 className="text-base font-semibold gold-gradient-text">نواة التعلم والفهم</h2>
            <div className="font-mono text-[10px] text-gold-600/80 tracking-wider">
              LEARNING CORE · UNDERSTANDING GATE · {agenticLearningStatus.version}
            </div>
            <p className="mt-2 text-xs leading-6 text-stone-400 max-w-3xl">
              فتحية الآن تميّز بين المعرفة المحفوظة والفهم العملي: تولد فرضيات، تختبر التناقضات،
              وتحوّل التداول الحقيقي والفحص الأمني الحي إلى طابور الموافقة قبل التنفيذ.
            </p>
          </div>
        </div>

        <button
          onClick={runUnderstandingCheck}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gold-500/40 bg-gold-600/10 px-4 py-2.5 text-sm font-medium text-gold-200 hover:border-gold-400/70 hover:bg-gold-600/15 transition"
        >
          <RefreshCw size={15} />
          تشغيل فحص فهم
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
        <div className="p-6 border-b lg:border-b-0 lg:border-l border-gold-700/15">
          <div className="grid sm:grid-cols-2 gap-4">
            {agenticLearningStatus.agents.map((agent) => (
              <div key={agent.id} className="rounded-xl border border-gold-700/20 bg-ink-950/35 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] text-gold-500/80 tracking-wider truncate">
                      {agent.modelSlot}
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-stone-100">{agent.name}</h3>
                  </div>
                  <StatusPill status={agent.status === 'active' ? 'ACTIVE' : 'GUARDED'} />
                </div>
                <p className="mt-2 text-xs leading-5 text-stone-400">{agent.mission}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-stone-100">
              <ShieldCheck size={16} className="text-gold-300" />
              آخر إثبات فهم
            </div>
            <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-[11px] text-emerald-300">{latestReceipt.id}</div>
                <StatusPill status="PASSED" tone="emerald" />
              </div>
              <p className="mt-2 text-xs leading-5 text-stone-300">{latestReceipt.summary}</p>
            </div>
          </div>

          <div className="grid gap-2.5">
            {agenticLearningStatus.understandingChecks.map((check) => (
              <div key={check.id} className="flex items-start gap-2.5 text-xs text-stone-400">
                <CheckCircle2 size={14} className="mt-0.5 text-emerald-300 shrink-0" />
                <div>
                  <span className="text-stone-200">{check.name}</span>
                  <span className="text-stone-500"> · {check.verifies}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-1">
            <ToolChip icon={GitBranch} label="GitHub" value="connected" />
            <ToolChip icon={Zap} label="Zapier MCP" value="guarded" />
            <ToolChip icon={Cpu} label="OpenRouter" value="contract" />
            <ToolChip icon={Database} label="Receipts" value={`${Math.max(receipts.length, 1)} local`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolChip({ icon: Icon, label, value }: { icon: typeof GitBranch; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-gold-700/20 bg-ink-950/35 px-3 py-2">
      <Icon size={14} className="text-gold-300 shrink-0" />
      <div className="min-w-0">
        <div className="text-xs text-stone-200 truncate">{label}</div>
        <div className="font-mono text-[10px] text-gold-500/80 truncate">{value}</div>
      </div>
    </div>
  );
}

function StatusPill({ status, tone = 'gold' }: { status: string; tone?: 'gold' | 'emerald' }) {
  const classes = tone === 'emerald'
    ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
    : 'border-gold-600/25 bg-gold-600/10 text-gold-300';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-mono ${classes}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current pulse-dot" />
      {status}
    </span>
  );
}
