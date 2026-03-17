import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, problem, solution, targetMarket, difficulty } = body;

    if (!title || !problem || !solution) {
      return Response.json(
        { error: 'Missing required fields: title, problem, solution' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert startup advisor and idea validator. Analyze the following startup idea and provide constructive feedback.

STARTUP IDEA:
Title: ${title}
Problem: ${problem}
Solution: ${solution}
Target Market: ${targetMarket || 'Not specified'}
Difficulty Level: ${difficulty || 'Not specified'}

Please provide:
1. A brief validation score (0-100) indicating viability
2. Key strengths of this idea (2-3 bullet points)
3. Potential challenges or concerns (2-3 bullet points)
4. Suggestions for improvement (2-3 bullet points)
5. Market potential assessment (Low/Medium/High)

Format your response as JSON with these exact keys: "validationScore", "strengths", "challenges", "suggestions", "marketPotential"`;

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse validation response');
    }

    const validation = JSON.parse(jsonMatch[0]);

    return Response.json({
      success: true,
      validation: {
        validationScore: validation.validationScore || 0,
        strengths: validation.strengths || [],
        challenges: validation.challenges || [],
        suggestions: validation.suggestions || [],
        marketPotential: validation.marketPotential || 'Unknown',
      },
    });
  } catch (error) {
    console.error('Validation API error:', error);
    return Response.json(
      {
        error: 'Failed to validate idea',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
