// Offer status types
export const OfferStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  NEGOTIATING: 'negotiating'
};

// Salary types
export const SalaryType = {
  MONTHLY_GLOBAL: 'monthly_global',
  HOURLY: 'hourly'
};

// Currency options
export const Currency = {
  NIS: 'NIS',
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP'
};

// Helper functions
export const formatCurrency = (amount, currency) => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    NIS: '₪'
  };

  if (currency === 'NIS') {
    return `${amount.toLocaleString('he-IL')}₪`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateMonthlyIncome = (offer) => {
  if (offer.salary_type === SalaryType.MONTHLY_GLOBAL) {
    return offer.base_salary;
  } else {
    return (offer.hourly_rate || 0) * (offer.monthly_hours || 0);
  }
};

export const formatSalary = (offer) => {
  if (offer.salary_type === SalaryType.HOURLY) {
    const rate = (offer.hourly_rate || 0).toLocaleString('en-US');
    const symbol = currencySymbols[offer.currency] || offer.currency;
    return `${symbol}${rate}/hr`;
  }
  return formatCurrency(offer.base_salary || 0, offer.currency);
};
