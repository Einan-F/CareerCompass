import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

export default function ApplicationsOverTime({ applications, isLoading }) {
  const processData = () => {
    const dataByMonth = {};
    applications.forEach(app => {
      const month = format(new Date(app.application_date), 'yyyy-MM');
      if (!dataByMonth[month]) {
        dataByMonth[month] = {
          month,
          applications: 0,
          interviews: 0
        };
      }
      dataByMonth[month].applications++;
      if (app.interview_stages && app.interview_stages.length > 0) {
        dataByMonth[month].interviews++;
      }
    });

    return Object.values(dataByMonth)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(d => ({ ...d, month: format(new Date(d.month), 'MMM yy') }));
  };
  
  const chartData = processData();

  return (
    <Card className="premium-card border-0">
      <CardHeader>
        <CardTitle>Application Volume Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Applications" />
              <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} name="Interviews" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}