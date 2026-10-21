import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@/src/lib/auth";

const groq = process.env.GROQ_API_KEY
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, missionDescription } = await req.json();

    if (!groq) {
      return NextResponse.json({ error: "AI Grader is not configured. Missing GROQ_API_KEY." }, { status: 500 });
    }

    // Prompt the AI to be a strict but fair Python teacher
    const prompt = `
You are an expert Python auto-grader.
The student was given this mission:
"${missionDescription}"

Here is the student's code:
\`\`\`python
${code}
\`\`\`

Does this code correctly solve the mission? 
Accept ANY valid solution that achieves the goal, not just one specific way.
Reply with a JSON object ONLY, in this exact format:
{
  "passed": true or false,
  "feedback": "If failed, explain why in 1-2 sentences. If passed, say 'Great job!'"
}
`;

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1, // Low temperature for strict, predictable grading
      response_format: { type: "json_object" }, // Force JSON output
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("AI Grader Error:", error.message);
    return NextResponse.json({ error: "Failed to grade code" }, { status: 500 });
  }
}