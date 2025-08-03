import React, { useState, useEffect } from "react";
import { CV, Application } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import CVCard from "../components/cv/CVCard";
import CVForm from "../components/cv/CVForm";

export default function CVLibrary() {
  const [cvs, setCvs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCV, setEditingCV] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [cvData, appData] = await Promise.all([
      CV.list('-created_date'),
      Application.list()
    ]);
    setCvs(cvData);
    setApplications(appData);
    setIsLoading(false);
  };

  const handleSaveCV = async (cvData) => {
    if (editingCV) {
      await CV.update(editingCV.id, cvData);
    } else {
      await CV.create(cvData);
    }
    
    setShowForm(false);
    setEditingCV(null);
    loadData();
  };

  const handleEditCV = (cv) => {
    setEditingCV(cv);
    setShowForm(true);
  };
  
  const handleDeleteCV = async (cvId) => {
    await CV.delete(cvId);
    loadData();
  };

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">CV Library</h1>
            <p className="text-gray-600 text-lg">Manage and analyze the performance of your resumes</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Upload New CV
          </Button>
        </motion.div>

        {/* CV Form */}
        <AnimatePresence>
          {showForm && (
            <CVForm
              cv={editingCV}
              onSave={handleSaveCV}
              onCancel={() => {
                setShowForm(false);
                setEditingCV(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* CVs Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-white/80 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
            ) : cvs.length > 0 ? (
              cvs.map((cv, index) => (
                <CVCard
                  key={cv.id}
                  cv={cv}
                  applications={applications}
                  index={index}
                  onEdit={handleEditCV}
                  onDelete={handleDeleteCV}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 col-span-full"
              >
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your CV Library is Empty</h3>
                <p className="text-gray-500 mb-6">
                  Upload your first CV to start tracking its performance.
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload a CV
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}