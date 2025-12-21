import { useRef, useEffect } from 'react';
import { useWizard } from './WizardContext';
import { WizardFooter } from './WizardFooter';
import registerVideo from '@/assets/register.mp4';
import { useWordPressEvents } from '@/hooks/useWordPressEvents';

interface Step4RegistrationProps {
  onPrev: () => void;
}

export function Step4Registration({ onPrev }: Step4RegistrationProps) {
  const { markStepComplete } = useWizard();
  const { dispatch: dispatchWpEvent } = useWordPressEvents();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, []);

  const handleRegister = () => {
    // Dispatch registration_clicked event to WordPress
    dispatchWpEvent('registration_clicked');
    
    markStepComplete(4);
    window.open('https://sadar.ir', '_blank');
  };

  return (
    <>
      <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
        {/* Video */}
        <div className="w-full aspect-[16/9] flex-shrink-0 bg-secondary flex items-center justify-center relative overflow-hidden">
          <video 
            ref={videoRef}
            src={registerVideo}
            controls
            className="w-full h-full object-cover"
            playsInline
          />
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">ثبت‌نام کارت هوشمند</h2>
          
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
{`🎉 تبریک! فقط یک قدم تا ثبت‌نام کارت هوشمند رانندگی فاصله دارید. 🚗💳

✨ امیدواریم این راهنمای هوشمند مسیر گرفتن کارت هوشمند رانندگی رو برای شما شفاف کرده باشه.

🟢 برای شروع ثبت‌نام آنلاین کارت هوشمند، کافیه روی دکمه‌ی زیر بزنید و از طریق سایت سدار اقدام کنید. 🔗`}
          </p>
        </div>
      </div>
      
      <WizardFooter
        onPrev={onPrev}
        showNext={false}
        actionLabel="ثبت‌نام در سایت سدار"
        onAction={handleRegister}
      />
    </>
  );
}
