import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    if (!BREVO_API_KEY) {
      throw new Error("BREVO_API_KEY is not configured");
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { nome, cognome, email, telefono } = body;

    if (!nome || !cognome || !email || !telefono) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if contact already exists
    const checkRes = await fetch(
      `https://api.brevo.com/v3/contacts/${encodeURIComponent(trimmedEmail)}`,
      {
        method: "GET",
        headers: {
          "api-key": BREVO_API_KEY,
          Accept: "application/json",
        },
      }
    );

    if (checkRes.ok) {
      // Contact already exists
      return new Response(
        JSON.stringify({ success: true, alreadyRegistered: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new contact
    const brevoPayload = JSON.stringify({
      email: trimmedEmail,
      attributes: {
        FIRSTNAME: nome.trim(),
        LASTNAME: cognome.trim(),
        NOME: `${nome.trim()} ${cognome.trim()}`,
        SMS: (() => {
          let phone = telefono.replace(/[\s\-().]/g, "");
          if (!phone.startsWith("+")) {
            phone = phone.startsWith("00") ? "+" + phone.slice(2) : "+39" + phone;
          }
          return phone;
        })(),
      },
      listIds: [2],
      updateEnabled: false,
    });

    const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: brevoPayload,
    });

    if (!brevoRes.ok) {
      const errBody = await brevoRes.text();
      console.error("Brevo API error:", brevoRes.status, errBody);
      throw new Error("Brevo API error");
    }

    console.log("Contact added to Brevo successfully");

    return new Response(
      JSON.stringify({ success: true, alreadyRegistered: false }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
