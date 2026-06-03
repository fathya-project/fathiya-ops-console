import { useCallback, useEffect, useMemo, useState } from 'react';
import { ControlBanner } from './components/ControlBanner';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { MarketIntel } from './pages/MarketIntel';
import { BugBounty } from './pages/BugBounty';
import { ApprovalQueue } from './pages/ApprovalQueue';
import { N8nBlueprint } from './pages/N8nBlueprint';
import { Login } from './pages/Login';
import { ActivityContext, LogEntry } from './lib/activity';
import { BridgeContext, loadPayloads, savePayloads } from './lib/bridge';
import { AuditContext, loadAuditEntries, saveAuditEntries } from './lib/audit';
import { hasSupabaseConfig, supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { FathiyaBridgePayload } from './types';
import type { AuditLogEntry } from './types';
import type { View } from './types';

const ACT_LS_KEY = 'fathiya.activityLog.v2';

function loadActivity(): LogEntry[] {
  try {
    const raw = localStorage.getItem(ACT_LS_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch { return []; }
}

function saveActivity(entries: LogEntry[]) {
  try { localStorage.setItem(ACT_LS_KEY, JSON.stringify(entries)); } catch { /* ignore */ }
}

function AppShell({ session }: { session?: Session | null }) {
  const [view, setView] = useState<View>('home');

  const [entries, setEntries] = useState<LogEntry[]>(loadActivity);

  const addEntry = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp' | 'status' | 'exported'>) => {
    setEntries((prev) => {
      const next: LogEntry[] = [...prev, {
        ...entry, id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        status: 'Draft Generated', exported: false,
      }];
      saveActivity(next);
      return next;
    });
  }, []);

  const markExported = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.map(e => e.id === id ? { ...e, exported: true } : e);
      saveActivity(next);
      return next;
    });
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
    try { localStorage.removeItem(ACT_LS_KEY); } catch { /* ignore */ }
  }, []);

  const actCtx = useMemo(
    () => ({ entries, addEntry, markExported, clearEntries }),
    [entries, addEntry, markExported, clearEntries],
  );

  const [payloads, setPayloads] = useState<FathiyaBridgePayload[]>(loadPayloads);

  const addPayload = useCallback((p: FathiyaBridgePayload) => {
    setPayloads((prev) => {
      const next = [...prev, p];
      savePayloads(next);
      return next;
    });
  }, []);

  const clearPayloads = useCallback(() => {
    setPayloads([]);
    try { localStorage.removeItem('fathiya.bridgePayloads.v1'); } catch { /* ignore */ }
  }, []);

  const bridgeCtx = useMemo(
    () => ({ payloads, addPayload, clearPayloads }),
    [payloads, addPayload, clearPayloads],
  );

  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>(loadAuditEntries);

  const addAuditEntry = useCallback((entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    setAuditEntries((prev) => {
      const next: AuditLogEntry[] = [...prev, {
        ...entry, id: crypto.randomUUID(), timestamp: new Date().toISOString(),
      }];
      saveAuditEntries(next);
      return next;
    });
  }, []);

  const clearAudit = useCallback(() => {
    setAuditEntries([]);
    try { localStorage.removeItem('fathiya.auditLog.v1'); } catch { /* ignore */ }
  }, []);

  const auditCtx = useMemo(
    () => ({ auditEntries, addAuditEntry, clearAudit }),
    [auditEntries, addAuditEntry, clearAudit],
  );

  void session;

  return (
    <ActivityContext.Provider value={actCtx}>
      <BridgeContext.Provider value={bridgeCtx}>
        <AuditContext.Provider value={auditCtx}>
          <div className="min-h-screen bg-ink-950 text-stone-200">
            <ControlBanner />
            <Header view={view} onNavigate={setView} payloadCount={payloads.filter(p => p.execution_status === 'pending_approval').length} />
            {view === 'home' && <Home onNavigate={setView} />}
            {view === 'market' && <MarketIntel onNavigate={setView} />}
            {view === 'bounty' && <BugBounty onNavigate={setView} />}
            {view === 'approval' && <ApprovalQueue onNavigate={setView} />}
            {view === 'n8n' && <N8nBlueprint onNavigate={setView} />}
            <footer className="mt-16 border-t border-gold-700/20">
              <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="font-mono text-xs tracking-wider text-gold-600/70">
                  SOVEREIGN INTELLIGENCE LAB · BRIDGE LAYER v0
                </div>
                <div className="text-xs text-stone-400 italic text-left sm:text-right">
                  فتحية لا تنفذ قرارات. فتحية توسّع الوعي وتنتج مسودات قابلة للمراجعة.
                </div>
              </div>
            </footer>
          </div>
        </AuditContext.Provider>
      </BridgeContext.Provider>
    </ActivityContext.Provider>
  );
}

function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const publicCommandCenter = typeof window !== 'undefined'
    && window.location.pathname.replace(/\/+$/, '') === '/command-center';

  useEffect(() => {
    if (publicCommandCenter || !hasSupabaseConfig) {
      setSession(null);
      return;
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, [publicCommandCenter]);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session && publicCommandCenter) return <AppShell session={null} />;

  if (!session) return <Login />;

  return <AppShell session={session} />;
}

export default App;
