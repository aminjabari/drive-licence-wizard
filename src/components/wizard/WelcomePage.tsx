import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWizard } from './WizardContext';
import { iranProvinces } from '@/lib/iranProvinces';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';
import { dispatchToWordPress } from '@/hooks/useWordPressEvents';
import { getImageUrl } from '@/lib/media';

interface WelcomePageProps {
  onStart: () => void;
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  const { userInfo, setUserInfo, loadFromLocalStorage } = useWizard();
  const [searchParams] = useSearchParams();
  
  const [localName, setLocalName] = useState(userInfo.fullName);
  const [localProvince, setLocalProvince] = useState(userInfo.province);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);
  
  const { 
    phone: localPhone, 
    error: phoneError, 
    isValid: isPhoneValid, 
    hasError: hasPhoneError,
    handlePhoneChange, 
    validatePhone,
    sanitizedPhone 
  } = usePhoneValidation(userInfo.phoneNumber);

  // Auto-populate from query params on mount
  useEffect(() => {
    const nameParam = searchParams.get('name') || searchParams.get('fullName');
    const phoneParam = searchParams.get('phone') || searchParams.get('mobile');
    const provinceParam = searchParams.get('province');

    if (nameParam && !localName) setLocalName(nameParam);
    if (phoneParam && !localPhone) handlePhoneChange(phoneParam);
    if (provinceParam && !localProvince && iranProvinces.includes(provinceParam)) {
      setLocalProvince(provinceParam);
    }
  }, [searchParams]);

  // Check localStorage on mount (one record per device)
  useEffect(() => {
    if (!localStorageChecked) {
      const storedData = loadFromLocalStorage();
      if (storedData) {
        setLocalName(storedData.userInfo.fullName);
        setLocalProvince(storedData.userInfo.province);
        if (storedData.userInfo.phoneNumber) {
          handlePhoneChange(storedData.userInfo.phoneNumber);
        }
      }
      setLocalStorageChecked(true);
    }
  }, [localStorageChecked, loadFromLocalStorage]);


  const handleStart = () => {
    if (!validatePhone()) return;
    
    const newUserInfo = { fullName: localName, phoneNumber: sanitizedPhone, province: localProvince };
    setUserInfo(newUserInfo);
    
    // Dispatch welcome_started event to WordPress
    dispatchToWordPress({
      action: 'welcome_started',
      userInfo: newUserInfo,
      assessmentAnswers: {},
      isEligible: null,
      currentStep: 1,
      timestamp: new Date().toISOString(),
    });
    
    onStart();
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleProvinceSelect = (province: string) => {
    setLocalProvince(province);
    setDrawerOpen(false);
    // Focus on the submit button after province selection
    setTimeout(() => buttonRef.current?.focus(), 100);
  };

  const isValid = localName.trim().length > 0 && isPhoneValid && localProvince.length > 0;

  return (
    <div className="flex flex-col h-[100dvh] bg-card max-w-[600px] mx-auto" dir="rtl">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8">
        <img src={getImageUrl('logo')} alt="سدار" className="h-16 w-auto mb-4" />
        
        <img 
          src={getImageUrl('smartCard')} 
          alt="کارت هوشمند رانندگی" 
          className="w-64 h-auto mb-4 rounded-lg shadow-md"
        />
        
        <h1 className="text-xl font-bold text-foreground mb-4 text-center">راهنمای آنلاین ثبت‌نام کارت هوشمند رانندگی</h1>
        <p className="text-muted-foreground text-sm text-center mb-8 max-w-xs leading-relaxed">
          برای شروع فرآیند ثبت‌نام و ارزیابی شرایط اخذ کارت هوشمند رانندگی، لطفاً اطلاعات خود را وارد کنید.
        </p>
        
        <form className="w-full max-w-sm space-y-4" autoComplete="on">
          <Input
            id="fullName"
            placeholder="نام و نام خانوادگی"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="wizard-input text-right"
            autoComplete="name"
            name="name"
          />
          <div className="space-y-1">
            <Input
              id="phone"
              placeholder="شماره تماس (مثال: ۰۹۱۲۱۲۳۴۵۶۷)"
              type="tel"
              value={localPhone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={cn(
                "wizard-input text-right",
                hasPhoneError 
                  ? "!ring-2 !ring-destructive !ring-offset-2" 
                  : isPhoneValid 
                    ? "!ring-2 !ring-primary !ring-offset-2" 
                    : ""
              )}
              dir="ltr"
              inputMode="tel"
              autoComplete="tel-national"
              name="tel"
            />
            {hasPhoneError && phoneError && (
              <p className="text-destructive text-xs px-4">{phoneError}</p>
            )}
          </div>
          
          {/* Province Drawer for Mobile-Friendly Selection */}
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <div className="relative">
                <Input
                  id="province"
                  placeholder="انتخاب استان"
                  value={localProvince}
                  readOnly
                  className="wizard-input text-right cursor-pointer"
                  autoComplete="off"
                  name="address-level1"
                  onClick={() => setDrawerOpen(true)}
                  onFocus={() => setDrawerOpen(true)}
                />
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh] max-w-[600px] mx-auto left-0 right-0" dir="rtl">
              <DrawerHeader className="text-right border-b border-border">
                <DrawerTitle>انتخاب استان</DrawerTitle>
              </DrawerHeader>
              <div className="overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-2">
                  {iranProvinces.map((province) => (
                    <button
                      key={province}
                      onClick={() => handleProvinceSelect(province)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg text-right transition-colors border",
                        localProvince === province
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white border-border hover:bg-muted/50"
                      )}
                    >
                      <span>{province}</span>
                      {localProvince === province && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </form>
      </div>
      
      {/* Footer Button */}
      <div className="p-6">
        <Button
          ref={buttonRef}
          onClick={handleStart}
          disabled={!isValid}
          className="wizard-button"
        >
          بزن بریم
        </Button>
      </div>
    </div>
  );
}
