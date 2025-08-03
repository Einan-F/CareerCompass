import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { format, isAfter, isBefore, addDays } from "date-fns";

export default function UpcomingTasks({ applications, offers, isLoading }) {
  const getTasks = () => {
    const tasks = [];
    const today = new Date();
    const nextWeek = addDays(today, 7);

    // Follow-up tasks
    applications.forEach(app => {
      if (app.follow_up_date) {
        const followUpDate = new Date(app.follow_up_date);
        if (isBefore(followUpDate, nextWeek)) {
          tasks.push({
            id: `followup-${app.id}`,
            type: 'follow_up',
            title: `Follow up with ${app.company_name}`,
            subtitle: app.position_title,
            date: followUpDate,
            priority: isAfter(today, followUpDate) ? 'high' : 'medium',
            company: app.company_name
          });
        }
      }
    });

    // Offer deadlines
    offers.forEach(offer => {
      if (offer.offer_deadline && offer.status === 'pending') {
        const deadline = new Date(offer.offer_deadline);
        if (isBefore(deadline, nextWeek)) {
          tasks.push({
            id: `offer-${offer.id}`,
            type: 'offer_deadline',
            title: `Respond to ${offer.company_name} offer`,
            subtitle: offer.position_title,
            date: deadline,
            priority: 'high',
            company: offer.company_name
          });
        }
      }
    });

    // Auto follow-ups for applications without response after 2 weeks
    applications.forEach(app => {
      if (app.status === 'applied') {
        const appDate = new Date(app.application_date);
        const twoWeeksLater = addDays(appDate, 14);
        if (isBefore(twoWeeksLater, nextWeek) && !app.follow_up_date) {
          tasks.push({
            id: `auto-followup-${app.id}`,
            type: 'auto_follow_up',
            title: `Consider following up with ${app.company_name}`,
            subtitle: `Applied ${format(appDate, 'MMM d')} - no response`,
            date: twoWeeksLater,
            priority: 'low',
            company: app.company_name
          });
        }
      }
    });

    return tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const tasks = getTasks();

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    low: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const taskIcons = {
    follow_up: Clock,
    offer_deadline: AlertTriangle,
    auto_follow_up: Calendar
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="premium-card border-0">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl font-bold text-gray-900">Upcoming Tasks</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="p-4 border rounded-xl animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <div className="space-y-4">
              {tasks.slice(0, 6).map((task, index) => {
                const Icon = taskIcons[task.type];
                const isOverdue = isAfter(new Date(), task.date);
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border rounded-xl hover:shadow-md transition-all duration-200 ${
                      isOverdue ? 'border-red-200 bg-red-50/50' : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          isOverdue ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            isOverdue ? 'text-red-500' : 'text-blue-500'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{task.subtitle}</p>
                          <p className={`text-xs mt-1 ${
                            isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'
                          }`}>
                            {isOverdue ? 'Overdue - ' : ''}{format(task.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        className={`${priorityColors[task.priority]} border text-xs`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming tasks</p>
              <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}