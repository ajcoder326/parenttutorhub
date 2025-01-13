import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ParentRequest, Match, TutorProfile } from "@/types/auth";

const ParentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<Partial<ParentRequest>>({
    grade_level: "",
    subjects: [],
    budget_min: 5000,
    budget_max: 27000,
    location: "",
    requirements: "",
  });
  const [matches, setMatches] = useState<Array<Match & { tutor: TutorProfile }>>([]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("parent_requests").insert([
        {
          ...request,
          parent_id: user?.id,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("Request submitted successfully!");
      // Trigger matchmaking algorithm
      await findMatches();
    } catch (error) {
      toast.error("Error submitting request");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const findMatches = async () => {
    // Fetch tutors that match the criteria
    const { data: tutors, error } = await supabase
      .from("tutor_profiles")
      .select("*")
      .contains("subjects", request.subjects)
      .gte("hourly_rate", request.budget_min / 4) // Assuming 4 hours per month minimum
      .lte("hourly_rate", request.budget_max / 4)
      .eq("location", request.location);

    if (error) {
      toast.error("Error finding matches");
      return;
    }

    // Create matches for compatible tutors
    const matchPromises = tutors.map(tutor =>
      supabase.from("matches").insert([
        {
          request_id: request.id,
          tutor_id: tutor.id,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])
    );

    await Promise.all(matchPromises);
    toast.success("Found potential matches!");
  };

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-brown">Parent Dashboard</h1>

        {/* Request Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-brown mb-4">Submit Tutor Request</h2>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Grade Level</label>
              <Input
                value={request.grade_level}
                onChange={(e) =>
                  setRequest(prev => ({
                    ...prev,
                    grade_level: e.target.value
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subjects (comma-separated)</label>
              <Input
                value={request.subjects?.join(", ")}
                onChange={(e) =>
                  setRequest(prev => ({
                    ...prev,
                    subjects: e.target.value.split(",").map(s => s.trim())
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Budget Range (INR)</label>
              <div className="flex gap-4">
                <Input
                  type="number"
                  value={request.budget_min}
                  onChange={(e) =>
                    setRequest(prev => ({
                      ...prev,
                      budget_min: parseInt(e.target.value)
                    }))
                  }
                  min="5000"
                  max="27000"
                  required
                />
                <Input
                  type="number"
                  value={request.budget_max}
                  onChange={(e) =>
                    setRequest(prev => ({
                      ...prev,
                      budget_max: parseInt(e.target.value)
                    }))
                  }
                  min="5000"
                  max="27000"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <Input
                value={request.location}
                onChange={(e) =>
                  setRequest(prev => ({
                    ...prev,
                    location: e.target.value
                  }))
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Additional Requirements</label>
              <Textarea
                value={request.requirements}
                onChange={(e) =>
                  setRequest(prev => ({
                    ...prev,
                    requirements: e.target.value
                  }))
                }
              />
            </div>
            <Button type="submit" className="bg-brown hover:bg-brown/90" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </div>

        {/* Matches Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-brown mb-4">Your Matches</h2>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border rounded p-4">
                <h3 className="font-semibold">{match.tutor.full_name}</h3>
                <p><strong>Subjects:</strong> {match.tutor.subjects.join(", ")}</p>
                <p><strong>Rate:</strong> ₹{match.tutor.hourly_rate}/hour</p>
                <p><strong>Status:</strong> {match.status}</p>
                <Button
                  className="mt-2 bg-brown hover:bg-brown/90"
                  onClick={() => {/* Implement chat functionality */}}
                >
                  Chat with Tutor
                </Button>
              </div>
            ))}
            {matches.length === 0 && (
              <p className="text-gray-500">No matches found yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;