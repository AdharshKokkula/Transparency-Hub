import {
  generateAndDownloadReport,
  ReportData,
} from "@/services/report-generator";

/**
 * Test function to verify report generation
 * This can be called from the browser console for testing
 */
export const testReportGeneration = async () => {
  console.log("🧪 Testing Report Generation...");

  try {
    const testData: ReportData = {
      productName: "Test Product",
      productCategory: "food",
      userEmail: "test@example.com",
      formResponses: {
        mfg_1: "Organic ingredients from local farms",
        mfg_2: "Organic",
        mfg_3: true,
        mfg_4: "Quarterly",
        mfg_5: ["Nuts", "Dairy"],
        test_1: true,
        test_2: ["HACCP", "ISO 22000"],
        test_3: "Every batch",
        test_4: true,
        test_5: "Standard shelf life testing protocol",
        env_1: true,
        env_2: 75,
        env_3: true,
        env_4: 2.5,
        env_5: true,
      },
      questions: {
        manufacturing: [
          {
            id: "mfg_1",
            question: "Where are the main ingredients sourced from?",
            type: "text",
            required: true,
          },
          {
            id: "mfg_2",
            question: "Are ingredients organic or conventional?",
            type: "select",
            required: true,
            options: ["Organic", "Conventional", "Mixed"],
          },
          {
            id: "mfg_3",
            question: "Is the manufacturing facility certified?",
            type: "boolean",
            required: true,
          },
          {
            id: "mfg_4",
            question: "How often are suppliers audited?",
            type: "select",
            required: false,
            options: ["Monthly", "Quarterly", "Annually", "Never"],
          },
          {
            id: "mfg_5",
            question: "Are there any allergens in the facility?",
            type: "multiselect",
            required: false,
            options: ["Dairy", "Nuts", "Gluten", "Soy", "None"],
          },
        ],
        testing: [
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
        environmental: [
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
      },
      generatedAt: new Date(),
    };

    console.log("📝 Generating test report...");
    await generateAndDownloadReport(testData);
    console.log("✅ Test report generated successfully!");
    return true;
  } catch (error) {
    console.error("❌ Report generation test failed:", error);
    return false;
  }
};

// Make function available globally for testing
if (typeof window !== "undefined") {
  (window as any).testReportGeneration = testReportGeneration;
}
