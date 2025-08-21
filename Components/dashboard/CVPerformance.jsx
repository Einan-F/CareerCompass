import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cvService } from '@/lib/services/cvService';

export default function CVPerformance() {
  const [isLoading, setIsLoading] = useState(true);
  const [cvs, setCvs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const metrics = await cvService.getPerformanceMetrics();
        // Sort by interview rate descending
        const sortedCVs = metrics.map(cv => ({
          ...cv,
          stats: {
            applications: cv.applications_count,
            interviews: Math.round(cv.applications_count * (cv.interview_rate / 100)),
            rate: cv.interview_rate.toFixed(1)
          }
        })).sort((a, b) => b.interview_rate - a.interview_rate);
        setCvs(sortedCVs);
      } catch (error) {
        console.error('Failed to load CV metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const topCVs = cvs.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="premium-card border-0">
        <CardHeader className="border-b border-gray-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">CV Performance</CardTitle>
            <Link to={createPageUrl("CVLibrary")}>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage CVs
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))}
            </div>
          ) : topCVs.length > 0 ? (
            <div className="space-y-4">
              {topCVs.map((cv, index) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{cv.version_name}</h4>
                      <p className="text-sm text-gray-600">
                        {cv.stats.applications} applications • {cv.stats.interviews} interviews
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={`font-semibold ${
                        cv.stats.rate >= 20 ? 'border-green-500 text-green-700 bg-green-50' :
                        cv.stats.rate >= 10 ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                        'border-gray-300 text-gray-600'
                      }`}
                    >
                      {cv.stats.rate}% rate
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No CVs uploaded yet</p>
              <Link to={createPageUrl("CVLibrary")}>
                <Button variant="outline">Upload Your First CV</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}