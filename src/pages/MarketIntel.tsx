import { useState } from 'react';
import {
  LineChart, Sparkles, TrendingUp, TrendingDown, XOctagon, Bell,
  Gauge, EyeOff, Loader2, Save, CheckCircle2, Database, ChevronRight,
  Download, FlaskConical, ShieldCheck, ShieldX, AlertTriangle,
} from 'lucide-react';
import { Field, Input, Select, Textarea, SectionCard, PrimaryButton } from '../components/ui';
import { generateMarketIntel, SAMPLE_MARKET_INTEL_INPUT } from '../lib/mock';
import { runMarketIntelQualityGate } from '../lib/quality-gate';
import { supabase } from '../lib/supabase';
import { useActivity } from '../lib/activity';
import type { MarketIntelOutput, QualityResult, View } from '../types';

type RunResult = { output: MarketIntelOutput; quality: QualityResult };

export function MarketIntel({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [asset, setAsset] = useState('');
  const [timeframe, setTimeframe] = useState('4H');
  const [marketContext, setMarketContext] = useState('نطاق عرضي');
  const [dataSource, setDataSource] = useState('Binance Spot');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addEntry, markExported } = useActivity();
  const [logId, setLogId] = useState<string | null>(null);

  async function runEngine(params: typeof SAMPLE_MARKET_INTEL_INPUT) {
    setLoading(true);
    setSaved(false);
    setResult(null);
    await new Promise(r => setTimeout(r, 700));

    const output = generateMarketIntel(params);
    const quality = runMarketIntelQualityGate(output);

    setResult({ output, quality });

    const id = crypto.randomUUID();
    setLogId(id);

    addEntry({
      module: 'Market Intel',
      inputSummary: `${params.asset || 'N/A'} · ${params.timeframe} · ${params.marketContext}`,
      outputSummary: output.coreThesis.slice(0, 80) + '…',
      outputType: 'Analysis Draft',
      riskLevel: params.riskLevel,
      qualityStatus: quality.passed ? 'passed' : 'failed',
    });

    try {
      await supabase.from('market_intel_reports').insert({
        asset: params.asset,
        timeframe: params.timeframe,
        data_source: params.dataSource,
        risk_level: params.riskLevel,
        notes: [params.marketContext ? `سياق السوق: ${params.marketContext}` : '', params.notes].filter(Boolean).join('\n\n'),
        output,
      });
      setSaved(true);
    } catch { /* local-only fallback */ }

    setLoading(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    runEngine({ asset, timeframe, marketContext, dataSource, riskLevel, notes });
  }

  function loadSample() {
    const s = SAMPLE_MARKET_INTEL_INPUT;
    setAsset(s.asset);
    setTimeframe(s.timeframe);
    setMarketContext(s.marketContext);
    setDataSource(s.dataSource);
    setRiskLevel(s.riskLevel);
    setNotes(s.notes);
    runEngine(s);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-12">
      <PageHeader onNavigate={onNavigate} onLoadSample={loadSample} />

      <div className="grid lg:grid-cols-[420px_1fr] gap-6">
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gold-700/30 bg-ink-900/60 p-6 h-fit lg:sticky lg:top-40">
          <div className="flex items-center gap-2 pb-4 border-b border-gold-700/20">
            <div className="w-8 h-8 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
              <Sparkles size={15} className="text-gold-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-100">مُدخلات التحليل</div>
              <div className="font-mono text-[10px] text-gold-600/80">INPUT · LOCAL ENGINE</div>
            </div>
          </div>

          <Field label="الأصل / زوج العملة" hint="ASSET">
            <Input required placeholder="BTC/USDT" value={asset} onChange={e => setAsset(e.target.value)} />
          </Field>
          <Field label="الإطار الزمني" hint="TIMEFRAME">
            <Select value={timeframe} onChange={e => setTimeframe(e.target.value)}>
              <option>15M</option><option>1H</option><option>4H</option><option>1D</option>
              <option>1W</option><option>1M</option>
            </Select>
          </Field>
          <Field label="سياق السوق" hint="MARKET CONTEXT">
            <Select value={marketContext} onChange={e => setMarketContext(e.target.value)}>
              <option>اتجاه صاعد</option>
              <option>اتجاه هابط</option>
              <option>نطاق عرضي</option>
              <option>تقلب مرتفع</option>
              <option>حدث ماكرو مرتقب</option>
            </Select>
          </Field>
          <Field label="مصدر البيانات" hint="SOURCE">
            <Select value={dataSource} onChange={e => setDataSource(e.target.value)}>
              <option>Binance Spot</option><option>Binance Futures</option>
              <option>Coinbase</option><option>Kraken</option><option>On-chain</option>
            </Select>
          </Field>
          <Field label="مستوى المخاطرة" hint="RISK">
            <Select value={riskLevel} onChange={e => setRiskLevel(e.target.value)}>
              <option value="low">منخفض</option>
              <option value="medium">متوسط</option>
              <option value="high">مرتفع</option>
            </Select>
          </Field>
          <Field label="ملاحظات المحلل" hint="NOTES">
            <Textarea placeholder="سياق ماكرو، مشاهدات، افتراضات..." value={notes} onChange={e => setNotes(e.target.value)} />
          </Field>

          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> جاري التحليل…</> : <><Sparkles size={16} /> توليد مسودة تحليل</>}
            </PrimaryButton>
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-xs text-gold-300">
                <CheckCircle2 size={14} /> محفوظة
              </span>
            )}
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed border-t border-gold-700/20 pt-4">
            المخرجات مسودة تحليلية محلية. لا يتم تنفيذ أي أوامر تداول أو إرسال أي تنبيهات خارجية.
          </p>
        </form>

        <div className="min-h-[400px]">
          {loading && <LoadingState />}
          {!loading && !result && <EmptyState />}
          {!loading && result && !result.quality.passed && (
            <QualityGateFailPanel quality={result.quality} onRetry={() => setResult(null)} />
          )}
          {!loading && result && result.quality.passed && (
            <OutputPanel
              output={result.output}
              quality={result.quality}
              params={{ asset, timeframe, marketContext, dataSource, riskLevel, notes }}
              logId={logId}
              onExported={() => logId && markExported(logId)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PageHeader({ onNavigate, onLoadSample }: { onNavigate: (v: View) => void; onLoadSample: () => void }) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-1.5 text-xs text-gold-300/80 hover:text-gold-200 transition px-3 py-1.5 rounded-md border border-gold-700/30 hover:border-gold-500/50"
        >
          <ChevronRight size={14} />
          <span>العودة للوحة الرئيسية</span>
        </button>
        <button
          onClick={onLoadSample}
          className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 transition px-3 py-1.5 rounded-md border border-amber-600/30 hover:border-amber-500/50 bg-amber-500/5"
        >
          <FlaskConical size={13} />
          <span>Generate Market Intel Sample</span>
        </button>
      </div>
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
        <LineChart size={14} />
        MODULE · 01 · MARKET INTEL ENGINE v0
      </div>
      <h1 className="text-3xl font-bold gold-gradient-text mb-2">استخبارات السوق</h1>
      <p className="text-stone-400 text-sm max-w-2xl">
        محرك فرضيات محلي — سيناريوهات، شروط إبطال، إشارات مراقبة، وحدود حكم. لا قرارات تنفيذية — مسودة للمراجعة البشرية.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-full min-h-[300px] rounded-2xl border border-gold-700/20 bg-ink-900/30 flex flex-col items-center justify-center p-12 text-center">
      <Loader2 size={28} className="text-gold-400 animate-spin mb-4" />
      <div className="text-sm text-stone-300 font-medium mb-1">المحرك يعمل…</div>
      <p className="text-xs text-stone-500">بناء الفرضيات وتشغيل Quality Gate</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-gold-700/30 bg-ink-900/30 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-gold-600/5 border border-gold-600/30 flex items-center justify-center mb-4">
        <LineChart size={22} className="text-gold-400" />
      </div>
      <div className="text-stone-300 font-medium mb-1">بانتظار مدخلات التحليل</div>
      <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
        أدخل البيانات واضغط "توليد مسودة تحليل"، أو جرّب النموذج التجريبي.
      </p>
    </div>
  );
}

function QualityGateFailPanel({ quality, onRetry }: { quality: QualityResult; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-500/40 bg-rose-500/5 overflow-hidden animate-fade-up">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-rose-500/20">
        <div className="w-8 h-8 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
          <ShieldX size={15} className="text-rose-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-rose-200">Quality Gate — فشل التحقق</div>
          <div className="font-mono text-[10px] text-rose-300/70">QUALITY GATE FAILED · REVISION REQUIRED</div>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {quality.blockedTerms.length > 0 && (
          <div>
            <div className="text-[11px] font-mono text-rose-300/80 mb-2">مصطلحات ممنوعة رُصدت:</div>
            <div className="flex flex-wrap gap-2">
              {quality.blockedTerms.map(t => (
                <span key={t} className="px-2 py-0.5 rounded font-mono text-[11px] bg-rose-500/10 border border-rose-500/30 text-rose-200">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
        {quality.warnings.map((w, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-rose-100/90">
            <AlertTriangle size={14} className="text-rose-400 mt-0.5 shrink-0" />
            <span>{w}</span>
          </div>
        ))}
        <button
          onClick={onRetry}
          className="mt-2 text-xs text-stone-400 hover:text-stone-200 transition underline underline-offset-2"
        >
          مسح المخرج والمحاولة مجدداً
        </button>
      </div>
    </div>
  );
}

function buildExportMarkdown(
  output: MarketIntelOutput,
  quality: QualityResult,
  params: { asset: string; timeframe: string; marketContext: string; dataSource: string; riskLevel: string; notes: string },
) {
  const ts = new Date().toISOString();
  return `# FATHIYA_MARKET_INTEL_${ts.replace(/[:.]/g, '-')}

---
## Metadata
- Module: Market Intel Engine v0
- Status: Draft Only — No execution authority
- Generated: ${ts}
- Quality Gate: ${quality.passed ? 'PASSED' : 'FAILED'}

---
## Inputs
- Asset: ${params.asset || 'N/A'}
- Timeframe: ${params.timeframe}
- Market Context: ${params.marketContext}
- Data Source: ${params.dataSource}
- Risk Level: ${params.riskLevel}
- Notes: ${params.notes || '—'}

---
## Output

### Core Thesis
${output.coreThesis}

### Bullish Scenario
${output.bullishScenario}

### Bearish Scenario
${output.bearishScenario}

### Invalidation Conditions
${output.invalidation.map((x, i) => `${i + 1}. ${x}`).join('\n')}

### Early Warning Signals
${output.earlyWarnings.map((x, i) => `${i + 1}. ${x}`).join('\n')}

### Confidence Score
${output.confidenceScore} / 100

### Hidden Risk
${output.hiddenRisk}

### Next Data Needed
${output.nextDataNeeded.map((x, i) => `${i + 1}. ${x}`).join('\n')}

---
## Decision Boundary
${output.decisionBoundary}

---
## Quality Gate Result
- Passed: ${quality.passed}
- Blocked Terms: ${quality.blockedTerms.length > 0 ? quality.blockedTerms.join(', ') : 'None'}
- Warnings: ${quality.warnings.length > 0 ? '\n' + quality.warnings.map(w => `  - ${w}`).join('\n') : 'None'}
- Revision Required: ${quality.revisionRequired}

---
> فتحية لا تنفذ قرارات. فتحية توسّع الوعي وتنتج مسودات قابلة للمراجعة.
`;
}

function downloadMd(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function OutputPanel({
  output, quality, params, logId, onExported,
}: {
  output: MarketIntelOutput;
  quality: QualityResult;
  params: { asset: string; timeframe: string; marketContext: string; dataSource: string; riskLevel: string; notes: string };
  logId: string | null;
  onExported: () => void;
}) {
  const conf = output.confidenceScore;
  const confColor: 'gold' | 'amber' | 'rose' = conf >= 70 ? 'gold' : conf >= 50 ? 'amber' : 'rose';
  const confColorHex = conf >= 70 ? '#e4c57f' : conf >= 50 ? '#fbbf24' : '#fb7185';

  function onExport() {
    const ts = Date.now();
    const safeAsset = (params.asset || 'market').replace(/[^a-z0-9]/gi, '_').toUpperCase();
    const md = buildExportMarkdown(output, quality, params);
    downloadMd(`FATHIYA_MARKET_INTEL_${safeAsset}_${ts}.md`, md);
    onExported();
  }

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center justify-between rounded-xl border border-gold-700/20 bg-ink-900/40 px-5 py-3 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Save size={14} className="text-gold-300" />
          <div className="text-xs text-stone-400">
            مسودة · <span className="text-stone-100 font-mono">{params.asset || 'N/A'}</span> · <span className="font-mono">{params.timeframe}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border bg-gold-600/10 border-gold-600/30 text-gold-200">
            <ShieldCheck size={11} />
            QG PASSED
          </span>
        </div>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 transition px-3 py-1.5 rounded-md border border-gold-600/30 hover:border-gold-400/60 bg-gold-600/5"
        >
          <Download size={13} />
          Export Markdown
        </button>
      </div>

      <SectionCard title="الفرضية المركزية" tag="CORE THESIS" icon={<Sparkles size={14} />} accent="gold">
        {output.coreThesis}
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="السيناريو الصاعد" tag="BULLISH" icon={<TrendingUp size={14} />} accent="gold">
          {output.bullishScenario}
        </SectionCard>
        <SectionCard title="السيناريو الهابط" tag="BEARISH" icon={<TrendingDown size={14} />} accent="rose">
          {output.bearishScenario}
        </SectionCard>
      </div>

      <SectionCard title="شروط الإبطال" tag="INVALIDATION" icon={<XOctagon size={14} />} accent="rose">
        <ul className="space-y-2">
          {output.invalidation.map((x, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[11px] text-rose-400/70 mt-1.5 shrink-0">[{String(i+1).padStart(2,'0')}]</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="إشارات الإنذار المبكر" tag="EARLY WARNINGS" icon={<Bell size={14} />} accent="amber">
        <ul className="space-y-2">
          {output.earlyWarnings.map((x, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[11px] text-amber-400/70 mt-1.5 shrink-0">[{String(i+1).padStart(2,'0')}]</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="درجة الثقة" tag="CONFIDENCE" icon={<Gauge size={14} />} accent={confColor}>
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2a2318" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={confColorHex} strokeWidth="3"
                strokeDasharray={`${conf} 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-lg font-semibold text-stone-100">{conf}</span>
            </div>
          </div>
          <div className="text-sm text-stone-400 leading-6">
            مؤشر تقديري بناءً على مستوى المخاطرة المُدخل وسياق السوق. لا يُستخدم كأساس وحيد لأي قرار.
          </div>
        </div>
      </SectionCard>

      <SectionCard title="الخطر الخفي" tag="HIDDEN RISK" icon={<EyeOff size={14} />} accent="slate">
        {output.hiddenRisk}
      </SectionCard>

      <SectionCard title="البيانات المطلوبة لاحقًا" tag="NEXT DATA NEEDED" icon={<Database size={14} />} accent="gold">
        <ul className="space-y-2">
          {output.nextDataNeeded.map((x, i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[11px] text-gold-400/80 mt-1.5 shrink-0">[{String(i+1).padStart(2,'0')}]</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="حدود الحكم" tag="DECISION BOUNDARY" icon={<ShieldCheck size={14} />} accent="amber">
        <p className="text-sm leading-7">{output.decisionBoundary}</p>
      </SectionCard>
    </div>
  );
}
