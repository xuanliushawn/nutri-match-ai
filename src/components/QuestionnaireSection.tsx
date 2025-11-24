import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "radio" | "text";
  options?: string[];
}

interface QuestionnaireSectionProps {
  query: string;
  onComplete: (answers: Record<string, string>) => void;
  loading?: boolean;
}

export function QuestionnaireSection({ query, onComplete, loading }: QuestionnaireSectionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Generate questions based on the health goal
  const generateQuestions = (goal: string): Question[] => {
    const goalLower = goal.toLowerCase();
    
    // Hair growth questions
    if (goalLower.includes("hair") || goalLower.includes("baldness")) {
      return [
        { id: "scalp", question: "Is your scalp usually oily, dry, or normal?", type: "radio", options: ["Oily", "Dry", "Normal", "Not sure"] },
        { id: "dandruff", question: "Do you have dandruff or seborrheic dermatitis?", type: "radio", options: ["Yes", "No", "Sometimes"] },
        { id: "hair_type", question: "Is your hair thin, thick, straight, or curly?", type: "radio", options: ["Thin", "Thick", "Straight", "Curly", "Mix"] },
        { id: "family_history", question: "Is there a family history of baldness?", type: "radio", options: ["Yes", "No", "Not sure"] },
        { id: "stress", question: "What is your current stress level?", type: "radio", options: ["Low", "Medium", "High"] },
        { id: "hormonal", question: "Are you experiencing postpartum or menopausal changes?", type: "radio", options: ["Yes", "No", "Not applicable"] },
      ];
    }
    
    // Sleep questions
    if (goalLower.includes("sleep") || goalLower.includes("insomnia")) {
      return [
        { id: "sleep_issue", question: "What's your main sleep issue?", type: "radio", options: ["Trouble falling asleep", "Waking up during night", "Early morning waking", "All of the above"] },
        { id: "sleep_duration", question: "How many hours do you typically sleep?", type: "radio", options: ["Less than 5", "5-6 hours", "6-7 hours", "7+ hours"] },
        { id: "caffeine", question: "How much caffeine do you consume daily?", type: "radio", options: ["None", "1-2 cups", "3-4 cups", "5+ cups"] },
        { id: "screen_time", question: "Do you use screens before bed?", type: "radio", options: ["Yes, frequently", "Sometimes", "Rarely", "Never"] },
        { id: "stress", question: "What is your current stress level?", type: "radio", options: ["Low", "Medium", "High"] },
      ];
    }
    
    // Stress/anxiety questions
    if (goalLower.includes("stress") || goalLower.includes("anxiety")) {
      return [
        { id: "stress_type", question: "What type of stress do you experience most?", type: "radio", options: ["Work-related", "Personal/family", "Financial", "Health-related", "Multiple sources"] },
        { id: "duration", question: "How long have you been experiencing elevated stress?", type: "radio", options: ["Less than 1 month", "1-3 months", "3-6 months", "6+ months"] },
        { id: "symptoms", question: "What symptoms do you experience?", type: "radio", options: ["Racing thoughts", "Physical tension", "Sleep issues", "Irritability", "All of the above"] },
        { id: "caffeine", question: "How much caffeine do you consume daily?", type: "radio", options: ["None", "1-2 cups", "3-4 cups", "5+ cups"] },
        { id: "exercise", question: "How often do you exercise?", type: "radio", options: ["Daily", "3-5x/week", "1-2x/week", "Rarely/Never"] },
      ];
    }
    
    // Energy/fatigue questions
    if (goalLower.includes("energy") || goalLower.includes("fatigue") || goalLower.includes("tired")) {
      return [
        { id: "fatigue_time", question: "When do you feel most fatigued?", type: "radio", options: ["Morning", "Afternoon", "Evening", "All day"] },
        { id: "sleep_quality", question: "How would you rate your sleep quality?", type: "radio", options: ["Poor", "Fair", "Good", "Excellent"] },
        { id: "caffeine", question: "How much caffeine do you consume daily?", type: "radio", options: ["None", "1-2 cups", "3-4 cups", "5+ cups"] },
        { id: "exercise", question: "How often do you exercise?", type: "radio", options: ["Daily", "3-5x/week", "1-2x/week", "Rarely/Never"] },
        { id: "stress", question: "What is your current stress level?", type: "radio", options: ["Low", "Medium", "High"] },
      ];
    }
    
    // Weight/metabolism questions
    if (goalLower.includes("weight") || goalLower.includes("metabolism") || goalLower.includes("fat")) {
      return [
        { id: "goal", question: "What is your primary goal?", type: "radio", options: ["Lose weight", "Gain muscle", "Maintain weight", "Improve metabolism"] },
        { id: "diet_type", question: "What type of diet do you follow?", type: "radio", options: ["No specific diet", "Low-carb", "High-protein", "Vegetarian/Vegan", "Intermittent fasting"] },
        { id: "exercise", question: "How often do you exercise?", type: "radio", options: ["Daily", "3-5x/week", "1-2x/week", "Rarely/Never"] },
        { id: "sleep_quality", question: "How would you rate your sleep quality?", type: "radio", options: ["Poor", "Fair", "Good", "Excellent"] },
        { id: "stress", question: "What is your current stress level?", type: "radio", options: ["Low", "Medium", "High"] },
      ];
    }
    
    // Default questions for other goals
    return [
      { id: "duration", question: "How long have you been experiencing this concern?", type: "radio", options: ["Less than 1 month", "1-3 months", "3-6 months", "6+ months"] },
      { id: "severity", question: "How would you rate the severity?", type: "radio", options: ["Mild", "Moderate", "Severe"] },
      { id: "tried_before", question: "Have you tried supplements for this before?", type: "radio", options: ["Yes, worked well", "Yes, didn't work", "No", "Not sure"] },
      { id: "stress", question: "What is your current stress level?", type: "radio", options: ["Low", "Medium", "High"] },
    ];
  };

  const questions = generateQuestions(query);

  const handleSubmit = () => {
    onComplete(answers);
  };

  const handleSkip = () => {
    onComplete({});
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Help Us Personalize Your Recommendations</CardTitle>
              <CardDescription className="text-base">
                Answer these questions about "{query}" to get more tailored supplement suggestions. 
                All questions are optional—answer as many or as few as you'd like.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="space-y-3">
                  <Label className="text-base font-medium">{q.question}</Label>
                  {q.type === "radio" && q.options && (
                    <RadioGroup
                      value={answers[q.id] || ""}
                      onValueChange={(value) => setAnswers({ ...answers, [q.id]: value })}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {q.options.map((option) => (
                          <div key={option} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                            <Label htmlFor={`${q.id}-${option}`} className="cursor-pointer flex-1">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-1"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Recommendations...
                    </>
                  ) : (
                    "Get My Recommendations"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  disabled={loading}
                  size="lg"
                >
                  Skip Questions
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {Object.keys(answers).length} of {questions.length} questions answered
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}