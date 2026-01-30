import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { saveWithExpiry, getWithExpiry, getWizardStorageKey } from '@/hooks/useLocalStorageWithExpiry';

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

interface WizardStoredData {
  userInfo: UserInfo;
  assessmentAnswers: AssessmentAnswers;
  isEligible: boolean | null;
  currentStep: number;
  completedSteps: number[];
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
  enteredViaQueryParam: boolean;
  setEnteredViaQueryParam: (entered: boolean) => void;
  loadFromLocalStorage: () => WizardStoredData | null;
  saveToLocalStorage: () => void;
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
  const [enteredViaQueryParam, setEnteredViaQueryParam] = useState(false);

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

  // Load data from localStorage
  const loadFromLocalStorage = useCallback((): WizardStoredData | null => {
    const key = getWizardStorageKey();
    const storedData = getWithExpiry<WizardStoredData>(key);
    
    if (storedData) {
      setUserInfo(storedData.userInfo);
      setAssessmentAnswers(storedData.assessmentAnswers);
      setIsEligible(storedData.isEligible);
      setCompletedSteps(storedData.completedSteps);
      if (storedData.isEligible !== null) {
        setAssessmentStarted(true);
      }
    }
    
    return storedData;
  }, []);

  // Save data to localStorage
  const saveToLocalStorage = useCallback(() => {
    if (!userInfo.phoneNumber) return;
    
    const key = getWizardStorageKey();
    const dataToStore: WizardStoredData = {
      userInfo,
      assessmentAnswers,
      isEligible,
      currentStep,
      completedSteps,
    };
    
    saveWithExpiry(key, dataToStore);
  }, [userInfo, assessmentAnswers, isEligible, currentStep, completedSteps]);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (userInfo.phoneNumber) {
      saveToLocalStorage();
    }
  }, [userInfo, assessmentAnswers, isEligible, currentStep, completedSteps, saveToLocalStorage]);

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
        enteredViaQueryParam,
        setEnteredViaQueryParam,
        loadFromLocalStorage,
        saveToLocalStorage,
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
