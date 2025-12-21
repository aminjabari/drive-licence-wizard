import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWizard } from './WizardContext';
import welcomeHero from '@/assets/welcome-hero.png';
import sadarLogo from '@/assets/sadar-logo.png';
import { iranProvinces } from '@/lib/iranProvinces';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePhoneValidation } from '@/hooks/usePhoneValidation';

interface WelcomePageProps {
  onStart: () => void;
}

export function WelcomePage({ onStart }: WelcomePageProps) {
  const { userInfo, setUserInfo } = useWizard();
  const [searchParams] = useSearchParams();
  
  const [localName, setLocalName] = useState(userInfo.fullName);
  const [localProvince, setLocalProvince] = useState(userInfo.province);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
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

  const handleStart = () => {
    if (!validatePhone()) return;
    setUserInfo({ fullName: localName, phoneNumber: sanitizedPhone, province: localProvince });
    onStart();
  };

  const handleProvinceSelect = (province: string) => {
    setLocalProvince(province);
    setDrawerOpen(false);
  };

  const isValid = localName.trim().length > 0 && isPhoneValid && localProvince.length > 0;

  return (
    <div className="flex flex-col h-[100dvh] bg-card max-w-[600px] mx-auto" dir="rtl">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8">
        <img src={sadarLogo} alt="سدار" className="h-16 w-auto mb-4" />
        
        <img 
          src={welcomeHero} 
          alt="کارت هوشمند رانندگی" 
          className="w-48 h-auto mb-4 rounded-lg"
        />
        
        <h1 className="text-2xl font-bold text-foreground mb-4">خوش آمدید</h1>
        <p className="text-muted-foreground text-sm text-center mb-8 max-w-xs leading-relaxed">
          برای شروع فرآیند ثبت‌نام و ارزیابی شرایط اخذ کارت هوشمند رانندگی، لطفاً اطلاعات خود را وارد کنید.
        </p>
        
        <form className="w-full max-w-sm space-y-4" autoComplete="on">
          <Input
            id="fullName"
            placeholder="نام و نام خانوادگی"
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            className="text-right bg-card border-border h-12 rounded-full px-6"
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
                "text-right bg-card h-12 rounded-full px-6 transition-all border-border",
                hasPhoneError 
                  ? "ring-2 ring-destructive ring-offset-2" 
                  : isPhoneValid 
                    ? "ring-2 ring-primary ring-offset-2" 
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
                  onChange={(e) => {
                    const value = e.target.value;
                    if (iranProvinces.includes(value)) {
                      setLocalProvince(value);
                    }
                  }}
                  className="text-right bg-card border-border h-12 rounded-full px-6 cursor-pointer"
                  autoComplete="address-level1"
                  name="address-level1"
                  onClick={() => setDrawerOpen(true)}
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
          onClick={handleStart}
          disabled={!isValid}
          className="w-full h-12 rounded-full text-lg font-medium"
        >
          بزن بریم
        </Button>
      </div>
    </div>
  );
}
