import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Building2, Calendar, MapPin, Edit, Eye, ExternalLink } from "lucide-react";
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

const methodIcons = {
  linkedin_easy_apply: "🔗",
  company_website: "🌐",
  email: "📧",
  recruiter: "👤",
  referral: "🤝",
  job_board: "📋"
};

export default function ApplicationCard({ application, index, onClick, onEdit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="premium-card border-0 hover:shadow-xl transition-all duration-300 group cursor-pointer">
        <CardContent className="p-6" onClick={onClick}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                {application.company_name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{application.company_name}</h3>
                <p className="text-gray-700 font-semibold mb-2">{application.position_title}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(application.application_date), 'MMM d, yyyy')}
                  </div>
                  {application.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {application.location}
                    </div>
                  )}
                  {application.application_method && (
                    <div className="flex items-center gap-1">
                      <span>{methodIcons[application.application_method]}</span>
                      {application.application_method.replace(/_/g, ' ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Badge className={`${statusColors[application.status]} border font-medium`}>
                {application.status.replace(/_/g, ' ')}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {application.salary_range && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {application.salary_range}
                </span>
              )}
              {application.work_type && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {application.work_type}
                </span>
              )}
              {application.interview_stages && application.interview_stages.length > 0 && (
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {application.interview_stages.length} interview{application.interview_stages.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                variant="outline" 
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(application);
                }}
                className="h-8 w-8"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onClick}
                className="h-8 w-8"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}