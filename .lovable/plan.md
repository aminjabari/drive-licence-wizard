

## برنامه حذف بررسی لاگین و دریافت اطلاعات از دیتابیس

### خلاصه تغییرات
حذف تمام منطق مربوط به بررسی لاگین WordPress و دریافت اطلاعات از دیتابیس. از این پس فقط localStorage برای ذخیره و بازیابی اطلاعات استفاده می‌شود.

---

### فایل‌هایی که تغییر می‌کنند

#### ۱. `src/components/wizard/WelcomePage.tsx`
**حذف شود:**
- ایمپورت `useWordPressUser`
- ایمپورت `getAssessmentFromWordPress`
- ایمپورت `ExistingAssessmentDialog`
- متغیر `isLoggedIn` از هوک
- state های `showExistingDialog` و `isCheckingPhone`
- شرط `!isLoggedIn` در useEffect بارگذاری localStorage
- بلوک بررسی دیتابیس در `handleStart` (خطوط 75-92)
- کامپوننت `ExistingAssessmentDialog` از JSX
- شرط `!isCheckingPhone` از `isValid`
- متن "در حال بررسی..." از دکمه

#### ۲. `src/components/wizard/WizardContainer.tsx`
**حذف شود:**
- ایمپورت `getAssessmentFromWordPress`
- ایمپورت `useWordPressUser`
- state های `isLoading` و `wpDataChecked`
- استفاده از هوک `useWordPressUser`
- useEffect بررسی کاربر WordPress (خطوط 58-64)
- تابع `checkWpUserAssessment` (خطوط 67-107)
- تابع `checkAssessmentStatus` (خطوط 109-139)
- فراخوانی `checkAssessmentStatus` در `handleStartWizard`
- صفحه loading

#### ۳. `src/components/wizard/ExistingAssessmentDialog.tsx`
**حذف کامل فایل** - دیگر استفاده نمی‌شود

#### ۴. `src/services/wordpressDirectApi.ts`
**حذف شود:**
- تابع `getAssessmentFromWordPress` و تمام کد مربوطه

تابع `saveAssessmentToWordPress` **باقی می‌ماند** چون در `AssessmentQuestions.tsx` برای ذخیره نتیجه ارزیابی استفاده می‌شود.

#### ۵. `src/hooks/useWordPressUser.ts`
**حذف کامل فایل** - دیگر استفاده نمی‌شود

---

### نتیجه نهایی

| قبل | بعد |
|-----|-----|
| بررسی لاگین WordPress | فقط localStorage |
| بررسی شماره در دیتابیس | فقط localStorage |
| نمایش دیالوگ "ارزیابی قبلی یافت شد" | مستقیم ادامه |
| دریافت اطلاعات از دیتابیس | فقط localStorage |
| ذخیره در دیتابیس WordPress | **همچنان ذخیره می‌شود** |

### منطق جدید
- در صفحه خوش‌آمدگویی، فقط localStorage بررسی می‌شود
- اگر `isEligible === true` در localStorage باشد، ارزیابی قبلی معتبر است
- ذخیره نتیجه ارزیابی در دیتابیس WordPress همچنان انجام می‌شود (برای گزارش‌گیری)

