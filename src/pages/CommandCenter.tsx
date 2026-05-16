import {
  Activity, AlertTriangle, ChevronRight, Database, GitBranch, Lock,
  Package, Receipt, ShieldCheck,
} from 'lucide-react';
import {
  FATHIYA_REPOSITORY_IDENTITY,
  getCoreArtifactIngestionPlan,
  getCoreArtifactIngestionSummary,
} from '../lib/coreArtifacts';
import type { CoreArtifactManifestEntry } from '../lib/coreArtifacts';
import type { View } from '../types';

const sectionIcons: Record<CoreArtifactManifestEntry['section'], typeof Package> = {
  'Runtime Queue': Activity,
  'Receipt Ledger': Receipt,
  'Crypto Radar': Database,
  'Scope & Authorization': ShieldCheck,
};

export function CommandCenter({ onNavigate }: { onNavigate: (v: View) => void }) {
  const summary = getCoreArtifactIngestionSummary();
  const ingestionPlan = getCoreArtifactIngestionPlan();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-14 pb-12">
      <div className="mb-10">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs text-gold-300/80 hover:text-gold-200 transition mb-5 px-3 py-1.5 rounded-md border border-gold-700/30 hover:border-gold-500/50"
        >
          <ChevronRight size={14} />
          العودة للوحة الرئيسية
        </button>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
          <Package size={14} />
          COMMAND CENTER · INTEGRATION SCAFFOLD
        </div>
        <h1 className="text-3xl font-bold gold-gradient-text mb-2">Command Center</h1>
        <p className="text-stone-400 text-sm max-w-3xl leading-7">
          واجهة Command Center تنتمي إلى Ops Console، بينما تبقى معرفة Core وآثار التشغيل
          في المستودع الأساسي كمصدر موثوق. هذه الصفحة تعرض اتجاه الدمج فقط دون تنفيذ خارجي.
        </p>
      </div>

      <section className="grid md:grid-cols-2 gap-4 mb-6">
        <RepoCard
          icon={Database}
          label="Core source repo"
          repo={FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug}
          url={FATHIYA_REPOSITORY_IDENTITY.coreRepoUrl}
          description="Canonical knowledge/runtime source for artifacts that will feed this console."
        />
        <RepoCard
          icon={GitBranch}
          label="Ops Console repo"
          repo={FATHIYA_REPOSITORY_IDENTITY.opsConsoleRepoSlug}
          url={FATHIYA_REPOSITORY_IDENTITY.opsConsoleRepoUrl}
          description="Application UI home for Command Center views, bridge screens, and operator review."
        />
      </section>

      <section className="rounded-2xl border border-gold-700/25 bg-ink-900/60 p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="font-mono text-[10px] text-gold-600/80 tracking-wider mb-2">CURRENT STATUS</div>
            <h2 className="text-xl font-semibold text-stone-100">Integration scaffold</h2>
          </div>
          <span className="font-mono text-[10px] px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-200">
            {summary.status.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <p className="text-sm text-stone-400 leading-7 mb-5">{summary.note}</p>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-medium text-amber-200 mb-1">Safety boundary</div>
            <p className="text-xs text-stone-400 leading-6">
              No active testing, trading, scanning, webhooks, or external execution is available from this UI yet.
              The current surface is display-only and scaffold-only.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gold-700/25 bg-ink-900/60 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock size={15} className="text-gold-400" />
          <div>
            <div className="font-mono text-[10px] text-gold-600/80 tracking-wider">EXPECTED LIVE SECTIONS FROM CORE</div>
            <h2 className="text-lg font-semibold text-stone-100">Read-only artifact intake plan</h2>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {ingestionPlan.map((entry) => (
            <CoreSectionCard key={entry.section} entry={entry} />
          ))}
        </div>
      </section>
    </div>
  );
}

function RepoCard({
  icon: Icon, label, repo, url, description,
}: {
  icon: typeof Database;
  label: string;
  repo: string;
  url: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gold-700/25 bg-ink-900/60 p-5">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl border border-gold-600/35 bg-gold-600/5 flex items-center justify-center shrink-0">
          <Icon size={19} className="text-gold-400" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-gold-600/80 tracking-wider mb-1">{label}</div>
          <div className="font-mono text-sm text-gold-200 break-all">{repo}</div>
          <div className="text-[11px] text-stone-500 break-all mt-1">{url}</div>
          <p className="text-xs text-stone-400 leading-6 mt-3">{description}</p>
        </div>
      </div>
    </div>
  );
}

function CoreSectionCard({ entry }: { entry: CoreArtifactManifestEntry }) {
  const Icon = sectionIcons[entry.section];

  return (
    <div className="rounded-xl border border-gold-700/20 bg-ink-950/35 p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-gold-700/30 bg-gold-600/5 flex items-center justify-center">
            <Icon size={17} className="text-gold-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-stone-100">{entry.section}</div>
            <div className="font-mono text-[10px] text-stone-500">{entry.sourceRepo}</div>
          </div>
        </div>
        <span className="font-mono text-[9px] px-2 py-1 rounded border border-stone-700/50 bg-stone-800/30 text-stone-400">
          PLANNED
        </span>
      </div>
      <p className="text-xs text-stone-400 leading-6 mb-3">{entry.expectedContract}</p>
      <div className="text-[11px] text-stone-500 leading-5">
        Source hint: <span className="text-stone-400">{entry.sourcePathHint}</span>
      </div>
    </div>
  );
}
