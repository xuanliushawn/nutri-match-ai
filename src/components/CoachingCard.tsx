import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Youtube, Target, AlertCircle, TrendingUp, Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface YouTubeVideo {
  title: string;
  channel: string;
  url: string;
  relevantTimestamp?: string;
  keyTakeaway: string;
}

interface CoachingCardProps {
  title: string;
  mainAdvice: string;
  personalizedReason: string;
  techniqueTips: string[];
  commonMistakes: string[];
  progressionSteps: string[];
  youtubeVideos: YouTubeVideo[];
  equipmentNeeded?: string[];
}

export function CoachingCard({
  title,
  mainAdvice,
  personalizedReason,
  techniqueTips,
  commonMistakes,
  progressionSteps,
  youtubeVideos,
  equipmentNeeded
}: CoachingCardProps) {
  return (
    <Card className="p-8 space-y-6 hover:shadow-lg transition-shadow">
      {/* Title */}
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-foreground">{title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">{mainAdvice}</p>
      </div>

      <Separator />

      {/* Personalized Reason */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Why This Works for You
        </h4>
        <p className="text-sm text-foreground">{personalizedReason}</p>
      </div>

      {/* Technique Tips */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Key Technique Tips
        </h4>
        <ul className="space-y-2">
          {techniqueTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-primary mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Common Mistakes */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-destructive" />
          Common Mistakes to Avoid
        </h4>
        <ul className="space-y-2">
          {commonMistakes.map((mistake, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className="text-destructive mt-1">✗</span>
              <span>{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Progression Steps */}
      <div className="space-y-3">
        <h4 className="font-semibold flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Progression Path
        </h4>
        <ol className="space-y-2">
          {progressionSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-3 text-sm">
              <Badge variant="outline" className="mt-0.5 min-w-6 justify-center">
                {index + 1}
              </Badge>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Equipment Needed */}
      {equipmentNeeded && equipmentNeeded.length > 0 && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Equipment Needed
            </h4>
            <div className="flex flex-wrap gap-2">
              {equipmentNeeded.map((item, index) => (
                <Badge key={index} variant="secondary">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      {/* YouTube Videos */}
      <div className="space-y-4">
        <h4 className="font-semibold flex items-center gap-2">
          <Youtube className="w-5 h-5 text-destructive" />
          Recommended Video Tutorials
        </h4>
        <div className="space-y-3">
          {youtubeVideos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <div className="flex items-start gap-3">
                <Youtube className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {video.channel}
                    {video.relevantTimestamp && ` • Start at ${video.relevantTimestamp}`}
                  </p>
                  <p className="text-xs text-foreground mt-2 italic">
                    "{video.keyTakeaway}"
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Card>
  );
}
