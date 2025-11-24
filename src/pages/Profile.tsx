import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    age: "",
    sex: "",
    height: "",
    weight: "",
    activity_level: "",
    dietary_preferences: [] as string[],
    dietary_restrictions: [] as string[],
    allergies: [] as string[],
    genetic_data_snps: {} as Record<string, boolean>,
    genetic_data_file_url: "",
  });

  const dietaryOptions = ["Vegan", "Vegetarian", "Keto", "Paleo", "Gluten-Free", "Dairy-Free", "Low-Carb"];
  const commonAllergies = ["Nuts", "Shellfish", "Soy", "Eggs", "Dairy", "Gluten", "Fish"];
  const snpOptions = [
    { id: "mthfr", label: "MTHFR C677T/A1298C (Folate metabolism)" },
    { id: "vdr", label: "VDR (Vitamin D receptor)" },
    { id: "apoe", label: "APOE ε4 (Alzheimer's risk)" },
    { id: "comt", label: "COMT (Dopamine/stress response)" },
    { id: "fto", label: "FTO (Obesity/metabolism)" },
    { id: "cyp1a2", label: "CYP1A2 (Caffeine metabolism)" }
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          age: data.age?.toString() || "",
          sex: data.sex || "",
          height: data.height?.toString() || "",
          weight: data.weight?.toString() || "",
          activity_level: data.activity_level || "",
          dietary_preferences: Array.isArray(data.dietary_preferences) ? (data.dietary_preferences as string[]) : [],
          dietary_restrictions: Array.isArray(data.dietary_restrictions) ? (data.dietary_restrictions as string[]) : [],
          allergies: data.allergies || [],
          genetic_data_snps: typeof data.genetic_data_snps === 'object' ? (data.genetic_data_snps as Record<string, boolean>) : {},
          genetic_data_file_url: data.genetic_data_file_url || "",
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          age: profile.age ? parseInt(profile.age) : null,
          sex: profile.sex || null,
          height: profile.height ? parseFloat(profile.height) : null,
          weight: profile.weight ? parseFloat(profile.weight) : null,
          activity_level: profile.activity_level as any || null,
          dietary_preferences: profile.dietary_preferences as any,
          dietary_restrictions: profile.dietary_restrictions as any,
          allergies: profile.allergies,
          genetic_data_snps: profile.genetic_data_snps as any,
          genetic_data_file_url: profile.genetic_data_file_url || null,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter((i) => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Fill in your information to get personalized supplement recommendations (all fields optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sex</Label>
                <Select value={profile.sex} onValueChange={(value) => setProfile({ ...profile, sex: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                  placeholder="175"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                  placeholder="70"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Activity Level</Label>
              <Select
                value={profile.activity_level}
                onValueChange={(value) => setProfile({ ...profile, activity_level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="lightly_active">Lightly Active</SelectItem>
                  <SelectItem value="moderately_active">Moderately Active</SelectItem>
                  <SelectItem value="very_active">Very Active</SelectItem>
                  <SelectItem value="extremely_active">Extremely Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="grid grid-cols-2 gap-3">
                {dietaryOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`pref-${option}`}
                      checked={profile.dietary_preferences.includes(option)}
                      onCheckedChange={() =>
                        toggleArrayItem(
                          profile.dietary_preferences,
                          option,
                          (arr) => setProfile({ ...profile, dietary_preferences: arr })
                        )
                      }
                    />
                    <label htmlFor={`pref-${option}`} className="text-sm cursor-pointer">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Allergies & Restrictions</Label>
              <div className="grid grid-cols-2 gap-3">
                {commonAllergies.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={`allergy-${allergy}`}
                      checked={profile.allergies.includes(allergy)}
                      onCheckedChange={() =>
                        toggleArrayItem(
                          profile.allergies,
                          allergy,
                          (arr) => setProfile({ ...profile, allergies: arr })
                        )
                      }
                    />
                    <label htmlFor={`allergy-${allergy}`} className="text-sm cursor-pointer">
                      {allergy}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
              <div>
                <Label className="text-base">Genetic Data (Optional)</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your genetic information for more personalized recommendations. Choose one or both methods below.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">Quick SNP Checkboxes</Label>
                <p className="text-xs text-muted-foreground">
                  Select genetic variants you've tested positive for:
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {snpOptions.map((snp) => (
                    <div key={snp.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`snp-${snp.id}`}
                        checked={profile.genetic_data_snps[snp.id] || false}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            genetic_data_snps: {
                              ...profile.genetic_data_snps,
                              [snp.id]: checked as boolean,
                            },
                          })
                        }
                      />
                      <label htmlFor={`snp-${snp.id}`} className="text-sm cursor-pointer">
                        {snp.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genetic-file" className="text-sm font-semibold">Raw DNA File Upload</Label>
                <p className="text-xs text-muted-foreground">
                  Upload your raw genetic data file from 23andMe, AncestryDNA (TXT or CSV format)
                </p>
                <Input
                  id="genetic-file"
                  type="file"
                  accept=".txt,.csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setProfile({ ...profile, genetic_data_file_url: file.name });
                      toast.info(`File selected: ${file.name}. Full upload functionality coming soon.`);
                    }
                  }}
                />
                {profile.genetic_data_file_url && (
                  <p className="text-xs text-muted-foreground">
                    Current file: {profile.genetic_data_file_url}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? "Saving..." : "Save Profile"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/")} className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
