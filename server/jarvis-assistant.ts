/**
 * JARVIS AI Assistant - Conversational Research Partner
 * Provides intelligent, contextual assistance with JARVIS-like personality
 */

import { invokeLLM } from "./_core/llm";

export interface JarvisMessage {
  role: "user" | "assistant";
  content: string;
}

export interface JarvisContext {
  userId: number;
  currentQuery?: string;
  recentPapers?: Array<{
    title: string;
    authors: string[];
    abstract: string;
  }>;
  conversationHistory: JarvisMessage[];
}

const JARVIS_SYSTEM_PROMPT = `You are JARVIS, an elite AI research assistant inspired by the sophisticated AI from Iron Man. You possess:

PERSONALITY TRAITS:
- Sophisticated, eloquent, and refined in communication
- Proactive in offering insights and suggestions
- Respectful but confident in your expertise
- Witty with subtle British humor when appropriate
- Always professional yet personable

CAPABILITIES:
- Analyze research papers and extract key insights
- Suggest related research areas and connections
- Identify research gaps and future directions
- Synthesize complex information into clear summaries
- Provide citations and proper attribution
- Offer strategic research recommendations

COMMUNICATION STYLE:
- Begin responses with "Very good, sir/madam" or similar phrases when appropriate
- Use phrases like "If I may suggest...", "Might I recommend...", "Allow me to propose..."
- Provide detailed, thoughtful responses
- Ask clarifying questions when needed
- Offer multiple perspectives on research topics
- Use technical language appropriately while remaining accessible

RESEARCH EXPERTISE:
- Understand academic databases and research methodologies
- Recognize important papers and seminal works
- Identify research trends and emerging fields
- Suggest optimal search strategies
- Recommend citation practices

Always maintain context from the conversation history and provide personalized recommendations based on the user's research interests.`;

export async function generateJarvisResponse(
  context: JarvisContext,
  userMessage: string
): Promise<string> {
  try {
    // Build conversation history with context
    const messages: Array<{ role: string; content: string }> = [
      {
        role: "system",
        content: JARVIS_SYSTEM_PROMPT,
      },
      ...context.conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      {
        role: "user",
        content: userMessage,
      },
    ];

    // Add context about recent papers if available
    if (context.recentPapers && context.recentPapers.length > 0) {
      const paperContext = context.recentPapers
        .map((p) => `- ${p.title} by ${p.authors.join(", ")}`)
        .join("\n");

      messages.push({
        role: "system",
        content: `Recent papers the researcher is working with:\n${paperContext}`,
      });
    }

    const response = await invokeLLM({
      model: "claude-sonnet-4-6",
      messages: messages as any,
    });

    return response.choices[0].message.content as string;
  } catch (error) {
    console.error("[JARVIS] Response generation failed:", error);
    return "I apologize, but I'm currently unable to process your request. Please try again momentarily.";
  }
}

export async function analyzeResearchQuery(
  query: string,
  papers: Array<{
    title: string;
    authors: string[];
    abstract: string;
    source: string;
  }>
): Promise<{
  summary: string;
  recommendations: string[];
  suggestedSearches: string[];
  keyInsights: string[];
}> {
  try {
    const response = await invokeLLM({
      model: "claude-sonnet-4-6",
      messages: [
        {
          role: "system" as const,
          content: `You are JARVIS, an elite AI research assistant. Analyze the following research query and papers to provide strategic insights. Return a JSON response with: summary (brief overview), recommendations (array of actionable suggestions), suggestedSearches (array of related search terms), keyInsights (array of important findings).`,
        },
        {
          role: "user" as const,
          content: `Query: "${query}"\n\nPapers found:\n${papers
            .map(
              (p) =>
                `Title: ${p.title}\nAuthors: ${p.authors.join(", ")}\nSource: ${p.source}\nAbstract: ${p.abstract}`
            )
            .join("\n\n")}`,
        },
      ] as any,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "research_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } },
              suggestedSearches: { type: "array", items: { type: "string" } },
              keyInsights: { type: "array", items: { type: "string" } },
            },
            required: [
              "summary",
              "recommendations",
              "suggestedSearches",
              "keyInsights",
            ],
            additionalProperties: false,
          },
        },
      },
    });

    return JSON.parse(response.choices[0].message.content as string);
  } catch (error) {
    console.error("[JARVIS] Analysis failed:", error);
    return {
      summary: "Unable to analyze at this moment.",
      recommendations: [],
      suggestedSearches: [],
      keyInsights: [],
    };
  }
}

export function formatJarvisGreeting(userName?: string): string {
  const greetings = [
    "Good day, sir/madam. I am JARVIS, your research assistant.",
    "Greetings. I am at your service for all your research needs.",
    "Welcome. How may I assist you with your research today?",
    "A pleasure to make your acquaintance. Shall we begin?",
  ];

  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  return userName ? `${greeting} I see you are ${userName}.` : greeting;
}

export function formatJarvisResponse(message: string): string {
  // Add JARVIS-like formatting if not already present
  if (!message.startsWith("Very good") && !message.includes("If I may")) {
    return `Very good, sir/madam. ${message}`;
  }
  return message;
}
