/**
 * تبدیل اعداد فارسی/عربی به انگلیسی
 */
export function convertPersianToEnglishNumbers(str: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  
  let result = str;
  
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(persianNumbers[i], 'g'), i.toString());
    result = result.replace(new RegExp(arabicNumbers[i], 'g'), i.toString());
  }
  
  return result;
}

/**
 * پاک‌سازی و نرمال‌سازی شماره تلفن ایرانی
 */
export function sanitizeIranianPhone(phone: string): string {
  // تبدیل اعداد فارسی/عربی به انگلیسی
  let sanitized = convertPersianToEnglishNumbers(phone);
  
  // حذف تمام کاراکترهای غیرعددی (فاصله، خط تیره، پرانتز و غیره)
  sanitized = sanitized.replace(/\D/g, '');
  
  // مدیریت کدهای کشوری مختلف
  if (sanitized.startsWith('0098')) {
    sanitized = '0' + sanitized.slice(4);
  } else if (sanitized.startsWith('98') && sanitized.length > 10) {
    sanitized = '0' + sanitized.slice(2);
  } else if (sanitized.startsWith('+98')) {
    sanitized = '0' + sanitized.slice(3);
  }
  
  return sanitized;
}

/**
 * اعتبارسنجی شماره موبایل ایرانی
 */
export function validateIranianMobile(phone: string): {
  isValid: boolean;
  error?: string;
  sanitized: string;
} {
  const sanitized = sanitizeIranianPhone(phone);
  
  // بررسی خالی بودن
  if (!sanitized) {
    return { isValid: false, error: 'شماره تلفن را وارد کنید', sanitized };
  }
  
  // بررسی طول (باید دقیقاً 11 رقم باشد)
  if (sanitized.length !== 11) {
    return { 
      isValid: false, 
      error: `شماره باید ۱۱ رقم باشد (${sanitized.length} رقم وارد شده)`, 
      sanitized 
    };
  }
  
  // بررسی شروع با 09
  if (!sanitized.startsWith('09')) {
    return { 
      isValid: false, 
      error: 'شماره موبایل باید با ۰۹ شروع شود', 
      sanitized 
    };
  }
  
  // بررسی فقط عدد بودن
  if (!/^\d+$/.test(sanitized)) {
    return { 
      isValid: false, 
      error: 'شماره فقط باید شامل اعداد باشد', 
      sanitized 
    };
  }
  
  return { isValid: true, sanitized };
}

/**
 * فرمت کردن شماره برای نمایش (اختیاری)
 */
export function formatIranianPhone(phone: string): string {
  const sanitized = sanitizeIranianPhone(phone);
  if (sanitized.length === 11) {
    return `${sanitized.slice(0, 4)}-${sanitized.slice(4, 7)}-${sanitized.slice(7)}`;
  }
  return sanitized;
}
