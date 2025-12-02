import { SupplementCard } from "./SupplementCard";
import { InteractionChecker } from "./InteractionChecker";
import { ProgressTracker } from "./ProgressTracker";
import { PriceComparison } from "./PriceComparison";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResultsSectionProps {
  query: string;
  answers?: Record<string, string>;
}

interface ScientificPaper {
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid: string;
  summary: string;
}

interface SocialTrend {
  platform: string;
  hashtag: string;
  mentions: number;
}

interface Supplement {
  name: string;
  description: string;
  socialSentiment: number;
  evidenceLevel: "A" | "B" | "C" | "D";
  keyBenefits: string[];
  warnings: string[];
  ingredients: (string | { name: string; dosage?: string })[];
  price: string;
  scientificPapers?: ScientificPaper[];
  socialTrends?: SocialTrend[];
  personalizedReason?: string;
  recommendedDose?: string;
}


export function ResultsSection({ query, answers = {} }: ResultsSectionProps) {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressQuestions, setProgressQuestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchSupplements = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: functionError } = await supabase.functions.invoke(
          'generate-supplements',
          {
            body: { query, answers }
          }
        );

        if (functionError) {
          throw functionError;
        }

        if (data?.supplements) {
          setSupplements(data.supplements);
          // Generate tailored progress-tracking questions for this goal
          try {
            const qRes = await fetch("/functions/v1/generate-progress-questions", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                healthGoal: query,
                supplementName: data.supplements[0]?.name ?? "",
              }),
            });
            if (qRes.ok) {
              const qJson = await qRes.json();
              if (Array.isArray(qJson.questions)) {
                setProgressQuestions(qJson.questions);
              }
            }
          } catch (e) {
            console.error("Error fetching progress questions:", e);
          }
        } else {
          throw new Error("No supplements returned");
        }
      } catch (err) {
        console.error("Error fetching supplements:", err);
        setError(err instanceof Error ? err.message : "Failed to generate recommendations");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplements();
  }, [query, answers]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">
              Top matches for <span className="text-primary">{query}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Based on AI analysis of social media reviews, PubMed research, and your answers.
            </p>
          </div>

          {/* Disclaimer */}
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Medical disclaimer:</strong> This tool is for educational purposes only and is not a substitute for professional medical advice. Always talk to your doctor or pharmacist before starting any new supplement.
            </AlertDescription>
          </Alert>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <p className="text-lg text-muted-foreground">
                  Analyzing social media reviews and scientific evidence for you...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert className="border-destructive/20 bg-destructive/5">
              <Info className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                <strong>Something went wrong.</strong> {error}. Please try again in a moment.
              </AlertDescription>
            </Alert>
          )}

          {/* Results Grid */}
          {!loading && !error && supplements.length > 0 && (
            <div className="space-y-8">
              {/* Interaction Checker */}
              <InteractionChecker supplements={supplements} />
              
              {/* Supplement Cards */}
              <Tabs defaultValue="supplements" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                  <TabsTrigger value="supplements">Supplements</TabsTrigger>
                  <TabsTrigger value="pricing">Where to buy</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                </TabsList>
                
                <TabsContent value="supplements" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {supplements.map((supplement, index) => (
                      <SupplementCard key={index} {...supplement} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pricing" className="mt-6">
                  <div className="space-y-6">
                    {supplements.map((supplement, index) => (
                      <div key={index}>
                        <h3 className="text-xl font-semibold mb-4">{supplement.name}</h3>
                        <PriceComparison 
                          supplementName={supplement.name}
                          ingredients={supplement.ingredients.map(i => 
                            typeof i === 'string' ? i : i.name
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="progress" className="mt-6">
                  <ProgressTracker
                    supplementName={supplements[0]?.name ?? ""}
                    healthGoal={query}
                    questions={progressQuestions}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && supplements.length === 0 && (
            <Alert>
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription>
                No supplement matches were found. Try rephrasing your goal or using a simpler phrase.
              </AlertDescription>
            </Alert>
          )}

          {/* Methodology Note */}
          <div className="mt-12 p-6 bg-muted/30 rounded-xl border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              How we match supplements for you
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Social sentiment analysis</p>
                <p>We scan real posts and reviews from X/Twitter and RedNote to understand what people actually experience with each supplement.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Scientific evidence grading</p>
                <p>We cross-check ingredients with PubMed research and clinical trials to rank the strength of the scientific evidence.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Ingredient efficacy scoring</p>
                <p>Each ingredient gets a score based on dosage ranges, study quality, and real-world outcomes reported by users.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Safety and interaction checks</p>
                <p>We highlight potential interactions and safety considerations, but always ask you to confirm with your own healthcare provider.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
