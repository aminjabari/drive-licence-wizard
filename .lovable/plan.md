
## برنامه افزایش اولویت استایل فیلدهای ورودی

### مشکل
وقتی ویزارد در صفحه‌ای با استایل‌های دیگر (مثل وردپرس) embed می‌شود، استایل‌های CSS خارجی ممکن است استایل‌های فیلدهای ورودی را override کنند.

### راه‌حل
استفاده از **CSS specificity بالاتر** با افزودن استایل‌های اختصاصی در `@layer components` به جای استفاده صرف از Tailwind classes.

---

### تغییرات مورد نیاز

#### فایل: `src/index.css`

اضافه کردن استایل‌های اختصاصی برای فیلدهای ورودی ویزارد با specificity بالا:

```css
@layer components {
  /* Wizard Input Styles - High Specificity */
  .wizard-input,
  input.wizard-input[type="text"],
  input.wizard-input[type="tel"],
  input.wizard-input[type="email"] {
    display: flex !important;
    width: 100% !important;
    height: 3rem !important;
    border-radius: 9999px !important;
    border: 1px solid hsl(var(--border)) !important;
    background-color: hsl(var(--card)) !important;
    padding: 0.5rem 1.5rem !important;
    font-size: 1rem !important;
    font-family: var(--font-sans) !important;
    color: hsl(var(--foreground)) !important;
    outline: none !important;
    box-shadow: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    transition: all 150ms ease !important;
  }

  .wizard-input::placeholder {
    color: hsl(var(--muted-foreground)) !important;
    opacity: 1 !important;
  }

  .wizard-input:focus {
    ring: 2px solid hsl(var(--ring)) !important;
    ring-offset: 2px !important;
    border-color: hsl(var(--ring)) !important;
  }

  .wizard-input:disabled {
    cursor: not-allowed !important;
    opacity: 0.5 !important;
  }

  /* Wizard Button Styles */
  .wizard-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 100% !important;
    height: 3rem !important;
    border-radius: 9999px !important;
    background-color: hsl(var(--primary)) !important;
    color: hsl(var(--primary-foreground)) !important;
    font-size: 1.125rem !important;
    font-weight: 500 !important;
    font-family: var(--font-sans) !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 150ms ease !important;
  }

  .wizard-button:hover:not(:disabled) {
    background-color: hsl(var(--primary) / 0.9) !important;
  }

  .wizard-button:disabled {
    pointer-events: none !important;
    opacity: 0.5 !important;
  }
}
```

---

#### فایل: `src/components/wizard/WelcomePage.tsx`

اضافه کردن کلاس `wizard-input` و `wizard-button` به المنت‌ها:

```tsx
// Input نام
<Input
  id="fullName"
  ...
  className="wizard-input text-right"
/>

// Input تلفن
<Input
  id="phone"
  ...
  className={cn(
    "wizard-input text-right transition-all",
    hasPhoneError ? "ring-2 ring-destructive" : isPhoneValid ? "ring-2 ring-primary" : ""
  )}
/>

// Input استان
<Input
  id="province"
  ...
  className="wizard-input text-right cursor-pointer"
/>

// Button
<Button
  ...
  className="wizard-button"
>
```

---

### مقایسه

| ویژگی | قبل | بعد |
|-------|-----|-----|
| Specificity | کلاس‌های Tailwind معمولی | کلاس‌های اختصاصی با `!important` |
| مقاومت در برابر override | ❌ کم | ✅ بالا |
| فونت | ممکن است override شود | ✅ تضمین شده |
| ابعاد و شکل | ممکن است override شود | ✅ تضمین شده |

---

### بخش فنی

**چرا `!important`؟**
- وقتی ویزارد در iframe یا embed در صفحه وردپرس قرار می‌گیرد، استایل‌های تم وردپرس (مثلاً Elementor، theme های مختلف) اغلب از `!important` استفاده می‌کنند
- بدون `!important`، حتی با specificity بالاتر، ممکن است استایل‌های خارجی برنده شوند

**چرا `@layer components`؟**
- Tailwind layer system امکان کنترل ترتیب بارگذاری را می‌دهد
- استایل‌های `components` بعد از `base` و قبل از `utilities` بارگذاری می‌شوند
