import { BookOpen, Users, Award, Clock } from "lucide-react";

const features = [
  {
    name: "Expert Tutors",
    description: "All our tutors are thoroughly vetted and have proven teaching experience.",
    icon: BookOpen,
  },
  {
    name: "Personalized Learning",
    description: "Customized teaching approaches to match your child's learning style.",
    icon: Users,
  },
  {
    name: "Quality Assurance",
    description: "Regular progress tracking and performance guarantees.",
    icon: Award,
  },
  {
    name: "Flexible Scheduling",
    description: "Choose timings that work best for your family.",
    icon: Clock,
  },
];

const About = () => {
  return (
    <div id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
            Why Choose TutorConnect?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            We're committed to providing the highest quality home tutoring services across India.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-secondary rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-primary tracking-tight">
                      {feature.name}
                    </h3>
                    <p className="mt-5 text-base text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;