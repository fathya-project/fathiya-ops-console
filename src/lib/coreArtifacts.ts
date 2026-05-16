export const FATHIYA_REPOSITORY_IDENTITY = {
  coreRepoSlug: 'fathya-core/fathiya-core',
  coreRepoUrl: 'https://github.com/fathya-core/fathiya-core',
  opsConsoleRepoSlug: 'fathya-project/fathiya-ops-console',
  opsConsoleRepoUrl: 'https://github.com/fathya-project/fathiya-ops-console',
} as const;

export const CORE_LIVE_SECTIONS = [
  'Runtime Queue',
  'Receipt Ledger',
  'Crypto Radar',
  'Scope & Authorization',
] as const;

export type CoreLiveSection = (typeof CORE_LIVE_SECTIONS)[number];

export type CoreArtifactIngestionStatus = 'planned' | 'blocked_until_core_contract';

export type CoreArtifactManifestEntry = {
  section: CoreLiveSection;
  sourceRepo: typeof FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug;
  sourcePathHint: string;
  expectedContract: string;
  status: CoreArtifactIngestionStatus;
};

export type CoreArtifactIngestionSummary = {
  status: 'integration_scaffold';
  sourceRepo: typeof FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug;
  destinationRepo: typeof FATHIYA_REPOSITORY_IDENTITY.opsConsoleRepoSlug;
  liveSections: readonly CoreLiveSection[];
  externalExecutionEnabled: false;
  note: string;
};

const CORE_ARTIFACT_INGESTION_PLAN: readonly CoreArtifactManifestEntry[] = [
  {
    section: 'Runtime Queue',
    sourceRepo: FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug,
    sourcePathHint: 'runtime queue artifacts from the Core repo',
    expectedContract: 'Read-only queue snapshot or signed export emitted by Core runtime.',
    status: 'blocked_until_core_contract',
  },
  {
    section: 'Receipt Ledger',
    sourceRepo: FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug,
    sourcePathHint: 'receipt ledger artifacts from the Core repo',
    expectedContract: 'Append-only receipt records with stable IDs, timestamps, and status fields.',
    status: 'blocked_until_core_contract',
  },
  {
    section: 'Crypto Radar',
    sourceRepo: FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug,
    sourcePathHint: 'crypto radar knowledge/runtime exports from the Core repo',
    expectedContract: 'Read-only signal summaries with provenance and no trading instructions.',
    status: 'blocked_until_core_contract',
  },
  {
    section: 'Scope & Authorization',
    sourceRepo: FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug,
    sourcePathHint: 'scope and authorization policies from the Core repo',
    expectedContract: 'Policy manifest defining allowed display surfaces and disabled actions.',
    status: 'blocked_until_core_contract',
  },
];

export function getCoreArtifactIngestionPlan(): readonly CoreArtifactManifestEntry[] {
  return CORE_ARTIFACT_INGESTION_PLAN;
}

export function getCoreArtifactIngestionSummary(): CoreArtifactIngestionSummary {
  return {
    status: 'integration_scaffold',
    sourceRepo: FATHIYA_REPOSITORY_IDENTITY.coreRepoSlug,
    destinationRepo: FATHIYA_REPOSITORY_IDENTITY.opsConsoleRepoSlug,
    liveSections: CORE_LIVE_SECTIONS,
    externalExecutionEnabled: false,
    note: 'Ops Console will ingest Core artifacts only after the Core repo publishes a stable read-only contract. This module performs no network calls and stores no secrets.',
  };
}
