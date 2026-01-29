
## برنامه اعمال تغییرات

### ۱. تغییر آدرس سایت وردپرسی در `.env`

```
قبل: VITE_WORDPRESS_API_URL="https://test.aminjabari.com"
بعد: VITE_WORDPRESS_API_URL="https://sadar.ir"
```

---

### ۲. حذف ایونت `step_changed` از `WizardContainer.tsx`

حذف ارسال ایونت در دو جای `handleNext` و `handlePrev`:

**فایل:** `src/components/wizard/WizardContainer.tsx`

```typescript
// handleNext - حذف خط 67
dispatchWpEvent('step_changed', { currentStep: newStep });

// handlePrev - حذف خط 84
dispatchWpEvent('step_changed', { currentStep: newStep });
```

همچنین می‌توان ایمپورت `useWordPressEvents` و متغیر `dispatchWpEvent` را حذف کرد چون دیگر استفاده نمی‌شود.

---

### ۳. اصلاح لینک ثبت‌نام با UTM در `Step4Registration.tsx`

**فایل:** `src/components/wizard/Step4Registration.tsx`

تغییر آدرس و اضافه کردن UTM:
```typescript
// قبل:
window.open('https://sadar.ir', '_blank');

// بعد:
window.open('https://sadar.ir/course/exam?utm_source=wizard&utm_medium=cta&utm_campaign=smart_card', '_blank');
```

---

### ۴. اضافه کردن تأخیر ۲.۵ ثانیه‌ای با حالت loading

**فایل:** `src/components/wizard/WizardFooter.tsx`

اضافه کردن prop جدید `actionLoading`:
```typescript
interface WizardFooterProps {
  // ... existing props
  actionLoading?: boolean;
}
```

و استفاده در دکمه:
```typescript
<Button
  onClick={onAction}
  disabled={actionLoading}
  className="flex-1 h-12 rounded-full text-base font-medium"
>
  {actionLoading ? 'در حال ارسال...' : actionLabel}
</Button>
```

**فایل:** `src/components/wizard/Step4Registration.tsx`

اضافه کردن state و تغییر `handleRegister`:
```typescript
const [isLoading, setIsLoading] = useState(false);

const handleRegister = async () => {
  setIsLoading(true);
  
  // Dispatch registration_clicked event to WordPress
  dispatchWpEvent('registration_clicked');
  
  // Wait 2.5 seconds for event to be fully dispatched
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  markStepComplete(4);
  window.open('https://sadar.ir/course/exam?utm_source=wizard&utm_medium=cta&utm_campaign=smart_card', '_blank');
  
  setIsLoading(false);
};

// در JSX:
<WizardFooter
  onPrev={onPrev}
  showNext={false}
  actionLabel="ثبت‌نام در سایت سدار"
  onAction={handleRegister}
  actionLoading={isLoading}
/>
```

---

### خلاصه تغییرات

| فایل | تغییر |
|------|-------|
| `.env` | تغییر URL به `https://sadar.ir` |
| `WizardContainer.tsx` | حذف ارسال ایونت `step_changed` |
| `Step4Registration.tsx` | اصلاح لینک + اضافه کردن loading |
| `WizardFooter.tsx` | اضافه کردن prop `actionLoading` |

---

### بخش فنی

**UTM Parameters:**
- `utm_source=wizard` - منبع: ویزارد کارت هوشمند
- `utm_medium=cta` - نوع: دکمه Call-to-Action
- `utm_campaign=smart_card` - کمپین: کارت هوشمند
