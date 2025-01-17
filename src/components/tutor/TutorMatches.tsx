import { supabase } from "@/lib/supabase";
import { Match } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const TutorMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("*");

      if (error) {
        console.error("Error fetching matches:", error);
        toast.error("Failed to load matches");
        return;
      }

      setMatches(data || []);
    } catch (error) {
      console.error("Error in fetchMatches:", error);
      toast.error("An error occurred while loading matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
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
  );
};