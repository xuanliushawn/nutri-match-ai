import { SupplementCard } from "./SupplementCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ResultsSectionProps {
  query: string;
}

// Mock data - in production this would come from AI analysis
const mockResults = [
  {
    name: "Biotin Complex Pro",
    description: "High-potency biotin with collagen and keratin for comprehensive hair support",
    socialSentiment: 85,
    evidenceLevel: "A" as const,
    keyBenefits: [
      "Promotes hair thickness and strength (reported by 82% of users)",
      "Reduces hair breakage within 8-12 weeks",
      "Supports nail health and skin clarity",
      "Backed by 15+ clinical trials"
    ],
    warnings: [
      "May interfere with thyroid function tests - inform your doctor",
      "Take at least 4 hours apart from thyroid medication",
      "Not recommended during pregnancy without medical consultation"
    ],
    ingredients: ["Biotin (10,000 mcg)", "Collagen Type I & III", "Keratin", "Zinc", "Vitamin E"],
    price: "$24.99",
  },
  {
    name: "Hair Growth Essentials",
    description: "Multi-nutrient formula targeting hair follicle health and growth cycles",
    socialSentiment: 78,
    evidenceLevel: "B" as const,
    keyBenefits: [
      "Supports hair density (76% user satisfaction)",
      "Reduces hair shedding in 6-10 weeks",
      "Contains saw palmetto for DHT blocking",
      "Moderate evidence from observational studies"
    ],
    warnings: [
      "May cause mild digestive discomfort initially",
      "Avoid if allergic to shellfish (contains marine collagen)"
    ],
    ingredients: ["Saw Palmetto", "Marine Collagen", "Iron", "B-Complex", "Silica"],
    price: "$32.99",
  },
  {
    name: "Follicle Fuel Advanced",
    description: "Amino acid-rich formula for hair follicle nourishment and regeneration",
    socialSentiment: 72,
    evidenceLevel: "B" as const,
    keyBenefits: [
      "Provides building blocks for hair protein synthesis",
      "Users report softer, more manageable hair",
      "May improve scalp health",
      "Some supporting research on amino acid supplementation"
    ],
    warnings: [
      "Limited long-term safety data",
      "Consult healthcare provider if taking blood thinners"
    ],
    ingredients: ["L-Cysteine", "L-Methionine", "MSM", "Vitamin C", "Grape Seed Extract"],
    price: "$28.50",
  },
];

export function ResultsSection({ query }: ResultsSectionProps) {
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

          {/* Results Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockResults.map((supplement, index) => (
              <SupplementCard key={index} {...supplement} />
            ))}
          </div>

          {/* Methodology Note */}
          <div className="mt-12 p-6 bg-muted/30 rounded-xl border">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              How We Match Supplements
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground mb-1">Social Sentiment Analysis</p>
                <p>AI scans X/Twitter and RedNote for recent user experiences, extracting benefits, side effects, and overall satisfaction patterns.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Scientific Evidence Grading</p>
                <p>Cross-references ingredients with PubMed research. Evidence levels: A (strong RCTs), B (moderate studies), C (limited data), D (insufficient).</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Ingredient Efficacy Scoring</p>
                <p>Evaluates active ingredients based on bioavailability, dosage adequacy, and documented mechanisms of action.</p>
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">Safety & Interaction Checks</p>
                <p>Flags potential interactions with medications, contraindications, and side effects based on medical databases.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
