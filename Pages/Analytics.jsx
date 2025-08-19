
import React, { useState, useEffect } from "react";
import { Application, CV, Offer } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, FileText, Target, TrendingUp, Check, Briefcase, Clock, Percent } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import ApplicationFunnel from "../components/analytics/ApplicationFunnel";
import ApplicationSourceChart from "../components/analytics/ApplicationSourceChart";
import CVSuccessRateChart from "../components/analytics/CVSuccessRateChart";
import StatusDistributionChart from "../components/analytics/StatusDistributionChart";
import ApplicationsOverTime from "../components/analytics/ApplicationsOverTime";

const StatCard = ({ title, value, icon: Icon, isLoading, color }) => (
    <Card className="premium-card border-0 hover:shadow-xl transition-all duration-500 group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mb-2" />
            ) : (
              <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
);

export default function Analytics() {
  const [data, setData] = useState({ applications: [], cvs: [], offers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCv, setSelectedCv] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [applications, cvs, offers] = await Promise.all([
      Application.list(),
      CV.list(),
      Offer.list()
    ]);
    setData({ applications, cvs, offers });
    setIsLoading(false);
  };
  
  const filteredApplications = selectedCv === 'all'
    ? data.applications
    : data.applications.filter(app => app.cv_version_used === selectedCv);
    
  const filteredOffers = selectedCv === 'all' 
    ? data.offers 
    : data.offers.filter(offer => filteredApplications.some(app => app.id === offer.application_id));


  const getSummaryStats = () => {
    const totalApps = filteredApplications.length;
    const interviews = filteredApplications.filter(app => app.interview_stages && app.interview_stages.length > 0).length;
    const offers = filteredOffers.length;
    
    const interviewRate = totalApps > 0 ? (interviews / totalApps) * 100 : 0;
    const offerRate = interviews > 0 ? (offers / interviews) * 100 : 0;
    
    return {
      totalApplications: totalApps,
      totalInterviews: interviews,
      totalOffers: offers,
      interviewRate: interviewRate.toFixed(1) + '%',
      offerRate: offerRate.toFixed(1) + '%',
    };
  };

  const stats = getSummaryStats();
  
  const statCards = [
    { title: "Total Applications", value: stats.totalApplications, icon: Briefcase, color: "bg-blue-500" },
    { title: "Total Interviews", value: stats.totalInterviews, icon: TrendingUp, color: "bg-purple-500" },
    { title: "Total Offers", value: stats.totalOffers, icon: Target, color: "bg-green-500" },
    { title: "Interview Rate", value: stats.interviewRate, icon: Percent, color: "bg-amber-500" },
  ];

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600 text-lg">Analyze your job search performance and identify trends</p>
          </div>
          <div className="w-full md:w-64">
             <Select value={selectedCv} onValueChange={setSelectedCv}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by CV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All CVs</SelectItem>
                  {data.cvs.map(cv => (
                    <SelectItem key={cv.id} value={cv.version_name}>
                      {cv.version_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} isLoading={isLoading} />
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ApplicationsOverTime applications={filteredApplications} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <ApplicationFunnel applications={filteredApplications} offers={filteredOffers} isLoading={isLoading} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CVSuccessRateChart applications={data.applications} cvs={data.cvs} isLoading={isLoading} />
          <StatusDistributionChart applications={filteredApplications} isLoading={isLoading} />
        </div>
        
        <div className="grid gap-8">
          <ApplicationSourceChart applications={filteredApplications} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
