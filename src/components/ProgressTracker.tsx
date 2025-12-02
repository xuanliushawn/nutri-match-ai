import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, FileText, Plus } from "lucide-react";
import { format } from "date-fns";

interface ProgressEntry {
  id: string;
  date: Date;
  supplementName: string;
  rating: number;
  notes: string;
  symptoms: string[];
}

interface ProgressTrackerProps {
  supplementName: string;
  healthGoal: string;
  questions?: string[];
}

export function ProgressTracker({ supplementName, healthGoal, questions = [] }: ProgressTrackerProps) {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState([5]);
  const [notes, setNotes] = useState("");

  const addEntry = () => {
    const newEntry: ProgressEntry = {
      id: Date.now().toString(),
      date: new Date(),
      supplementName,
      rating: rating[0],
      notes,
      symptoms: []
    };

    setEntries([newEntry, ...entries]);
    setNotes("");
    setRating([5]);
    setShowForm(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "text-success";
    if (rating >= 5) return "text-warning";
    return "text-destructive";
  };

  const getRatingLabel = (rating: number) => {
    if (rating >= 8) return "Great Progress";
    if (rating >= 5) return "Moderate Progress";
    return "Needs Improvement";
  };

  const averageRating = entries.length > 0 
    ? entries.reduce((sum, e) => sum + e.rating, 0) / entries.length 
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progress Tracker
            </CardTitle>
            <CardDescription>
              Track how {supplementName} is affecting your {healthGoal.toLowerCase()} day by day.
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(!showForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Log Progress
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Overview */}
        {entries.length > 0 && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{entries.length}</p>
              <p className="text-xs text-muted-foreground">Days Tracked</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${getRatingColor(averageRating)}`}>
                {averageRating.toFixed(1)}/10
              </p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">
                {entries.filter(e => e.rating >= 7).length}
              </p>
              <p className="text-xs text-muted-foreground">Good Days</p>
            </div>
          </div>
        )}

        {/* Entry Form */}
        {showForm && (
          <Card className="border-primary/20">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>How is your {healthGoal.toLowerCase()} today? (1–10)</Label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={rating}
                    onValueChange={setRating}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="outline" className="w-12 text-center">
                    {rating[0]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  1 = no change or worse, 10 = major improvement in your {healthGoal.toLowerCase()}
                </p>
              </div>

              {questions.length > 0 && (
                <div className="space-y-2">
                  <Label>Today, reflect on these points:</Label>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {questions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea
                  placeholder={`Describe any changes in your ${healthGoal.toLowerCase()} today (symptoms, timing, side effects, triggers, etc.).`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={addEntry} className="flex-1">
                  Save Entry
                </Button>
                <Button onClick={() => setShowForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress History */}
        {entries.length > 0 ? (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Progress History
            </h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {entries.map(entry => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {format(entry.date, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={getRatingColor(entry.rating)}>
                            {entry.rating}/10 - {getRatingLabel(entry.rating)}
                          </Badge>
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            "{entry.notes}"
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : !showForm && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No progress entries yet</p>
            <p className="text-sm">Start tracking to see how your {healthGoal.toLowerCase()} changes over time.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
