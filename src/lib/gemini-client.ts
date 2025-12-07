import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generatePaperSummary(title: string, abstract: string | null): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Summarize this research paper for students in 2-3 concise sentences:

Title: ${title}
Abstract: ${abstract || 'No abstract available'}

Focus on:
1. What problem does it solve?
2. What are the key findings?
3. Why is it relevant for students/researchers?

Keep it clear, actionable, and under 100 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary.trim();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate AI summary');
  }
}
