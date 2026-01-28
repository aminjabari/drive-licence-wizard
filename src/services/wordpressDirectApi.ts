const WORDPRESS_API_URL = import.meta.env.VITE_WORDPRESS_API_URL || '';

interface AssessmentData {
  phone_number: string;
  full_name: string;
  province?: string;
  is_eligible: boolean;
  assessment_answers: Record<string, string>;
}

interface WordPressAssessment {
  id?: number;
  phone_number: string;
  full_name: string;
  province: string | null;
  is_eligible: boolean;
  assessment_answers: Record<string, string> | null;
  created_at?: string;
  updated_at?: string;
}

type WrappedResponse<T> = { success: boolean; data?: T; message?: string };

function unwrapWordPressResponse<T>(result: unknown): T | null {
  if (result === null || result === undefined) return null;

  if (typeof result === 'object' && result !== null && 'success' in result) {
    const wrapped = result as WrappedResponse<T>;
    return wrapped.data ?? null;
  }

  return result as T;
}

// Create or update assessment in WordPress (direct call)
export async function saveAssessmentToWordPress(
  data: AssessmentData
): Promise<{ success: boolean; data?: WordPressAssessment; error?: string }> {
  if (!WORDPRESS_API_URL) {
    console.error('VITE_WORDPRESS_API_URL is not configured');
    return { success: false, error: 'WordPress API URL not configured' };
  }

  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Error saving to WordPress:', result);
      return { success: false, error: result.message || 'WordPress API error' };
    }

    return { success: true, data: unwrapWordPressResponse<WordPressAssessment>(result) ?? undefined };
  } catch (err) {
    console.error('Error saving to WordPress:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
