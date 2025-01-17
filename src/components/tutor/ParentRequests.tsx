import { supabase } from "@/lib/supabase";
import { ParentRequest } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const ParentRequests = () => {
  const [requests, setRequests] = useState<ParentRequest[]>([]);
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
        return;
      }

      setRequests(data || []);
    } catch (error) {
      console.error("Error in fetchRequests:", error);
      toast.error("An error occurred while loading requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId: string, accept: boolean) => {
    try {
      const { error: matchError } = await supabase.from("matches").insert([
        {
          request_id: requestId,
          status: accept ? "accepted" : "rejected",
        },
      ]);

      if (matchError) {
        toast.error("Error responding to request");
        return;
      }

      const { error: requestError } = await supabase
        .from("parent_requests")
        .update({ status: accept ? "matched" : "rejected" })
        .eq("id", requestId);

      if (requestError) {
        toast.error("Error updating request status");
        return;
      }

      toast.success(`Request ${accept ? "accepted" : "rejected"} successfully!`);
      await fetchRequests();
    } catch (error) {
      console.error("Error in handleRequestResponse:", error);
      toast.error("An error occurred while processing your response");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="border rounded p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
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
  );
};