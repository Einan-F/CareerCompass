import React, { useState, useEffect } from "react";
import { Application, CV, Offer } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Plus, 
  Briefcase, 
  FileText, 
  Target, 
  TrendingUp,
  Calendar,
  Building2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";

import StatsOverview from "../components/dashboard/StatsOverview";
import RecentApplications from "../components/dashboard/RecentApplications";
import CVPerformance from "../components/dashboard/CVPerformance";
import UpcomingTasks from "../components/dashboard/UpcomingTasks";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [applicationsData, cvsData, offersData] = await Promise.all([
        Application.list('-application_date', 20),
        CV.list('-created_date', 10),
        Offer.list('-created_date', 10)
      ]);
      
      setApplications(applicationsData);
      setCvs(cvsData);
      setOffers(offersData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const getStats = () => {
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(app => 
      app.status === 'applied' || app.status === 'rejected_after_screening'
    ).length;
    const interviewInvitations = applications.filter(app => 
      app.interview_stages && app.interview_stages.length > 0
    ).length;
    const activeOffers = offers.filter(offer => offer.status === 'pending').length;
    
    return {
      totalApplications,
      pendingApplications,
      interviewInvitations,
      activeOffers,
      interviewRate: totalApplications > 0 ? ((interviewInvitations / totalApplications) * 100).toFixed(1) : 0
    };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Dashboard</h1>
            <p className="text-gray-600 text-lg">Track your job search journey and optimize your approach</p>
          </div>
          <div className="flex gap-3">
            <Link to={createPageUrl("Applications?action=new")}>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <StatsOverview stats={stats} isLoading={isLoading} />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Applications */}
          <div className="lg:col-span-2 space-y-8">
            <RecentApplications 
              applications={applications} 
              isLoading={isLoading}
              onRefresh={loadDashboardData}
            />
            
            <CVPerformance 
              cvs={cvs} 
              applications={applications}
              isLoading={isLoading} 
            />
          </div>

          {/* Right Column - Tasks & Quick Actions */}
          <div className="space-y-8">
            <UpcomingTasks 
              applications={applications}
              offers={offers}
              isLoading={isLoading}
            />

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="premium-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to={createPageUrl("CVLibrary")} className="block">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                    >
                      <FileText className="w-4 h-4 mr-3 text-blue-500" />
                      Manage CVs
                    </Button>
                  </Link>
                  
                  <Link to={createPageUrl("Analytics")} className="block">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-green-50 hover:border-green-200 transition-all duration-300"
                    >
                      <TrendingUp className="w-4 h-4 mr-3 text-green-500" />
                      View Analytics
                    </Button>
                  </Link>
                  
                  <Link to={createPageUrl("Offers")} className="block">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start hover:bg-amber-50 hover:border-amber-200 transition-all duration-300"
                    >
                      <Target className="w-4 h-4 mr-3 text-amber-500" />
                      Compare Offers
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}