import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI with API key
const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GOOGLE_AI_API_KEY || ""
);

// Question generation prompt templates
const QUESTION_PROMPTS = {
  manufacturing: `Generate 5-7 relevant questions about manufacturing and sourcing for a {category} product. 
  Focus on:
  - Ingredient/component sourcing and transparency
  - Manufacturing processes and locations
  - Supply chain visibility
  - Quality control measures
  - Ethical sourcing practices
  
  IMPORTANT: Return ONLY a valid JSON array without any markdown formatting or code blocks.
  Each question object should have: 'id', 'question', 'type', and 'required' fields.
  Question types must be exactly: 'text', 'select', 'multiselect', 'number', or 'boolean'.
  For 'select' and 'multiselect' types, include an 'options' array.
  Make questions specific to {category} industry standards.
  
  Example format:
  [
    {
      "id": "mfg_1",
      "question": "Where are the main ingredients sourced from?",
      "type": "text",
      "required": true
    }
  ]`,

  testing: `Generate 5-7 relevant questions about testing and certifications for a {category} product.
  Focus on:
  - Quality testing procedures
  - Safety certifications and standards
  - Third-party testing and validation
  - Compliance with industry regulations
  - Testing frequency and protocols
  
  IMPORTANT: Return ONLY a valid JSON array without any markdown formatting or code blocks.
  Each question object should have: 'id', 'question', 'type', and 'required' fields.
  Question types must be exactly: 'text', 'select', 'multiselect', 'number', or 'boolean'.
  For 'select' and 'multiselect' types, include an 'options' array.
  Make questions specific to {category} industry requirements.
  
  Example format:
  [
    {
      "id": "test_1",
      "question": "Is the product FDA approved?",
      "type": "boolean",
      "required": true
    }
  ]`,

  environmental: `Generate 5-7 relevant questions about environmental impact for a {category} product.
  Focus on:
  - Sustainability practices
  - Packaging materials and recyclability
  - Carbon footprint and emissions
  - Waste management and disposal
  - Environmental certifications
  
  IMPORTANT: Return ONLY a valid JSON array without any markdown formatting or code blocks.
  Each question object should have: 'id', 'question', 'type', and 'required' fields.
  Question types must be exactly: 'text', 'select', 'multiselect', 'number', or 'boolean'.
  For 'select' and 'multiselect' types, include an 'options' array.
  Make questions specific to {category} environmental considerations.
  
  Example format:
  [
    {
      "id": "env_1",
      "question": "Is the packaging recyclable?",
      "type": "boolean",
      "required": true
    }
  ]`,
};

