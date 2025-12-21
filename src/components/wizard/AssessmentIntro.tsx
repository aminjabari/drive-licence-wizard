import { Button } from '@/components/ui/button';
import assessmentImage from '@/assets/assessment-intro.png';

interface AssessmentIntroProps {
  onStart: () => void;
}

export function AssessmentIntro({ onStart }: AssessmentIntroProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6">
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-primary text-center mb-2">
          برای ادامه، ابتدا شرایط را ارزیابی کنیم
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          تا زمانی که ارزیابی را انجام ندادید، جابجایی بین فصل‌ها/صفحات غیرفعال است.
        </p>
        
        <div className="flex justify-center mb-6">
          <img 
            src={assessmentImage} 
            alt="ارزیابی شرایط رانندگی" 
            className="w-36 h-36 object-contain"
          />
        </div>
        
        <Button
          onClick={onStart}
          className="w-full h-12 rounded-full text-base font-medium"
        >
          شروع ارزیابی
        </Button>
      </div>
    </div>
  );
}
