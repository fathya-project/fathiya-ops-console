import { useState } from 'react';
import { ClipboardList, LineChart, Bug, Trash2, X, AlertTriangle, ShieldCheck, ShieldX, FileCheck } from 'lucide-react';
import { useActivity } from '../lib/activity';

export function ActivityLog() {
  const { entries, clearEntries } = useActivity();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleClear() {
    clearEntries();
    setConfirmOpen(false);
  }

  return (
    <>
      <section className="rounded-2xl border border-gold-700/30 bg-ink-900/50 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gold-700/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-gold-600/10 border border-gold-600/40 flex items-center justify-center">
              <ClipboardList size={15} className="text-gold-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold gold-gradient-text">سجل النشاط المحلي</h2>
              <div className="font-mono text-[10px] text-gold-600/80 tracking-wider">LOCAL ACTIVITY LOG · localStorage</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono text-gold-600/80">{entries.length} ENTRIES</div>
            {entries.length > 0 && (
              <button
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-rose-300/80 hover:text-rose-200 transition px-2.5 py-1 rounded-md border border-rose-500/20 hover:border-rose-500/40 bg-rose-500/5"
              >
                <Trash2 size={11} />
                Clear Log
              </button>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-sm text-stone-400 mb-1">لا توجد إدخالات بعد</div>
            <div className="text-[11px] text-stone-500">كل توليد مسودة سيُسجَّل هنا مع نتيجة Quality Gate.</div>
          </div>
        ) : (
          <div className="divide-y divide-gold-700/10">
            {entries.slice().reverse().map((e) => {
              const Icon = e.module === 'Market Intel' ? LineChart : Bug;
              const qPassed = e.qualityStatus === 'passed';
              return (
                <div key={e.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gold-600/[0.03] transition">
                  <div className="w-9 h-9 rounded-md border border-gold-600/30 bg-gold-600/5 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-gold-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-stone-100">{e.module}</span>
                      <span className="text-[10px] font-mono text-stone-600">·</span>
                      <span className="text-[11px] font-mono text-gold-300/80">{e.outputType}</span>
                      {e.riskLevel && e.riskLevel !== 'N/A' && (
                        <span className="text-[10px] font-mono text-stone-500">risk:{e.riskLevel}</span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400 truncate mb-0.5">{e.inputSummary}</div>
                    {e.outputSummary && (
                      <div className="text-[11px] text-stone-500 truncate">{e.outputSummary}</div>
                    )}
                  </div>
                  <div className="text-left shrink-0 space-y-1">
                    <div className="font-mono text-[10px] text-stone-500">
                      {new Date(e.timestamp).toLocaleTimeString('en-GB')}
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
                        qPassed
                          ? 'bg-gold-600/10 text-gold-200 border-gold-600/30'
                          : 'bg-rose-500/10 text-rose-200 border-rose-500/25'
                      }`}>
                        {qPassed ? <ShieldCheck size={10} /> : <ShieldX size={10} />}
                        {qPassed ? 'QG OK' : 'QG FAIL'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Draft Generated
                      </span>
                    </div>
                    {e.exported && (
                      <div className="flex justify-end">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-stone-700/30 text-stone-400 border border-stone-700/50">
                          <FileCheck size={10} />
                          Exported
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-500/30 bg-ink-900 shadow-2xl shadow-rose-500/10 animate-fade-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-rose-500/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertTriangle size={15} className="text-rose-400" />
                </div>
                <span className="text-sm font-semibold text-stone-100">تأكيد المسح</span>
              </div>
              <button onClick={() => setConfirmOpen(false)} className="text-stone-500 hover:text-stone-300 transition">
                <X size={16} />
              </button>
            </div>
            <div className="px-5 py-5">
              <p className="text-sm text-stone-300 leading-7 mb-1">
                سيتم حذف <span className="font-semibold text-stone-100">{entries.length}</span> إدخال من سجل النشاط المحلي.
              </p>
              <p className="text-xs text-stone-500">هذا الإجراء لا يمكن التراجع عنه. البيانات في localStorage فقط.</p>
            </div>
            <div className="px-5 pb-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-xs rounded-lg border border-stone-700 text-stone-300 hover:border-stone-500 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 text-xs rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-200 hover:bg-rose-500/20 transition font-medium"
              >
                نعم، امسح السجل
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
