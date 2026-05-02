import { useCallback, useMemo, useState } from 'react';
import { ControlBanner } from './components/ControlBanner';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { MarketIntel } from './pages/MarketIntel';
import { BugBounty } from './pages/BugBounty';
import { ActivityContext, LogEntry } from './lib/activity';
import type { View } from './types';

const LS_KEY = 'fathiya.activityLog.v2';

function loadFromStorage(): LogEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as LogEntry[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries: LogEntry[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
  } catch { /* ignore quota */ }
}

function App() {
  const [view, setView] = useState<View>('home');
  const [entries, setEntries] = useState<LogEntry[]>(loadFromStorage);

  const addEntry = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp' | 'status' | 'exported'>) => {
    setEntries((prev) => {
      const next: LogEntry[] = [
        ...prev,
        {
          ...entry,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          status: 'Draft Generated',
          exported: false,
        },
      ];
      saveToStorage(next);
      return next;
    });
  }, []);

  const markExported = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.map(e => e.id === id ? { ...e, exported: true } : e);
      saveToStorage(next);
      return next;
    });
  }, []);

  const clearEntries = useCallback(() => {
    setEntries([]);
    try { localStorage.removeItem(LS_KEY); } catch { /* ignore */ }
  }, []);

  const ctx = useMemo(
    () => ({ entries, addEntry, markExported, clearEntries }),
    [entries, addEntry, markExported, clearEntries],
  );

  return (
    <ActivityContext.Provider value={ctx}>
      <div className="min-h-screen bg-ink-950 text-stone-200">
        <ControlBanner />
        <Header view={view} onNavigate={setView} />
        {view === 'home' && <Home onNavigate={setView} />}
        {view === 'market' && <MarketIntel onNavigate={setView} />}
        {view === 'bounty' && <BugBounty onNavigate={setView} />}
        <footer className="mt-16 border-t border-gold-700/20">
          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="font-mono text-xs tracking-wider text-gold-600/70">
              SOVEREIGN INTELLIGENCE LAB · INTELLIGENCE ENGINE v0
            </div>
            <div className="text-xs text-stone-400 italic text-left sm:text-right">
              فتحية لا تنفذ قرارات. فتحية توسّع الوعي وتنتج مسودات قابلة للمراجعة.
            </div>
          </div>
        </footer>
      </div>
    </ActivityContext.Provider>
  );
}

export default App;
