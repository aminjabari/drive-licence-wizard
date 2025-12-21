import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ExistingAssessmentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ExistingAssessmentDialog({ open, onClose }: ExistingAssessmentDialogProps) {
  const handleLogin = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('login', 'true');
    window.location.href = currentUrl.toString();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent dir="rtl" className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">ارزیابی قبلی یافت شد</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            برای این شماره تلفن قبلاً ارزیابی انجام شده است. برای ادامه لطفاً وارد حساب کاربری خود شوید.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2 sm:flex-row-reverse">
          <Button variant="outline" onClick={onClose}>
            تغییر شماره
          </Button>
          <Button onClick={handleLogin}>
            ورود به حساب
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
