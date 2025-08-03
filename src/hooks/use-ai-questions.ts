import { useState, useEffect, useCallback } from "react";
import {
  generateQuestions,
  Question,
  QuestionGenerationParams,
} from "@/integrations/ai/client";

interface UseAIQuestionsReturn {
  questions: Question[];
  loading: boolean;
  error: string | null;
  generateQuestionsForStep: (params: QuestionGenerationParams) => Promise<void>;
  clearError: () => void;
}

export const useAIQuestions = (): UseAIQuestionsReturn => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestionsForStep = useCallback(
    async (params: QuestionGenerationParams) => {
      setLoading(true);
      setError(null);

      try {
        const generatedQuestions = await generateQuestions(params);
        setQuestions(generatedQuestions);
      } catch (err) {
        console.error("Error generating questions:", err);
        setError("Failed to generate questions. Please try again.");
        // Set empty questions array to trigger fallback UI
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    questions,
    loading,
    error,
    generateQuestionsForStep,
    clearError,
  };
};
