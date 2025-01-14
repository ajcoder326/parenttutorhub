import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Fetch the user's profile to get their role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session?.user?.id)
          .single();

        toast({
          title: "Success",
          description: "Successfully signed in!",
        });

        // Redirect based on role
        if (profile?.role === 'tutor') {
          navigate("/tutor/dashboard");
        } else if (profile?.role === 'parent') {
          navigate("/parent/dashboard");
        } else {
          navigate("/");
        }
      } else if (event === 'SIGNED_OUT') {
        setError("");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (user) {
    if (profile?.role === 'tutor') {
      navigate("/tutor/dashboard");
    } else if (profile?.role === 'parent') {
      navigate("/parent/dashboard");
    } else {
      navigate("/");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          theme="light"
          providers={[]}
        />
      </div>
    </div>
  );
};

export default Login;