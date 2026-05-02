import type { MarketIntelOutput, BugBountyOutput, QualityResult } from '../types';

const FORBIDDEN_TRADING_TERMS = [
  'buy', 'sell', 'enter', 'exit', 'long', 'short',
  'اشتري', 'بع', 'ادخل', 'اخرج', 'شراء', 'بيع', 'دخول', 'خروج',
];

const FORBIDDEN_SECURITY_TERMS = [
  'exploit', 'bypass', 'dump', 'steal', 'scan', 'brute force',
  'brute-force', 'payload', 'injection attack', 'استغلال فعلي',
  'تجاوز صلاحيات', 'سحب بيانات', 'فحص حي', 'اختراق فعلي',
];

function detectTerms(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter(t => lower.includes(t.toLowerCase()));
}

function scanText(fields: string[], terms: string[]): string[] {
  const found = new Set<string>();
  for (const field of fields) {
    for (const t of detectTerms(field, terms)) {
      found.add(t);
    }
  }
  return Array.from(found);
}

export function runMarketIntelQualityGate(output: MarketIntelOutput): QualityResult {
  const allText = [
    output.coreThesis,
    output.bullishScenario,
    output.bearishScenario,
    ...output.invalidation,
    ...output.earlyWarnings,
    output.hiddenRisk,
    ...output.nextDataNeeded,
    output.decisionBoundary,
  ];

  const blockedTerms = [
    ...scanText(allText, FORBIDDEN_TRADING_TERMS),
    ...output.forbiddenDecisionTermsDetected,
  ].filter((v, i, a) => a.indexOf(v) === i);

  const warnings: string[] = [];

  if (!output.decisionBoundary || output.decisionBoundary.trim().length < 20) {
    warnings.push('decision_boundary مفقود أو غير مكتمل');
  }
  if (output.confidenceScore < 30) {
    warnings.push('درجة الثقة منخفضة جداً — يُنصح بمراجعة المدخلات');
  }
  if (blockedTerms.length > 0) {
    warnings.push(`تم رصد مصطلحات تداول ممنوعة: ${blockedTerms.join(', ')}`);
  }

  const passed = blockedTerms.length === 0 && warnings.filter(w => w.includes('مفقود')).length === 0;

  return {
    passed,
    warnings,
    blockedTerms,
    revisionRequired: !passed,
  };
}

export function runBugBountyQualityGate(output: BugBountyOutput): QualityResult {
  const allText = [
    ...output.vulnHypotheses.map(v => v.title + ' ' + v.rationale),
    ...output.safeChecklist,
    output.evidenceTemplate,
    output.draftReport,
    output.decisionBoundary,
    ...output.outOfScopeWarnings,
  ];

  const blockedTerms = [
    ...scanText(allText, FORBIDDEN_SECURITY_TERMS),
    ...output.unsafeTermsDetected,
  ].filter((v, i, a) => a.indexOf(v) === i);

  const warnings: string[] = [];

  if (!output.decisionBoundary || output.decisionBoundary.trim().length < 20) {
    warnings.push('decision_boundary مفقود أو غير مكتمل');
  }
  if (output.outOfScopeWarnings.length > 0) {
    warnings.push(`تحذيرات خارج النطاق: ${output.outOfScopeWarnings.join('; ')}`);
  }
  if (blockedTerms.length > 0) {
    warnings.push(`تم رصد مصطلحات أمنية غير آمنة: ${blockedTerms.join(', ')}`);
  }

  const passed = blockedTerms.length === 0 && warnings.filter(w => w.includes('مفقود')).length === 0;

  return {
    passed,
    warnings,
    blockedTerms,
    revisionRequired: !passed,
  };
}
