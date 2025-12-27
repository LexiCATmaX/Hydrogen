import { generateText } from "ai"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const { text } = await req.json()

    if (!text || typeof text !== "string") {
      return Response.json({ error: "Text is required and must be a string." }, { status: 400 })
    }

    const {
      text: conciseText,
      usage,
      finishReason,
    } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Make the following text more concise while preserving its meaning and key information. Return only the concise version without any explanations or preamble:\n\n${text}`,
      maxOutputTokens: 2000,
      temperature: 0.7,
    })

    return Response.json({
      originalText: text,
      conciseText,
      usage,
      finishReason,
      userId: user.id,
    })
  } catch (error) {
    console.error("[v0] Error in more-concise route:", error)
    return Response.json({ error: "Failed to generate concise text. Please try again." }, { status: 500 })
  }
}
