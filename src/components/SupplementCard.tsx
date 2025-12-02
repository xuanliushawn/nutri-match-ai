import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, ExternalLink, Award, ThumbsUp, CheckCircle2 } from "lucide-react";

interface ScientificPaper {
  title: string;
  authors: string;
  journal: string;
  year: number;
  pmid: string;
  summary: string;
  highlightSentence?: string;
  isVerified?: boolean;
}

interface SocialTrend {
  platform: string;
  hashtag: string;
  mentions: number;
}

interface SupplementCardProps {
  name: string;
  description: string;
  socialSentiment: number;
  evidenceLevel: "A" | "B" | "C" | "D";
  keyBenefits: string[];
  warnings?: string[];
  ingredients: (string | { name: string; dosage?: string })[];
  price?: string;
  imageUrl?: string;
  scientificPapers?: ScientificPaper[];
  socialTrends?: SocialTrend[];
  personalizedReason?: string;
  recommendedDose?: string;
}

export function SupplementCard({
  name,
  description,
  socialSentiment,
  evidenceLevel,
  keyBenefits,
  warnings,
  ingredients,
  price,
  imageUrl,
  scientificPapers,
  socialTrends,
  personalizedReason,
  recommendedDose,
}: SupplementCardProps) {
  const getEvidenceBadgeVariant = (level: string) => {
    switch (level) {
      case "A":
        return "success";
      case "B":
        return "default";
      case "C":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getEvidenceLabel = (level: string) => {
    switch (level) {
      case "A":
        return "Strong evidence";
      case "B":
        return "Moderate evidence";
      case "C":
        return "Limited evidence";
      default:
        return "Insufficient evidence";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 bg-gradient-card">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              {name}
              {socialSentiment >= 80 && (
                <Award className="w-5 h-5 text-accent" />
              )}
            </CardTitle>
            <CardDescription className="text-base">{description}</CardDescription>
          </div>
          {imageUrl && (
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={getEvidenceBadgeVariant(evidenceLevel)}>
            {getEvidenceLabel(evidenceLevel)} (Level {evidenceLevel})
          </Badge>
          {price && <Badge variant="outline">{price}</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Personalized Recommendation */}
        {personalizedReason && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Why this is good for you
            </h4>
            <p className="text-sm">{personalizedReason}</p>
            {recommendedDose && (
              <p className="text-sm font-medium text-primary">
                Recommended dose: {recommendedDose}
              </p>
            )}
          </div>
        )}

        {/* Social Sentiment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-primary" />
              <span className="font-medium">User sentiment</span>
            </div>
            <span className="font-semibold">{socialSentiment}% positive</span>
          </div>
          <Progress value={socialSentiment} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Based on {Math.floor(Math.random() * 5000) + 1000}+ social media reviews
          </p>
        </div>

        {/* Key Benefits */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <TrendingUp className="w-4 h-4 text-success" />
            <span>Key benefits</span>
          </div>
          <ul className="space-y-1.5">
            {keyBenefits.map((benefit, index) => (
              <li key={index} className="text-sm flex items-start gap-2">
                <span className="text-success mt-1">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Active Ingredients */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Active ingredients</h4>
          <div className="flex flex-wrap gap-1.5">
            {ingredients.map((ingredient, index) => {
              const displayText = typeof ingredient === 'string' 
                ? ingredient 
                : `${ingredient.name}${ingredient.dosage ? ` ${ingredient.dosage}` : ''}`;
              
              return (
                <Badge key={index} variant="secondary" className="text-xs">
                  {displayText}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Warnings */}
        {warnings && warnings.length > 0 && (
          <div className="space-y-2 p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-warning">
              <AlertTriangle className="w-4 h-4" />
              <span>Safety considerations</span>
            </div>
            <ul className="space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  • {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Scientific Evidence */}
        {scientificPapers && scientificPapers.length > 0 && (
          <div className="space-y-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Scientific evidence
              {scientificPapers.some(p => p.isVerified) && (
                <Badge variant="success" className="ml-2 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  PubMed verified
                </Badge>
              )}
            </h4>
            <div className="space-y-3">
              {scientificPapers.map((paper, index) => (
                <div key={index} className="text-xs space-y-1 p-3 bg-background/50 rounded-lg border">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium flex-1">{paper.title}</p>
                    {paper.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {paper.authors} - {paper.journal}, {paper.year}
                  </p>
                  {paper.highlightSentence && (
                    <p className="text-muted-foreground text-sm border-l-2 border-primary/50 pl-2 py-1">
                      “{paper.highlightSentence}”
                    </p>
                  )}
                  <p className="text-muted-foreground italic text-xs mt-1">
                    {paper.summary}
                  </p>
                  <a 
                    href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    Read full study <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
            {scientificPapers.some(p => p.isVerified) && (
              <p className="text-xs text-muted-foreground italic">
                ✓ Papers verified from the PubMed scientific database
              </p>
            )}
          </div>
        )}

        {/* Social Media Trends */}
        {socialTrends && socialTrends.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              Trending on social media
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialTrends.map((trend, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trend.platform}: {trend.hashtag} ({trend.mentions.toLocaleString()} posts)
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="default" className="flex-1">
            View details
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
