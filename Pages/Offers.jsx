import React, { useState, useEffect } from "react";
import { Offer, Application } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import OfferCard from "../components/offers/OfferCard";
import OfferForm from "../components/offers/OfferForm";
import OfferComparison from "../components/offers/OfferComparison";

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedToCompare, setSelectedToCompare] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [offerData, appData] = await Promise.all([
      Offer.list('-created_date'),
      Application.list()
    ]);
    setOffers(offerData);
    setApplications(appData);
    setIsLoading(false);
  };

  const handleSaveOffer = async (offerData) => {
    if (editingOffer) {
      await Offer.update(editingOffer.id, offerData);
    } else {
      await Offer.create(offerData);
    }
    setShowForm(false);
    setEditingOffer(null);
    loadData();
  };
  
  const handleEditOffer = (offer) => {
    setEditingOffer(offer);
    setShowForm(true);
  };
  
  const handleDeleteOffer = async (offerId) => {
    await Offer.delete(offerId);
    loadData();
  };

  const toggleCompare = (offerId) => {
    setSelectedToCompare(prev =>
      prev.includes(offerId)
        ? prev.filter(id => id !== offerId)
        : [...prev, offerId]
    );
  };
  
  const offersToCompare = offers.filter(offer => selectedToCompare.includes(offer.id));

  return (
    <div className="min-h-screen gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Offers</h1>
            <p className="text-gray-600 text-lg">Manage and compare your job offers</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => setCompareMode(prev => !prev)}
              disabled={offers.length < 2}
            >
              {compareMode ? "Exit Compare Mode" : "Compare Offers"}
            </Button>
            <Button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Offer
            </Button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <OfferForm
              offer={editingOffer}
              applications={applications.filter(app => app.status === 'offer_received')}
              onSave={handleSaveOffer}
              onCancel={() => { setShowForm(false); setEditingOffer(null); }}
            />
          )}
        </AnimatePresence>

        {compareMode && (
          <OfferComparison offers={offersToCompare} />
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <AnimatePresence>
            {isLoading ? (
              Array(2).fill(0).map((_, i) => (
                <div key={i} className="bg-white/80 rounded-2xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                </div>
              ))
            ) : offers.length > 0 ? (
              offers.map((offer, index) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  index={index}
                  onEdit={handleEditOffer}
                  onDelete={handleDeleteOffer}
                  isComparing={compareMode}
                  isSelected={selectedToCompare.includes(offer.id)}
                  onToggleCompare={toggleCompare}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 col-span-full"
              >
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Offers Logged Yet</h3>
                <p className="text-gray-500 mb-6">
                  When you receive a job offer, add it here to compare and decide.
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Offer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}