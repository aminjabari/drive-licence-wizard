// آدرس پایه از متغیر محیطی
const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_BASE_URL || '';

// تابع ساخت آدرس کامل مدیا
export function getMediaUrl(path: string): string {
  if (!MEDIA_BASE_URL) return path;
  // حذف اسلش اضافی
  const cleanBase = MEDIA_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

// ثابت‌های مسیر مدیاها برای استفاده راحت‌تر
export const MEDIA_PATHS = {
  images: {
    logo: '/media/images/sadar-logo.png',
    smartCard: '/media/images/smart-card.jpg',
    assessmentIntro: '/media/images/assessment-intro.png',
    welcomeHero: '/media/images/welcome-hero.png',
    documentsRequired: '/media/images/documents-required.png',
    instructor: '/media/images/instructor.png',
    processSteps: '/media/images/process-steps.png',
  },
  videos: {
    cost: '/media/videos/cost.mp4',
    steps: '/media/videos/steps.mp4',
    register: '/media/videos/register.mp4',
  }
} as const;

// توابع کمکی برای دسترسی سریع
export const getImageUrl = (key: keyof typeof MEDIA_PATHS.images) => 
  getMediaUrl(MEDIA_PATHS.images[key]);

export const getVideoUrl = (key: keyof typeof MEDIA_PATHS.videos) => 
  getMediaUrl(MEDIA_PATHS.videos[key]);
