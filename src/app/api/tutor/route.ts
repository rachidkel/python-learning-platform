import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@/src/lib/auth";

// Point the OpenAI SDK to Groq's free, ultra-fast endpoint
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

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    // ── Use Groq (Llama 3.3) ──
    if (groq) {
      try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b", // Groq's smartest free model
          messages: [
            {
              role: "system",
              content: `You are a friendly, encouraging Python tutor on the PyLearn platform. 
You help students learn Python. Provide hints and explanations rather than just giving the exact solution. 
Keep your answers concise, use simple language, and format code with markdown backticks.`,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        return NextResponse.json({
          role: "assistant",
          content: response.choices[0].message.content,
        });
      } catch (apiError: any) {
        console.error("Groq API Error:", apiError.message);
      }
    }

    // ── Fallback Mock AI (Instant) ──
    const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
    let mockResponse = "";

    if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi")) {
      mockResponse = "Hello! 👋 I'm your AI Python Tutor. (Running in fast local mode). What concept are you struggling with today?";
    } else if (lastUserMessage.includes("list") || lastUserMessage.includes("array")) {
      mockResponse = "Lists in Python are ordered collections, written with square brackets: `[]`.\n\n```python\nfruits = ['apple', 'banana']\nfruits.append('orange')\nprint(fruits[0]) # 'apple'\n```\nWhat else would you like to know about lists?";
    } else if (lastUserMessage.includes("loop") || lastUserMessage.includes("for") || lastUserMessage.includes("while")) {
      mockResponse = "Loops are used to repeat code!\n\n**For loops** are great when you know how many times to repeat:\n```python\nfor i in range(3):\n    print(i)\n```\n\n**While loops** run until a condition is false:\n```python\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\n```\nDoes that make sense?";
    } else if (lastUserMessage.includes("error") || lastUserMessage.includes("bug") || lastUserMessage.includes("not working")) {
      mockResponse = "Don't worry, errors are normal! 🐛\n\n1. Read the error message from the bottom up.\n2. Check for missing brackets `()` or quotes `''`.\n3. Make sure your indentation is correct.\n\nCan you paste the code you're trying to run?";
    } else {
      mockResponse = "That's a great question! I'm currently running in fast local mode. To get full AI answers for any question, make sure your GROQ_API_KEY is set correctly in `.env`.";
    }

    return NextResponse.json({
      role: "assistant",
      content: mockResponse,
    });

  } catch (error) {
    console.error("AI Tutor Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}