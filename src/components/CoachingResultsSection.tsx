import { CoachingCard } from "./CoachingCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CoachingResultsSectionProps {
  query: string;
}

interface YouTubeVideo {
  title: string;
  channel: string;
  url: string;
  relevantTimestamp?: string;
  keyTakeaway: string;
}

interface CoachingAdvice {
  title: string;
  mainAdvice: string;
  personalizedReason: string;
  techniqueTips: string[];
  commonMistakes: string[];
  progressionSteps: string[];
  youtubeVideos: YouTubeVideo[];
  equipmentNeeded?: string[];
}

export function CoachingResultsSection({ query }: CoachingResultsSectionProps) {
  const [advice, setAdvice] = useState<CoachingAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoachingAdvice = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: functionError } = await supabase.functions.invoke(
          'generate-coaching',
          {
            body: { query }
          }
        );

        if (functionError) {
          throw functionError;
        }

        if (data?.advice) {
          setAdvice(data.advice);
        } else {
          throw new Error("No coaching advice returned");
        }
      } catch (err) {
        console.error("Error fetching coaching advice:", err);
        setError(err instanceof Error ? err.message : "Failed to generate coaching advice");
      } finally {
        setLoading(false);
      }
    };

    fetchCoachingAdvice();
  }, [query]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">
              Coaching Advice for: <span className="text-primary">{query}</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              AI-powered coaching based on expert YouTube tutorials and personalized to your profile
            </p>
          </div>

          {/* Disclaimer */}
          <Alert className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              <strong>Coaching Disclaimer:</strong> This advice is for educational purposes and based on publicly available content. 
              For sport-specific training, consider working with a certified coach. Always warm up properly and listen to your body.
            </AlertDescription>
          </Alert>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <p className="text-lg text-muted-foreground">
                  Analyzing expert coaching videos and personalizing advice...
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Alert className="border-destructive/20 bg-destructive/5">
              <Info className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-sm">
                <strong>Error:</strong> {error}. Please try again or ask a different question.
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {!loading && !error && advice && (
            <CoachingCard {...advice} />
          )}

          {/* Empty State */}
          {!loading && !error && !advice && (
            <Alert>
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription>
                No coaching advice generated. Try a different question.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </section>
  );
}
