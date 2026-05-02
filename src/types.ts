export type MarketIntelOutput = {
  asset: string;
  timeframe: string;
  coreThesis: string;
  bullishScenario: string;
  bearishScenario: string;
  invalidation: string[];
  earlyWarnings: string[];
  confidenceScore: number;
  hiddenRisk: string;
  nextDataNeeded: string[];
  decisionBoundary: string;
  forbiddenDecisionTermsDetected: string[];
};

export type BugBountyOutput = {
  programName: string;
  scopeMap: { in: string[]; out: string[] };
  allowedAssets: { name: string; type: string; priority: string }[];
  forbiddenAssets: string[];
  vulnHypotheses: { title: string; rationale: string; severity: string }[];
  safeChecklist: string[];
  evidenceTemplate: string;
  draftReport: string;
  outOfScopeWarnings: string[];
  decisionBoundary: string;
  unsafeTermsDetected: string[];
};

export type QualityResult = {
  passed: boolean;
  warnings: string[];
  blockedTerms: string[];
  revisionRequired: boolean;
};

export type View = 'home' | 'market' | 'bounty';
