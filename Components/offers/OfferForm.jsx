
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";

export default function OfferForm({ offer, applications, onSave, onCancel }) {
  const [formData, setFormData] = useState(offer || {
    application_id: "",
    company_name: "",
    position_title: "",
    salary_type: "monthly_global", // New field
    base_salary: "",
    hourly_rate: "", // New field
    monthly_hours: "", // New field
    currency: "NIS",
    bonus_structure: "",
    vacation_days: "",
    start_date: "",
    offer_deadline: "",
    status: "pending",
    notes: ""
  });
  const [errors, setErrors] = useState({}); // New state for validation errors

  const handleApplicationSelect = (appId) => {
    const selectedApp = applications.find(app => app.id === appId);
    if (selectedApp) {
      setFormData(prev => ({
        ...prev,
        application_id: appId,
        company_name: selectedApp.company_name,
        position_title: selectedApp.position_title
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.salary_type === 'monthly_global' && (!formData.base_salary || parseFloat(formData.base_salary) <= 0)) {
        newErrors.base_salary = "Base salary must be a positive number.";
    }
    if (formData.salary_type === 'hourly' && (!formData.hourly_rate || parseFloat(formData.hourly_rate) <= 0)) {
        newErrors.hourly_rate = "Hourly rate must be a positive number.";
    }
    if (formData.salary_type === 'hourly' && (!formData.monthly_hours || parseFloat(formData.monthly_hours) <= 0)) {
        newErrors.monthly_hours = "Monthly hours must be a positive number.";
    }
    if (formData.vacation_days && parseFloat(formData.vacation_days) < 0) {
        newErrors.vacation_days = "Vacation days cannot be negative.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for the field being changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-8"
    >
      <Card className="premium-card border-0">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              {offer ? 'Edit Offer' : 'Add New Offer'}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="application_id">Linked Application</Label>
              <Select onValueChange={handleApplicationSelect} value={formData.application_id}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the application for this offer" />
                </SelectTrigger>
                <SelectContent>
                  {applications.map(app => (
                    <SelectItem key={app.id} value={app.id}>
                      {app.company_name} - {app.position_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* New: Salary Type Selector */}
            <div className="space-y-2">
                <Label htmlFor="salary_type">Salary Type</Label>
                <Select value={formData.salary_type} onValueChange={(value) => handleChange('salary_type', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly_global">Monthly (Global)</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
            </div>

            {/* Conditional Salary Input Fields based on salary_type */}
            {formData.salary_type === 'monthly_global' ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="base_salary">Base Monthly Salary *</Label>
                  <Input
                    id="base_salary"
                    type="number"
                    min="0"
                    value={formData.base_salary}
                    onChange={(e) => handleChange('base_salary', e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 25000"
                    required
                  />
                  {errors.base_salary && <p className="text-sm text-red-500">{errors.base_salary}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NIS">NIS (₪)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
               <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hourly_rate">Hourly Rate *</Label>
                  <Input
                    id="hourly_rate"
                    type="number"
                    min="0"
                    value={formData.hourly_rate}
                    onChange={(e) => handleChange('hourly_rate', e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 150"
                    required
                  />
                  {errors.hourly_rate && <p className="text-sm text-red-500">{errors.hourly_rate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly_hours">Monthly Hours *</Label>
                  <Input
                    id="monthly_hours"
                    type="number"
                    min="0"
                    value={formData.monthly_hours}
                    onChange={(e) => handleChange('monthly_hours', e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 182"
                    required
                  />
                  {errors.monthly_hours && <p className="text-sm text-red-500">{errors.monthly_hours}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                   <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NIS">NIS (₪)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {/* New: Bonus Structure and Vacation Days in a grid */}
            <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="bonus_structure">Bonus Structure</Label>
                    <Input
                      id="bonus_structure"
                      value={formData.bonus_structure}
                      onChange={(e) => handleChange('bonus_structure', e.target.value)}
                      placeholder="e.g. 15% annual bonus + stock options"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vacation_days">Annual Vacation Days</Label>
                    <Input
                      id="vacation_days"
                      type="number"
                      min="0"
                      value={formData.vacation_days}
                      onChange={(e) => handleChange('vacation_days', e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 25"
                    />
                    {errors.vacation_days && <p className="text-sm text-red-500">{errors.vacation_days}</p>}
                  </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer_deadline">Offer Deadline</Label>
                <Input
                  id="offer_deadline"
                  type="date"
                  value={formData.offer_deadline}
                  onChange={(e) => handleChange('offer_deadline', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Details about benefits, culture, pros and cons..."
                className="h-24"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {offer ? 'Update Offer' : 'Save Offer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
