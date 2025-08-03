import React from "react";
import { Question } from "@/integrations/ai/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface AIQuestionFormProps {
  questions: Question[];
  loading: boolean;
  error: string | null;
  responses: Record<string, any>;
  onResponseChange: (questionId: string, value: any) => void;
  onRetry?: () => void;
}

export const AIQuestionForm: React.FC<AIQuestionFormProps> = ({
  questions,
  loading,
  error,
  responses,
  onResponseChange,
  onRetry,
}) => {
  const renderQuestion = (question: Question) => {
    const value = responses[question.id] || "";
    const isRequired = question.required;

    switch (question.type) {
      case "text":
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="flex items-center gap-2">
              {question.question}
              {isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </Label>
            <Textarea
              id={question.id}
              placeholder="Enter your answer..."
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              required={isRequired}
              className="min-h-[80px]"
            />
          </div>
        );

      case "number":
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="flex items-center gap-2">
              {question.question}
              {isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </Label>
            <Input
              id={question.id}
              type="number"
              placeholder="Enter a number..."
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              required={isRequired}
            />
          </div>
        );

      case "select":
        return (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id} className="flex items-center gap-2">
              {question.question}
              {isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => onResponseChange(question.id, val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "multiselect":
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div key={question.id} className="space-y-3">
            <Label className="flex items-center gap-2">
              {question.question}
              {isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </Label>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${question.id}_${option}`}
                    checked={selectedValues.includes(option)}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...selectedValues, option]
                        : selectedValues.filter((v) => v !== option);
                      onResponseChange(question.id, newValues);
                    }}
                  />
                  <Label
                    htmlFor={`${question.id}_${option}`}
                    className="text-sm font-normal"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case "boolean":
        return (
          <div key={question.id} className="space-y-3">
            <Label className="flex items-center gap-2">
              {question.question}
              {isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
            </Label>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}_yes`}
                  checked={value === true}
                  onCheckedChange={(checked) =>
                    onResponseChange(question.id, checked ? true : undefined)
                  }
                />
                <Label
                  htmlFor={`${question.id}_yes`}
                  className="text-sm font-normal"
                >
                  Yes
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}_no`}
                  checked={value === false}
                  onCheckedChange={(checked) =>
                    onResponseChange(question.id, checked ? false : undefined)
                  }
                />
                <Label
                  htmlFor={`${question.id}_no`}
                  className="text-sm font-normal"
                >
                  No
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Generating Questions</p>
              <p className="text-sm text-muted-foreground">
                AI is creating personalized questions for your product...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {onRetry && (
              <button
                onClick={onRetry}
                className="ml-2 underline hover:no-underline"
              >
                Try again
              </button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="space-y-2">
            <p className="text-lg font-medium">No Questions Available</p>
            <p className="text-sm text-muted-foreground">
              Unable to generate questions at this time. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="p-4 border rounded-lg bg-card">
          {renderQuestion(question)}
        </div>
      ))}
    </div>
  );
};
