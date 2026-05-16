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

export type BridgeActionType =
  | 'market_watch_record'
  | 'bug_bounty_report_draft'
  | 'github_issue_draft'
  | 'n8n_workflow_draft'
  | 'email_draft'
  | 'log_only';

export type BridgeRiskLevel = 'low' | 'medium' | 'high' | 'red_zone';

export type BridgeExecutionStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'blocked'
  | 'executed';

export type BridgeTargetSystem = 'local' | 'n8n' | 'github' | 'zapier' | 'email' | 'none';

export type FathiyaBridgePayload = {
  id: string;
  timestamp: string;
  source_module: 'market_intel' | 'bug_bounty';
  action_type: BridgeActionType;
  title: string;
  draft_markdown: string;
  draft_json: Record<string, unknown>;
  risk_level: BridgeRiskLevel;
  quality_gate: QualityResult;
  requires_human_confirmation: true;
  execution_status: BridgeExecutionStatus;
  target_system: BridgeTargetSystem;
  payload_preview: string;
};

export type AuditEventType =
  | 'draft_generated'
  | 'payload_created'
  | 'quality_gate_passed'
  | 'quality_gate_failed'
  | 'exported_markdown'
  | 'exported_json'
  | 'approval_requested';

export type AuditLogEntry = {
  id: string;
  timestamp: string;
  actor: 'fathiya' | 'user';
  event_type: AuditEventType;
  module: 'market_intel' | 'bug_bounty' | 'bridge';
  risk_level: string;
  summary: string;
};

export type View = 'home' | 'command-center' | 'market' | 'bounty' | 'approval' | 'n8n';
