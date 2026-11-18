import React, { useState } from 'react';
import {
  Calculator,
  Sparkles,
  Users,
  Paintbrush,
  Check,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { WeddingParameters } from '../types/wedding';
import { calculateDynamicEstimates, CATEGORY_LABELS } from '../utils/budgetCalculations';

interface CostEstimatorProps {
  params: WeddingParameters;
  onUpdateParams: (newParams: WeddingParameters) => void;
  onApplyEstimatesToBudget?: (estimates: ReturnType<typeof calculateDynamicEstimates>) => void;
  onNavigateToDashboard?: () => void;
}

export const CostEstimator: React.FC<CostEstimatorProps> = ({
  params,
  onUpdateParams,
  onApplyEstimatesToBudget,
  onNavigateToDashboard,
}) => {
  const [formData, setFormData] = useState<WeddingParameters>({ ...params });
  const [savedNotice, setSavedNotice] = useState(false);

  // Compute live estimates - if totalBudget is 0/empty, ALL values are strictly 0!
  const estimates = calculateDynamicEstimates(formData);
  const currency = formData.currency || '₹';
  const hasUserEnteredBudget = Boolean(formData.totalBudget && formData.totalBudget > 0);

  const handleChange = (field: keyof WeddingParameters, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveAndSync = () => {
    onUpdateParams(formData);
    if (onApplyEstimatesToBudget) {
      onApplyEstimatesToBudget(estimates);
    }
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleClearBudget = () => {
    setFormData((prev) => ({
      ...prev,
      totalBudget: 0,
    }));
    onUpdateParams({
      ...formData,
      totalBudget: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
            <Calculator className="w-3.5 h-3.5" />
            <span>Manual Budget Entry & Custom Estimator</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Wedding Cost Estimator & Parameter Configurator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Enter your total budget manually. All category estimates start at 0 until you specify your amount.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasUserEnteredBudget && (
            <button
              onClick={handleClearBudget}
              className="px-3.5 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              title="Reset budget to zero"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Amount</span>
            </button>
          )}

          <button
            onClick={handleSaveAndSync}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer text-sm shrink-0"
          >
            {savedNotice ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Budget Saved & Synced!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save & Calculate Estimates</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Core Numbers */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              Enter Your Real Wedding Scale
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Overall Budget Target ({currency}) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    placeholder="Enter amount (e.g. 1000000)"
                    value={formData.totalBudget === 0 ? '' : formData.totalBudget}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      handleChange('totalBudget', val);
                    }}
                    className="w-full text-base font-bold text-slate-900 px-3.5 py-2.5 rounded-xl border-2 border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20 placeholder:font-normal placeholder:text-slate-400"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {formData.totalBudget > 0
                    ? `Set to: ${currency} ${formData.totalBudget.toLocaleString()}`
                    : 'Currently 0. Type your budget to estimate category shares.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Currency Symbol
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 bg-white"
                >
                  <option value="₹">₹ (INR - Rupee)</option>
                  <option value="$">$ (USD - Dollar)</option>
                  <option value="€">€ (EUR - Euro)</option>
                  <option value="£">£ (GBP - Pound)</option>
                  <option value="AED ">AED (UAE Dirham)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Couple / Wedding Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diya & Aarav"
                  value={formData.coupleName}
                  onChange={(e) => handleChange('coupleName', e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => handleChange('weddingDate', e.target.value)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Guests Expected
                </label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={formData.guestCount}
                  onChange={(e) => handleChange('guestCount', Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Celebration Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={formData.totalDays}
                  onChange={(e) => handleChange('totalDays', Number(e.target.value))}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Host City / Destination
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Udaipur, Mumbai, Goa, Delhi, Dubai"
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Preferences & Style Selectors */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-pink-600" />
              Venue, Dining & Aesthetics Styling
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Venue Category
                </label>
                <select
                  value={formData.venueType}
                  onChange={(e) => handleChange('venueType', e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="resort_destination">Luxury Destination Resort</option>
                  <option value="heritage_palace">Royal Heritage Palace</option>
                  <option value="beachfront">Beachfront Lawn / Coastal Villa</option>
                  <option value="banquet_hall">City 5-Star Banquet Hall</option>
                  <option value="community_hall">Community Hall / Club Ground</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Food & Dining Menu Style
                </label>
                <select
                  value={formData.foodPreference}
                  onChange={(e) => handleChange('foodPreference', e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="multi_cuisine">Multi-Cuisine (North/South Indian, Asian, Continental)</option>
                  <option value="pure_veg">Strict Vegetarian & Royal Maharaj Special</option>
                  <option value="non_veg">Gourmet Non-Veg & Seafood Delicacies</option>
                  <option value="gourmet_organic">Farm-to-Table Gourmet Organic Plated</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Decoration & Floral Theme
                </label>
                <select
                  value={formData.decorStyle}
                  onChange={(e) => handleChange('decorStyle', e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="royal_regal">Royal & Grand Palace Ambience</option>
                  <option value="floral_extravaganza">Exotic Floral Extravaganza (Imported Blooms)</option>
                  <option value="traditional">Traditional Marigold, Bells & Brass</option>
                  <option value="boho_chic">Boho-Chic & Fairy Lights</option>
                  <option value="minimalist">Minimalist Modern Pastel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photography & Cinematography
                </label>
                <select
                  value={formData.photographyStyle}
                  onChange={(e) => handleChange('photographyStyle', e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="candid_cinematic">Candid + 4K Cinematic Films + Teaser</option>
                  <option value="drone_multi_team">Multi-Team Drone + Live Streaming Crew</option>
                  <option value="celebrity_studio">Celebrity Studio & High-Fashion Portraits</option>
                  <option value="standard">Standard Traditional Photo & Video</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bridal & Groom Attire Tier
                </label>
                <select
                  value={formData.clothingStyle}
                  onChange={(e) => handleChange('clothingStyle', e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="designer_couture">Designer Haute Couture (Custom Handcrafted)</option>
                  <option value="heritage_silks">Traditional Pure Silks & Kanjeevarams</option>
                  <option value="custom_tailored">Custom Tailored Boutique Sets</option>
                  <option value="ready_to_wear">Ready-to-Wear Premium Brands</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Invitation Cards
                </label>
                <select
                  value={formData.invitationType}
                  onChange={(e) => handleChange('invitationType', e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="luxury_boxed">Luxury Boxed Invites with Mithai / Hampers</option>
                  <option value="standard_print">Elegant Metallic Foil Print Cards</option>
                  <option value="handmade_eco">Handmade Seed Paper / Eco-Friendly</option>
                  <option value="digital_only">Eco-Digital Video & RSVP Website Only</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Logistics & Guest Transit
                </label>
                <select
                  value={formData.transportTier}
                  onChange={(e) => handleChange('transportTier', e.target.value as any)}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="shuttle_coaches">AC Shuttles + Airport Pickups + Vintage Groom Entry Car</option>
                  <option value="vintage_luxury_cars">Fleet of Luxury Sedans & Vintage Convertibles</option>
                  <option value="self_standard">Self-Arranged / Standard Local Taxis</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Real-time Live Estimates Card */}
        <div className="space-y-6">
          <div className="sticky top-20 bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Real-Time AI Estimate
              </span>
              <div className="text-3xl font-extrabold text-slate-900 mt-1">
                {currency} {estimates.totalEstimated.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs">
                <span className="text-slate-500">Target Budget:</span>
                <span className="font-bold text-slate-800">{currency} {(formData.totalBudget || 0).toLocaleString()}</span>
              </div>

              {formData.totalBudget && formData.totalBudget > 0 ? (
                <div className="mt-3 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 p-2.5 rounded-xl font-medium">
                  ✓ Categories calculated proportionally based on your {currency}{formData.totalBudget.toLocaleString()} budget.
                </div>
              ) : (
                <div className="mt-3 text-xs bg-slate-50 text-slate-500 border border-slate-200 p-2.5 rounded-xl font-medium">
                  Enter your Overall Budget Target on the left to allocate and see amounts.
                </div>
              )}
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Itemized Estimated Allocation
              </h3>

              <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {Object.entries(estimates)
                  .filter(([key]) => key !== 'totalEstimated')
                  .map(([key, amount]) => {
                    const labelInfo = CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] || {
                      name: key,
                      color: '#e11d48',
                    };
                    const pct = estimates.totalEstimated > 0 ? Math.round((Number(amount) / estimates.totalEstimated) * 100) : 0;

                    return (
                      <div key={key} className="flex items-center justify-between text-xs py-1">
                        <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: labelInfo.color }}
                          />
                          <span className="text-slate-700 truncate">{labelInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-[11px]">{pct}%</span>
                          <span className="font-semibold text-slate-900">
                            {currency} {Number(amount).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <button
              onClick={handleSaveAndSync}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Apply & Sync to Dashboard</span>
            </button>

            {onNavigateToDashboard && (
              <button
                onClick={() => {
                  handleSaveAndSync();
                  onNavigateToDashboard();
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
