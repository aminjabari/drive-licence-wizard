import { useEffect, useState, useRef } from 'react';
import { WizardProvider, useWizard, AssessmentAnswers } from './WizardContext';
import { WelcomePage } from './WelcomePage';
import { WizardHeader } from './WizardHeader';
import { Step1Assessment } from './Step1Assessment';
import { Step2Documents } from './Step2Documents';
import { Step3Process } from './Step3Process';
import { Step4Registration } from './Step4Registration';
import { getAssessmentFromWordPress } from '@/services/wordpressDirectApi';
import { useWordPressUser } from '@/hooks/useWordPressUser';
import { useWordPressEvents } from '@/hooks/useWordPressEvents';
import { useQueryParams } from '@/hooks/useQueryParams';
import { getVideoUrl } from '@/lib/media';

function WizardContent() {
  const { get: getQueryParam } = useQueryParams();
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [wpDataChecked, setWpDataChecked] = useState(false);
  const { wpUser, isLoggedIn } = useWordPressUser();
  const { 
    currentStep, 
    setCurrentStep, 
    userInfo, 
    setUserInfo, 
    setIsEligible, 
    setAssessmentAnswers,
    setAssessmentStarted,
    markStepComplete,
    setEnteredViaQueryParam
  } = useWizard();

  // Preload video for step 4 when user reaches step 2 or beyond
  const videoPreloadRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (currentStep >= 2 && !videoPreloadRef.current) {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = getVideoUrl('register');
      video.load();
      videoPreloadRef.current = video;
    }
  }, [currentStep]);

  // Check for step query param or localStorage on mount
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

  // Auto-check WordPress user data on mount
  useEffect(() => {
    if (isLoggedIn && wpUser && !wpDataChecked) {
      setWpDataChecked(true);
      checkWpUserAssessment(wpUser.phone);
    }
  }, [isLoggedIn, wpUser, wpDataChecked]);

  // Check assessment from WordPress for logged-in user
  const checkWpUserAssessment = async (phoneNumber: string) => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    try {
      const result = await getAssessmentFromWordPress(phoneNumber);

      if (result.success && result.data) {
        const data = result.data;
        // Pre-fill user info
        setUserInfo({
          fullName: data.full_name || '',
          phoneNumber: data.phone_number,
          province: data.province || ''
        });

        // Restore eligibility status
        if (data.is_eligible) {
          setIsEligible(true);
          setAssessmentStarted(true);
          markStepComplete(1);
        }

        // Restore assessment answers
        if (data.assessment_answers) {
          setAssessmentAnswers(data.assessment_answers as AssessmentAnswers);
        }
      } else if (wpUser) {
        // No existing assessment, just pre-fill phone from WordPress
        setUserInfo({
          fullName: '',
          phoneNumber: wpUser.phone,
          province: ''
        });
      }
    } catch (err) {
      console.error('Error checking WP user assessment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check assessment status from WordPress backend
  const checkAssessmentStatus = async (phoneNumber: string) => {
    if (!phoneNumber) return;
    
    setIsLoading(true);
    try {
      const result = await getAssessmentFromWordPress(phoneNumber);

      if (result.success && result.data) {
        const data = result.data;
        if (data.is_eligible) {
          setIsEligible(true);
          markStepComplete(1);
        }
        if (data.assessment_answers) {
          setAssessmentAnswers(data.assessment_answers as AssessmentAnswers);
        }
        if (data.full_name) {
          setUserInfo({
            fullName: data.full_name,
            phoneNumber: data.phone_number,
            province: data.province || ''
          });
        }
      }
    } catch (err) {
      console.error('Error checking assessment status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartWizard = async () => {
    // Only check WordPress backend if not already checked via wpUser
    if (!wpDataChecked && userInfo.phoneNumber) {
      await checkAssessmentStatus(userInfo.phoneNumber);
    }
    setShowWelcome(false);
  };

  const { dispatch: dispatchWpEvent } = useWordPressEvents();

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
      
      // Dispatch step_changed event to WordPress
      dispatchWpEvent('step_changed', { currentStep: newStep });
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
      
      // Dispatch step_changed event to WordPress
      dispatchWpEvent('step_changed', { currentStep: newStep });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[100dvh] bg-background max-w-[600px] mx-auto items-center justify-center">
        <div className="text-lg text-muted-foreground">در حال بررسی...</div>
      </div>
    );
  }

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
