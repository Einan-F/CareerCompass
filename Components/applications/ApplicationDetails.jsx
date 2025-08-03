import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Calendar, MapPin, FileText, Building2, DollarSign, Clock, Users, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const statusColors = {
  applied: "bg-blue-100 text-blue-800 border-blue-200",
  no_response: "bg-gray-100 text-gray-800 border-gray-200",
  auto_rejection: "bg-red-100 text-red-800 border-red-200",
  rejected_after_screening: "bg-red-100 text-red-800 border-red-200",
  rejected_after_interview: "bg-red-100 text-red-800 border-red-200",
  offer_received: "bg-green-100 text-green-800 border-green-200",
  offer_accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  offer_declined: "bg-orange-100 text-orange-800 border-orange-200"
};

const workTypeIcons = {
  remote: "🏠",
  hybrid: "🏢",
  on_site: "🏗️"
};

export default function ApplicationDetails({ application, onBack, onEdit }) {
  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header with Company Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="premium-card border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full transform translate-x-32 -translate-y-32" />
            <CardContent className="p-8 relative">
              <div className="flex items-start justify-between mb-6">
                <Button variant="outline" size="icon" onClick={onBack} className="mb-4">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Badge className={`${statusColors[application.status]} border font-medium text-lg px-4 py-2`}>
                  {application.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {application.company_name[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{application.position_title}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-gray-500" />
                    <p className="text-2xl text-gray-700 font-semibold">{application.company_name}</p>
                  </div>
                  
                  {/* Key Info Pills */}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      Applied {format(new Date(application.application_date), 'MMM d, yyyy')}
                    </div>
                    
                    {application.location && (
                      <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        {application.location}
                      </div>
                    )}
                    
                    {application.work_type && (
                      <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        <span>{workTypeIcons[application.work_type]}</span>
                        {application.work_type.replace('_', ' ')}
                      </div>
                    )}
                    
                    {application.salary_range && (
                      <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                        <DollarSign className="w-4 h-4" />
                        {application.salary_range}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  onClick={() => onEdit(application)} 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            {application.job_description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="premium-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{application.job_description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Cover Letter */}
            {application.cover_letter && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="premium-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      Cover Letter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{application.cover_letter}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Interview Timeline */}
            {application.interview_stages && application.interview_stages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="premium-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-500" />
                      Interview Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {application.interview_stages.map((stage, index) => (
                        <div key={index} className="relative">
                          {/* Timeline line */}
                          {index < application.interview_stages.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-12 bg-gray-200" />
                          )}
                          
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                              stage.result === 'passed' ? 'bg-green-500' :
                              stage.result === 'rejected' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}>
                              {index + 1}
                            </div>
                            
                            <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-gray-900 text-lg">{stage.stage_name}</h4>
                                <Badge variant="outline" className={
                                  stage.result === 'passed' ? 'border-green-500 text-green-700 bg-green-50' :
                                  stage.result === 'rejected' ? 'border-red-500 text-red-700 bg-red-50' :
                                  'border-yellow-500 text-yellow-700 bg-yellow-50'
                                }>
                                  {stage.result}
                                </Badge>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-3">
                                {stage.date && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(stage.date), 'PPP')}
                                  </div>
                                )}
                                {stage.interviewer && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4" />
                                    {stage.interviewer}
                                  </div>
                                )}
                              </div>
                              
                              {stage.feedback && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                  <p className="text-sm text-gray-700 italic">"{stage.feedback}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Additional Notes */}
            {application.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="premium-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-500" />
                      Additional Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{application.notes}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Application Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="premium-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Application Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Method</label>
                      <p className="font-semibold text-gray-900 mt-1">
                        {application.application_method ? application.application_method.replace(/_/g, ' ') : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Source</label>
                      <p className="font-semibold text-gray-900 mt-1">
                        {application.job_source ? application.job_source.replace(/_/g, ' ') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {application.cv_version_used && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">CV Version</label>
                      <div className="flex items-center gap-2 mt-1">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <p className="font-semibold text-gray-900">{application.cv_version_used}</p>
                      </div>
                    </div>
                  )}

                  {application.follow_up_date && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Follow-up Date</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <p className="font-semibold text-gray-900">
                          {format(new Date(application.follow_up_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Progress Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="premium-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { stage: 'Applied', completed: true },
                      { stage: 'Screening', completed: application.status !== 'applied' && application.status !== 'no_response' },
                      { stage: 'Interview', completed: application.interview_stages && application.interview_stages.length > 0 },
                      { stage: 'Offer', completed: application.status === 'offer_received' || application.status === 'offer_accepted' }
                    ].map((item, index) => (
                      <div key={item.stage} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          item.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.completed ? '✓' : index + 1}
                        </div>
                        <span className={`font-medium ${item.completed ? 'text-green-700' : 'text-gray-500'}`}>
                          {item.stage}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="premium-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50"
                    onClick={() => onEdit(application)}
                  >
                    <Edit className="w-4 h-4 mr-3" />
                    Edit Application
                  </Button>
                  
                  {application.cv_version_used && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50"
                      asChild
                    >
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        <FileText className="w-4 h-4 mr-3" />
                        View CV Used
                      </a>
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-purple-50"
                    onClick={onBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-3" />
                    Back to Applications
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}