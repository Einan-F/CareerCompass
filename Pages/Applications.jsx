import React, { useState, useEffect } from "react";
import { Application, CV } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Filter,
  Building2,
  Calendar,
  MapPin,
  ExternalLink,
  Edit,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ApplicationForm from "../components/applications/ApplicationForm";
import ApplicationCard from "../components/applications/ApplicationCard";
import ApplicationFilters from "../components/applications/ApplicationFilters";
import ApplicationDetails from "../components/applications/ApplicationDetails";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    method: "all",
    dateRange: "all"
  });

  useEffect(() => {
    loadApplications();
    loadCVs();
    
    // Check URL parameters for new application
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'new') {
      setShowForm(true);
    }
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    const data = await Application.list('-application_date');
    setApplications(data);
    setIsLoading(false);
  };

  const loadCVs = async () => {
    const data = await CV.list('-created_date');
    setCvs(data);
  };

  const handleSaveApplication = async (applicationData) => {
    if (editingApplication) {
      await Application.update(editingApplication.id, applicationData);
    } else {
      await Application.create(applicationData);
    }
    
    setShowForm(false);
    setEditingApplication(null);
    loadApplications();
  };

  const handleEditApplication = (application) => {
    setEditingApplication(application);
    setShowForm(true);
    setSelectedApplication(null);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.position_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === "all" || app.status === filters.status;
    const matchesMethod = filters.method === "all" || app.application_method === filters.method;
    
    let matchesDate = true;
    if (filters.dateRange !== "all") {
      const appDate = new Date(app.application_date);
      const now = new Date();
      const daysAgo = Math.floor((now - appDate) / (1000 * 60 * 60 * 24));
      
      switch (filters.dateRange) {
        case "week":
          matchesDate = daysAgo <= 7;
          break;
        case "month":
          matchesDate = daysAgo <= 30;
          break;
        case "quarter":
          matchesDate = daysAgo <= 90;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  });

  if (selectedApplication) {
    return (
      <ApplicationDetails 
        application={selectedApplication}
        onBack={() => setSelectedApplication(null)}
        onEdit={handleEditApplication}
      />
    );
  }

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Applications</h1>
            <p className="text-gray-600 text-lg">Track and manage all your job applications</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        </motion.div>

        {/* Application Form */}
        <AnimatePresence>
          {showForm && (
            <ApplicationForm
              application={editingApplication}
              cvs={cvs}
              onSave={handleSaveApplication}
              onCancel={() => {
                setShowForm(false);
                setEditingApplication(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search companies or positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <ApplicationFilters filters={filters} onFilterChange={setFilters} />
          </div>
        </motion.div>

        {/* Applications Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6"
        >
          <AnimatePresence>
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white/80 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((application, index) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  index={index}
                  onClick={() => setSelectedApplication(application)}
                  onEdit={() => handleEditApplication(application)}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filters.status !== "all" || filters.method !== "all" || filters.dateRange !== "all"
                    ? "Try adjusting your search or filters"
                    : "Start tracking your job applications to see them here"
                  }
                </p>
                {!searchTerm && filters.status === "all" && filters.method === "all" && filters.dateRange === "all" && (
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Application
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}