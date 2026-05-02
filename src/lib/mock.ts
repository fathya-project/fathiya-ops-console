import type { MarketIntelOutput, BugBountyOutput } from '../types';

// Forbidden term detection (runs before output is finalized)
const TRADING_TERMS = ['buy','sell','enter','exit','long','short','اشتري','بع','ادخل','اخرج','شراء','بيع','دخول','خروج'];
const SECURITY_TERMS = ['exploit','bypass','dump','steal','scan','brute force','payload','استغلال فعلي','تجاوز صلاحيات','سحب بيانات','فحص حي'];

function detectIn(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter(t => lower.includes(t.toLowerCase()));
}

export function generateMarketIntel(input: {
  asset: string;
  timeframe: string;
  marketContext?: string;
  dataSource: string;
  riskLevel: string;
  notes: string;
}): MarketIntelOutput {
  const { asset, timeframe, riskLevel, marketContext = 'نطاق عرضي', dataSource } = input;
  const a = asset || 'الأصل';
  const tf = timeframe || '4H';

  const riskMap: Record<string, number> = { low: 74, medium: 62, high: 47 };
  const score = riskMap[riskLevel] ?? 60;

  const contextNotes: Record<string, string> = {
    'اتجاه صاعد': 'سياق السوق صاعد — البنية تدعم استمرار الزخم الإيجابي.',
    'اتجاه هابط': 'سياق السوق هابط — البنية تُلمح إلى ضغط مستمر على المستويات.',
    'نطاق عرضي': 'السوق في طور التوازن — حركة جانبية مع تشكّل طاقة كامنة.',
    'تقلب مرتفع': 'تقلب مرتفع — تزداد احتمالية التحركات الحادة في كلا الاتجاهين.',
    'حدث ماكرو مرتقب': 'حدث ماكرو مرتقب — قد يُعيد رسم المشهد الهيكلي بالكامل.',
  };
  const ctxNote = contextNotes[marketContext] ?? '';

  const coreThesis = `[مسودة تحليل · ${a} · ${tf}] ${ctxNote} البنية الحالية تُظهر طبقات سيولة متراكمة عند مناطق رئيسية، مع تفاوت في زخم الطرفين. السيناريو الأساسي يفترض اختباراً هيكلياً لمنطقة التوازن قبل إصدار حكم الاتجاه. مستوى المخاطرة المُدخل: ${riskLevel === 'low' ? 'منخفض' : riskLevel === 'medium' ? 'متوسط' : 'مرتفع'}.`;

  const bullishScenario = `السيناريو الصاعد [مسودة]: ثبات فوق منطقة التوازن مع توسع في الحجم يُعزّز فرضية استئناف الاتجاه الصاعد. تأكيد إضافي عبر إعادة اختبار المقاومة المكسورة كدعم، ومشاركة واسعة في طيف الأصول المرتبطة. النقطة الفاصلة: إغلاق أسبوعي مدعوم فوق المستوى الهيكلي الرئيسي.`;

  const bearishScenario = `السيناريو الهابط [مسودة]: فشل في الاحتفاظ بمنطقة التوازن وتشكّل أنماط إغلاق متراجعة. كسر الدعم الرئيسي بحجم تداول مرتفع يُفعّل مسار التصحيح الأعمق نحو منطقة الطلب السابقة. مؤشر التحذير: تراجع مفاجئ في السيولة المتاحة.`;

  const invalidation = [
    'إغلاق حاسم أسفل مستوى الدعم الهيكلي الرئيسي بزخم بيعي متصاعد',
    'ارتفاع حاد في مؤشر التقلب يتجاوز الانحراف المعياري الثالث',
    'تدفقات مخالفة مؤكدة من محافظ كبيرة خلال ٤٨ ساعة متتالية',
    'قرار ماكرو مفاجئ يُعيد رسم معادلة السيولة الكلية',
  ];

  const earlyWarnings = [
    'انحراف سلبي في مؤشر الزخم مقابل حركة السعر على الإطار الأعلى',
    'انكماش عمق دفتر الأوامر عند المستويات الحرجة بمقدار يزيد على ٣٠٪',
    'ارتفاع نسبة الصفقات البيعية الكبيرة مقابل الشرائية خلال جلسة آسيا',
    'هبوط مؤشر القوة النسبية تحت ٤٠ على الإطار الأسبوعي',
  ];

  const nextDataNeeded = [
    `تدفقات العملات المستقرة للبورصات الرئيسية — ٢٤ ساعة (${dataSource})`,
    'بيانات دفتر الأوامر العميق عند مستويات الدعم والمقاومة القريبة',
    'مؤشرات التمويل للعقود الآجلة الدائمة والاهتمام المفتوح',
    'مفكرة الأحداث الاقتصادية الكبرى للأيام الثلاثة القادمة',
  ];

  const hiddenRisk = `الارتباط المخفي بأصول سيولة أخرى قد يُضخّم التحركات في حال ضغط مفاجئ. نطاق التقلب الضمني يستحق المراقبة في هذا السياق. مستوى المخاطرة المُدخل: ${riskLevel === 'low' ? 'منخفض' : riskLevel === 'medium' ? 'متوسط' : 'مرتفع'}.`;

  const decisionBoundary = `حدود الحكم [مسودة]: هذا التحليل يُنتج سيناريوهات وشروط إبطال فقط. لا يُصدر أمر تنفيذ من أي نوع. أي إجراء فعلي يتطلب تأكيداً بشرياً صريحاً خارج هذه المنصة. المنصة تعمل في وضع مسودة حصراً.`;

  // Scan the generated text for any accidentally leaked trading terms
  const allGeneratedText = [coreThesis, bullishScenario, bearishScenario, hiddenRisk, decisionBoundary].join(' ');
  const forbiddenDecisionTermsDetected = detectIn(allGeneratedText, TRADING_TERMS);

  return {
    asset: a,
    timeframe: tf,
    coreThesis,
    bullishScenario,
    bearishScenario,
    invalidation,
    earlyWarnings,
    confidenceScore: score,
    hiddenRisk,
    nextDataNeeded,
    decisionBoundary,
    forbiddenDecisionTermsDetected,
  };
}

