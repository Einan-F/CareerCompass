// Application status types
export const ApplicationStatus = {
  APPLIED: 'applied',
  NO_RESPONSE: 'no_response',
  AUTO_REJECTION: 'auto_rejection',
  REJECTED_AFTER_SCREENING: 'rejected_after_screening',
  REJECTED_AFTER_INTERVIEW: 'rejected_after_interview',
  OFFER_RECEIVED: 'offer_received',
  OFFER_ACCEPTED: 'offer_accepted',
  OFFER_DECLINED: 'offer_declined'
};

// Application method types
export const ApplicationMethod = {
  LINKEDIN_EASY_APPLY: 'linkedin_easy_apply',
  COMPANY_WEBSITE: 'company_website',
  EMAIL: 'email',
  RECRUITER: 'recruiter',
  REFERRAL: 'referral',
  JOB_BOARD: 'job_board'
};

// Job source types
export const JobSource = {
  LINKEDIN: 'linkedin',
  WHATSAPP_GROUP: 'whatsapp_group',
  FRIEND_REFERRAL: 'friend_referral',
  COMPANY_DIRECT: 'company_direct',
  JOB_BOARD: 'job_board',
  RECRUITER: 'recruiter'
};

// Work type options
export const WorkType = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ON_SITE: 'on_site'
};

// Helper functions
export const formatApplicationStatus = (status) => {
  return status.replace(/_/g, ' ');
};

export const getStatusColor = (status) => {
  const colors = {
    [ApplicationStatus.APPLIED]: 'blue',
    [ApplicationStatus.NO_RESPONSE]: 'gray',
    [ApplicationStatus.AUTO_REJECTION]: 'red',
    [ApplicationStatus.REJECTED_AFTER_SCREENING]: 'red',
    [ApplicationStatus.REJECTED_AFTER_INTERVIEW]: 'red',
    [ApplicationStatus.OFFER_RECEIVED]: 'green',
    [ApplicationStatus.OFFER_ACCEPTED]: 'emerald',
    [ApplicationStatus.OFFER_DECLINED]: 'orange'
  };
  
  return colors[status] || 'gray';
};

export const isActiveApplication = (status) => {
  return ![
    ApplicationStatus.AUTO_REJECTION,
    ApplicationStatus.REJECTED_AFTER_SCREENING,
    ApplicationStatus.REJECTED_AFTER_INTERVIEW,
    ApplicationStatus.OFFER_DECLINED
  ].includes(status);
};

export const isOfferStage = (status) => {
  return [
    ApplicationStatus.OFFER_RECEIVED,
    ApplicationStatus.OFFER_ACCEPTED,
    ApplicationStatus.OFFER_DECLINED
  ].includes(status);
};
