

## برنامه اصلاح سیستم ذخیره‌سازی LocalStorage

### مشکل فعلی
در حال حاضر، کلید ذخیره‌سازی بر اساس شماره تلفن تولید می‌شود:
```
wizard_data_09121234567
wizard_data_09129876543
wizard_data_guest
```
این باعث می‌شود با هر شماره تلفن جدید، یک رکورد جدید ایجاد شود.

### راه‌حل
تغییر سیستم به یک کلید ثابت برای هر دستگاه:
```
wizard_data
```

### تغییرات مورد نیاز

#### ۱. به‌روزرسانی `src/hooks/useLocalStorageWithExpiry.ts`

تغییر تابع `getWizardStorageKey`:
```typescript
// قبل:
export function getWizardStorageKey(phoneNumber?: string): string {
  return phoneNumber ? `wizard_data_${phoneNumber}` : 'wizard_data_guest';
}

// بعد:
export const WIZARD_STORAGE_KEY = 'wizard_data';

export function getWizardStorageKey(): string {
  return WIZARD_STORAGE_KEY;
}
```

#### ۲. به‌روزرسانی `src/components/wizard/WizardContext.tsx`

حذف پارامتر `phoneNumber` از فراخوانی‌های `getWizardStorageKey`:

```typescript
// loadFromLocalStorage - خط 74-75
const loadFromLocalStorage = useCallback((): WizardStoredData | null => {
  const key = getWizardStorageKey(); // بدون phoneNumber
  // ...
}

// saveToLocalStorage - خط 93-96
const saveToLocalStorage = useCallback(() => {
  const key = getWizardStorageKey(); // بدون phoneNumber
  // ...
}
```

#### ۳. به‌روزرسانی `src/components/wizard/WelcomePage.tsx`

تغییر فراخوانی `loadFromLocalStorage`:
```typescript
// خط 59
const storedData = loadFromLocalStorage(); // بدون sanitizedPhone
```

### نتیجه

- **قبل:** هر شماره تلفن = یک رکورد جدید
- **بعد:** یک رکورد ثابت برای هر دستگاه/مرورگر

### نکته مهم
پس از اعمال تغییرات، رکوردهای قدیمی (با کلیدهای `wizard_data_*`) همچنان در localStorage باقی می‌مانند. اگر نیاز است پاکسازی شوند، می‌توان یک تابع migration اضافه کرد که در اولین بارگذاری، رکوردهای قدیمی را حذف کند.

