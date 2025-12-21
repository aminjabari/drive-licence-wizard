import { XCircle } from 'lucide-react';

interface AssessmentFailedProps {
  onRetry: () => void;
}

export function AssessmentFailed({ onRetry }: AssessmentFailedProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="bg-destructive/10 rounded-2xl p-6 w-full max-w-sm text-center border-2 border-destructive/30">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center">
            <XCircle className="w-10 h-10 text-destructive-foreground" />
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-destructive mb-2">
          متأسفانه شرایط لازم را ندارید
        </h2>
        
        <p className="text-muted-foreground text-sm">
          بر اساس پاسخ‌های شما، امکان ادامه فرآیند ثبت‌نام وجود ندارد. می‌توانید مجدداً ارزیابی کنید.
        </p>
      </div>
    </div>
  );
}

export default AssessmentFailed;
