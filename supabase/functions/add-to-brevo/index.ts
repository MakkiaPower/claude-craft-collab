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

    // Fire-and-forget: send to Brevo in background, respond immediately
    const brevoPayload = JSON.stringify({
      email: email.trim(),
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
      updateEnabled: true,
    });

    // Don't await — let it run in background
    fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: brevoPayload,
    }).then(async (res) => {
      if (!res.ok) {
        const errBody = await res.text();
        if (res.status === 400 && errBody.includes("duplicate_parameter")) {
          console.log("Contact already exists, treating as success");
        } else {
          console.error("Brevo API error:", res.status, errBody);
        }
      } else {
        console.log("Contact added to Brevo successfully");
      }
    }).catch((err) => {
      console.error("Brevo fetch error:", err);
    });

    return new Response(
      JSON.stringify({ success: true }),
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
