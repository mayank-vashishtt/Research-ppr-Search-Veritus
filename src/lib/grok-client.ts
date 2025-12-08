const GROQ_API_KEY = process.env.GROK_API_KEY; // Using same env var name

if (!GROQ_API_KEY) {
  throw new Error('GROK_API_KEY is not defined in environment variables');
}

export async function generatePaperSummary(title: string, abstract: string | null): Promise<string> {
  try {
    const prompt = `Summarize this research paper for students in 2-3 concise sentences:

Title: ${title}
Abstract: ${abstract || 'No abstract available'}

Focus on:
1. What problem does it solve?
2. What are the key findings?
3. Why is it relevant for students/researchers?

Keep it clear, actionable, and under 100 words.`;

    // Using Groq API (not Grok/xAI)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that summarizes research papers for students.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      console.error('Status:', response.status, response.statusText);
      
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error?.message || 'Groq API request failed');
      } catch (e) {
        throw new Error(`Groq API request failed: ${response.status} ${errorText}`);
      }
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error('No summary generated');
    }

    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate AI summary');
  }
}

export async function generateDetailedReview(title: string, abstract: string | null, authors: string): Promise<string> {
  try {
    const prompt = `Provide a comprehensive, in-depth review of this research paper for students and researchers:

Title: ${title}
Authors: ${authors}
Abstract: ${abstract || 'No abstract available'}

Please provide a detailed analysis covering:

## 🎯 Research Problem
- What specific problem does this paper address?
- Why is this problem important?
- What are the limitations of existing approaches?

## 🔬 Methodology
- What approach/methods do the authors use?
- What makes their approach novel or different?
- What are the key technical innovations?

## 📊 Key Findings
- What are the main results and contributions?
- What evidence supports these findings?
- How significant are the results?

## 💡 Impact & Applications
- How does this advance the field?
- What are the practical applications?
- Who would benefit from this research?

## 🚀 Future Directions
- What questions remain unanswered?
- What are potential next steps?
- How might this influence future research?

Keep it detailed but accessible for students. Use clear explanations and avoid excessive jargon.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert research paper reviewer who provides detailed, insightful analysis for students and researchers.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error response:', errorText);
      
      try {
        const error = JSON.parse(errorText);
        throw new Error(error.error?.message || 'Groq API request failed');
      } catch (e) {
        throw new Error(`Groq API request failed: ${response.status} ${errorText}`);
      }
    }

    const data = await response.json();
    const review = data.choices[0]?.message?.content?.trim();

    if (!review) {
      throw new Error('No review generated');
    }

    return review;
  } catch (error) {
    console.error('Error generating detailed review:', error);
    throw new Error('Failed to generate detailed review');
  }
}
