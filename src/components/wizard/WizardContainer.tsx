import { useEffect, useState } from 'react';
import { WizardProvider, useWizard } from './WizardContext';
import { WelcomePage } from './WelcomePage';
import { WizardHeader } from './WizardHeader';
import { Step1Assessment } from './Step1Assessment';
import { Step2Documents } from './Step2Documents';
import { Step3Process } from './Step3Process';
import { Step4Registration } from './Step4Registration';
import { useQueryParams } from '@/hooks/useQueryParams';
import { getVideoUrl } from '@/lib/media';

function WizardContent() {
  const { get: getQueryParam } = useQueryParams();
  const [showWelcome, setShowWelcome] = useState(true);
  const { 
    currentStep, 
    setCurrentStep, 
    userInfo, 
    setEnteredViaQueryParam
  } = useWizard();

  // Sequential video preloading on wizard mount
  useEffect(() => {
    const videoOrder = ['steps', 'cost', 'register'] as const;
    let currentIndex = 0;

    const preloadNextVideo = () => {
      if (currentIndex >= videoOrder.length) return;
      
      const videoKey = videoOrder[currentIndex];
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = getVideoUrl(videoKey);
      
      video.addEventListener('canplaythrough', () => {
        currentIndex++;
        preloadNextVideo();
      }, { once: true });
      
      video.load();
    };

    preloadNextVideo();
  }, []);

  // Check for step query param on mount
  useEffect(() => {
    const stepParam = getQueryParam('step');
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (step >= 1 && step <= 4) {
        setShowWelcome(false);
        setCurrentStep(step);
        setEnteredViaQueryParam(true);
      }
    }
  }, []);

  const handleStartWizard = () => {
    setShowWelcome(false);
  };

  const handleNext = () => {
    // If user data is missing, redirect to welcome page
    if (!userInfo.phoneNumber) {
      setShowWelcome(true);
      setCurrentStep(1);
      return;
    }
    
    if (currentStep < 4) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
    }
  };

  const handlePrev = () => {
    // If user data is missing, redirect to welcome page
    if (!userInfo.phoneNumber) {
      setShowWelcome(true);
      setCurrentStep(1);
      return;
    }
    
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
    }
  };

  if (showWelcome) {
    return <WelcomePage onStart={handleStartWizard} />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-background max-w-[600px] mx-auto border border-border/30 shadow-sm">
      <WizardHeader />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {currentStep === 1 && <Step1Assessment onNext={handleNext} />}
        {currentStep === 2 && <Step3Process onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 3 && <Step2Documents onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 4 && <Step4Registration onPrev={handlePrev} />}
      </div>
    </div>
  );
}

export function WizardContainer() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