// Fallback questions for each category and step
const FALLBACK_QUESTIONS = {
  manufacturing: {
    food: [
      {
        id: "mfg_1",
        question: "Where are the main ingredients sourced from?",
        type: "text" as const,
        required: true,
      },
      {
        id: "mfg_2",
        question: "Are ingredients organic or conventional?",
        type: "select" as const,
        required: true,
        options: ["Organic", "Conventional", "Mixed"],
      },
      {
        id: "mfg_3",
        question: "Is the manufacturing facility certified?",
        type: "boolean" as const,
        required: true,
      },
      {
        id: "mfg_4",
        question: "How often are suppliers audited?",
        type: "select" as const,
        required: false,
        options: ["Monthly", "Quarterly", "Annually", "Never"],
      },
      {
        id: "mfg_5",
        question: "Are there any allergens in the facility?",
        type: "multiselect" as const,
        required: false,
        options: ["Dairy", "Nuts", "Gluten", "Soy", "None"],
      },
    ],
    "personal-care": [
      {
        id: "mfg_1",
        question: "Are ingredients cruelty-free certified?",
        type: "boolean" as const,
        required: true,
      },
      {
        id: "mfg_2",
        question: "What percentage of ingredients are natural vs synthetic?",
        type: "number" as const,
        required: true,
      },
      {
        id: "mfg_3",
        question: "Is the manufacturing facility GMP certified?",
        type: "boolean" as const,
        required: true,
      },
      {
        id: "mfg_4",
        question: "Are ingredients tested for purity?",
        type: "boolean" as const,
        required: true,
      },
      {
        id: "mfg_5",
        question: "What preservatives are used?",
        type: "multiselect" as const,
        required: false,
        options: [
          "Parabens",
          "Phenoxyethanol",
          "Natural preservatives",
          "None",
        ],
      },
    ],
    electronics: [
      {
        id: "mfg_1",
        question: "Where are electronic components manufactured?",
        type: "text",
        required: true,
      },
      {
        id: "mfg_2",
        question: "Are conflict minerals avoided?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_3",
        question: "Is the manufacturing facility ISO certified?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_4",
        question: "What quality control tests are performed?",
        type: "multiselect",
        required: true,
        options: [
          "Safety testing",
          "Performance testing",
          "Durability testing",
          "Environmental testing",
        ],
      },
      {
        id: "mfg_5",
        question: "Are suppliers audited for labor practices?",
        type: "boolean",
        required: false,
      },
    ],
    cosmetics: [
      {
        id: "mfg_1",
        question: "Are ingredients vegan and cruelty-free?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_2",
        question: "What percentage of ingredients are natural?",
        type: "number",
        required: true,
      },
      {
        id: "mfg_3",
        question: "Is the manufacturing facility FDA registered?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_4",
        question: "Are ingredients tested for skin sensitivity?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_5",
        question: "What preservatives are used?",
        type: "multiselect",
        required: false,
        options: [
          "Parabens",
          "Phenoxyethanol",
          "Natural preservatives",
          "None",
        ],
      },
    ],
    pharmaceuticals: [
      {
        id: "mfg_1",
        question: "Is the manufacturing facility FDA approved?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_2",
        question: "Are ingredients USP grade?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_3",
        question: "Is the facility GMP certified?",
        type: "boolean",
        required: true,
      },
      {
        id: "mfg_4",
        question: "How often is quality testing performed?",
        type: "select",
        required: true,
        options: ["Every batch", "Daily", "Weekly", "Monthly"],
      },
      {
        id: "mfg_5",
        question: "Are ingredients tested for purity?",
        type: "boolean",
        required: true,
      },
    ],
  },
  testing: {
    food: [
      {
        id: "test_1",
        question: "Is the product FDA approved?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_2",
        question: "What food safety certifications does the product have?",
        type: "multiselect",
        required: true,
        options: ["HACCP", "ISO 22000", "FSSC 22000", "SQF", "None"],
      },
      {
        id: "test_3",
        question: "How often is the product tested for contaminants?",
        type: "select",
        required: true,
        options: ["Every batch", "Weekly", "Monthly", "Quarterly"],
      },
      {
        id: "test_4",
        question: "Are third-party laboratories used for testing?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_5",
        question: "What is the shelf life testing protocol?",
        type: "text",
        required: false,
      },
    ],
    "personal-care": [
      {
        id: "test_1",
        question: "Is the product dermatologically tested?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_2",
        question: "What safety certifications does the product have?",
        type: "multiselect",
        required: true,
        options: ["FDA", "EU Cosmetics Regulation", "ISO 22716", "None"],
      },
      {
        id: "test_3",
        question: "Are ingredients tested for skin sensitivity?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_4",
        question: "Is the product tested for microbial contamination?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_5",
        question: "What is the stability testing period?",
        type: "number",
        required: false,
      },
    ],
    electronics: [
      {
        id: "test_1",
        question: "Is the product UL certified?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_2",
        question: "What safety standards does the product meet?",
        type: "multiselect",
        required: true,
        options: ["CE", "FCC", "RoHS", "REACH", "None"],
      },
      {
        id: "test_3",
        question: "Is electromagnetic compatibility (EMC) tested?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_4",
        question: "Are drop and impact tests performed?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_5",
        question: "What is the warranty testing protocol?",
        type: "text",
        required: false,
      },
    ],
    cosmetics: [
      {
        id: "test_1",
        question: "Is the product dermatologically tested?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_2",
        question: "What safety certifications does the product have?",
        type: "multiselect",
        required: true,
        options: [
          "FDA",
          "EU Cosmetics Regulation",
          "ISO 22716",
          "Leaping Bunny",
          "None",
        ],
      },
      {
        id: "test_3",
        question: "Are ingredients tested for skin sensitivity?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_4",
        question: "Is the product tested for microbial contamination?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_5",
        question: "What is the stability testing period?",
        type: "number",
        required: false,
      },
    ],
    pharmaceuticals: [
      {
        id: "test_1",
        question: "Is the product FDA approved?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_2",
        question: "What clinical trials have been conducted?",
        type: "text",
        required: true,
      },
      {
        id: "test_3",
        question: "Are ingredients tested for purity?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_4",
        question: "Is the product tested for efficacy?",
        type: "boolean",
        required: true,
      },
      {
        id: "test_5",
        question: "What is the shelf life testing protocol?",
        type: "text",
        required: false,
      },
    ],
  },
  environmental: {
    food: [
      {
        id: "env_1",
        question: "Is the packaging recyclable?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_2",
        question:
          "What percentage of packaging is made from recycled materials?",
        type: "number",
        required: false,
      },
      {
        id: "env_3",
        question: "Is the product certified organic?",
        type: "boolean",
        required: false,
      },
      {
        id: "env_4",
        question: "What is the carbon footprint per unit?",
        type: "number",
        required: false,
      },
      {
        id: "env_5",
        question: "Are sustainable farming practices used?",
        type: "boolean",
        required: false,
      },
    ],
    "personal-care": [
      {
        id: "env_1",
        question: "Is the packaging biodegradable?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_2",
        question: "Are ingredients sustainably sourced?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_3",
        question: "Is the product certified cruelty-free?",
        type: "boolean",
        required: false,
      },
      {
        id: "env_4",
        question: "What percentage of ingredients are biodegradable?",
        type: "number",
        required: false,
      },
      {
        id: "env_5",
        question: "Is the manufacturing process carbon-neutral?",
        type: "boolean",
        required: false,
      },
    ],
    electronics: [
      {
        id: "env_1",
        question: "Is the product Energy Star certified?",
        type: "boolean",
        required: false,
      },
      {
        id: "env_2",
        question: "Is the packaging made from recycled materials?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_3",
        question: "Is the product RoHS compliant?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_4",
        question: "What is the power consumption in standby mode?",
        type: "number",
        required: false,
      },
      {
        id: "env_5",
        question: "Is there a take-back program for recycling?",
        type: "boolean",
        required: false,
      },
    ],
    cosmetics: [
      {
        id: "env_1",
        question: "Is the packaging recyclable?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_2",
        question: "Are ingredients sustainably sourced?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_3",
        question: "Is the product certified cruelty-free?",
        type: "boolean",
        required: false,
      },
      {
        id: "env_4",
        question: "What percentage of packaging is biodegradable?",
        type: "number",
        required: false,
      },
      {
        id: "env_5",
        question: "Is the manufacturing process carbon-neutral?",
        type: "boolean",
        required: false,
      },
    ],
    pharmaceuticals: [
      {
        id: "env_1",
        question: "Is the packaging recyclable?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_2",
        question: "Are ingredients sustainably sourced?",
        type: "boolean",
        required: true,
      },
      {
        id: "env_3",
        question: "Is the product certified organic?",
        type: "boolean",
        required: false,
      },
      {
        id: "env_4",
        question: "What is the carbon footprint per unit?",
        type: "number",
        required: false,
      },
      {
        id: "env_5",
        question: "Are sustainable manufacturing practices used?",
        type: "boolean",
        required: false,
      },
    ],
  },
};

