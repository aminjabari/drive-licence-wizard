import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssessmentSuccessProps {
  onContinue: () => void;
  onRestart: () => void;
}

export function AssessmentSuccess({ onContinue, onRestart }: AssessmentSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="bg-success-light rounded-2xl p-6 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-success-foreground" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-success mb-2">
          تبریک! شما شرایط لازم را دارید.
        </h2>
        
        <div className="space-y-3 mt-6">
          <Button
            onClick={onContinue}
            className="w-full h-12 rounded-full text-base font-medium bg-success hover:bg-success/90 text-success-foreground"
          >
            رفتن به مرحله بعد
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            className="w-full h-12 rounded-full text-base font-medium border-success text-success hover:bg-success/10"
          >
            شروع مجدد
          </Button>
        </div>
      </div>
    </div>
  );
}
