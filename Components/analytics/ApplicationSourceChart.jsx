import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ApplicationSourceChart({ applications, isLoading }) {
  const processData = () => {
    const sourceCounts = {};
    applications.forEach(app => {
      const source = app.job_source ? app.job_source.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown';
      if (!sourceCounts[source]) {
        sourceCounts[source] = {
          name: source,
          applications: 0,
          interviews: 0,
        };
      }
      sourceCounts[source].applications++;
      if (app.interview_stages && app.interview_stages.length > 0) {
        sourceCounts[source].interviews++;
      }
    });
    return Object.values(sourceCounts);
  };

  const chartData = processData();

  return (
    <Card className="premium-card border-0">
      <CardHeader>
        <CardTitle>Application Source Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="applications" fill="#3b82f6" name="Total Applications" />
              <Bar dataKey="interviews" fill="#10b981" name="Interviews" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}