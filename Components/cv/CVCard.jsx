import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FileText, Edit, Trash2, TrendingUp, Briefcase } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CVCard({ cv, applications, index, onEdit, onDelete }) {
  const getStats = () => {
    const appsWithThisCV = applications.filter(app => app.cv_version_used === cv.version_name);
    const interviews = appsWithThisCV.filter(app => app.interview_stages && app.interview_stages.length > 0).length;
    const interviewRate = appsWithThisCV.length > 0 ? (interviews / appsWithThisCV.length) * 100 : 0;
    return {
      applicationsCount: appsWithThisCV.length,
      interviewRate: interviewRate.toFixed(1)
    };
  };

  const stats = getStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="premium-card border-0 h-full flex flex-col justify-between group">
        <div>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-gray-900 mb-2">{cv.version_name}</CardTitle>
              <p className="text-sm text-gray-600">{cv.description}</p>
            </div>
            <a href={cv.file_url} target="_blank" rel="noopener noreferrer">
              <FileText className="w-8 h-8 text-blue-500 hover:text-blue-700 transition-colors" />
            </a>
          </CardHeader>
          <CardContent>
            {cv.target_roles && cv.target_roles.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Target Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {cv.target_roles.map(role => (
                    <Badge key={role} variant="secondary" className="bg-gray-100">{role}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-lg">{stats.applicationsCount}</p>
                  <p className="text-xs text-gray-500">Applications</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-lg">{stats.interviewRate}%</p>
                  <p className="text-xs text-gray-500">Interview Rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
        <div className="p-6 pt-0 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(cv)}>
            <Edit className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" className="h-8 w-8">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete "{cv.version_name}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(cv.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </motion.div>
  );
}