import { VideoContentStep } from './VideoContentStep';
import { WizardFooter } from './WizardFooter';
import { useWizard } from './WizardContext';
import costVideo from '@/assets/cost.mp4';

interface Step2DocumentsProps {
  onNext: () => void;
  onPrev: () => void;
}

export function Step2Documents({ onNext, onPrev }: Step2DocumentsProps) {
  const { markStepComplete } = useWizard();

  const handleNext = () => {
    markStepComplete(2);
    onNext();
  };

  return (
    <>
      <VideoContentStep
        title="هزینه و زمان صدور"
        videoSrc={costVideo}
        description={`💰 هزینه صدور کارت هوشمند رانندگی
در حال حاضر، هزینه گرفتن کارت هوشمند رانندگی حدود ۵ تا ۷ میلیون تومان است.

⏱️ مدت زمان صدور کارت هوشمند
به طور معمول، تکمیل مراحل و دریافت کارت بین ۳ تا ۴ ماه زمان می‌برد.`}
      />
      <WizardFooter
        onNext={handleNext}
        onPrev={onPrev}
      />
    </>
  );
}
