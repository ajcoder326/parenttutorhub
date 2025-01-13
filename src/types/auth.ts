export type UserRole = 'tutor' | 'parent';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

export interface TutorProfile extends Profile {
  qualifications: string[];
  subjects: string[];
  hourly_rate: number;
  availability: Record<string, any>;
  rating: number;
  bio: string;
}

export interface ParentRequest {
  id: string;
  parent_id: string;
  grade_level: string;
  subjects: string[];
  budget_min: number;
  budget_max: number;
  location: string;
  requirements: string;
  status: string;
  created_at: string;
}

export interface Match {
  id: string;
  request_id: string;
  tutor_id: string;
  status: string;
  created_at: string;
}