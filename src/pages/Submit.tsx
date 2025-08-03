import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAIQuestions } from "@/hooks/use-ai-questions";
import { useReportGeneration } from "@/hooks/use-report-generation";
import { AIQuestionForm } from "@/components/AIQuestionForm";
import { generateQuestions } from "@/integrations/ai/client";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  Save,
  User,
  RefreshCw,
} from "lucide-react";

const productCategories = [
  { value: "food", label: "Food & Beverages", icon: "🍎" },
  { value: "personal-care", label: "Personal Care", icon: "🧴" },
  { value: "electronics", label: "Electronics", icon: "📱" },
  { value: "clothing", label: "Clothing & Textiles", icon: "👕" },
  { value: "household", label: "Household Items", icon: "🏠" },
  { value: "automotive", label: "Automotive", icon: "🚗" },
  { value: "cosmetics", label: "Cosmetics & Beauty", icon: "💄" },
  { value: "pharmaceuticals", label: "Pharmaceuticals", icon: "💊" },
  { value: "toys", label: "Toys & Games", icon: "🧸" },
  { value: "sports", label: "Sports & Fitness", icon: "⚽" },
];

const Submit = () => {
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formResponses, setFormResponses] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    questions,
    loading: aiLoading,
    error: aiError,
    generateQuestionsForStep,
    clearError,
  } = useAIQuestions();

  const {
    generating: reportGenerating,
    error: reportError,
    generateReport,
    clearError: clearReportError,
  } = useReportGeneration();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    checkUser();
  }, []);

  // Generate questions when step changes and category is available
  useEffect(() => {
    if (currentStep >= 2 && currentStep <= 4 && productCategory) {
      const stepMap = {
        2: "manufacturing" as const,
        3: "testing" as const,
        4: "environmental" as const,
      };

      generateQuestionsForStep({
        category: productCategory,
        step: stepMap[currentStep],
        previousResponses: formResponses,
      });
    }
  }, [currentStep, productCategory, generateQuestionsForStep, formResponses]);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);
  };

  const handleNext = () => {
    if (currentStep === 1 && (!productName || !productCategory)) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    if (currentStep < totalSteps) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);

      // Generate AI questions for the next step if it's an AI-powered step
      if (nextStep >= 2 && nextStep <= 4 && productCategory) {
        const stepMap = {
          2: "manufacturing" as const,
          3: "testing" as const,
          4: "environmental" as const,
        };

        generateQuestionsForStep({
          category: productCategory,
          step: stepMap[nextStep],
          previousResponses: formResponses,
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setFormResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleRetryQuestions = () => {
    if (currentStep >= 2 && currentStep <= 4 && productCategory) {
      const stepMap = {
        2: "manufacturing" as const,
        3: "testing" as const,
        4: "environmental" as const,
      };

      generateQuestionsForStep({
        category: productCategory,
        step: stepMap[currentStep],
        previousResponses: formResponses,
      });
    }
  };

  const handleSaveDraft = async () => {
    if (!user || !productName || !productCategory) {
      setError("Please fill in the basic product information");
      return;
    }

    setLoading(true);
    try {
      // Mock save functionality until database is set up
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Draft saved",
        description: "Your product information has been saved as a draft.",
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving draft:", err);
      setError("Failed to save draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!productName || !productCategory || !user) {
      setError(
        "Please complete all required fields before generating the report."
      );
      return;
    }

    try {
      // Get questions from all steps by generating them if not already cached
      const stepMap = {
        2: "manufacturing" as const,
        3: "testing" as const,
        4: "environmental" as const,
      };

      const allQuestions: Record<string, any[]> = {};

      // Generate questions for each step to ensure we have all data
      for (let step = 2; step <= 4; step++) {
        const stepName = stepMap[step as keyof typeof stepMap];
        try {
          const stepQuestions = await generateQuestions({
            category: productCategory,
            step: stepName,
            previousResponses: formResponses,
          });
          allQuestions[stepName] = stepQuestions;
        } catch (error) {
          console.warn(`Failed to generate questions for ${stepName}:`, error);
          // Use fallback questions if AI generation fails
          allQuestions[stepName] = [];
        }
      }

      const reportData = {
        productName,
        productCategory,
        userEmail: user.email,
        formResponses: formResponses,
        questions: allQuestions,
        generatedAt: new Date(),
      };

      await generateReport(reportData);

      toast({
        title: "Report Generated",
        description:
          "Your transparency report has been generated and downloaded successfully.",
      });
    } catch (error) {
      console.error("Report generation error:", error);
      setError("Failed to generate report. Please try again.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Product Information
              </h2>
              <p className="text-muted-foreground">
                Let's start with basic information about your product
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  type="text"
                  placeholder="Enter your product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productCategory">Product Category *</Label>
                <Select
                  value={productCategory}
                  onValueChange={setProductCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {productCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Manufacturing & Sourcing
              </h2>
              <p className="text-muted-foreground">
                Tell us about how your product is made and where materials come
                from
              </p>
            </div>

            <AIQuestionForm
              questions={questions}
              loading={aiLoading}
              error={aiError}
              responses={formResponses}
              onResponseChange={handleResponseChange}
              onRetry={handleRetryQuestions}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Testing & Certifications
              </h2>
              <p className="text-muted-foreground">
                Share information about quality testing and certifications
              </p>
            </div>

            <AIQuestionForm
              questions={questions}
              loading={aiLoading}
              error={aiError}
              responses={formResponses}
              onResponseChange={handleResponseChange}
              onRetry={handleRetryQuestions}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Environmental Impact
              </h2>
              <p className="text-muted-foreground">
                Help consumers understand your product's environmental footprint
              </p>
            </div>

            <AIQuestionForm
              questions={questions}
              loading={aiLoading}
              error={aiError}
              responses={formResponses}
              onResponseChange={handleResponseChange}
              onRetry={handleRetryQuestions}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                Review & Submit
              </h2>
              <p className="text-muted-foreground">
                Review your information and generate your transparency report
              </p>
            </div>

            <Card className="bg-gradient-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      Product Name:
                    </span>
                    <span className="text-muted-foreground">{productName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      Category:
                    </span>
                    <div className="flex items-center gap-2">
                      <span>
                        {
                          productCategories.find(
                            (c) => c.value === productCategory
                          )?.icon
                        }
                      </span>
                      <span className="text-muted-foreground">
                        {
                          productCategories.find(
                            (c) => c.value === productCategory
                          )?.label
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      Completion:
                    </span>
                    <Badge className="bg-primary/20 text-primary-foreground border-primary/30">
                      Ready for Review
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                Your transparency report is ready to be generated. This will
                create a comprehensive PDF document with all your product
                information.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">
              TransparencyHub
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">
                Product Transparency Report
              </h1>
              <Badge variant="outline">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-glow">
            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {reportError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{reportError}</AlertDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearReportError}
                    className="mt-2"
                  >
                    Dismiss
                  </Button>
                </Alert>
              )}

              {renderStep()}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button variant="outline" onClick={handlePrevious}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    onClick={handleSaveDraft}
                    disabled={loading || !productName || !productCategory}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>

                {currentStep < totalSteps ? (
                  <Button onClick={handleNext} variant="professional">
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="hero"
                    disabled={loading || reportGenerating}
                    onClick={handleGenerateReport}
                  >
                    {loading || reportGenerating
                      ? "Generating..."
                      : "Generate Report"}
                    <Check className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Submit;
