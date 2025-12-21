import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWizard } from './WizardContext';

interface WizardFooterProps {
  onNext?: () => void;
  onPrev: () => void;
  nextDisabled?: boolean;
  prevDisabled?: boolean;
  nextLabel?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showNext?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function WizardFooter({
  onNext,
  onPrev,
  nextDisabled = false,
  prevDisabled = false,
  nextLabel = 'مرحله بعد',
  showRetry = false,
  onRetry,
  showNext = true,
  actionLabel,
  onAction,
}: WizardFooterProps) {
  const { currentStep } = useWizard();

  if (showRetry) {
    return (
      <div className="bg-card border-t border-border p-4">
        <Button
          onClick={onRetry}
          className="w-full h-12 rounded-full text-base font-medium bg-destructive hover:bg-destructive/90"
        >
          ارزیابی مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border-t border-border p-4 flex gap-3">
      <Button
        onClick={onPrev}
        disabled={prevDisabled}
        variant="outline"
        className="flex-1 h-12 rounded-full text-base font-medium gap-2"
      >
        <ChevronRight className="w-5 h-5" />
        <span>مرحله قبل</span>
      </Button>
      {showNext && onNext && (
        <Button
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 h-12 rounded-full text-base font-medium gap-2"
        >
          <span>{nextLabel}</span>
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="flex-1 h-12 rounded-full text-base font-medium"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
