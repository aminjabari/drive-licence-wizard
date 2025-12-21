import { VideoContentStep } from './VideoContentStep';
import { WizardFooter } from './WizardFooter';
import { useWizard } from './WizardContext';
import stepsVideo from '@/assets/steps.mp4';

interface Step3ProcessProps {
  onNext: () => void;
  onPrev: () => void;
}

export function Step3Process({ onNext, onPrev }: Step3ProcessProps) {
  const { markStepComplete } = useWizard();

  const handleNext = () => {
    markStepComplete(3);
    onNext();
  };

  return (
    <>
      <VideoContentStep
        title="مراحل کارت هوشمند"
        videoSrc={stepsVideo}
        description={`📋 مراحل کارت هوشمند رانندگی شامل سه مرحله‌ی اصلی هستند:

1️⃣ شرکت در آزمون کارت هوشمند 📝 و قبولی در این آزمون (ثبت‌نام از سایت سدار)

2️⃣ استعلام مدرک تحصیلی 🎓 و انجام امورات بیمه 📑

3️⃣ انجام آزمایشات 🩺 شامل کارت سلامت و عدم اعتیاد

✅ بعد از تکمیل این مراحل، کارت هوشمند شما صادر می‌شود 🚗💳`}
      />
      <WizardFooter
        onNext={handleNext}
        onPrev={onPrev}
      />
    </>
  );
}
