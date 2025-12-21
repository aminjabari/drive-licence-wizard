import { useState, useCallback } from 'react';
import { 
  validateIranianMobile, 
  sanitizeIranianPhone,
  convertPersianToEnglishNumbers 
} from '@/lib/phoneValidation';

interface UsePhoneValidationReturn {
  phone: string;
  error: string | undefined;
  isValid: boolean;
  hasError: boolean; // نشان‌دهنده وضعیت خطا (حتی در حین تایپ)
  handlePhoneChange: (value: string) => void;
  validatePhone: () => boolean;
  sanitizedPhone: string;
}

export function usePhoneValidation(initialValue: string = ''): UsePhoneValidationReturn {
  const [phone, setPhone] = useState(initialValue);
  const [error, setError] = useState<string | undefined>();
  const [isValid, setIsValid] = useState(false);

  const handlePhoneChange = useCallback((value: string) => {
    // تبدیل آنی اعداد فارسی به انگلیسی
    const converted = convertPersianToEnglishNumbers(value);
    // حذف کاراکترهای غیرعددی به جز + در ابتدا
    const cleaned = converted.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    
    setPhone(cleaned);
    
    // اعتبارسنجی در زمان تایپ
    if (cleaned.length > 0) {
      const result = validateIranianMobile(cleaned);
      // همیشه خطا را نشان بده اگر معتبر نیست
      setError(result.error);
      setIsValid(result.isValid);
    } else {
      setError('شماره تلفن را وارد کنید');
      setIsValid(false);
    }
  }, []);

  const validatePhone = useCallback((): boolean => {
    const result = validateIranianMobile(phone);
    setError(result.error);
    setIsValid(result.isValid);
    return result.isValid;
  }, [phone]);

  const sanitizedPhone = sanitizeIranianPhone(phone);
  
  // hasError: اگر شماره وارد شده و معتبر نیست
  const hasError = phone.length > 0 && !isValid;

  return {
    phone,
    error,
    isValid,
    hasError,
    handlePhoneChange,
    validatePhone,
    sanitizedPhone,
  };
}
