import { useState } from 'react';
import { useWizard } from './WizardContext';
import { AssessmentIntro } from './AssessmentIntro';
import { AssessmentQuestions } from './AssessmentQuestions';
import { AssessmentSuccess } from './AssessmentSuccess';
import { WizardFooter } from './WizardFooter';

interface Step1AssessmentProps {
  onNext: () => void;
}

export function Step1Assessment({ onNext }: Step1AssessmentProps) {
  const { 
    assessmentStarted, 
    setAssessmentStarted, 
    isEligible, 
    setIsEligible,
    resetAssessment,
    markStepComplete
  } = useWizard();
  
  const [showRetryButton, setShowRetryButton] = useState(false);

  const handleStartAssessment = () => {
    setAssessmentStarted(true);
    setShowRetryButton(false);
  };

  const handleAssessmentComplete = (eligible: boolean) => {
    setIsEligible(eligible);
    if (eligible) {
      markStepComplete(1);
    }
  };

  const handleDisqualify = () => {
    setShowRetryButton(true);
  };

  const handleContinue = () => {
    onNext();
  };

  const handleRestart = () => {
    resetAssessment();
    setShowRetryButton(false);
  };

  // Show success screen first (for state persistence when returning)
  if (isEligible === true) {
    return (
      <>
        <AssessmentSuccess onContinue={handleContinue} onRestart={handleRestart} />
        <WizardFooter
          onNext={handleContinue}
          onPrev={() => {}}
          nextDisabled={false}
          prevDisabled={true}
        />
      </>
    );
  }

  // Show intro if assessment hasn't started
  if (!assessmentStarted) {
    return (
      <>
        <AssessmentIntro onStart={handleStartAssessment} />
        <WizardFooter
          onNext={() => {}}
          onPrev={() => {}}
          nextDisabled={true}
          prevDisabled={true}
        />
      </>
    );
  }

  // Show questions (with retry button if disqualified)
  return (
    <>
      <AssessmentQuestions 
        onComplete={handleAssessmentComplete} 
        onDisqualify={handleDisqualify}
      />
      <WizardFooter
        onNext={() => {}}
        onPrev={() => {}}
        nextDisabled={true}
        prevDisabled={true}
        showRetry={showRetryButton}
        onRetry={handleRestart}
      />
    </>
  );
}
