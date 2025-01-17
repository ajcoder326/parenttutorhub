import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { TutorProfile as TutorProfileType } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const TutorProfile = () => {
  const { user } = useAuth();
  const [tutorProfile, setTutorProfile] = useState<TutorProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        console.log("Fetching tutor profile for:", user?.id);
        const { data: profileData, error: profileError } = await supabase
          .from("tutor_profiles")
          .select("*")
          .eq("id", user?.id)
          .single();

        if (profileError) {
          console.error("Error fetching tutor profile:", profileError);
          toast.error("Failed to load tutor profile");
          return;
        }

        setTutorProfile(profileData);
      } catch (error) {
        console.error("Error in fetchTutorProfile:", error);
        toast.error("An error occurred while loading the profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTutorProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tutorProfile ? (
        <>
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
        </>
      ) : (
        <p className="text-gray-500">Please complete your tutor profile to start receiving requests.</p>
      )}
    </div>
  );
};