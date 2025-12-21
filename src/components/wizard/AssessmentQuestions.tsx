import { useState } from 'react';
import { Check, X, AlertTriangle } from 'lucide-react';
import { useWizard } from './WizardContext';
import { cn } from '@/lib/utils';
import { saveAssessmentToWordPress } from '@/services/wordpressApi';

interface Option {
  id: string;
  label: string;
  disqualifies?: boolean;
  disqualifyMessage?: string;
}

interface Question {
  id: string;
  title: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: 'age',
    title: 'سن خود را مشخص کنید',
    options: [
      { id: 'under27', label: 'زیر ۲۷ سال', disqualifies: true, disqualifyMessage: 'سن شما باید بین ۲۷ تا ۵۵ سال باشد.' },
      { id: '27-55', label: '۲۷ تا ۵۵ سال' },
      { id: 'over55', label: 'بالای ۵۵ سال', disqualifies: true, disqualifyMessage: 'سن شما باید بین ۲۷ تا ۵۵ سال باشد.' },
    ],
  },
  {
    id: 'military',
    title: 'وضعیت خدمت سربازی خود را مشخص کنید',
    options: [
      { id: 'completed', label: 'پایان خدمت دارم' },
      { id: 'exempt', label: 'معافیت دارم' },
      { id: 'not_yet', label: 'هنوز سربازی نرفته‌ام', disqualifies: true, disqualifyMessage: 'برای ادامه باید وضعیت سربازی شما مشخص باشد.' },
      { id: 'female', label: 'خانم هستم' },
    ],
  },
  {
    id: 'education',
    title: 'میزان تحصیلات خود را مشخص کنید',
    options: [
      { id: 'below_middle', label: 'کمتر از سیکل', disqualifies: true, disqualifyMessage: 'حداقل مدرک تحصیلی مورد نیاز سیکل است.' },
      { id: 'middle', label: 'سیکل' },
      { id: 'diploma', label: 'دیپلم' },
      { id: 'higher', label: 'بالاتر از دیپلم' },
    ],
  },
  {
    id: 'employment',
    title: 'وضعیت شغلی‌تان را مشخص کنید',
    options: [
      { id: 'unemployed', label: 'شاغل نیستم' },
      { id: 'no_insurance', label: 'شاغلم ولی حق بیمه رد نمی‌کنم' },
      { id: 'driver_insurance', label: 'شاغلم و به عنوان راننده حق بیمه واریز می‌کنم' },
      { id: 'other_insurance', label: 'شاغلم و برایم حق بیمه‌ای غیر از رانندگی رد می‌شود', disqualifies: true, disqualifyMessage: 'افراد دارای بیمه غیر از رانندگی امکان ثبت‌نام ندارند.' },
      { id: 'retired', label: 'بازنشسته هستم', disqualifies: true, disqualifyMessage: 'افراد بازنشسته امکان ثبت‌نام ندارند.' },
    ],
  },
];

interface AssessmentQuestionsProps {
  onComplete: (eligible: boolean) => void;
  onDisqualify: () => void;
}

export function AssessmentQuestions({ onComplete, onDisqualify }: AssessmentQuestionsProps) {
  const { currentQuestion, setCurrentQuestion, assessmentAnswers, setAssessmentAnswers, userInfo } = useWizard();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualifyMessage, setDisqualifyMessage] = useState<string>('');

  const question = questions[currentQuestion];

  const saveAssessmentToBackend = async (answers: Record<string, string>, isEligible: boolean) => {
    if (!userInfo.phoneNumber) return;
    
    try {
      const result = await saveAssessmentToWordPress({
        phone_number: userInfo.phoneNumber,
        full_name: userInfo.fullName,
        province: userInfo.province,
        is_eligible: isEligible,
        assessment_answers: answers,
      });
      
      if (!result.success) {
        console.error('Error saving assessment to WordPress:', result.error);
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
    }
  };

  const handleOptionSelect = (option: Option) => {
    setSelectedOption(option.id);
    
    if (option.disqualifies) {
      setIsDisqualified(true);
      setDisqualifyMessage(option.disqualifyMessage || 'این گزینه معتبر نیست.');
      onDisqualify();
      return;
    }
    
    // Clear any previous disqualification
    setIsDisqualified(false);
    setDisqualifyMessage('');
    
    // Auto-advance after selection
    setTimeout(async () => {
      const newAnswers = {
        ...assessmentAnswers,
        [question.id]: option.id,
      };
      setAssessmentAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // Save to backend when assessment is complete
        await saveAssessmentToBackend(newAnswers as Record<string, string>, true);
        onComplete(true);
      }
    }, 300);
  };

  return (
    <div className="flex flex-col flex-1 p-6 overflow-y-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              idx === currentQuestion
                ? "w-6 bg-primary"
                : idx < currentQuestion
                  ? "bg-primary"
                  : "bg-muted"
            )}
          />
        ))}
      </div>
      
      <h2 className="text-lg font-bold text-foreground text-center mb-6">
        {question.title}
      </h2>
      
      <div className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const willDisqualify = option.disqualifies && isSelected;
          
          return (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              disabled={isDisqualified && !isSelected}
              className={cn(
                "w-full p-4 rounded-full border-2 text-right transition-all flex items-center justify-between",
                isSelected
                  ? willDisqualify
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-primary bg-primary text-primary-foreground"
                  : isDisqualified
                    ? "border-border bg-card/50 opacity-50 cursor-not-allowed"
                    : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span className="font-medium">{option.label}</span>
              {isSelected && (
                willDisqualify ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Check className="w-5 h-5" />
                )
              )}
            </button>
          );
        })}
      </div>
      
      {/* Disqualification message */}
      {isDisqualified && disqualifyMessage && (
        <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive mb-1">شرایط لازم را ندارید</p>
            <p className="text-sm text-destructive/80">{disqualifyMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
