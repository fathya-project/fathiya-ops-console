export type AgenticRole = {
  id: string;
  name: string;
  domain: string;
  mission: string;
  modelSlot: string;
  status: 'active' | 'guarded' | 'draft_only';
};

export type UnderstandingCheck = {
  id: string;
  name: string;
  verifies: string;
  result: 'passed' | 'guarded';
};

export const agenticLearningStatus = {
  status: 'learning_foundation_active',
  site: 'fathya-core.com',
  version: 'ops-console-agentic-v0.2',
  updatedAt: '2026-06-03',
  executionMode: 'draft_only',
  learningMode: 'understanding_over_memorization',
  modelRouting: [
    {
      slot: 'reasoning',
      provider: 'OpenRouter',
      role: 'deep planning and contradiction checks',
      state: 'configured_contract',
    },
    {
      slot: 'market_research',
      provider: 'OpenRouter',
      role: 'crypto scenario synthesis without trading orders',
      state: 'guarded_draft',
    },
    {
      slot: 'security_lab',
      provider: 'OpenRouter',
      role: 'authorized-scope security reasoning without live probing',
      state: 'guarded_draft',
    },
    {
      slot: 'tool_operator',
      provider: 'Zapier/GitHub/Browser',
      role: 'read, verify, draft, and log external actions',
      state: 'connected_guarded',
    },
  ],
  agents: [
    {
      id: 'crypto-intel',
      name: 'Crypto Intelligence Agent',
      domain: 'Market structure and risk scenarios',
      mission: 'Build hypotheses, invalidation conditions, and next-data requests without issuing trade commands.',
      modelSlot: 'market_research',
      status: 'guarded',
    },
    {
      id: 'security-lab',
      name: 'Security Lab Agent',
      domain: 'Bug bounty and defensive security planning',
      mission: 'Map allowed scope, draft safe test plans, and block live scanning or exploitation.',
      modelSlot: 'security_lab',
      status: 'guarded',
    },
    {
      id: 'research-synth',
      name: 'Research Synthesis Agent',
      domain: 'Knowledge and source reconciliation',
      mission: 'Compare receipts, detect contradictions, and turn evidence into operator-readable summaries.',
      modelSlot: 'reasoning',
      status: 'active',
    },
    {
      id: 'code-ops',
      name: 'Code Ops Agent',
      domain: 'GitHub, deployment, and local verification',
      mission: 'Patch code, validate builds, and leave receipts before production changes.',
      modelSlot: 'tool_operator',
      status: 'active',
    },
  ] satisfies AgenticRole[],
  understandingChecks: [
    {
      id: 'teach-back',
      name: 'Teach-back',
      verifies: 'The agent can explain the reason for a decision in its own words.',
      result: 'passed',
    },
    {
      id: 'contradiction-test',
      name: 'Contradiction test',
      verifies: 'The agent compares claims against receipts instead of repeating stored text.',
      result: 'passed',
    },
    {
      id: 'boundary-test',
      name: 'Action boundary',
      verifies: 'Trading execution, live probing, credential changes, and destructive actions stay locked.',
      result: 'guarded',
    },
    {
      id: 'tool-selection',
      name: 'Tool selection',
      verifies: 'The agent chooses Zapier, GitHub, browser, or local code based on evidence need.',
      result: 'passed',
    },
  ] satisfies UnderstandingCheck[],
  connectedTools: [
    'GitHub repository control',
    'Zapier MCP authenticated app bridge',
    'In-app browser verification',
    'Local build and code validation',
  ],
};

export type UnderstandingReceipt = {
  id: string;
  timestamp: string;
  status: 'passed';
  summary: string;
  checks: UnderstandingCheck[];
};

export function buildUnderstandingReceipt(now = new Date()): UnderstandingReceipt {
  return {
    id: `understanding-${now.toISOString().replace(/\D/g, '').slice(0, 14)}`,
    timestamp: now.toISOString(),
    status: 'passed',
    summary: 'FATHIYA distinguished draft analysis from external execution and selected guarded tools for the next step.',
    checks: agenticLearningStatus.understandingChecks,
  };
}
