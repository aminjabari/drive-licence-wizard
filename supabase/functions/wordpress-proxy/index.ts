import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  action: 'get-credentials' | 'save-assessment' | 'get-assessment';
  payload?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WORDPRESS_API_URL = Deno.env.get('WORDPRESS_API_URL');
    const WORDPRESS_USERNAME = Deno.env.get('WORDPRESS_USERNAME');
    const WORDPRESS_API_KEY = Deno.env.get('WORDPRESS_API_KEY');

    if (!WORDPRESS_API_URL || !WORDPRESS_USERNAME || !WORDPRESS_API_KEY) {
      console.error('Missing WordPress credentials');
      return new Response(
        JSON.stringify({ error: 'WordPress credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Basic Auth header
    const credentials = btoa(`${WORDPRESS_USERNAME}:${WORDPRESS_API_KEY.replace(/\s/g, '')}`);
    const authHeader = `Basic ${credentials}`;

    const body: RequestBody = await req.json();
    const { action, payload } = body;

    let response: Response;

    switch (action) {
      case 'get-credentials':
        // Don't expose actual credentials, just confirm they exist
        return new Response(
          JSON.stringify({ configured: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'save-assessment':
        // First try to get existing assessment
        const checkResponse = await fetch(
          `${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments?phone_number=${encodeURIComponent(payload.phone_number)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          }
        );

        if (checkResponse.ok) {
          const existingData = await checkResponse.json();
          
          if (existingData && existingData.id) {
            // Update existing assessment
            response = await fetch(
              `${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments/${existingData.id}`,
              {
                method: 'PUT',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              }
            );
          } else {
            // Create new assessment
            response = await fetch(
              `${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments`,
              {
                method: 'POST',
                headers: {
                  'Authorization': authHeader,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
              }
            );
          }
        } else {
          // Create new assessment
          response = await fetch(
            `${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments`,
            {
              method: 'POST',
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            }
          );
        }
        break;

      case 'get-assessment':
        response = await fetch(
          `${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments?phone_number=${encodeURIComponent(payload.phone_number)}`,
          {
            method: 'GET',
            headers: {
              'Authorization': authHeader,
              'Content-Type': 'application/json',
            },
          }
        );
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('WordPress API error:', data);
      return new Response(
        JSON.stringify({ error: data.message || 'WordPress API error', details: data }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in wordpress-proxy:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
