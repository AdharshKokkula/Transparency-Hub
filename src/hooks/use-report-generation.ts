import { useState, useCallback } from "react";
import {
  generateAndDownloadReport,
  generateReportAsBase64,
  ReportData,
} from "@/services/report-generator";

interface UseReportGenerationReturn {
  generating: boolean;
  error: string | null;
  generateReport: (data: ReportData) => Promise<void>;
  generateReportPreview: (data: ReportData) => Promise<string>;
  clearError: () => void;
}

export const useReportGeneration = (): UseReportGenerationReturn => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (data: ReportData) => {
    setGenerating(true);
    setError(null);

    try {
      await generateAndDownloadReport(data);
    } catch (err) {
      console.error("Error generating report:", err);
      setError(
        err instanceof Error ? err.message : "Failed to generate report"
      );
    } finally {
      setGenerating(false);
    }
  }, []);

  const generateReportPreview = useCallback(
    async (data: ReportData): Promise<string> => {
      setGenerating(true);
      setError(null);

      try {
        const base64 = await generateReportAsBase64(data);
        return base64;
      } catch (err) {
        console.error("Error generating report preview:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate report preview"
        );
        throw err;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generating,
    error,
    generateReport,
    generateReportPreview,
    clearError,
  };
};
