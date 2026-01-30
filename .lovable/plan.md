
## برنامه حذف بازیابی مرحله از localStorage

### تغییر مورد نیاز

#### فایل: `src/components/wizard/WizardContext.tsx`

**تغییر تابع `loadFromLocalStorage`:**

حذف خط ست کردن `currentStep`:

```typescript
// قبل (خطوط 78-86):
if (storedData) {
  setUserInfo(storedData.userInfo);
  setAssessmentAnswers(storedData.assessmentAnswers);
  setIsEligible(storedData.isEligible);
  setCurrentStep(storedData.currentStep);        // ← این خط حذف شود
  setCompletedSteps(storedData.completedSteps);
  if (storedData.isEligible !== null) {
    setAssessmentStarted(true);
  }
}

// بعد:
if (storedData) {
  setUserInfo(storedData.userInfo);
  setAssessmentAnswers(storedData.assessmentAnswers);
  setIsEligible(storedData.isEligible);
  setCompletedSteps(storedData.completedSteps);
  if (storedData.isEligible !== null) {
    setAssessmentStarted(true);
  }
}
```

---

### نتیجه

| داده | ذخیره می‌شود؟ | بازیابی می‌شود؟ |
|------|--------------|----------------|
| اطلاعات کاربر (نام، تلفن، استان) | ✅ | ✅ |
| پاسخ‌های ارزیابی | ✅ | ✅ |
| نتیجه واجد شرایط بودن | ✅ | ✅ |
| مراحل تکمیل شده | ✅ | ✅ |
| **مرحله فعلی** | ✅ | ❌ (همیشه از ۱ شروع) |

---

### توضیح

- `currentStep` همچنان در localStorage ذخیره می‌شود (برای احتمال استفاده آینده)
- اما هنگام بازیابی، مرحله فعلی ست نمی‌شود
- کاربر همیشه از مرحله ۱ شروع می‌کند، اما اطلاعات قبلی‌اش (نام، ارزیابی و...) موجود است
