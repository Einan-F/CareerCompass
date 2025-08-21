
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cvService } from '@/lib/services/cvService';

export default function CVSuccessRateChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const metrics = await cvService.getPerformanceMetrics();
        const formattedData = metrics.map(cv => ({
          name: cv.version_name,
          'Interview Rate': parseFloat(cv.interview_rate.toFixed(1)),
          'Applications': cv.applications_count
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error('Failed to load CV metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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
