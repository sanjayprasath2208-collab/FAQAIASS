const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini client
const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_google_gemini_api_key_here') {
    throw new Error(
      'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file.'
    );
  }

  return new GoogleGenAI({
    apiKey: apiKey
  });
};

/**
 * Generate an AI answer
 */
const generateAnswer = async (question) => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Answer this question clearly and concisely:

${question}`,
    });

    const answer = response.text;

    if (!answer) {
      throw new Error('No response text received from Gemini API');
    }

    return answer.trim();

  } catch (error) {
    console.error('Error in geminiService.generateAnswer:', error);

    throw new Error(
      `AI Answer Generation failed: ${error.message}`
    );
  }
};

/**
 * Generate an AI FAQ
 */
const generateFAQ = async (topic) => {
  try {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',

      contents: `Generate one frequently asked question and its answer about this topic:

${topic}`,

      config: {
        responseMimeType: 'application/json',

        responseSchema: {
          type: 'OBJECT',

          properties: {
            question: {
              type: 'STRING'
            },

            answer: {
              type: 'STRING'
            }
          },

          required: [
            'question',
            'answer'
          ]
        }
      }
    });

    const text = response.text;

    if (!text) {
      throw new Error('No response received from Gemini API');
    }

    const faqPair = JSON.parse(text);

    return faqPair;

  } catch (error) {
    console.error('Error in geminiService.generateFAQ:', error);

    throw new Error(
      `AI FAQ Generation failed: ${error.message}`
    );
  }
};

module.exports = {
  generateAnswer,
  generateFAQ
};