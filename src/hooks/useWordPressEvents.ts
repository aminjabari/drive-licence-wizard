import { useCallback } from 'react';
import { useWizard } from '@/components/wizard/WizardContext';

export type WizardAction = 
  | 'welcome_started'
  | 'assessment_completed'
  | 'step_changed'
  | 'registration_clicked';

export interface WizardEventData {
  action: WizardAction;
  userInfo: {
    fullName: string;
    phoneNumber: string;
    province: string;
  };
  assessmentAnswers: Record<string, string>;
  isEligible: boolean | null;
  currentStep: number;
  timestamp: string;
}

// Dispatch event to WordPress
export function dispatchToWordPress(data: WizardEventData) {
  const event = new CustomEvent('sadar_wizard_event', {
    detail: data,
    bubbles: true
  });
  window.dispatchEvent(event);
  
  // Also log for debugging
  console.log('[WordPress Event]', data.action, data);
}

// Hook for easy usage within wizard components
export function useWordPressEvents() {
  const { userInfo, assessmentAnswers, isEligible, currentStep } = useWizard();

  const dispatch = useCallback((action: WizardAction, overrides?: Partial<WizardEventData>) => {
    const eventData: WizardEventData = {
      action,
      userInfo: {
        fullName: userInfo.fullName,
        phoneNumber: userInfo.phoneNumber,
        province: userInfo.province,
      },
      assessmentAnswers: assessmentAnswers as Record<string, string>,
      isEligible,
      currentStep,
      timestamp: new Date().toISOString(),
      ...overrides,
    };
    
    dispatchToWordPress(eventData);
  }, [userInfo, assessmentAnswers, isEligible, currentStep]);

  return { dispatch };
}
