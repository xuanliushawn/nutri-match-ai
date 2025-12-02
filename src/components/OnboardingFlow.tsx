import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Search, 
  FileText, 
  ShoppingCart, 
  TrendingUp,
  X,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShow(true);
    }
  }, []);

  const steps = [
    {
      icon: Sparkles,
      title: "Welcome to NutriMatch AI",
      description: "Your personalized health supplement advisor powered by AI and real scientific research.",
      tip: "Get evidence-based supplement recommendations tailored to your unique health goals."
    },
    {
      icon: Search,
      title: "Answer a Few Questions",
      description: "Tell us about your age, gender, health goals, and dietary preferences.",
      tip: "The more details you provide, the better we can personalize your recommendations."
    },
    {
      icon: FileText,
      title: "AI-Powered Analysis",
      description: "Our AI analyzes your profile and searches PubMed for real scientific papers.",
      tip: "Every recommendation is backed by peer-reviewed research from trusted sources."
    },
    {
      icon: ShoppingCart,
      title: "Find the Best Prices",
      description: "Compare prices across Amazon, iHerb, Walmart, and more retailers.",
      tip: "Save money with our real-time price comparison feature."
    },
    {
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Log daily ratings, symptoms, and notes to see what works for you.",
      tip: "Use the progress tracker to monitor your supplement effectiveness over time."
    }
  ];

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true");
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleSkip}
        >
          <X className="w-4 h-4" />
        </Button>

        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <currentStepData.icon className="w-12 h-12 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold">{currentStepData.title}</h2>
              <p className="text-lg text-muted-foreground max-w-md mx-auto">
                {currentStepData.description}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg max-w-md mx-auto">
              <p className="text-sm font-medium flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{currentStepData.tip}</span>
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              className="gap-2"
            >
              {currentStep === steps.length - 1 ? "Get Started" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Skip Button */}
          <div className="text-center mt-4">
            <Button
              variant="link"
              size="sm"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
