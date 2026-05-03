import { useState } from 'react';
import {
  Bug, Map, AlertTriangle, CheckSquare, FileText, ClipboardList,
  Loader2, Sparkles, CheckCircle2, ShieldCheck, ShieldOff,
  ChevronRight, Download, FlaskConical, ShieldX,
} from 'lucide-react';
import { Field, Input, Textarea, SectionCard, PrimaryButton } from '../components/ui';
import { generateBugBounty, SAMPLE_BUG_BOUNTY_INPUT } from '../lib/mock';
import { runBugBountyQualityGate } from '../lib/quality-gate';
import { buildBugBountyPayload, useBridge } from '../lib/bridge';
import { useAudit } from '../lib/audit';
import { supabase } from '../lib/supabase';
import { useActivity } from '../lib/activity';
import type { BugBountyOutput, QualityResult, View } from '../types';

type RunResult = { output: BugBountyOutput; quality: QualityResult };

export function BugBounty({ onNavigate }: { onNavigate: (v: View) => void }) {
  const [programName, setProgramName] = useState('');
  const [policyUrl, setPolicyUrl] = useState('');
  const [allowedScope, setAllowedScope] = useState('');
  const [forbiddenScope, setForbiddenScope] = useState('');
  const [assets, setAssets] = useState('');
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { addEntry, markExported } = useActivity();
  const { addPayload } = useBridge();
  const { addAuditEntry } = useAudit();
  const [logId, setLogId] = useState<string | null>(null);

  async function runEngine(params: typeof SAMPLE_BUG_BOUNTY_INPUT) {
    setLoading(true);
    setSaved(false);
    setResult(null);
    await new Promise(r => setTimeout(r, 700));

    const output = generateBugBounty(params);
    const quality = runBugBountyQualityGate(output);

    setResult({ output, quality });

    const id = crypto.randomUUID();
    setLogId(id);

    const assetCount = params.assets.split(/[\n,]/).filter(s => s.trim()).length;
    addEntry({
      module: 'Bug Bounty',
      inputSummary: `${params.programName || 'Unnamed'} · assets:${assetCount}`,
      outputSummary: `scope: ${output.scopeMap.in.length} in / ${output.scopeMap.out.length} out`,
      outputType: 'Report Draft',
      riskLevel: 'N/A',
      qualityStatus: quality.passed ? 'passed' : 'failed',
    });

    addAuditEntry({ actor: 'fathiya', event_type: 'draft_generated', module: 'bug_bounty', risk_level: 'medium', summary: `Bug Bounty draft for ${params.programName || 'Unnamed'}` });

    if (quality.passed) {
      addAuditEntry({ actor: 'fathiya', event_type: 'quality_gate_passed', module: 'bug_bounty', risk_level: 'medium', summary: 'QG passed' });
      const draftMd = buildExportMarkdown(output, quality);
      const payload = buildBugBountyPayload(output, quality, draftMd);
      addPayload(payload);
      addAuditEntry({ actor: 'fathiya', event_type: 'payload_created', module: 'bridge', risk_level: 'medium', summary: `Payload created: ${payload.title}` });
    } else {
      addAuditEntry({ actor: 'fathiya', event_type: 'quality_gate_failed', module: 'bug_bounty', risk_level: 'medium', summary: `QG failed: ${quality.blockedTerms.join(', ')}` });
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('bug_bounty_reports').insert({
        program_name: params.programName, policy_url: params.policyUrl,
        allowed_scope: params.allowedScope, forbidden_scope: params.forbiddenScope,
        assets: params.assets, notes: params.notes, output,
        user_id: user?.id ?? null,
      });
      setSaved(true);
    } catch { /* local-only fallback */ }

    setLoading(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    runEngine({ programName, policyUrl, allowedScope, forbiddenScope, assets, notes });
  }

  function loadSample() {
    const s = SAMPLE_BUG_BOUNTY_INPUT;
    setProgramName(s.programName);
    setPolicyUrl(s.policyUrl);
    setAllowedScope(s.allowedScope);
    setForbiddenScope(s.forbiddenScope);
    setAssets(s.assets);
    setNotes(s.notes);
    runEngine(s);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-14 pb-12">
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
            onClick={loadSample}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300/80 hover:text-amber-200 transition px-3 py-1.5 rounded-md border border-amber-600/30 hover:border-amber-500/50 bg-amber-500/5"
          >
            <FlaskConical size={13} />
            <span>Generate Bug Bounty Sample</span>
          </button>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-gold-400/90 mb-3">
          <Bug size={14} />
          MODULE · 02 · BUG BOUNTY ENGINE v0
        </div>
        <h1 className="text-3xl font-bold gold-gradient-text mb-2">مكافآت الثغرات</h1>
        <p className="text-stone-400 text-sm max-w-2xl">
          محرك تخطيط آمن محلي — خرائط نطاق، فرضيات، قوائم تحقق، وقوالب مسودة. لا فحص ولا استغلال — مسودة تقرير فقط.
        </p>
      </div>

      <div className="grid lg:grid-cols-[420px_1fr] gap-6">
        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-gold-700/30 bg-ink-900/60 p-6 h-fit lg:sticky lg:top-40">
          <div className="flex items-center gap-2 pb-4 border-b border-gold-700/20">
            <div className="w-8 h-8 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
              <ClipboardList size={15} className="text-gold-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-100">مُدخلات البرنامج</div>
              <div className="font-mono text-[10px] text-gold-600/80">INPUT · LOCAL ENGINE</div>
            </div>
          </div>

          <Field label="اسم البرنامج" hint="PROGRAM">
            <Input required placeholder="Acme Security Program" value={programName} onChange={e => setProgramName(e.target.value)} />
          </Field>
          <Field label="رابط السياسة" hint="POLICY URL">
            <Input type="url" placeholder="https://example.com/security" value={policyUrl} onChange={e => setPolicyUrl(e.target.value)} />
          </Field>
          <Field label="النطاق المسموح" hint="IN-SCOPE">
            <Textarea placeholder="*.example.com&#10;api.example.com" value={allowedScope} onChange={e => setAllowedScope(e.target.value)} />
          </Field>
          <Field label="النطاق الممنوع" hint="OUT-OF-SCOPE">
            <Textarea placeholder="billing.example.com&#10;internal.example.com" value={forbiddenScope} onChange={e => setForbiddenScope(e.target.value)} />
          </Field>
          <Field label="الأصول / Assets" hint="ASSETS">
            <Textarea placeholder="app.example.com&#10;android.apk" value={assets} onChange={e => setAssets(e.target.value)} />
          </Field>
          <Field label="ملاحظات" hint="NOTES">
            <Textarea placeholder="قيود وقت الاختبار، ملاحظات تقنية..." value={notes} onChange={e => setNotes(e.target.value)} />
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
            لن يتم إرسال أي طلب شبكي نحو الأصول. المخرجات وثائقية تخطيطية فقط.
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
              logId={logId}
              onExported={() => logId && markExported(logId)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="h-full min-h-[300px] rounded-2xl border border-gold-700/20 bg-ink-900/30 flex flex-col items-center justify-center p-12 text-center">
      <Loader2 size={28} className="text-gold-400 animate-spin mb-4" />
      <div className="text-sm text-stone-300 font-medium mb-1">المحرك يعمل…</div>
      <p className="text-xs text-stone-500">رسم خريطة النطاق وتشغيل Quality Gate</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full min-h-[300px] rounded-2xl border border-dashed border-gold-700/30 bg-ink-900/30 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-14 h-14 rounded-full bg-gold-600/5 border border-gold-600/30 flex items-center justify-center mb-4">
        <Bug size={22} className="text-gold-400" />
      </div>
      <div className="text-stone-300 font-medium mb-1">بانتظار بيانات البرنامج</div>
      <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
        أدخل نطاق البرنامج والأصول، أو جرّب النموذج التجريبي.
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
            <div className="text-[11px] font-mono text-rose-300/80 mb-2">مصطلحات غير آمنة رُصدت:</div>
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

function buildExportMarkdown(output: BugBountyOutput, quality: QualityResult) {
  const ts = new Date().toISOString();
  return `# FATHIYA_BUG_BOUNTY_${ts.replace(/[:.]/g, '-')}

---
## Metadata
- Module: Bug Bounty Engine v0
- Program: ${output.programName}
- Status: Draft Only — No actual testing performed
- Generated: ${ts}
- Quality Gate: ${quality.passed ? 'PASSED' : 'FAILED'}

---
## Inputs
- Program Name: ${output.programName}
- In-Scope: ${output.scopeMap.in.join(', ')}
- Out-of-Scope: ${output.scopeMap.out.join(', ')}

---
## Output

### Scope Map
#### In-Scope
${output.scopeMap.in.map(s => `- ${s}`).join('\n')}

#### Out-of-Scope
${output.scopeMap.out.map(s => `- ${s}`).join('\n')}

### Allowed Assets
${output.allowedAssets.map(a => `- ${a.name} (${a.type}) — priority: ${a.priority}`).join('\n')}

### Forbidden Assets
${output.forbiddenAssets.length ? output.forbiddenAssets.map(s => `- ${s}`).join('\n') : '— None specified'}

### Vulnerability Hypotheses
${output.vulnHypotheses.map((v, i) => `${i + 1}. **${v.title}** [${v.severity}]\n   ${v.rationale}`).join('\n\n')}

### Safe Test Checklist
${output.safeChecklist.map(c => `- [ ] ${c}`).join('\n')}

### Out-of-Scope Warnings
${output.outOfScopeWarnings.length ? output.outOfScopeWarnings.map(w => `- ⚠ ${w}`).join('\n') : '— None'}

### Evidence Template
\`\`\`
${output.evidenceTemplate}
\`\`\`

### Draft Report
${output.draftReport}

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
  output, quality, logId, onExported,
}: {
  output: BugBountyOutput;
  quality: QualityResult;
  logId: string | null;
  onExported: () => void;
}) {
  const { addAuditEntry } = useAudit();
  const safeName = (output.programName || 'program').replace(/[^a-z0-9]/gi, '_').toUpperCase().slice(0, 30);

  function onExport() {
    const ts = Date.now();
    const md = buildExportMarkdown(output, quality);
    downloadMd(`FATHIYA_BUG_BOUNTY_${safeName}_${ts}.md`, md);
    onExported();
    addAuditEntry({ actor: 'user', event_type: 'exported_markdown', module: 'bug_bounty', risk_level: 'medium', summary: `Markdown exported for ${output.programName}` });
  }

  function onExportJson() {
    const ts = Date.now();
    const blob = new Blob([JSON.stringify({ output, quality, generated: new Date().toISOString() }, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `FATHIYA_PAYLOAD_BUG_BOUNTY_${safeName}_${ts}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    addAuditEntry({ actor: 'user', event_type: 'exported_json', module: 'bug_bounty', risk_level: 'medium', summary: `JSON payload exported for ${output.programName}` });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-gold-700/20 bg-ink-900/40 px-5 py-3 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="text-xs text-stone-400">
            مسودة · <span className="text-stone-100 font-medium">{output.programName}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2 py-0.5 rounded border bg-gold-600/10 border-gold-600/30 text-gold-200">
            <ShieldCheck size={11} />
            QG PASSED
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 text-xs text-gold-300 hover:text-gold-100 transition px-3 py-1.5 rounded-md border border-gold-600/30 hover:border-gold-400/60 bg-gold-600/5"
          >
            <Download size={13} />
            Markdown
          </button>
          <button
            onClick={onExportJson}
            className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-100 transition px-3 py-1.5 rounded-md border border-amber-600/30 hover:border-amber-400/60 bg-amber-500/5"
          >
            <Download size={13} />
            JSON
          </button>
        </div>
      </div>

      <SectionCard title="خريطة النطاق" tag="SCOPE MAP" icon={<Map size={14} />} accent="gold">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-[11px] font-mono text-gold-300/90 mb-2 flex items-center gap-1.5">
              <ShieldCheck size={12} /> IN-SCOPE
            </div>
            <ul className="space-y-1.5">
              {output.scopeMap.in.map((s, i) => (
                <li key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gold-600/5 border border-gold-600/20 font-mono text-xs text-stone-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />{s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-mono text-rose-400/80 mb-2 flex items-center gap-1.5">
              <ShieldOff size={12} /> OUT-OF-SCOPE
            </div>
            <ul className="space-y-1.5">
              {output.scopeMap.out.map((s, i) => (
                <li key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-500/5 border border-rose-500/15 font-mono text-xs text-stone-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="الأصول المسموحة" tag="ALLOWED ASSETS" icon={<ShieldCheck size={14} />} accent="gold">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] font-mono text-gold-600/80 text-right">
                <th className="pb-2 font-normal">الاسم</th>
                <th className="pb-2 font-normal">النوع</th>
                <th className="pb-2 font-normal">الأولوية</th>
              </tr>
            </thead>
            <tbody>
              {output.allowedAssets.map((a, i) => (
                <tr key={i} className="border-t border-gold-700/10">
                  <td className="py-2.5 font-mono text-xs text-stone-200">{a.name}</td>
                  <td className="py-2.5 text-stone-400">{a.type}</td>
                  <td className="py-2.5">
                    <span className={`inline-block px-2 py-0.5 text-[11px] rounded font-medium ${
                      a.priority === 'عالية' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                      a.priority === 'متوسطة' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                      'bg-gold-600/10 text-gold-300 border border-gold-600/20'
                    }`}>{a.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {output.forbiddenAssets.length > 0 && (
        <SectionCard title="الأصول الممنوعة" tag="FORBIDDEN ASSETS" icon={<ShieldOff size={14} />} accent="rose">
          <ul className="space-y-2">
            {output.forbiddenAssets.map((s, i) => (
              <li key={i} className="flex items-center gap-3 px-3 py-2 rounded-md bg-rose-500/5 border border-rose-500/15 font-mono text-xs text-stone-200">
                <ShieldOff size={13} className="text-rose-400 shrink-0" />{s}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {output.outOfScopeWarnings.length > 0 && (
        <SectionCard title="تحذيرات النطاق" tag="OUT-OF-SCOPE WARNINGS" icon={<AlertTriangle size={14} />} accent="rose">
          <ul className="space-y-2">
            {output.outOfScopeWarnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-rose-100/90">
                <AlertTriangle size={13} className="text-rose-400 mt-0.5 shrink-0" />{w}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <SectionCard title="فرضيات الثغرات" tag="HYPOTHESES" icon={<AlertTriangle size={14} />} accent="amber">
        <div className="space-y-3">
          {output.vulnHypotheses.map((v, i) => (
            <div key={i} className="rounded-lg border border-gold-700/15 bg-ink-950/40 p-4">
              <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="font-medium text-stone-100">{v.title}</div>
                <span className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded ${
                  v.severity === 'عالية' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' :
                  v.severity === 'متوسطة' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                  'bg-gold-600/10 text-gold-300 border border-gold-600/20'
                }`}>{v.severity}</span>
              </div>
              <p className="text-xs text-stone-400 leading-6">{v.rationale}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="قائمة فحص آمنة" tag="SAFE CHECKLIST" icon={<CheckSquare size={14} />} accent="gold">
        <ul className="space-y-2">
          {output.safeChecklist.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckSquare size={14} className="text-gold-400 mt-1 shrink-0" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="قالب الأدلة" tag="EVIDENCE TEMPLATE" icon={<FileText size={14} />} accent="slate">
        <pre className="font-mono text-xs text-stone-300 bg-ink-950/60 border border-gold-700/15 rounded-lg p-4 overflow-auto whitespace-pre-wrap leading-6">
{output.evidenceTemplate}
        </pre>
      </SectionCard>

      <SectionCard title="مسودة التقرير" tag="DRAFT REPORT" icon={<FileText size={14} />} accent="gold">
        <pre className="font-mono text-xs text-stone-300 bg-ink-950/60 border border-gold-700/15 rounded-lg p-4 overflow-auto whitespace-pre-wrap leading-6">
{output.draftReport}
        </pre>
      </SectionCard>

      <SectionCard title="حدود الحكم" tag="DECISION BOUNDARY" icon={<ShieldCheck size={14} />} accent="amber">
        <p className="text-sm leading-7">{output.decisionBoundary}</p>
      </SectionCard>
    </div>
  );
}
