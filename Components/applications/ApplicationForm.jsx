
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { X, Save, Upload, Loader2, Check } from "lucide-react";
import { uploadFile } from '../../lib/storageService';
import { useAuth } from '../../lib/context/AuthContext';

export default function ApplicationForm({ application, cvs, onSave, onCancel }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState(application || {
    company_name: "",
    position_title: "",
    job_description: "",
    application_date: new Date().toISOString().split('T')[0],
    application_method: "",
    job_source: "",
    status: "applied",
    cv_version_used: null,
    cover_letter_file_url: "",
    cover_letter: "",
    salary_range: "",
    location: "",
    work_type: "",
    notes: "",
    user_id: user?.id
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name) newErrors.company_name = "Company name is required.";
    if (!formData.position_title) newErrors.position_title = "Position title is required.";
    if (!formData.application_date) {
      newErrors.application_date = "Application date is required.";
    } else if (new Date(formData.application_date) > new Date()) {
      newErrors.application_date = "Application date cannot be in the future.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for the field once it's changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCoverLetterUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const filePath = await uploadFile('cover-letters', file);
      handleChange('cover_letter_file_url', filePath);
      setUploadSuccess(true);
      e.target.value = '';
    } catch (error) {
      console.error("Cover letter upload failed:", error);
      setErrors(prev => ({ ...prev, upload: 'Failed to upload cover letter. Please try again.' }));
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="premium-card border-0">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              {application ? 'Edit Application' : 'New Job Application'}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  placeholder="e.g. Google, Microsoft"
                  required
                />
                {errors.company_name && <p className="text-sm text-red-500">{errors.company_name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position_title">Position Title *</Label>
                <Input
                  id="position_title"
                  value={formData.position_title}
                  onChange={(e) => handleChange('position_title', e.target.value)}
                  placeholder="e.g. Senior Data Scientist"
                  required
                />
                {errors.position_title && <p className="text-sm text-red-500">{errors.position_title}</p>}
              </div>
            </div>

            {/* Application Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="application_date">Application Date *</Label>
                <Input
                  id="application_date"
                  type="date"
                  value={formData.application_date}
                  onChange={(e) => handleChange('application_date', e.target.value)}
                  required
                />
                {errors.application_date && <p className="text-sm text-red-500">{errors.application_date}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="application_method">Application Method</Label>
                <Select
                  value={formData.application_method}
                  onValueChange={(value) => handleChange('application_method', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How did you apply?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin_easy_apply">LinkedIn Easy Apply</SelectItem>
                    <SelectItem value="company_website">Company Website</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="recruiter">Through Recruiter</SelectItem>
                    <SelectItem value="referral">Employee Referral</SelectItem>
                    <SelectItem value="job_board">Job Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_source">Job Source</Label>
                <Select
                  value={formData.job_source}
                  onValueChange={(value) => handleChange('job_source', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Where did you find it?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="whatsapp_group">WhatsApp Group</SelectItem>
                    <SelectItem value="friend_referral">Friend Referral</SelectItem>
                    <SelectItem value="company_direct">Company Direct</SelectItem>
                    <SelectItem value="job_board">Job Board</SelectItem>
                    <SelectItem value="recruiter">Recruiter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* CV and Status */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cv_version_used">CV Version Used</Label>
                <Select
                  value={formData.cv_version_used || ""}
                  onValueChange={(value) => {
                    if (!value) {
                      setFormData(prev => ({ ...prev, cv_version_used: null }));
                      return;
                    }
                    setFormData(prev => ({ ...prev, cv_version_used: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CV version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No CV</SelectItem>
                    {cvs.map(cv => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.version_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Current Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>
            </div>

            {/* Job Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  value={formData.salary_range}
                  onChange={(e) => handleChange('salary_range', e.target.value)}
                  placeholder="e.g. $80k - $120k"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="work_type">Work Type</Label>
                <Select
                  value={formData.work_type}
                  onValueChange={(value) => handleChange('work_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Work arrangement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="on_site">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="cover_letter_upload">Attach Cover Letter (PDF/DOCX)</Label>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                    <label htmlFor="cover_letter_input" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </label>
                  </Button>
                  <Input
                    id="cover_letter_input"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleCoverLetterUpload}
                    className="hidden"
                  />
                  {isUploading && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                  {uploadSuccess && !isUploading && <Check className="w-5 h-5 text-green-500" />}
                  {formData.cover_letter_file_url && !isUploading && (
                    <a href={formData.cover_letter_file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate">
                      {/* Displaying only the filename for brevity, assuming URL provides a recognizable name or a simple generic "Uploaded File" */}
                      {formData.cover_letter_file_url.split('/').pop() || "Uploaded File"}
                    </a>
                  )}
                </div>
            </div>

            {/* Long Text Fields */}
            <div className="space-y-2">
              <Label htmlFor="job_description">Job Description</Label>
              <Textarea
                id="job_description"
                value={formData.job_description}
                onChange={(e) => handleChange('job_description', e.target.value)}
                placeholder="Paste or summarize the job description..."
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover_letter">Cover Letter Notes</Label>
              <Textarea
                id="cover_letter"
                value={formData.cover_letter}
                onChange={(e) => handleChange('cover_letter', e.target.value)}
                placeholder="Your cover letter content or notes about it..."
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Any additional notes about this application..."
                className="h-20"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {application ? 'Update Application' : 'Save Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
