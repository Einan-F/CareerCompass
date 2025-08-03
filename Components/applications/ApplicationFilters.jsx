import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function ApplicationFilters({ filters, onFilterChange }) {
  const handleFilterChange = (type, value) => {
    onFilterChange(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="flex items-center gap-3">
      <Filter className="w-5 h-5 text-gray-400" />
      
      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange('status', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="applied">Applied</SelectItem>
          <SelectItem value="no_response">No Response</SelectItem>
          <SelectItem value="auto_rejection">Auto Rejection</SelectItem>
          <SelectItem value="rejected_after_screening">Rejected After Screening</SelectItem>
          <SelectItem value="rejected_after_interview">Rejected After Interview</SelectItem>
          <SelectItem value="offer_received">Offer Received</SelectItem>
          <SelectItem value="offer_accepted">Offer Accepted</SelectItem>
          <SelectItem value="offer_declined">Offer Declined</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.method}
        onValueChange={(value) => handleFilterChange('method', value)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Methods</SelectItem>
          <SelectItem value="linkedin_easy_apply">LinkedIn Easy Apply</SelectItem>
          <SelectItem value="company_website">Company Website</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="recruiter">Through Recruiter</SelectItem>
          <SelectItem value="referral">Employee Referral</SelectItem>
          <SelectItem value="job_board">Job Board</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.dateRange}
        onValueChange={(value) => handleFilterChange('dateRange', value)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="week">Last Week</SelectItem>
          <SelectItem value="month">Last Month</SelectItem>
          <SelectItem value="quarter">Last 3 Months</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}