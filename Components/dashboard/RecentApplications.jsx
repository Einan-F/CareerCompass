import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Building2, Calendar, ExternalLink, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

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

export default function RecentApplications({ applications, isLoading, onRefresh }) {
  const recentApplications = applications.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="premium-card border-0">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Recent Applications</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={onRefresh} className="h-8 w-8">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Link to={createPageUrl("Applications")}>
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-xl" />
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))
            ) : recentApplications.length > 0 ? (
              recentApplications.map((application, index) => (
                <motion.div
                  key={application.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-gray-50/50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {application.company_name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{application.company_name}</h3>
                        <p className="text-sm text-gray-600 mb-1">{application.position_title}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(application.application_date), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${statusColors[application.status]} border font-medium`}>
                      {application.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No applications yet. Start tracking your job search!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}