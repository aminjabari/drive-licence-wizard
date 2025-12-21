import { supabase } from '@/integrations/supabase/client';

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

type WrappedResponse<T> = { success: boolean; data?: T; error?: string };

function unwrapWordPressResponse<T>(result: unknown): T | null {
  if (result === null || result === undefined) return null;

  if (typeof result === 'object' && result !== null && 'success' in result) {
    const wrapped = result as WrappedResponse<T>;
    return wrapped.data ?? null;
  }

  return result as T;
}

// Get WordPress API credentials from edge function
async function getWordPressCredentials(): Promise<{ url: string; username: string; apiKey: string } | null> {
  try {
    const { data, error } = await supabase.functions.invoke('wordpress-proxy', {
      body: { action: 'get-credentials' }
    });

    if (error) {
      console.error('Error getting WordPress credentials:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error getting WordPress credentials:', err);
    return null;
  }
}

// Create or update assessment in WordPress
export async function saveAssessmentToWordPress(
  data: AssessmentData
): Promise<{ success: boolean; data?: WordPressAssessment; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke('wordpress-proxy', {
      body: {
        action: 'save-assessment',
        payload: data
      }
    });

    if (error) {
      console.error('Error saving to WordPress:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: unwrapWordPressResponse<WordPressAssessment>(result) ?? undefined };
  } catch (err) {
    console.error('Error saving to WordPress:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Get assessment by phone number from WordPress
export async function getAssessmentFromWordPress(
  phoneNumber: string
): Promise<{ success: boolean; data?: WordPressAssessment | null; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke('wordpress-proxy', {
      body: {
        action: 'get-assessment',
        payload: { phone_number: phoneNumber }
      }
    });

    if (error) {
      console.error('Error getting from WordPress:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: unwrapWordPressResponse<WordPressAssessment>(result) };
  } catch (err) {
    console.error('Error getting from WordPress:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

