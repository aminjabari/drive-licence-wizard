import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserInfo {
  fullName: string;
  phoneNumber: string;
  province: string;
}

export interface AssessmentAnswers {
  age?: number;
  militaryStatus?: string;
  education?: string;
  employment?: string;
}

interface WizardContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  completedSteps: number[];
  markStepComplete: (step: number) => void;
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  assessmentAnswers: AssessmentAnswers;
  setAssessmentAnswers: (answers: AssessmentAnswers) => void;
  isEligible: boolean | null;
  setIsEligible: (eligible: boolean | null) => void;
  assessmentStarted: boolean;
  setAssessmentStarted: (started: boolean) => void;
  currentQuestion: number;
  setCurrentQuestion: (question: number) => void;
  resetAssessment: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ fullName: '', phoneNumber: '', province: '' });
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswers>({});
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  const resetAssessment = () => {
    setAssessmentAnswers({});
    setIsEligible(null);
    setAssessmentStarted(false);
    setCurrentQuestion(0);
    setCompletedSteps(completedSteps.filter(s => s !== 1));
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        completedSteps,
        markStepComplete,
        userInfo,
        setUserInfo,
        assessmentAnswers,
        setAssessmentAnswers,
        isEligible,
        setIsEligible,
        assessmentStarted,
        setAssessmentStarted,
        currentQuestion,
        setCurrentQuestion,
        resetAssessment,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
