import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

export default function OfferComparison({ offers }) {
  if (offers.length === 0) return null;

  const comparisonFields = [
    { key: 'base_salary', label: 'Base Salary', format: (val, offer) => new Intl.NumberFormat('en-US', { style: 'currency', currency: offer.currency || 'USD' }).format(val) },
    { key: 'bonus_structure', label: 'Bonus' },
    { key: 'vacation_days', label: 'Vacation Days' },
    { key: 'work_type', label: 'Work Type' },
    { key: 'equity_details', label: 'Equity' },
    { key: 'professional_development', label: 'Prof. Dev.' },
    { key: 'start_date', label: 'Start Date', format: (val) => format(new Date(val), 'MMM d, yyyy') },
    { key: 'offer_deadline', label: 'Deadline', format: (val) => format(new Date(val), 'MMM d, yyyy') },
    { key: 'overall_score', label: 'Personal Score' },
  ];

  const bestValues = {};
  comparisonFields.forEach(field => {
    if (field.key === 'base_salary' || field.key === 'vacation_days' || field.key === 'overall_score') {
      const values = offers.map(o => o[field.key]).filter(v => v !== undefined);
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
                    const value = offer[field.key];
                    const isBest = value === bestValues[field.key];
                    return (
                      <TableCell key={offer.id} className={`text-center ${isBest ? 'bg-green-50' : ''}`}>
                        {value !== undefined && value !== null ? (
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