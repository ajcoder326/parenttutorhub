import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Current session:", session);
        
        if (session?.user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          console.log("Profile data:", profileData);
          console.log("Profile error:", profileError);

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setError("Error fetching user profile");
            setIsLoading(false);
            return;
          }

          if (profileData?.role) {
            console.log('Redirecting to dashboard for role:', profileData.role);
            if (profileData.role === 'tutor') {
              window.location.href = '/tutor/dashboard';
            } else if (profileData.role === 'parent') {
              window.location.href = '/parent/dashboard';
            }
          } else {
            console.log('No role found for user');
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError("Authentication error");
        setIsLoading(false);
      }
    };

    checkAuthAndRedirect();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          console.log("Profile data after sign in:", profileData);

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            setError("Error fetching user profile");
            return;
          }

          if (profileData?.role) {
            toast.success("Successfully signed in!");
            console.log('Redirecting after sign in with role:', profileData.role);
            if (profileData.role === 'tutor') {
              window.location.href = '/tutor/dashboard';
            } else if (profileData.role === 'parent') {
              window.location.href = '/parent/dashboard';
            }
          }
        } catch (err) {
          console.error('Sign in error:', err);
          setError("Error during sign in");
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
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