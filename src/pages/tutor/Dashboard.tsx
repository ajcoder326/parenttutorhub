import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface TutorProfile {
  id: string;
  qualifications: string[];
  subjects: string[];
  hourly_rate: number;
  bio: string;
}

interface ParentRequest {
  id: string;
  grade_level: string;
  subjects: string[];
  budget_min: number;
  budget_max: number;
  location: string;
  requirements: string;
}

interface Match {
  id: string;
  request_id: string;
  status: string;
  created_at: string;
}

const TutorDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [requests, setRequests] = useState<ParentRequest[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("parent_requests")
        .select("*")
        .eq("status", "pending");

      if (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to load requests");
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error("Error in fetchRequests:", error);
      toast.error("An error occurred while loading requests");
    }
  };

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .eq("tutor_id", user?.id);

      if (error) {
        console.error("Error fetching matches:", error);
        toast.error("Failed to load matches");
      } else {
        setMatches(data || []);
      }
    } catch (error) {
      console.error("Error in fetchMatches:", error);
      toast.error("An error occurred while loading matches");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (profile?.role !== "tutor") {
      toast.error("Unauthorized access. This dashboard is for tutors only.");
      navigate("/");
      return;
    }

    const fetchTutorData = async () => {
      try {
        console.log("Fetching tutor profile for:", user.id);
        const { data: profileData, error: profileError } = await supabase
          .from("tutor_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching tutor profile:", profileError);
          toast.error("Failed to load tutor profile");
        } else {
          setTutorProfile(profileData);
        }

        // Fetch requests and matches
        await Promise.all([fetchRequests(), fetchMatches()]);
      } catch (error) {
        console.error("Error in fetchTutorData:", error);
        toast.error("An error occurred while loading the dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorData();
  }, [user, profile, navigate]);

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
    await Promise.all([fetchRequests(), fetchMatches()]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-8 w-48" />
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="border rounded p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Profile</h2>
          {tutorProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                <p className="mt-1 text-gray-900">{tutorProfile.qualifications?.join(", ") || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subjects</label>
                <p className="mt-1 text-gray-900">{tutorProfile.subjects?.join(", ") || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                <p className="mt-1 text-gray-900">₹{tutorProfile.hourly_rate || "Not specified"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <p className="mt-1 text-gray-900">{tutorProfile.bio || "No bio available"}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Please complete your tutor profile to start receiving requests.</p>
          )}
        </div>

        {/* Requests Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Requests</h2>
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.id} className="border rounded p-4">
                  <p><strong>Grade Level:</strong> {request.grade_level}</p>
                  <p><strong>Subjects:</strong> {request.subjects.join(", ")}</p>
                  <p><strong>Budget Range:</strong> ₹{request.budget_min} - ₹{request.budget_max}</p>
                  <p><strong>Location:</strong> {request.location}</p>
                  <p><strong>Requirements:</strong> {request.requirements}</p>
                  <div className="flex gap-4 mt-2">
                    <Button onClick={() => handleRequestResponse(request.id, true)}>Accept</Button>
                    <Button onClick={() => handleRequestResponse(request.id, false)}>Reject</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No new requests at the moment.</p>
            )}
          </div>
        </div>

        {/* Matches Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Matches</h2>
          <div className="space-y-4">
            {matches.length > 0 ? (
              matches.map((match) => (
                <div key={match.id} className="border rounded p-4">
                  <p><strong>Status:</strong> {match.status}</p>
                  <p><strong>Matched on:</strong> {new Date(match.created_at).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No matches yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
