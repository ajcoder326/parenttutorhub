import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError("Error fetching user profile");
          return;
        }

        if (profileData) {
          handleRedirect(profileData.role);
        }
      }
    };

    checkAndRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError("Error fetching user profile");
          return;
        }

        if (profileData) {
          toast.success("Successfully signed in!");
          handleRedirect(profileData.role);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [user, navigate]);

  const handleRedirect = (role?: string | null) => {
    console.log('Redirecting with role:', role); // Debug log
    if (role === 'tutor') {
      navigate('/tutor/dashboard', { replace: true });
    } else if (role === 'parent') {
      navigate('/parent/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // If already logged in, show loading
  if (user) {
    return <div>Loading...</div>;
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