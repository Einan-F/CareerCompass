import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const StatCard = ({ title, value, subtitle, icon: Icon, color, index, isLoading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
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
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          <div className={`p-4 rounded-2xl ${color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function StatsOverview({ stats, isLoading }) {
  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      subtitle: "Applications submitted",
      icon: Briefcase,
      color: "bg-blue-500"
    },
    {
      title: "Pending",
      value: stats.pendingApplications,
      subtitle: "Awaiting response",
      icon: Clock,
      color: "bg-amber-500"
    },
    {
      title: "Interviews",
      value: stats.interviewInvitations,
      subtitle: "Interview invitations",
      icon: Target,
      color: "bg-green-500"
    },
    {
      title: "Interview Rate",
      value: `${stats.interviewRate}%`,
      subtitle: "Success rate",
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} isLoading={isLoading} />
      ))}
    </div>
  );
}