import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleJoinClick = (role: 'parent' | 'tutor') => {
    if (user) {
      navigate(role === 'parent' ? '/parent/dashboard' : '/tutor/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-primary sm:text-5xl md:text-6xl">
            <span className="block">Find Your Perfect</span>
            <span className="block text-accent-dark">Home Tutor</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with qualified tutors who can help your child excel in their studies. Personalized learning, verified tutors, and guaranteed results.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Button
              className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              onClick={() => handleJoinClick('parent')}
            >
              {user ? 'Parent Dashboard' : 'Join as Parent'}
            </Button>
            <Button
              className="bg-accent hover:bg-accent-dark text-primary px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              onClick={() => handleJoinClick('tutor')}
            >
              {user ? 'Tutor Dashboard' : 'Join as Tutor'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;