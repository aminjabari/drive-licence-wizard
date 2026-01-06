import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WORDPRESS_API_URL = Deno.env.get('WORDPRESS_API_URL') || '';
const WORDPRESS_USERNAME = Deno.env.get('WORDPRESS_USERNAME') || '';
const WORDPRESS_API_KEY = Deno.env.get('WORDPRESS_API_KEY') || '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    
    if (!WORDPRESS_API_URL) {
      throw new Error('WORDPRESS_API_URL is not configured');
    }

    // Create Basic Auth header
    const authHeader = WORDPRESS_USERNAME && WORDPRESS_API_KEY
      ? 'Basic ' + btoa(`${WORDPRESS_USERNAME}:${WORDPRESS_API_KEY}`)
      : '';

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    if (action === 'get') {
      // GET assessment by phone number
      const phoneNumber = url.searchParams.get('phone_number');
      
      if (!phoneNumber) {
        return new Response(
          JSON.stringify({ success: false, error: 'phone_number is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const wpResponse = await fetch(
        `${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments?phone_number=${encodeURIComponent(phoneNumber)}`,
        { method: 'GET', headers }
      );

      if (wpResponse.status === 404) {
        return new Response(
          JSON.stringify({ success: true, data: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await wpResponse.json();
      
      if (!wpResponse.ok) {
        return new Response(
          JSON.stringify({ success: false, error: data.message || 'WordPress API error' }),
          { status: wpResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'save') {
      // POST/save assessment
      const body = await req.json();
      
      const wpResponse = await fetch(
        `${WORDPRESS_API_URL}/wp-json/sadar/v1/assessments`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        }
      );

      const data = await wpResponse.json();

      if (!wpResponse.ok) {
        return new Response(
          JSON.stringify({ success: false, error: data.message || 'WordPress API error' }),
          { status: wpResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid action. Use action=get or action=save' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('WordPress proxy error:', errorMessage);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
