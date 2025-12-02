import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";

interface Interaction {
  severity: "high" | "moderate" | "low";
  description: string;
  recommendation: string;
}

interface InteractionCheckerProps {
  supplements: string[];
  medications?: string[];
}

export function InteractionChecker({ supplements, medications = [] }: InteractionCheckerProps) {
  const [userMedications, setUserMedications] = useState<string[]>(medications);
  const [newMedication, setNewMedication] = useState("");
  const [interactions, setInteractions] = useState<Record<string, Interaction[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplements.length > 0 || userMedications.length > 0) {
      checkInteractions();
    }
  }, [supplements, userMedications]);

  const checkInteractions = async () => {
    setLoading(true);
    
    // Simulate interaction checking (in production, use DrugBank API or OpenFDA)
    const knownInteractions: Record<string, Interaction[]> = {
      "Magnesium": [
        {
          severity: "moderate",
          description: "May interact with antibiotics (tetracyclines, fluoroquinolones)",
          recommendation: "Take magnesium 2-3 hours before or after antibiotics"
        },
        {
          severity: "moderate",
          description: "Can interact with bisphosphonates (osteoporosis medications)",
          recommendation: "Separate doses by at least 2 hours"
        }
      ],
      "Vitamin K": [
        {
          severity: "high",
          description: "Interacts with blood thinners (Warfarin, Coumadin)",
          recommendation: "Consult doctor before taking - may reduce medication effectiveness"
        }
      ],
      "St. John's Wort": [
        {
          severity: "high",
          description: "Interacts with antidepressants (SSRIs, MAOIs)",
          recommendation: "Do NOT combine - risk of serotonin syndrome"
        },
        {
          severity: "high",
          description: "Reduces effectiveness of birth control pills",
          recommendation: "Use alternative contraception methods"
        }
      ],
      "Calcium": [
        {
          severity: "moderate",
          description: "Interferes with thyroid medication absorption",
          recommendation: "Take at least 4 hours apart from thyroid medication"
        }
      ],
      "Iron": [
        {
          severity: "low",
          description: "May reduce calcium absorption",
          recommendation: "Take iron and calcium supplements at different times"
        }
      ]
    };

    const detectedInteractions: Record<string, Interaction[]> = {};
    
    supplements.forEach(supplement => {
      const supplementName = supplement.split(' ')[0]; // Get base ingredient name
      if (knownInteractions[supplementName]) {
        detectedInteractions[supplement] = knownInteractions[supplementName];
      }
    });

    setInteractions(detectedInteractions);
    setLoading(false);
  };

  const addMedication = () => {
    if (newMedication.trim() && !userMedications.includes(newMedication.trim())) {
      setUserMedications([...userMedications, newMedication.trim()]);
      setNewMedication("");
    }
  };

  const removeMedication = (med: string) => {
    setUserMedications(userMedications.filter(m => m !== med));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "destructive";
      case "moderate": return "warning";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <XCircle className="w-4 h-4" />;
      case "moderate": return <AlertTriangle className="w-4 h-4" />;
      case "low": return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const hasInteractions = Object.keys(interactions).length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Interaction Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Medication Input */}
        <div className="space-y-2">
          <Label>Current Medications (Optional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter medication name (e.g., Warfarin, Levothyroxine)"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addMedication()}
            />
            <Button onClick={addMedication}>Add</Button>
          </div>
          {userMedications.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {userMedications.map(med => (
                <Badge key={med} variant="outline" className="gap-1">
                  {med}
                  <button onClick={() => removeMedication(med)} className="ml-1">×</button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Interaction Results */}
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Checking for interactions...
          </div>
        ) : hasInteractions ? (
          <div className="space-y-3">
            <Alert variant="destructive" className="border-warning bg-warning/10">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Potential Interactions Found</AlertTitle>
              <AlertDescription>
                {Object.keys(interactions).length} supplement(s) may have interactions. Review details below.
              </AlertDescription>
            </Alert>

            {Object.entries(interactions).map(([supplement, interactionList]) => (
              <Card key={supplement} className="border-warning/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{supplement}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {interactionList.map((interaction, idx) => (
                    <Alert key={idx} variant={getSeverityColor(interaction.severity) as any}>
                      <div className="flex items-start gap-2">
                        {getSeverityIcon(interaction.severity)}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(interaction.severity) as any}>
                              {interaction.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{interaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            <strong>Recommendation:</strong> {interaction.recommendation}
                          </p>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle>No Interactions Detected</AlertTitle>
            <AlertDescription>
              No known interactions found for the recommended supplements.
              {userMedications.length === 0 && " Add your medications above for a comprehensive check."}
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Important:</strong> This checker provides general information only. 
            Always consult your healthcare provider before combining supplements with medications.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
