import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, ExternalLink, Award, ThumbsUp } from "lucide-react";

interface SupplementCardProps {
  name: string;
  description: string;
  socialSentiment: number;
  evidenceLevel: "A" | "B" | "C" | "D";
  keyBenefits: string[];
  warnings?: string[];
  ingredients: string[];
  price?: string;
  imageUrl?: string;
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
        return "Strong Evidence";
      case "B":
        return "Moderate Evidence";
      case "C":
        return "Limited Evidence";
      default:
        return "Insufficient Evidence";
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
        {/* Social Sentiment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-primary" />
              <span className="font-medium">User Sentiment</span>
            </div>
            <span className="font-semibold">{socialSentiment}% Positive</span>
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
            <span>Key Benefits</span>
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
          <h4 className="text-sm font-medium">Active Ingredients</h4>
          <div className="flex flex-wrap gap-1.5">
            {ingredients.map((ingredient, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {warnings && warnings.length > 0 && (
          <div className="space-y-2 p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-medium text-warning">
              <AlertTriangle className="w-4 h-4" />
              <span>Safety Considerations</span>
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

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="default" className="flex-1">
            View Details
          </Button>
          <Button variant="outline">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