export function generateBugBounty(input: {
  programName: string;
  policyUrl: string;
  allowedScope: string;
  forbiddenScope: string;
  assets: string;
  notes: string;
}): BugBountyOutput {
  const { programName, policyUrl, allowedScope, forbiddenScope, assets, notes } = input;

  const inScope = allowedScope.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  const outScope = forbiddenScope.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
  const assetList = assets.split(/[\n,]/).map(s => s.trim()).filter(Boolean);

  const allowedAssets = (assetList.length ? assetList : ['asset-غير-محدد']).map((name, i) => ({
    name,
    type: i % 3 === 0 ? 'Web App' : i % 3 === 1 ? 'API Endpoint' : 'Mobile App',
    priority: i === 0 ? 'عالية' : i === 1 ? 'متوسطة' : 'منخفضة',
  }));

  const vulnHypotheses = [
    {
      title: 'فرضية: تحكم بالصلاحيات على مستوى الكائن (IDOR)',
      rationale: 'استناداً إلى نمط المعرّفات الظاهر في الواجهة، يُنصح بمراجعة التحكم بالصلاحيات على المستوى الكائني ضمن النطاق المسموح فقط.',
      severity: 'عالية',
    },
    {
      title: 'فرضية: سياسات CORS مفتوحة بشكل مفرط',
      rationale: 'رؤوس CORS قد تسمح بأصول متعددة؛ يستحق التحليل الوثائقي التحقق من حدود السياسة المعلنة.',
      severity: 'متوسطة',
    },
    {
      title: 'فرضية: تسريب معلومات عبر رسائل الأخطاء',
      rationale: 'كشف مسارات أو آثار مكدّس في استجابات الخطأ يُعدّ مدخلاً محتملاً للتعرف على البنية الداخلية.',
      severity: 'منخفضة',
    },
    {
      title: 'فرضية: إدارة الجلسات وانتهاء الصلاحية',
      rationale: 'آليات انتهاء صلاحية الجلسة وإلغائها تستحق المراجعة الوثائقية قبل أي اختبار ميداني مصرح.',
      severity: 'متوسطة',
    },
  ];

  const safeChecklist = [
    'قراءة سياسة البرنامج كاملةً وتأكيد الالتزام بالنطاق المسموح حصراً',
    'التحقق أن كل أصل مُختبر مدرج صراحةً في قائمة الأصول المسموحة',
    'عدم تنفيذ أي اختبار فعلي — هذه المسودة للتخطيط والتحليل الوثائقي فقط',
    'توثيق كل خطوة مخططة قبل أي تنفيذ بشري لاحق',
    'إيقاف فوري عند أي اقتراب من أصل خارج النطاق أو غير مسموح',
    'استخدام بيئات اختبار مخصصة حين يُسمح بذلك من شروط البرنامج',
    'تجنب أي إجراء يؤثر على مستخدمين حقيقيين أو بيانات إنتاج',
  ];

  const outOfScopeWarnings = outScope.length > 0
    ? outScope.map(s => `الأصل "${s}" خارج النطاق المسموح — يجب تجنب أي تحليل ميداني عليه`)
    : [];

  const decisionBoundary = `حدود الحكم [مسودة]: هذا التحليل يُنتج خرائط نطاق وفرضيات وقوالب مسودة فقط. لا يُنفَّذ أي فحص أمني أو استغلال أو إرسال تقرير فعلي. كل إجراء خارجي يتطلب تأكيداً بشرياً صريحاً وموافقة البرنامج المعني.`;

  const evidenceTemplate = `# قالب الأدلة — ${programName || 'البرنامج'}

## العنوان
<وصف موجز للفرضية>

## الأصل المتأثر
<الأصل من قائمة الأصول المسموحة فقط>

## الخطوات المخططة (مسودة — لا تُنفَّذ)
1. <خطوة وثائقية>
2. <خطوة وثائقية>

## الأثر المتوقع (نظري)
<وصف نظري للأثر المحتمل دون تنفيذ>

## إثبات المفهوم (نصي فقط — لا تنفيذ)
<وصف نظري — لا يُنفَّذ>

## التوصية المقترحة للإصلاح
<توصية>

---
> تنبيه: هذا القالب للتوثيق المسبق فقط. أي تنفيذ يتطلب موافقة صريحة من البرنامج.`;

  const draftReport = `# مسودة تقرير — ${programName || 'برنامج غير مسمى'}

> الحالة: مسودة تحليلية — لم يُنفَّذ أي اختبار فعلي.
> سياسة البرنامج: ${policyUrl || 'غير محددة'}
> تاريخ الإنشاء: ${new Date().toLocaleDateString('ar-SA')}

## الملخص التنفيذي
تحليل أولي للنطاق والأصول المعلنة، مع فرضيات ثغرات مرتبة حسب الأولوية. هذه المسودة للمراجعة البشرية قبل أي إجراء خارجي. لا يُستخدم هذا التقرير كدليل على اختبار فعلي.

## النطاق
- **مسموح**: ${inScope.length ? inScope.join('، ') : 'غير محدد'}
- **ممنوع**: ${outScope.length ? outScope.join('، ') : 'غير محدد'}

## الأصول المحللة (وثائقياً)
${assetList.length ? assetList.map(a => `- ${a}`).join('\n') : '- غير محدد'}

## فرضيات الثغرات
${vulnHypotheses.map((v, i) => `${i + 1}. ${v.title} [${v.severity}]`).join('\n')}

## ملاحظات المحلل
${notes || 'لا توجد ملاحظات إضافية.'}

## حدود الحكم
${decisionBoundary}

## الخطوة التالية
تأكيد بشري صريح وموافقة البرنامج قبل أي إجراء ميداني.`;

  // Scan generated text for accidentally leaked unsafe terms
  const allGeneratedText = [
    ...vulnHypotheses.map(v => v.title + ' ' + v.rationale),
    ...safeChecklist,
    evidenceTemplate,
    draftReport,
  ].join(' ');
  const unsafeTermsDetected = detectIn(allGeneratedText, SECURITY_TERMS);

  return {
    programName: programName || 'برنامج غير مسمى',
    scopeMap: {
      in: inScope.length ? inScope : ['لم تُحدَّد نطاقات مسموحة'],
      out: outScope.length ? outScope : ['لم تُحدَّد نطاقات ممنوعة'],
    },
    allowedAssets,
    forbiddenAssets: outScope.length ? outScope : [],
    vulnHypotheses,
    safeChecklist,
    evidenceTemplate,
    draftReport,
    outOfScopeWarnings,
    decisionBoundary,
    unsafeTermsDetected,
  };
}

// ── Test mode sample data ────────────────────────────────────────────────────

export const SAMPLE_MARKET_INTEL_INPUT = {
  asset: 'BTC/USDT',
  timeframe: '4H',
  marketContext: 'نطاق عرضي',
  dataSource: 'Binance Spot',
  riskLevel: 'medium',
  notes: 'سياق ماكرو: قرار فيدرالي مرتقب خلال أسبوعين. الحجم أقل من المتوسط.',
};

export const SAMPLE_BUG_BOUNTY_INPUT = {
  programName: 'ACME Security Program (Sample)',
  policyUrl: 'https://example.com/security-policy',
  allowedScope: '*.acme-app.com\napi.acme-app.com\nbeta.acme-app.com',
  forbiddenScope: 'billing.acme-app.com\ninternal.acme-app.com\nadmin.acme-app.com',
  assets: 'app.acme-app.com\napi.acme-app.com/v2\nAndroid APK (latest)',
  notes: 'بيئة sandbox متاحة. الاختبار مسموح خلال ساعات العمل فقط.',
};
