import { useState } from "react";
import { Menu, X, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const getDashboardLink = () => {
    if (profile?.role === 'tutor') {
      return "/tutor/dashboard";
    } else if (profile?.role === 'parent') {
      return "/parent/dashboard";
    }
    return null;
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-primary text-xl font-bold cursor-pointer" onClick={() => navigate("/")}>
              TutorConnect
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">About Us</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-primary transition-colors">How It Works</a>
            <a href="#faqs" className="text-gray-700 hover:text-primary transition-colors">FAQs</a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Contact</a>
            {user ? (
              <>
                {getDashboardLink() && (
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-primary"
                    onClick={() => navigate(getDashboardLink()!)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-primary"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="text-gray-700 hover:text-primary"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <a
              href="#about"
              className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </a>
            <a
              href="#how-it-works"
              className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#faqs"
              className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              FAQs
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </a>
            {user ? (
              <>
                {getDashboardLink() && (
                  <Button
                    variant="ghost"
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-primary"
                    onClick={() => {
                      navigate(getDashboardLink()!);
                      setIsOpen(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  className="w-full text-left px-3 py-2 text-gray-700 hover:text-primary"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                className="w-full text-left px-3 py-2 text-gray-700 hover:text-primary"
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;