// Question type definitions
export interface Question {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect" | "number" | "boolean";
  required: boolean;
  options?: string[];
}

export interface QuestionGenerationParams {
  category: string;
  step: "manufacturing" | "testing" | "environmental";
  previousResponses?: Record<string, any>;
}

// Cache for generated questions to avoid repeated API calls
const questionCache = new Map<string, Question[]>();

/**
 * Generate questions using Google AI Studio (Gemini)
 */
export const generateQuestions = async (
  params: QuestionGenerationParams
): Promise<Question[]> => {
  const { category, step, previousResponses } = params;
  const cacheKey = `${category}_${step}`;

  // Check cache first
  if (questionCache.has(cacheKey)) {
    return questionCache.get(cacheKey)!;
  }

  try {
    // Check if API key is available
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      console.warn("Google AI API key not found, using fallback questions");
      return getFallbackQuestions(category, step);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build the prompt
    const prompt = QUESTION_PROMPTS[step].replace("{category}", category);

    // Add context from previous responses if available
    let fullPrompt = prompt;
    if (previousResponses && Object.keys(previousResponses).length > 0) {
      fullPrompt += `\n\nPrevious responses context: ${JSON.stringify(
        previousResponses
      )}`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse JSON response
    try {
      // Clean the response text - remove markdown code blocks if present
      let cleanText = text.trim();

      // Remove markdown code blocks if present
      if (cleanText.startsWith("```json")) {
        cleanText = cleanText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
      } else if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```\n?/, "").replace(/\n?```$/, "");
      }

      // Try to extract JSON from the response
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        cleanText = jsonMatch[0];
      }

      const questions = JSON.parse(cleanText) as Question[];

      // Validate questions structure
      if (Array.isArray(questions) && questions.length > 0) {
        // Validate each question has required fields
        const validQuestions = questions.filter(
          (q) =>
            q.id &&
            q.question &&
            q.type &&
            typeof q.required === "boolean" &&
            ["text", "select", "multiselect", "number", "boolean"].includes(
              q.type
            )
        );

        if (validQuestions.length > 0) {
          // Cache the result
          questionCache.set(cacheKey, validQuestions);
          return validQuestions;
        }
      }
    } catch (parseError) {
      console.warn("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response:", text);
    }

    // If parsing fails, use fallback
    console.warn("AI response parsing failed, using fallback questions");
    return getFallbackQuestions(category, step);
  } catch (error) {
    console.error("Error generating questions with AI:", error);
    return getFallbackQuestions(category, step);
  }
};

