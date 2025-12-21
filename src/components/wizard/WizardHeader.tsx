import { ClipboardCheck, FileText, ListOrdered, UserPlus } from 'lucide-react';
import { useWizard } from './WizardContext';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, label: 'ارزیابی شرایط', subtitle: 'ارزیابی شرایط گرفتن کارت هوشمند رانندگی', icon: ClipboardCheck },
  { id: 2, label: 'مراحل', subtitle: 'مراحل گرفتن کارت هوشمند رانندگی', icon: ListOrdered },
  { id: 3, label: 'زمان و هزینه', subtitle: 'زمان و هزینه گرفتن کارت هوشمند رانندگی', icon: FileText },
  { id: 4, label: 'ثبت نام', subtitle: 'ثبت نام کارت هوشمند رانندگی', icon: UserPlus },
];

export function WizardHeader() {
  const { currentStep, setCurrentStep, completedSteps } = useWizard();

  const isStep1Completed = completedSteps.includes(1);

  const handleStepClick = (stepId: number) => {
    // After completing assessment (step 1), all steps become accessible
    if (isStep1Completed || completedSteps.includes(stepId) || stepId === currentStep) {
      setCurrentStep(stepId);
    }
  };

  const getStepTitle = () => {
    const step = steps.find(s => s.id === currentStep);
    const stepNumber = currentStep === 1 ? 'اول' : currentStep === 2 ? 'دوم' : currentStep === 3 ? 'سوم' : 'چهارم';
    return step ? `گام ${stepNumber}: ${step.subtitle}` : '';
  };

  return (
    <div className="bg-card border-b border-border">
      {/* Step Icons Row */}
      <div className="flex items-center justify-between px-4 py-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          const isClickable = isStep1Completed || isCompleted || step.id === currentStep;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              disabled={!isClickable}
              className={cn(
                "flex flex-col items-center gap-1 transition-all",
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : isCompleted 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted/30 text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-muted/30">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>
      
      {/* Step Title */}
      <div className="bg-muted/20 px-4 py-2">
        <p className="text-sm text-muted-foreground">{getStepTitle()}</p>
      </div>
    </div>
  );
}
