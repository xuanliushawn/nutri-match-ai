import { SupplementCard } from "./SupplementCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ResultsSectionProps {
  query: string;
}

// Mock data - in production this would come from AI analysis
const supplementDatabase = {
  hairGrowth: [
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
  ],
  stress: [
    {
      name: "Ashwagandha Supreme",
      description: "Adaptogenic herb clinically proven to reduce cortisol and stress responses",
      socialSentiment: 88,
      evidenceLevel: "A" as const,
      keyBenefits: [
        "Reduces cortisol levels by up to 28% (clinical studies)",
        "Improves stress resilience within 4-6 weeks",
        "Enhances mood and cognitive function",
        "Backed by 20+ randomized controlled trials"
      ],
      warnings: [
        "May cause drowsiness - avoid driving initially",
        "Not recommended for pregnant or breastfeeding women",
        "May interact with thyroid medications"
      ],
      ingredients: ["KSM-66 Ashwagandha (600mg)", "Black Pepper Extract", "Magnesium", "L-Theanine"],
      price: "$29.99",
    },
    {
      name: "Calm & Balance Complex",
      description: "Multi-ingredient formula combining adaptogens and calming amino acids",
      socialSentiment: 82,
      evidenceLevel: "B" as const,
      keyBenefits: [
        "Promotes relaxation without sedation (78% user approval)",
        "Supports healthy stress response",
        "Contains L-Theanine for calm focus",
        "Moderate evidence from multiple studies"
      ],
      warnings: [
        "May enhance effects of sedative medications",
        "Start with half dose to assess tolerance"
      ],
      ingredients: ["Rhodiola Rosea", "L-Theanine", "Holy Basil", "Magnesium Glycinate", "B-Complex"],
      price: "$26.50",
    },
    {
      name: "Magnesium Threonate Plus",
      description: "Brain-optimized magnesium for stress relief and cognitive support",
      socialSentiment: 79,
      evidenceLevel: "B" as const,
      keyBenefits: [
        "Crosses blood-brain barrier effectively",
        "Supports calm nervous system function",
        "May improve sleep quality",
        "Emerging research on cognitive benefits"
      ],
      warnings: [
        "May cause loose stools if taken in excess",
        "Take with food to improve absorption"
      ],
      ingredients: ["Magnesium L-Threonate", "Vitamin B6", "Zinc", "Taurine"],
      price: "$34.99",
    },
  ],
};

function getResultsForQuery(query: string) {
  const lowerQuery = query.toLowerCase();
  
  // Check for stress-related keywords
  if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety') || 
      lowerQuery.includes('calm') || lowerQuery.includes('relax')) {
    return supplementDatabase.stress;
  }
  
  // Check for hair-related keywords
  if (lowerQuery.includes('hair') || lowerQuery.includes('growth') || 
      lowerQuery.includes('biotin') || lowerQuery.includes('follicle')) {
    return supplementDatabase.hairGrowth;
  }
  
  // Default to hair growth if no match
  return supplementDatabase.hairGrowth;
}

export function ResultsSection({ query }: ResultsSectionProps) {
  const results = getResultsForQuery(query);
  
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
            {results.map((supplement, index) => (
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
