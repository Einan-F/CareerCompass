//export type { CV, Application, Offer, InterviewStage };

export interface CV {
  id: string;
  user_id: string;
  version_name: string;
  file_url: string;
  target_roles: string[];
  key_skills: string[];
  description?: string;
  applications_count: number;
  interview_rate: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  job_description?: string;
  application_date: string;
  application_method: 'linkedin_easy_apply' | 'company_website' | 'email' | 'recruiter' | 'referral' | 'job_board';
  job_source: 'linkedin' | 'whatsapp_group' | 'friend_referral' | 'company_direct' | 'job_board' | 'recruiter';
  status: 'applied' | 'no_response' | 'auto_rejection' | 'rejected_after_screening' | 'rejected_after_interview' | 'offer_received' | 'offer_accepted' | 'offer_declined';
  cv_version_used?: string;
  cover_letter_file_url?: string;
  cover_letter?: string;
  additional_documents?: string[];
  interview_stages?: InterviewStage[];
  salary_range?: string;
  location?: string;
  work_type?: 'remote' | 'hybrid' | 'on_site';
  notes?: string;
  rejection_reason?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  application_id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  salary_type: 'monthly_global' | 'hourly';
  base_salary?: number;
  hourly_rate?: number;
  monthly_hours?: number;
  currency: string;
  bonus_structure?: string;
  benefits?: any;
  vacation_days?: number;
  work_type: 'remote' | 'hybrid' | 'on_site';
  start_date?: string;
  offer_deadline?: string;
  equity_details?: string;
  professional_development?: string;
  status: 'pending' | 'accepted' | 'declined' | 'negotiating';
  notes?: string;
  overall_score?: number;
  created_at: string;
  updated_at: string;
}

export interface InterviewStage {
  stage_name: string;
  date: string;
  format: 'phone' | 'video' | 'in_person' | 'take_home';
  duration?: string;
  interviewers?: string[];
  notes?: string;
  outcome?: 'passed' | 'failed' | 'pending';
}
