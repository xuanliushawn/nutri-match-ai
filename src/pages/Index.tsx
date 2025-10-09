import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { ResultsSection } from "@/components/ResultsSection";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  const handleNewSearch = () => {
    setShowResults(false);
    setSearchQuery(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm shadow-soft">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold">NutriMatch AI</span>
          </div>
          {showResults && (
            <button 
              onClick={handleNewSearch}
              className="text-sm text-primary hover:underline font-medium"
            >
              New Search
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {!showResults ? (
          <HeroSection onSearch={handleSearch} />
        ) : (
          searchQuery && <ResultsSection query={searchQuery} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">About NutriMatch AI</h3>
              <p className="text-sm text-muted-foreground">
                Combining AI, social intelligence, and scientific evidence to help you discover 
                supplements that align with your health goals.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Data Sources</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• X/Twitter real-time reviews</li>
                <li>• RedNote (小红书) user experiences</li>
                <li>• PubMed scientific research</li>
                <li>• Clinical trial databases</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• GDPR & Privacy Compliant</li>
                <li>• Not medical advice</li>
                <li>• Consult healthcare providers</li>
                <li>• Evidence levels are estimates</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 NutriMatch AI. For educational purposes only. Not intended to diagnose, treat, cure, or prevent any disease.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
