import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CVSuccessRateChart({ applications, cvs, isLoading }) {
  const processData = () => {
    return cvs.map(cv => {
      const appsWithCV = applications.filter(app => app.cv_version_used === cv.version_name);
      const interviews = appsWithCV.filter(app => app.interview_stages && app.interview_stages.length > 0).length;
      return {
        name: cv.version_name,
        'Interview Rate': appsWithCV.length > 0 ? (interviews / appsWithCV.length * 100) : 0,
        'Applications': appsWithCV.length
      };
    });
  };

  const chartData = processData();

  return (
    <Card className="premium-card border-0">
      <CardHeader>
        <CardTitle>CV Success Rate</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-72 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" unit="%" />
              <YAxis yAxisId="right" orientation="right" stroke="#a78bfa" allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="Interview Rate" fill="#3b82f6" />
              <Bar yAxisId="right" dataKey="Applications" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}