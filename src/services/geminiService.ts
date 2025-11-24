const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// UPDATED: Using a model from your allowed list (Index 7)
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function askGemini(question: string): Promise<string> {
  if (!API_KEY) {
    throw new Error('Gemini API key is missing');
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful agricultural assistant for Indian farmers. Answer the following farming question in a clear, practical way: ${question}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("API Error:", errorData);
      throw new Error(`Error ${response.status}: Failed to fetch AI response`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw error;
  }
}