/**
 * Get fallback questions for a category and step
 */
const getFallbackQuestions = (
  category: string,
  step: "manufacturing" | "testing" | "environmental"
): Question[] => {
  const categoryQuestions =
    FALLBACK_QUESTIONS[step][
      category as keyof (typeof FALLBACK_QUESTIONS)[typeof step]
    ];

  if (categoryQuestions) {
    return categoryQuestions as Question[];
  }

  // Generic fallback questions if category not found
  const genericQuestions = {
    manufacturing: [
      {
        id: "mfg_1",
        question: "Where are the main components sourced from?",
        type: "text" as const,
        required: true,
      },
      {
        id: "mfg_2",
        question: "Is the manufacturing facility certified?",
        type: "boolean" as const,
        required: true,
      },
      {
        id: "mfg_3",
        question: "How often are suppliers audited?",
        type: "select" as const,
        required: false,
        options: ["Monthly", "Quarterly", "Annually", "Never"],
      },
    ],
    testing: [
      {
        id: "test_1",
        question: "What safety certifications does the product have?",
        type: "multiselect" as const,
        required: true,
        options: ["ISO", "CE", "FDA", "None"],
      },
      {
        id: "test_2",
        question: "Are third-party laboratories used for testing?",
        type: "boolean" as const,
        required: true,
      },
      {
        id: "test_3",
        question: "How often is quality testing performed?",
        type: "select" as const,
        required: true,
        options: ["Every batch", "Weekly", "Monthly", "Quarterly"],
      },
    ],
    environmental: [
      {
        id: "env_1",
        question: "Is the packaging recyclable?",
        type: "boolean" as const,
        required: true,
      },
      {
        id: "env_2",
        question: "What percentage of materials are sustainable?",
        type: "number" as const,
        required: false,
      },
      {
        id: "env_3",
        question: "Is the manufacturing process environmentally friendly?",
        type: "boolean" as const,
        required: false,
      },
    ],
  };

  return genericQuestions[step] as Question[];
};

/**
 * Clear the question cache (useful for testing or when you want fresh questions)
 */
export const clearQuestionCache = () => {
  questionCache.clear();
};

/**
 * Get cached questions for a category and step
 */
export const getCachedQuestions = (
  category: string,
  step: "manufacturing" | "testing" | "environmental"
): Question[] | null => {
  const cacheKey = `${category}_${step}`;
  return questionCache.get(cacheKey) || null;
};

/**
 * Debug function to test AI response parsing
 */
export const debugAIResponse = async (
  category: string,
  step: "manufacturing" | "testing" | "environmental"
) => {
  try {
    if (!import.meta.env.VITE_GOOGLE_AI_API_KEY) {
      console.log("No API key available for debugging");
      return;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = QUESTION_PROMPTS[step].replace("{category}", category);

    console.log("Sending prompt to AI:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Raw AI response:", text);

    // Test parsing
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    console.log("Cleaned text:", cleanText);

    const questions = JSON.parse(cleanText);
    console.log("Parsed questions:", questions);
  } catch (error) {
    console.error("Debug error:", error);
  }
};
