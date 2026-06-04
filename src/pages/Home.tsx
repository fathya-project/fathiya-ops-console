import { LineChart, Bug, ArrowLeft, Activity, Lock, FlaskConical, ListChecks, Workflow, Bot } from 'lucide-react';
import type { View } from '../types';
import { SystemStatus } from '../components/SystemStatus';
import { RedZone } from '../components/RedZone';
import { ActivityLog } from '../components/ActivityLog';
import { Logo } from '../components/Logo';
import { AgenticLearningPanel } from '../components/AgenticLearningPanel';

export function Home({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
        <div className="mb-14 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500/20 blur-2xl rounded-full" />
              <div className="relative w-24 h-24 rounded-xl bg-ink-950 border border-gold-600/40 flex items-center justify-center">
                <Logo size={56} />
              </div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-gold-300/80 border border-gold-600/30 rounded-full px-4 py-1 mb-6 bg-gold-600/5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 pulse-dot" />
            SOVEREIGN OPS CONSOLE · INTELLIGENCE ENGINE v0
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gold-gradient-text tracking-tight leading-tight mb-2">
            المنشأة السيادية الذكية
          </h1>
          <div className="font-mono text-xs tracking-[0.3em] text-gold-600/80 mb-6">
            SOVEREIGN INTELLIGENCE LAB
          </div>
          <p className="text-stone-400 max-w-2xl mx-auto leading-relaxed">
            بوابة تشغيل للمحرك المحلي: تفهم المعرفة، تخطط، تنفّذ العمل الداخلي، وتصدر إيصالات قابلة للمراجعة.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <ModuleCard
            tag="MODULE · 01"
            title="استخبارات السوق"
            subtitle="Market Intel Engine v0"
            description="محرك استخبارات محلي يبني السيناريوهات وشروط الإبطال وإشارات المراقبة، ثم يمرر العمل القابل للتنفيذ إلى الوكلاء."
            icon={LineChart}
            stats={[
              { label: 'Quality Gate', value: 'مفعّل' },
              { label: 'Bridge Payload', value: 'تلقائي' },
              { label: 'التنفيذ', value: 'عبر الوكلاء' },
            ]}
            status="INTELLIGENCE READY"
            onClick={() => onNavigate('market')}
          />
          <ModuleCard
            tag="MODULE · 02"
            title="مكافآت الثغرات"
            subtitle="Bug Bounty Engine v0"
            description="محرك دفاعي محلي لخرائط النطاق والفرضيات والأدلة والتقارير. الفحص الحي ينتقل لطابور الموافقة قبل تشغيله."
            icon={Bug}
            stats={[
              { label: 'Quality Gate', value: 'مفعّل' },
              { label: 'Bridge Payload', value: 'تلقائي' },
              { label: 'المخرجات', value: 'تقرير وأدلة' },
            ]}
            status="DEFENSIVE PLANNER"
            onClick={() => onNavigate('bounty')}
          />
          <ModuleCard
            tag="RUNTIME · 01"
            title="مهام الوكلاء"
            subtitle="Local Agent Runtime"
            description="إرسال المهام للمشغّل المحلي، متابعة heartbeat والخطوات، اعتماد الإجراءات الحساسة، وعرض إيصالات التنفيذ."
            icon={Bot}
            stats={[
              { label: 'Heartbeat', value: 'مباشر' },
              { label: 'Receipts', value: 'مفعّلة' },
              { label: 'الحساس', value: 'موافقة' },
            ]}
            status="LOCAL RUNTIME ACTIVE"
            onClick={() => onNavigate('agents')}
          />
          <ModuleCard
            tag="BRIDGE · 01"
            title="طابور الموافقة"
            subtitle="Approval Queue"
            description="تظهر هنا فقط الخطوات الحساسة التي اختارتها الخطة. اعتمدها أو ألغها، ثم يكمل المشغّل التنفيذ ويصدر إيصالًا."
            icon={ListChecks}
            stats={[
              { label: 'Payloads', value: 'حساسة فقط' },
              { label: 'اعتماد', value: 'متاح' },
              { label: 'Receipts', value: 'إلزامية' },
            ]}
            status="APPROVAL GATE"
            onClick={() => onNavigate('approval')}
          />
          <ModuleCard
            tag="BRIDGE · 02"
            title="مخطط n8n"
            subtitle="n8n Bridge Blueprint"
            description="n8n يعمل محليًا كطبقة أتمتة. جسر الوكلاء مهيأ، وتفعيل workflows ينتظر إصلاح قاعدة n8n وإعداد مفتاح API."
            icon={Workflow}
            stats={[
              { label: 'عقد العمل', value: '6' },
              { label: 'الحالة', value: 'متصل محليًا' },
              { label: 'Bridge', value: 'قيد التهيئة' },
            ]}
            status="LOCAL n8n ONLINE"
            onClick={() => onNavigate('n8n')}
          />
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          <FooterChip icon={Activity} label="تنفيذ داخلي" sub="عبر المشغّل المحلي" />
          <FooterChip icon={Lock} label="إيصالات محفوظة" sub="قاعدة بيانات مؤمّنة" />
          <FooterChip icon={ArrowLeft} label="تأكيد بشري" sub="للإجراءات الحساسة" />
        </div>

        <div className="mt-14 space-y-6">
          <TestModePanel onNavigate={onNavigate} />
          <AgenticLearningPanel />
          <SystemStatus />
          <RedZone />
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  tag, title, subtitle, description, icon: Icon, stats, status, onClick,
}: {
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  icon: typeof LineChart;
  stats: { label: string; value: string }[];
  status: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group relative text-right overflow-hidden rounded-2xl border border-gold-700/30 bg-ink-900/60 p-8 transition-all duration-300 hover:border-gold-500/60 hover:shadow-2xl hover:shadow-gold-600/10 hover:-translate-y-0.5"
    >
      <div className="absolute inset-0 bg-gold-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className="w-14 h-14 rounded-xl border border-gold-600/40 bg-gold-600/5 flex items-center justify-center">
            <Icon size={24} className="text-gold-400" />
          </div>
          <div className="font-mono text-[10px] tracking-[0.25em] text-gold-400">
            {tag}
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-2xl font-bold gold-gradient-text mb-1">{title}</h2>
          <p className="font-mono text-xs text-gold-600/70 tracking-wider">{subtitle}</p>
        </div>

        <p className="text-stone-400 text-sm leading-relaxed mb-6 min-h-[60px]">
          {description}
        </p>

        <div className="grid grid-cols-3 gap-3 mb-6 pt-6 border-t border-gold-700/20">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-mono text-sm font-semibold text-gold-300">{s.value}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-stone-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-1.5 pulse-dot" />
            {status}
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-gold-300 group-hover:gap-3 transition-all">
            دخول الوحدة
            <ArrowLeft size={16} />
          </span>
        </div>
      </div>
    </button>
  );
}

