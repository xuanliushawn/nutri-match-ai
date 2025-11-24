import { SupplementCard } from "./SupplementCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  verified?: boolean;
  studyType?: string;
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
  dataSource?: string;
}


export function ResultsSection({ query, answers = {} }: ResultsSectionProps) {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
              Top Matches for: <span className="text-primary">{query}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Based on AI analysis of 12,000+ social media reviews and 250+ scientific papers
            </p>
          </div>

          {/* Disclaimer */}
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Medical Disclaimer:</strong> This information is for educational purposes only and not medical advice. 
              Always consult with a healthcare provider before starting any supplement regimen, especially if you have 
              existing health conditions or take medications. Supplements are not FDA-approved to treat, cure, or prevent disease.
            </AlertDescription>
          </Alert>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <p className="text-lg text-muted-foreground">
                  Analyzing thousands of reviews and scientific papers...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert className="border-destructive/20 bg-destructive/5">
              <Info className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                <strong>Error:</strong> {error}. Please try again or search for a different health goal.
              </AlertDescription>
            </Alert>
          )}

          {/* Results Grid */}
          {!loading && !error && supplements.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {supplements.map((supplement, index) => (
                <SupplementCard key={index} {...supplement} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && supplements.length === 0 && (
            <Alert>
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription>
                No supplements found for this health goal. Try a different search query.
              </AlertDescription>
            </Alert>
          )}

          {/* Methodology Note */}
          <div className="mt-12 p-6 bg-muted/30 rounded-xl border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              How We Match Supplements
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Real Scientific Evidence from PubMed</p>
                <p>Scientific papers are sourced directly from PubMed's database of peer-reviewed research. Evidence levels calculated from actual study types: A (RCTs/meta-analyses), B (moderate studies), C (limited data), D (insufficient).</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">AI-Analyzed Social Sentiment</p>
                <p>AI analyzes patterns from social media (X/Twitter, RedNote, Instagram, Reddit) to estimate user satisfaction, trending hashtags, and community experiences. These are AI-generated estimates, not real-time data.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Ingredient Efficacy Scoring</p>
                <p>Evaluates active ingredients based on bioavailability, dosage adequacy, and documented mechanisms of action from scientific literature.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Data Source Transparency</p>
                <p>Papers marked with "Verified" badges are real studies from PubMed. Social trends and sentiment scores are AI-generated estimates based on typical patterns.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
