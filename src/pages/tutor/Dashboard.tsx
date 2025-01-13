import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { TutorProfile, ParentRequest, Match } from "@/types/auth";

const TutorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTutorProfile();
      fetchRequests();
      fetchMatches();
    }
  }, [user]);

  const fetchTutorProfile = async () => {
    const { data, error } = await supabase
      .from("tutor_profiles")
      .select("*")
      .eq("id", user?.id)
      .single();

    if (error) {
      toast.error("Error fetching profile");
      return;
    }

    setProfile(data);
  };

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("parent_requests")
      .select("*")
      .eq("status", "pending");

    if (error) {
      toast.error("Error fetching requests");
      return;
    }

    setRequests(data);
    setLoading(false);
  };

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .eq("tutor_id", user?.id);

    if (error) {
      toast.error("Error fetching matches");
      return;
    }

    setMatches(data);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase
      .from("tutor_profiles")
      .update(profile)
      .eq("id", user?.id);

    if (error) {
      toast.error("Error updating profile");
      return;
    }

    toast.success("Profile updated successfully!");
  };

  const handleRequestResponse = async (requestId: string, accept: boolean) => {
    const { error } = await supabase.from("matches").insert([
      {
        request_id: requestId,
        tutor_id: user?.id,
        status: accept ? "accepted" : "rejected",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast.error("Error responding to request");
      return;
    }

    await supabase
      .from("parent_requests")
      .update({ status: accept ? "matched" : "rejected" })
      .eq("id", requestId);

    toast.success(`Request ${accept ? "accepted" : "rejected"} successfully!`);
    fetchRequests();
    fetchMatches();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-beige p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-brown">Tutor Dashboard</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-brown mb-4">My Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Qualifications</label>
              <Input
                value={profile?.qualifications.join(", ")}
                onChange={(e) =>
                  setProfile(prev => ({
                    ...prev!,
                    qualifications: e.target.value.split(",").map(q => q.trim())
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Subjects</label>
              <Input
                value={profile?.subjects.join(", ")}
                onChange={(e) =>
                  setProfile(prev => ({
                    ...prev!,
                    subjects: e.target.value.split(",").map(s => s.trim())
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hourly Rate (INR)</label>
              <Input
                type="number"
                value={profile?.hourly_rate}
                onChange={(e) =>
                  setProfile(prev => ({
                    ...prev!,
                    hourly_rate: parseInt(e.target.value)
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <Textarea
                value={profile?.bio}
                onChange={(e) =>
                  setProfile(prev => ({
                    ...prev!,
                    bio: e.target.value
                  }))
                }
              />
            </div>
            <Button type="submit" className="bg-brown hover:bg-brown/90">
              Update Profile
            </Button>
          </form>
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-brown mb-4">New Requests</h2>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border rounded p-4">
                <p><strong>Grade Level:</strong> {request.grade_level}</p>
                <p><strong>Subjects:</strong> {request.subjects.join(", ")}</p>
                <p><strong>Budget Range:</strong> ₹{request.budget_min} - ₹{request.budget_max}</p>
                <p><strong>Location:</strong> {request.location}</p>
                <p><strong>Requirements:</strong> {request.requirements}</p>
                <div className="mt-4 space-x-4">
                  <Button
                    onClick={() => handleRequestResponse(request.id, true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleRequestResponse(request.id, false)}
                    variant="destructive"
                  >
                    Decline
                  </Button>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-gray-500">No new requests at the moment.</p>
            )}
          </div>
        </div>

        {/* Matches Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-brown mb-4">My Matches</h2>
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match.id} className="border rounded p-4">
                <p><strong>Status:</strong> {match.status}</p>
                <p><strong>Matched on:</strong> {new Date(match.created_at).toLocaleDateString()}</p>
              </div>
            ))}
            {matches.length === 0 && (
              <p className="text-gray-500">No matches yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;