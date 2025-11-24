import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";
import heroBackground from "@/assets/hero-background.jpg";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  mode: "supplements" | "coaching";
}

export function HeroSection({ onSearch, mode }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(210, 245, 240, 0.9), rgba(180, 230, 240, 0.85)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border shadow-soft">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Supplement Discovery</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              {mode === "supplements" ? (
                <>
                  Find Your Perfect
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    Supplement Match
                  </span>
                </>
              ) : (
                <>
                  Get Personalized
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    Sports Coaching
                  </span>
                </>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              {mode === "supplements" 
                ? "Discover supplements backed by real user experiences and scientific evidence. Let AI analyze thousands of reviews and research papers to find what works for you."
                : "Get expert coaching advice powered by AI analysis of top YouTube tutorials. Personalized tips based on your profile and training goals."
              }
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 p-2 bg-card rounded-xl shadow-strong border">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={mode === "supplements" 
                    ? "What health goal are you looking to achieve? (e.g., hair growth, better sleep)"
                    : "What do you need help with? (e.g., improve my tennis serve, run faster, build endurance)"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-base border-0 focus-visible:ring-0 bg-transparent"
                />
              </div>
              <Button 
                size="lg" 
                variant="hero"
                onClick={handleSearch}
                className="px-8 h-14"
              >
                Discover
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {mode === "supplements" 
                ? 'Try: "boost energy", "improve sleep", "support hair growth", or "reduce stress"'
                : 'Try: "improve my serve", "run faster", "build core strength", or "increase flexibility"'
              }
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
            <div className="p-6 bg-card/60 backdrop-blur-sm rounded-xl border shadow-soft">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Social Intelligence</h3>
              <p className="text-sm text-muted-foreground">
                Real reviews from X/Twitter and RedNote analyzed by AI
              </p>
            </div>
            
            <div className="p-6 bg-card/60 backdrop-blur-sm rounded-xl border shadow-soft">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Science-Backed</h3>
              <p className="text-sm text-muted-foreground">
                Cross-referenced with PubMed research and clinical studies
              </p>
            </div>
            
            <div className="p-6 bg-card/60 backdrop-blur-sm rounded-xl border shadow-soft">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Safety First</h3>
              <p className="text-sm text-muted-foreground">
                Interaction warnings and evidence-based risk assessments
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
