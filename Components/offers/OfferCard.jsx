import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Edit, Trash2, Calendar, DollarSign, Briefcase } from "lucide-react";
import { format } from "date-fns";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-green-100 text-green-800 border-green-200",
  declined: "bg-red-100 text-red-800 border-red-200",
  negotiating: "bg-blue-100 text-blue-800 border-blue-200",
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NIS: '₪'
};

export default function OfferCard({ offer, index, onEdit, onDelete, isComparing, isSelected, onToggleCompare }) {
  const formatCurrency = (amount, currency) => {
    const symbol = currencySymbols[currency] || currency;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`premium-card border-0 h-full flex flex-col justify-between group ${isSelected ? 'border-blue-500 ring-2 ring-blue-500' : ''}`}>
        <div>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-1">{offer.company_name}</CardTitle>
              <p className="font-semibold text-gray-600">{offer.position_title}</p>
            </div>
            <Badge className={`${statusColors[offer.status]} border font-medium`}>{offer.status}</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Base Salary</p>
                  <p className="font-bold text-lg">{formatCurrency(offer.base_salary, offer.currency)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Vacation</p>
                  <p className="font-bold text-lg">{offer.vacation_days} days</p>
                </div>
              </div>
            </div>
            {offer.bonus_structure && (
              <p className="text-sm text-gray-600 mb-2"><strong>Bonus:</strong> {offer.bonus_structure}</p>
            )}
            {offer.offer_deadline && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {format(new Date(offer.offer_deadline), 'MMM d, yyyy')}</span>
              </div>
            )}
          </CardContent>
        </div>
        <div className="p-6 pt-0 flex justify-between items-center">
          {isComparing ? (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`compare-${offer.id}`}
                checked={isSelected}
                onCheckedChange={() => onToggleCompare(offer.id)}
              />
              <label htmlFor={`compare-${offer.id}`} className="text-sm font-medium leading-none">
                Compare
              </label>
            </div>
          ) : <div />}
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(offer)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(offer.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}