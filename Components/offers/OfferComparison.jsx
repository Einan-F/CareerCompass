
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
};

const getComparableSalary = (offer) => {
  if (offer.salary_type === 'hourly') {
    return (offer.hourly_rate || 0) * (offer.monthly_hours || 0);
  }
  // Assuming base_salary is annual, convert to monthly for comparison if needed
  // This function is intended to return a comparable monthly value.
  // If base_salary is already monthly, no division is needed.
  // Based on the format for 'monthly_salary' which uses it directly,
  // we'll assume base_salary is intended to be an annual or monthly value as stored.
  // For 'Comparable Monthly Salary', we'll return the base_salary directly if not hourly,
  // trusting the stored value is compatible with the "monthly" label for comparison purposes.
  return offer.base_salary || 0;
};

export default function OfferComparison({ offers }) {
  if (offers.length === 0) return null;

  const comparisonFields = [
    { key: 'monthly_salary', label: 'Comparable Monthly Salary', format: (val, offer) => new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency || 'USD', maximumFractionDigits: 0 }).format(val) },
    { key: 'bonus_structure', label: 'Bonus' },
    { key: 'vacation_days', label: 'Vacation Days', format: (val) => val ? `${val} days` : '-' },
    { key: 'work_type', label: 'Work Type' },
    { key: 'equity_details', label: 'Equity' },
    { key: 'professional_development', label: 'Prof. Dev.' },
    { key: 'start_date', label: 'Start Date', format: (val) => val && !isNaN(new Date(val)) ? format(new Date(val), 'MMM d, yyyy') : '-' },
    { key: 'offer_deadline', label: 'Deadline', format: (val) => val && !isNaN(new Date(val)) ? format(new Date(val), 'MMM d, yyyy') : '-' },
    { key: 'overall_score', label: 'Personal Score' },
  ];

  const bestValues = {};
  comparisonFields.forEach(field => {
    if (['monthly_salary', 'vacation_days', 'overall_score'].includes(field.key)) {
      const values = offers.map(o => field.key === 'monthly_salary' ? getComparableSalary(o) : o[field.key]).filter(v => v !== undefined && v !== null);
      if (values.length > 0) {
        bestValues[field.key] = Math.max(...values);
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="premium-card border-0">
        <CardHeader>
          <CardTitle>Offer Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                {offers.map(offer => (
                  <TableHead key={offer.id} className="text-center">
                    {offer.company_name}
                    <p className="font-normal text-sm text-gray-500">{offer.position_title}</p>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonFields.map(field => (
                <TableRow key={field.key}>
                  <TableCell className="font-semibold">{field.label}</TableCell>
                  {offers.map(offer => {
                    const value = field.key === 'monthly_salary' ? getComparableSalary(offer) : offer[field.key];
                    const isBest = value === bestValues[field.key] && value > 0;
                    return (
                      <TableCell key={offer.id} className={`text-center ${isBest ? 'bg-green-50' : ''}`}>
                        {value !== undefined && value !== null && value !== '' ? (
                          <span className={`font-medium ${isBest ? 'text-green-700' : ''}`}>
                            {field.format ? field.format(value, offer) : value}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
