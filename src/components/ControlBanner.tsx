import { ShieldAlert } from 'lucide-react';

export function ControlBanner() {
  return (
    <div className="sticky top-0 z-30 border-b border-gold-700/30 bg-gradient-to-l from-gold-700/5 via-gold-600/10 to-gold-700/5 backdrop-blur">
      <div className="max-w-7xl mx-auto px-6 py-2.5 flex items-center gap-4 text-sm flex-wrap">
        <div className="flex items-center gap-2 text-gold-400 shrink-0">
          <ShieldAlert size={16} />
          <span className="font-semibold tracking-wide">طبقة التحكم · CONTROL LAYER</span>
        </div>
        <div className="h-4 w-px bg-gold-700/30 hidden sm:block" />
        <div className="flex items-center gap-2 font-mono text-xs text-gold-200/90">
          <span className="px-2 py-0.5 rounded bg-gold-600/10 border border-gold-600/20">Request</span>
          <span className="opacity-50">→</span>
          <span className="px-2 py-0.5 rounded bg-gold-600/10 border border-gold-600/20">Plan</span>
          <span className="opacity-50">→</span>
          <span className="px-2 py-0.5 rounded bg-gold-600/10 border border-gold-600/20">Execute</span>
          <span className="opacity-50">→</span>
          <span className="px-2 py-0.5 rounded bg-gold-600/10 border border-gold-600/20">Receipt</span>
        </div>
        <div className="h-4 w-px bg-gold-700/30 hidden md:block" />
        <p className="text-gold-100/80 text-xs hidden md:block">
          Sensitive external actions require explicit human approval.
        </p>
      </div>
    </div>
  );
}
