export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function calculateDaysAgo(date: string | Date): string {
  const days = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    applied: 'bg-blue-500',
    no_response: 'bg-gray-500',
    auto_rejection: 'bg-red-500',
    rejected_after_screening: 'bg-red-500',
    rejected_after_interview: 'bg-red-500',
    offer_received: 'bg-green-500',
    offer_accepted: 'bg-green-500',
    offer_declined: 'bg-yellow-500'
  };
  
  return statusColors[status] || 'bg-gray-500';
}

export function formatWorkType(workType: string): string {
  return workType.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export function calculateSuccessRate(applications: any[]): number {
  if (!applications.length) return 0;
  
  const successfulApplications = applications.filter(app => 
    ['offer_received', 'offer_accepted'].includes(app.status)
  );
  
  return (successfulApplications.length / applications.length) * 100;
}

export const INTERVIEW_STAGES = [
  'Applied',
  'Phone Screen',
  'Technical Interview',
  'Take Home Assignment',
  'On-site Interview',
  'Final Interview',
  'Offer Stage'
];

export function createPageUrl(type: string, id: string): string {
  const urlMap: Record<string, string> = {
    application: `/applications/${id}`,
    cv: `/cv-library/${id}`,
    offer: `/offers/${id}`
  };

  return urlMap[type] || '/';
}
