import {
  generateQuestions,
  clearQuestionCache,
  debugAIResponse,
} from "@/integrations/ai/client";

/**
 * Test function to verify AI integration
 * This can be called from the browser console for testing
 */
export const testAIIntegration = async () => {
  console.log("🧪 Testing AI Integration...");

  try {
    // Test manufacturing questions for food category
    console.log("📝 Testing manufacturing questions for food category...");
    const manufacturingQuestions = await generateQuestions({
      category: "food",
      step: "manufacturing",
    });

    console.log(
      "✅ Manufacturing questions generated:",
      manufacturingQuestions
    );

    // Test testing questions for electronics category
    console.log("📝 Testing testing questions for electronics category...");
    const testingQuestions = await generateQuestions({
      category: "electronics",
      step: "testing",
    });

    console.log("✅ Testing questions generated:", testingQuestions);

    // Test environmental questions for personal-care category
    console.log(
      "📝 Testing environmental questions for personal-care category..."
    );
    const environmentalQuestions = await generateQuestions({
      category: "personal-care",
      step: "environmental",
    });

    console.log(
      "✅ Environmental questions generated:",
      environmentalQuestions
    );

    console.log("🎉 All AI integration tests passed!");
    return true;
  } catch (error) {
    console.error("❌ AI integration test failed:", error);
    return false;
  }
};

/**
 * Test fallback questions (works without API key)
 */
export const testFallbackQuestions = async () => {
  console.log("🧪 Testing Fallback Questions...");

  try {
    // Test manufacturing questions for food category
    console.log("📝 Testing manufacturing questions for food category...");
    const manufacturingQuestions = await generateQuestions({
      category: "food",
      step: "manufacturing",
    });

    console.log(
      "✅ Manufacturing questions generated:",
      manufacturingQuestions
    );

    console.log("🎉 Fallback questions test passed!");
    return true;
  } catch (error) {
    console.error("❌ Fallback questions test failed:", error);
    return false;
  }
};

/**
 * Clear the question cache
 */
export const clearCache = () => {
  clearQuestionCache();
  console.log("🗑️ Question cache cleared");
};

/**
 * Debug AI response for a specific category and step
 */
export const debugResponse = async (
  category: string,
  step: "manufacturing" | "testing" | "environmental"
) => {
  console.log(`🔍 Debugging AI response for ${category} - ${step}`);
  await debugAIResponse(category, step);
};

// Make functions available globally for testing
if (typeof window !== "undefined") {
  (window as any).testAIIntegration = testAIIntegration;
  (window as any).testFallbackQuestions = testFallbackQuestions;
  (window as any).clearAICache = clearCache;
  (window as any).debugAIResponse = debugResponse;
}
