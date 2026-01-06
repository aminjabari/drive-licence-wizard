import { supabase } from "@/integrations/supabase/client";

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

interface ProxyResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Save assessment via Edge Function proxy
export async function saveAssessmentToWordPress(
  data: AssessmentData
): Promise<{ success: boolean; data?: WordPressAssessment; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke<ProxyResponse<WordPressAssessment>>(
      'wordpress-proxy?action=save',
      {
        body: data,
      }
    );

    if (error) {
      console.error('Error calling wordpress-proxy:', error);
      return { success: false, error: error.message };
    }

    if (!result?.success) {
      return { success: false, error: result?.error || 'Unknown error' };
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('Error saving to WordPress:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Get assessment by phone number via Edge Function proxy
export async function getAssessmentFromWordPress(
  phoneNumber: string
): Promise<{ success: boolean; data?: WordPressAssessment | null; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke<ProxyResponse<WordPressAssessment>>(
      `wordpress-proxy?action=get&phone_number=${encodeURIComponent(phoneNumber)}`
    );

    if (error) {
      console.error('Error calling wordpress-proxy:', error);
      return { success: false, error: error.message };
    }

    if (!result?.success) {
      return { success: false, error: result?.error || 'Unknown error' };
    }

    return { success: true, data: result.data };
  } catch (err) {
    console.error('Error getting from WordPress:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
