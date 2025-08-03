import React, { useState, useEffect } from "react";
import { Application, CV, Offer } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, FileText, Target, TrendingUp } from "lucide-react";

import ApplicationFunnel from "../components/analytics/ApplicationFunnel";
import ApplicationSourceChart from "../components/analytics/ApplicationSourceChart";
import CVSuccessRateChart from "../components/analytics/CVSuccessRateChart";
import StatusDistributionChart from "../components/analytics/StatusDistributionChart";
import ApplicationsOverTime from "../components/analytics/ApplicationsOverTime";

export default function Analytics() {
  const [data, setData] = useState({ applications: [], cvs: [], offers: [] });
  const [isLoading, setIsLoading] = useState(true);

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

  const getSummaryStats = () => {
    const totalApps = data.applications.length;
    const interviews = data.applications.filter(app => app.interview_stages && app.interview_stages.length > 0).length;
    const offers = data.offers.length;
    
    return {
      totalApplications: totalApps,
      totalInterviews: interviews,
      totalOffers: offers,
      overallSuccessRate: totalApps > 0 ? ((offers / totalApps) * 100).toFixed(1) + '%' : '0%',
    };
  };

  const stats = getSummaryStats();

  const SummaryCard = ({ title, value, icon: Icon }) => (
    <Card className="premium-card border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600 text-lg">Analyze your job search performance and identify trends</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Total Applications" value={stats.totalApplications} icon={FileText} />
          <SummaryCard title="Total Interviews" value={stats.totalInterviews} icon={TrendingUp} />
          <SummaryCard title="Total Offers" value={stats.totalOffers} icon={Target} />
          <SummaryCard title="Overall Success Rate" value={stats.overallSuccessRate} icon={BarChart} />
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ApplicationsOverTime applications={data.applications} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-2">
            <ApplicationFunnel applications={data.applications} offers={data.offers} isLoading={isLoading} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <CVSuccessRateChart applications={data.applications} cvs={data.cvs} isLoading={isLoading} />
          <StatusDistributionChart applications={data.applications} isLoading={isLoading} />
        </div>
        
        <div className="grid gap-8">
          <ApplicationSourceChart applications={data.applications} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}