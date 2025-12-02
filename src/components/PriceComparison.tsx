import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Store } from "lucide-react";

interface PriceComparisonProps {
  supplementName: string;
  ingredients: string[];
}

export function PriceComparison({ supplementName }: PriceComparisonProps) {
  const encoded = encodeURIComponent(supplementName);

  const links = [
    {
      retailer: "Amazon",
      url: `https://www.amazon.com/s?k=${encoded}`,
    },
    {
      retailer: "iHerb",
      url: `https://www.iherb.com/search?kw=${encoded}`,
    },
    {
      retailer: "Walmart",
      url: `https://www.walmart.com/search?q=${encoded}`,
    },
    {
      retailer: "Vitacost",
      url: `https://www.vitacost.com/search?q=${encoded}`,
    },
    {
      retailer: "CVS",
      url: `https://www.cvs.com/search?searchTerm=${encoded}`,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Where to Buy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.map((link) => (
          <div key={link.retailer} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              <span className="font-medium">{link.retailer}</span>
            </div>
            <Button asChild variant="outline" size="sm">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                Visit
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-2">
          These links search for your recommended supplement on popular shopping sites.
        </p>
      </CardContent>
    </Card>
  );
}
