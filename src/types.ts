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

export type View = 'home' | 'market' | 'bounty' | 'approval' | 'n8n' | 'agents';

export type AgentTaskStatus =
  | 'queued'
  | 'running'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'stalled'
  | 'canceled';

export type AgentRiskClass =
  | 'internal_owned'
  | 'financial'
  | 'live_security'
  | 'destructive'
  | 'external';

export type AgentTask = {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  status: AgentTaskStatus;
  progress: number;
  current_step: string | null;
  risk_class: AgentRiskClass;
  requires_approval: boolean;
  approval_state: 'not_required' | 'pending' | 'approved' | 'rejected';
  worker_id: string | null;
  plan: unknown;
  result: unknown | null;
  error_message: string | null;
  last_heartbeat_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AgentTaskEvent = {
  id: number;
  task_id: string;
  event_type: string;
  status: string | null;
  step: string | null;
  message: string;
  progress: number | null;
  payload: unknown;
  created_at: string;
};

export type AgentReceipt = {
  id: string;
  receipt_id: string;
  task_id: string;
  status: string;
  summary: string;
  evidence: unknown;
  created_at: string;
};

export type AgentTaskDetail = {
  task: AgentTask;
  events: AgentTaskEvent[];
  receipts: AgentReceipt[];
};
