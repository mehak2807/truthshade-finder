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
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are TrustVault, an expert AI fact-checker and misinformation analyst. Analyze the provided text for credibility and misinformation.

You MUST respond with a JSON object using this exact tool call. Do not output anything else.

Analyze every sentence and assign each a credibility level. Be thorough and specific in your explanations.

Scoring guide:
- overall_score: 0-100 (100 = fully credible)
- source_score: 0-100 (how reliable are the cited sources)
- claims_score: 0-100 (how accurate are the factual claims)
- risk_level: "low", "medium", or "high"
- For segments: "verified" = supported by evidence, "questionable" = lacks evidence, "misinformation" = contradicts known facts
- For findings: provide 3-5 specific observations with type "verified", "questionable", or "misinformation"
- For explanation: provide a clear, detailed, human-readable explanation of your reasoning. Explain WHY the content is rated this way, what specific red flags or green flags you found, what logical fallacies or manipulation techniques are used (if any), and what a reader should watch out for. This is the "Explainable AI" section — be thorough and educational.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content: `Analyze this text for credibility and misinformation:\n\n${text.slice(0, 5000)}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "report_analysis",
                description:
                  "Report the credibility analysis results for the given text.",
                parameters: {
                  type: "object",
                  properties: {
                    overall_score: {
                      type: "number",
                      description: "Overall credibility score 0-100",
                    },
                    source_score: {
                      type: "number",
                      description: "Source reliability score 0-100",
                    },
                    claims_score: {
                      type: "number",
                      description: "Claims accuracy score 0-100",
                    },
                    risk_level: {
                      type: "string",
                      enum: ["low", "medium", "high"],
                    },
                    segments: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          text: { type: "string" },
                          level: {
                            type: "string",
                            enum: [
                              "verified",
                              "questionable",
                              "misinformation",
                            ],
                          },
                        },
                        required: ["text", "level"],
                        additionalProperties: false,
                      },
                    },
                    findings: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          title: { type: "string" },
                          description: { type: "string" },
                          type: {
                            type: "string",
                            enum: [
                              "verified",
                              "questionable",
                              "misinformation",
                            ],
                          },
                        },
                        required: ["title", "description", "type"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: [
                    "overall_score",
                    "source_score",
                    "claims_score",
                    "risk_level",
                    "segments",
                    "findings",
                  ],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "report_analysis" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No analysis returned from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-news error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
