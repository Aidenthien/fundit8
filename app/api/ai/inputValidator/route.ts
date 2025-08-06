"use server";
import { NextResponse, NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error("Missing GOOGLE_GEMINI_API_KEY environment variable");
}

export async function POST(req: NextRequest) {
  const { name, description } = await req.json();

  if (!name || !description) {
    return NextResponse.json(
      { status: "error", message: "Name and description are required" },
      { status: 400 }
    );
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const analyzeField = async (field: string, type: "name" | "description") => {
    // const prompt = `
    //   You are a fraud detection AI. Analyze the following ${type} of a fundraising campaign and score how SAFE it is from potential fraud, scams, or money laundering.

    //   Respond with:
    //   - A safety score between 0 to 100 (only the number), where:
    //     • 100 = completely safe
    //     • below 50 = suspicious or needs review

    //   ${type.charAt(0).toUpperCase() + type.slice(1)}: ${field}
    // `;
    const prompt = `
You are an AI compliance and fraud detection analyst. Evaluate the following fundraising campaign ${type} for potential risks such as fraud, scams, money laundering, or misuse.

Give a **safety score from 0 to 100** (as a percentage):

- 100 = Completely safe and legitimate
- 70–99 = Mostly safe, minor concerns possible
- 50–69 = Possibly suspicious — needs manual review
- 0–49 = Likely fraudulent or misleading

Respond ONLY with a **number** (0–100). Do NOT include any explanation, text, or formatting.

Here is the ${type} to evaluate:

"${field}"
`;

    try {
      const result = await model.generateContent(prompt);
      const output = result.response.text().trim();

      // Extract and clamp score
      const match = output.match(/\d+/);
      const score = match ? parseInt(match[0]) : 0;
      return Math.min(Math.max(score, 0), 100);
    } catch (err) {
      console.error(`Error scoring ${type}:`, err);
      return 0;
    }
  };

  const nameScore = await analyzeField(name, "name");
  const descScore = await analyzeField(description, "description");

  const avgScore = Math.round((nameScore + descScore) / 2);
  const status = avgScore < 50 ? "rejected" : "approved";

  return NextResponse.json({
    status: 200,
    scores: {
      name: nameScore,
      description: descScore,
      average: avgScore,
    },
    message:
      status === "approved"
        ? "Campaign approved"
        : "Campaign rejected due to low safety score",
  });
}
