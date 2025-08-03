import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, Check, TrendingUp, Target } from "lucide-react";

export default function ApplicationFunnel({ applications, offers, isLoading }) {
  const getFunnelData = () => {
    const totalApps = applications.length;
    const interviews = applications.filter(app => app.interview_stages && app.interview_stages.length > 0).length;
    const offerReceived = offers.length;
    
    return [
      { name: 'Applied', value: totalApps, conversion: totalApps > 0 ? (interviews / totalApps * 100) : 0 },
      { name: 'Interview', value: interviews, conversion: interviews > 0 ? (offerReceived / interviews * 100) : 0 },
      { name: 'Offer', value: offerReceived, conversion: null },
    ];
  };

  const funnelData = getFunnelData();

  const FunnelStage = ({ name, value, color, icon: Icon }) => (
    <div className={`relative flex items-center justify-between p-4 ${color} bg-opacity-10 rounded-lg`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-20`}>
          <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="premium-card border-0">
      <CardHeader>
        <CardTitle>Application Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <div className="space-y-1">
            {funnelData.map((stage, index) => (
              <React.Fragment key={stage.name}>
                <FunnelStage 
                  name={stage.name} 
                  value={stage.value} 
                  color={['bg-blue-500', 'bg-purple-500', 'bg-green-500'][index]}
                  icon={[Check, TrendingUp, Target][index]}
                />
                {stage.conversion !== null && (
                  <div className="flex justify-center items-center my-2">
                    <ArrowDown className="w-4 h-4 text-gray-400" />
                    <p className="text-sm font-semibold text-green-600 ml-2">
                      {stage.conversion.toFixed(1)}% to next stage
                    </p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}