function TestModePanel({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-amber-500/20">
        <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <FlaskConical size={15} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-stone-100">وضع الاختبار المحلي</h2>
          <div className="font-mono text-[10px] text-amber-400/80 tracking-wider">TEST MODE · SAFE SAMPLE DATA</div>
        </div>
      </div>
      <div className="px-6 py-5">
        <p className="text-xs text-stone-400 leading-6 mb-4">
          يُولّد بيانات اختبار ويُشغّل المسارات المحلية مباشرةً للتحقق من الفهم والخطة والأدوات والإيصالات.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate('market')}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15 hover:border-amber-400/50 transition"
          >
            <LineChart size={15} />
            Generate Market Intel Sample
          </button>
          <button
            onClick={() => onNavigate('bounty')}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/15 hover:border-amber-400/50 transition"
          >
            <Bug size={15} />
            Generate Bug Bounty Sample
          </button>
        </div>
        <p className="text-[11px] text-stone-500 mt-3">
          بعد الانتقال للوحدة، اضغط زر النموذج التجريبي لتشغيل المحرك فوراً.
        </p>
      </div>
    </section>
  );
}

function FooterChip({ icon: Icon, label, sub }: { icon: typeof Activity; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-gold-700/20 bg-ink-900/40">
      <div className="w-9 h-9 rounded-md bg-gold-600/5 border border-gold-700/30 flex items-center justify-center">
        <Icon size={15} className="text-gold-400" />
      </div>
      <div>
        <div className="text-sm text-stone-200">{label}</div>
        <div className="text-[11px] text-stone-500">{sub}</div>
      </div>
    </div>
  );
}
