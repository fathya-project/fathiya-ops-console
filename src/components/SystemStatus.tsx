import { Activity, Github, Workflow, Zap, Cpu, Bug, Server, Lock, ShieldCheck, ListChecks } from 'lucide-react';

type Status = 'active' | 'mock' | 'connected-guarded' | 'disconnected' | 'draft' | 'blueprint';

const statusStyles: Record<Status, { label: string; dot: string; text: string; bg: string }> = {
  active: { label: 'Active', dot: 'bg-gold-300', text: 'text-gold-200', bg: 'bg-gold-600/10 border-gold-600/30' },
  mock: { label: 'Local Mock', dot: 'bg-gold-400', text: 'text-gold-300', bg: 'bg-gold-600/10 border-gold-600/20' },
  'connected-guarded': { label: 'Connected · Guarded', dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20' },
  disconnected: { label: 'Not Connected', dot: 'bg-stone-500', text: 'text-stone-400', bg: 'bg-stone-700/20 border-stone-700/50' },
  draft: { label: 'Draft Only', dot: 'bg-amber-400', text: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20' },
  blueprint: { label: 'Blueprint Only', dot: 'bg-stone-500', text: 'text-stone-400', bg: 'bg-stone-700/20 border-stone-700/50' },
};

const items: { icon: typeof Server; name: string; sub: string; status: Status }[] = [
  { icon: Server, name: 'Frontend', sub: 'واجهة المستخدم', status: 'active' },
  { icon: Cpu, name: 'Intelligence Engine', sub: 'محرك التحليل المحلي', status: 'active' },
  { icon: ShieldCheck, name: 'Quality Gate', sub: 'بوابة التحقق', status: 'active' },
  { icon: Cpu, name: 'Understanding Gate', sub: 'فحص الفهم لا الحفظ', status: 'active' },
  { icon: Activity, name: 'Bridge Layer', sub: 'طبقة الجسر', status: 'mock' },
  { icon: ListChecks, name: 'Approval Queue', sub: 'طابور الموافقة', status: 'active' },
  { icon: Bug, name: 'Bug Bounty Engine', sub: 'محرك مكافآت الثغرات', status: 'mock' },
  { icon: Cpu, name: 'OpenRouter Routing', sub: 'عقود نماذج متعددة', status: 'connected-guarded' },
  { icon: Workflow, name: 'n8n', sub: 'أتمتة سير العمل', status: 'blueprint' },
  { icon: Github, name: 'GitHub', sub: 'تكامل المستودعات', status: 'connected-guarded' },
  { icon: Zap, name: 'Zapier', sub: 'تكامل محمي', status: 'connected-guarded' },
  { icon: Lock, name: 'Execution Mode', sub: 'وضع التنفيذ', status: 'draft' },
];

export function SystemStatus() {
  return (
    <section className="rounded-2xl border border-gold-700/30 bg-ink-900/50 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gold-700/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
            <Activity size={15} className="text-gold-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold gold-gradient-text">حالة النظام</h2>
            <div className="font-mono text-[10px] text-gold-600/80 tracking-wider">SYSTEM STATUS · BRIDGE LAYER v0</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-gold-400/80">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-300 pulse-dot" />
          LIVE
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 divide-x divide-y divide-gold-700/10 [direction:ltr]">
        {items.map((it) => {
          const s = statusStyles[it.status];
          return (
            <div key={it.name} className="p-4 [direction:rtl]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-ink-800/60 border border-gold-700/20 flex items-center justify-center shrink-0">
                    <it.icon size={14} className="text-gold-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-stone-100 truncate">{it.name}</div>
                    <div className="text-[11px] text-stone-500 truncate">{it.sub}</div>
                  </div>
                </div>
              </div>
              <div className={`mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-[11px] font-mono ${s.bg} ${s.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot} pulse-dot`} />
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
