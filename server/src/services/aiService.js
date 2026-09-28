const AI_BASE_URL =
  process.env.AI_BASE_URL ||
  "https://api.openai.com/";

const AI_MODEL =
  process.env.AI_MODEL;

export const analyzeResume = async ({
  resumeText,
  jobDescription,
}) => {
  if (!process.env.AI_API_KEY) {
    throw new Error(
      "AI_API_KEY is not configured"
    );
  }

  const prompt = `
You are an AI recruitment screening assistant.

Analyze the candidate resume against the job description.

Return ONLY valid JSON.

Required structure:

{
  "matchScore": number,
  "skillsMatched": [],
  "skillsMissing": [],
  "experienceSummary": "",
  "strengths": [],
  "concerns": [],
  "recommendation": ""
}

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}
`;

  const response = await fetch(
    `${AI_BASE_URL}/chat/completions`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization:
          `Bearer ${process.env.AI_API_KEY}`,
      },

      body: JSON.stringify({
        model: AI_MODEL,

        messages: [
          {
            role: "system",
            content:
              "You are a recruitment screening assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 0.2,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `AI request failed: ${errorText}`
    );
  }

  const data = await response.json();

  const content =
    data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error(
      "AI returned an empty response"
    );
  }

  return JSON.parse(content);
};