# FATHIYA OPS CONSOLE — Bolt Patch v1.1

## الهدف
تحويل النسخة الحالية من واجهة سيادية جميلة إلى Console تشغيلية فعلية:
- مدخلات داخل كل وحدة
- مخرجات Draft منظمة
- سجل نشاط محلي
- تصدير Markdown
- Red Zone مقفلة فعليًا

## ملاحظة حول الرابطين
- رابط الواجهة المنشورة يصلح للمراجعة البصرية.
- رابط Bolt request-access يحتاج موافقة/صلاحية داخل حساب Bolt. ChatGPT لا يدخل كحساب مستقل؛ الأفضل ربط المشروع بـ GitHub أو رفع zip/ملفات الكود.

## Prompt جاهز لـ Bolt

Paste this into Bolt:

Upgrade the current FATHIYA OPS CONSOLE to v1.1.

Keep the current visual identity:
- Arabic-first RTL interface
- Black/gold sovereign command center style
- Red Zone section
- Control Layer banner
- Draft-only operating doctrine
- System Status panel

Do not change the brand feeling. Improve functionality.

Fix layout:
1. The fixed header is covering content while scrolling.
2. Add enough top padding to the main content.
3. Make the header slightly more compact on smaller screens.
4. Keep all sections readable at 100% browser zoom.

Add module routing:
- Main Dashboard
- Market Intel Workspace
- Bug Bounty Workspace

When the user clicks "دخول الوحدة" on Market Intel:
Open Market Intel Workspace.

Market Intel Workspace must include:
- Back button: العودة للوحة
- Form fields:
  - الأصل / زوج العملة
  - الإطار الزمني
  - سياق السوق
  - مصدر البيانات
  - مستوى المخاطرة
  - ملاحظات
- Button: توليد مسودة تحليل

On submit, generate local mock output cards:
- الفرضية الأساسية
- السيناريو الصاعد
- السيناريو الهابط
- شروط الإبطال
- إشارات الإنذار المبكر
- درجة الثقة
- الخطر الخفي
- البيانات المطلوبة لاحقًا

When the user clicks "دخول الوحدة" on Bug Bounty:
Open Bug Bounty Workspace.

Bug Bounty Workspace must include:
- Back button: العودة للوحة
- Form fields:
  - اسم البرنامج
  - رابط السياسة
  - النطاق المسموح
  - النطاق الممنوع
  - الأصول / Assets
  - ملاحظات
- Button: توليد مسودة تحليل

On submit, generate local mock output cards:
- خريطة النطاق
- الأصول المسموحة
- الأصول الممنوعة
- فرضيات الثغرات
- قائمة فحص آمنة
- قالب الأدلة
- مسودة التقرير

Add local activity log:
- Every draft generation adds a log entry.
- Fields:
  - timestamp
  - module
  - input summary
  - status: Draft Generated
- Persist the log in localStorage.
- Show latest entries on the dashboard.
- Add Clear Log button, but require a small confirmation modal.

Add export:
- Each generated output panel must have:
  - Export Markdown
- Export should download a local .md file in the browser.
- No server upload.

Red Zone:
- Keep all Red Zone buttons visually locked.
- Use real disabled attributes.
- Disabled buttons:
  - Modify GitHub
  - Trigger Webhook
  - Send Email
  - Execute Trade
  - Submit Bug Report
  - Run n8n Workflow
- On hover, show tooltip:
  "مقفل — يتطلب أمرًا صريحًا"

System Status:
Update status labels:
- Frontend: Active
- Market Intel Engine: Local Mock
- Bug Bounty Engine: Local Mock
- GitHub: Not Connected
- n8n: Not Connected
- Zapier: Connected / Guarded
- Execution Mode: Draft Only

Add a footer note:
"فتحية لا تنفذ قرارات. فتحية توسّع الوعي وتنتج مسودات قابلة للمراجعة."

Do not add:
- Real APIs
- Authentication
- Trading execution
- Security scanning
- GitHub write actions
- n8n workflow execution
- Email sending
- Webhooks

Everything remains local, mock, draft-only.
