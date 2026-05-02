import { createContext, useContext } from 'react';

export type LogEntry = {
  id: string;
  timestamp: string;
  module: 'Market Intel' | 'Bug Bounty';
  inputSummary: string;
  outputSummary: string;
  outputType: string;
  riskLevel: string;
  qualityStatus: 'passed' | 'failed';
  exported: boolean;
  status: 'Draft Generated';
};

export type ActivityContextType = {
  entries: LogEntry[];
  addEntry: (entry: Omit<LogEntry, 'id' | 'timestamp' | 'status' | 'exported'>) => void;
  markExported: (id: string) => void;
  clearEntries: () => void;
};

export const ActivityContext = createContext<ActivityContextType>({
  entries: [],
  addEntry: () => {},
  markExported: () => {},
  clearEntries: () => {},
});

export const useActivity = () => useContext(ActivityContext);
