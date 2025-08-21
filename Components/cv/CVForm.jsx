import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { X, Save, Upload, Loader2, Check, FileType } from "lucide-react";
import { uploadFile } from "@/lib/storageService";
import { isValidDocumentType, formatFileSize, getFileTypeFromName } from "@/lib/utils/fileUtils";

export default function CVForm({ cv, onSave, onCancel }) {
  const [formData, setFormData] = useState(cv || {
    version_name: "",
    file_url: "",
    target_roles: [],
    key_skills: [],
    description: "",
    is_active: true
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedFile) {
        setIsUploading(true);
        const filePath = await uploadFile('cv-files', selectedFile);
        await onSave({ ...formData, file_url: filePath });
      } else if (formData.file_url) {
        // If we're editing and no new file was selected
        await onSave(formData);
      } else {
        throw new Error("Please select a CV file");
      }
    } catch (error) {
      setUploadError(error.message);
      console.error("Form submission failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleTagChange = (field, value) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, [field]: tags }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!isValidDocumentType(file)) {
      setUploadError('Please upload a PDF, DOC, or DOCX file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`File size (${formatFileSize(file.size)}) exceeds 10MB limit`);
      return;
    }
    
    setSelectedFile(file);
    setUploadSuccess(true);
    setUploadError(null);
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
              {cv ? 'Edit CV' : 'Upload New CV'}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="version_name">Version Name *</Label>
                <Input
                  id="version_name"
                  value={formData.version_name}
                  onChange={(e) => handleChange('version_name', e.target.value)}
                  placeholder="e.g. Bioinformatics_v3"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file_upload">CV File (PDF) *</Label>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline">
                    <label htmlFor="file_upload_input" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </label>
                  </Button>
                  <Input 
                    id="file_upload_input" 
                    type="file" 
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                  {isUploading && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
                  {uploadSuccess && !uploadError && <Check className="w-5 h-5 text-green-500" />}
                  {(formData.file_url || selectedFile) && !isUploading && (
                    <div className="flex items-center gap-2">
                      <FileType className="w-4 h-4 text-blue-500" />
                      {selectedFile ? (
                        <div className="text-sm">
                          <span className="font-medium">{selectedFile.name}</span>
                          <span className="text-gray-500 ml-2">({formatFileSize(selectedFile.size)})</span>
                        </div>
                      ) : formData.file_url && (
                        <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline truncate flex items-center gap-1">
                          <span>{formData.file_url.split('/').pop()}</span>
                          <span className="text-gray-500">({getFileTypeFromName(formData.file_url)})</span>
                        </a>
                      )}
                    </div>
                  )}
                  {uploadError && (
                    <span className="text-sm text-red-600 flex items-center gap-1">
                      <X className="w-4 h-4" />
                      {uploadError}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Brief description of this CV version's focus..."
                className="h-24"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="target_roles">Target Roles (comma-separated)</Label>
                <Input
                  id="target_roles"
                  value={Array.isArray(formData.target_roles) ? formData.target_roles.join(', ') : ''}
                  onChange={(e) => handleTagChange('target_roles', e.target.value)}
                  placeholder="e.g. Bioinformatician, Data Analyst"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key_skills">Key Skills (comma-separated)</Label>
                <Input
                  id="key_skills"
                  value={Array.isArray(formData.key_skills) ? formData.key_skills.join(', ') : ''}
                  onChange={(e) => handleTagChange('key_skills', e.target.value)}
                  placeholder="e.g. Python, R, SQL"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                disabled={!formData.file_url && !selectedFile}
              >
                <Save className="w-4 h-4 mr-2" />
                {cv ? 'Update CV' : 'Save CV'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}