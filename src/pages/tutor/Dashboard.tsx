import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { TutorProfile } from "@/components/tutor/TutorProfile";
import { ParentRequests } from "@/components/tutor/ParentRequests";
import { TutorMatches } from "@/components/tutor/TutorMatches";

const TutorDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

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
  }, [user, profile, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Profile</h2>
          <TutorProfile />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Requests</h2>
          <ParentRequests />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Matches</h2>
          <TutorMatches />
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;