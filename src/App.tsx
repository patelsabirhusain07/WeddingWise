import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CostEstimator } from './components/CostEstimator';
import { ExpenseTracker } from './components/ExpenseTracker';
import { EventTimeline } from './components/EventTimeline';
import { VendorManagement } from './components/VendorManagement';
import { GuestListRSVP } from './components/GuestListRSVP';
import { ChecklistView } from './components/ChecklistView';

import {
  WeddingParameters,
  ExpenseItem,
  WeddingEvent,
  VendorQuote,
  Guest,
  ChecklistItem,
} from './types/wedding';

import { generateAISuggestions, calculateDynamicEstimates } from './utils/budgetCalculations';
import { generateWeddingReportPDF } from './utils/pdfExport';

// Initial clean wedding parameters
const initialWeddingParameters: WeddingParameters = {
  coupleName: '',
  weddingDate: '',
  totalBudget: 0, // Starts at 0 - user enters manually
  guestCount: 150,
  totalDays: 2,
  city: '',
  currency: '₹',
  foodPreference: 'multi_cuisine',
  decorStyle: 'royal_regal',
  venueType: 'resort_destination',
  photographyStyle: 'candid_cinematic',
  clothingStyle: 'designer_couture',
  invitationType: 'standard_print',
  transportTier: 'shuttle_coaches',
};

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Load saved data or start clean
  const [params, setParams] = useState<WeddingParameters>(() => {
    const saved = localStorage.getItem('weddingwise_user_params');
    return saved ? JSON.parse(saved) : initialWeddingParameters;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('weddingwise_user_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [events, setEvents] = useState<WeddingEvent[]>(() => {
    const saved = localStorage.getItem('weddingwise_user_events');
    return saved ? JSON.parse(saved) : [];
  });

  const [vendors, setVendors] = useState<VendorQuote[]>(() => {
    const saved = localStorage.getItem('weddingwise_user_vendors');
    return saved ? JSON.parse(saved) : [];
  });

  const [guests, setGuests] = useState<Guest[]>(() => {
    const saved = localStorage.getItem('weddingwise_user_guests');
    return saved ? JSON.parse(saved) : [];
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem('weddingwise_user_checklist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('weddingwise_user_params', JSON.stringify(params));
  }, [params]);

  useEffect(() => {
    localStorage.setItem('weddingwise_user_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('weddingwise_user_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('weddingwise_user_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('weddingwise_user_guests', JSON.stringify(guests));
  }, [guests]);

  useEffect(() => {
    localStorage.setItem('weddingwise_user_checklist', JSON.stringify(checklist));
  }, [checklist]);

  // Financial calculations
  const totalActual = expenses.reduce((sum, item) => sum + item.actualCost, 0);
  const remainingBudget = (params.totalBudget || 0) - totalActual;
  const suggestions = generateAISuggestions(params, expenses);

  // PDF Export
  const handleExportPDF = () => {
    generateWeddingReportPDF(params, expenses, events);
  };

  // Synchronize dynamic estimates from the Estimator to generate actual initial expense items ONLY IF user has set budget
  const handleApplyEstimatesToBudget = (estimates: ReturnType<typeof calculateDynamicEstimates>) => {
    if (!params.totalBudget || params.totalBudget <= 0) {
      return;
    }

    if (expenses.length === 0 && estimates.totalEstimated > 0) {
      const generatedExpenses: ExpenseItem[] = [
        {
          id: `exp-${Date.now()}-1`,
          title: 'Venue & Accommodation Booking',
          category: 'venue',
          eventId: 'all',
          estimatedCost: estimates.venue,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
          notes: 'Estimated budget allocation.',
        },
        {
          id: `exp-${Date.now()}-2`,
          title: `Catering & Dining for ${params.guestCount} Guests`,
          category: 'food_catering',
          eventId: 'all',
          estimatedCost: estimates.food_catering,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
        },
        {
          id: `exp-${Date.now()}-3`,
          title: 'Decor, Mandap & Stage Styling',
          category: 'decoration',
          eventId: 'all',
          estimatedCost: estimates.decoration,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
        },
        {
          id: `exp-${Date.now()}-4`,
          title: 'Photography & Cinematography Team',
          category: 'photography_video',
          eventId: 'all',
          estimatedCost: estimates.photography_video,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
        },
        {
          id: `exp-${Date.now()}-5`,
          title: 'Bridal & Groom Attire / Jewelry',
          category: 'clothing_jewelry',
          eventId: 'all',
          estimatedCost: estimates.clothing_jewelry,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
        },
        {
          id: `exp-${Date.now()}-6`,
          title: 'Invitations & Stationery',
          category: 'invitations_stationery',
          eventId: 'all',
          estimatedCost: estimates.invitations_stationery,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
        },
        {
          id: `exp-${Date.now()}-7`,
          title: 'Logistics & Guest Transit Shuttles',
          category: 'transport_logistics',
          eventId: 'all',
          estimatedCost: estimates.transport_logistics,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
        },
        {
          id: `exp-${Date.now()}-8`,
          title: 'Music, Sound, DJ & Entertainment',
          category: 'entertainment_music',
          eventId: 'all',
          estimatedCost: estimates.entertainment_music,
          actualCost: 0,
          advancePaid: 0,
          status: 'planned',
        },
      ];

      setExpenses(generatedExpenses);
    } else {
      setExpenses((prevExpenses) =>
        prevExpenses.map((exp) => {
          const catKey = exp.category;
          if (estimates[catKey as keyof typeof estimates] !== undefined) {
            const newEstimated = estimates[catKey as keyof typeof estimates];
            return {
              ...exp,
              estimatedCost: typeof newEstimated === 'number' ? newEstimated : exp.estimatedCost,
            };
          }
          return exp;
        })
      );
    }
  };

  // Expense Handlers
  const handleAddExpense = (item: Omit<ExpenseItem, 'id'>) => {
    const newItem: ExpenseItem = {
      ...item,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newItem, ...prev]);
  };

  const handleUpdateExpense = (item: ExpenseItem) => {
    setExpenses((prev) => prev.map((e) => (e.id === item.id ? item : e)));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Vendor Handlers
  const handleAddVendor = (vendor: Omit<VendorQuote, 'id'>) => {
    const newVendor: VendorQuote = {
      ...vendor,
      id: `vnd-${Date.now()}`,
    };
    setVendors((prev) => [newVendor, ...prev]);
  };

  const handleUpdateVendorStatus = (id: string, status: VendorQuote['status']) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
  };

  const handleDeleteVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  // Guest Handlers
  const handleAddGuest = (guest: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guest,
      id: `gst-${Date.now()}`,
    };
    setGuests((prev) => [newGuest, ...prev]);
  };

  const handleUpdateGuestStatus = (id: string, status: Guest['rsvpStatus']) => {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, rsvpStatus: status } : g)));
  };

  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  // Event Handlers
  const handleAddEvent = (event: Omit<WeddingEvent, 'id'>) => {
    const newEvt: WeddingEvent = {
      ...event,
      id: `evt-${Date.now()}`,
    };
    setEvents((prev) => [...prev, newEvt]);
  };

  const handleUpdateEvent = (event: WeddingEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? event : e)));
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Checklist Handlers
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isCompleted: !c.isCompleted } : c))
    );
  };

  const handleAddChecklist = (item: Omit<ChecklistItem, 'id'>) => {
    const newItem: ChecklistItem = {
      ...item,
      id: `chk-${Date.now()}`,
    };
    setChecklist((prev) => [...prev, newItem]);
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklist((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coupleName={params.coupleName || 'My Wedding'}
        onOpenSettings={() => setActiveTab('calculator')}
        onExportPDF={handleExportPDF}
        remainingBudget={remainingBudget}
        currency={params.currency}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            params={params}
            expenses={expenses}
            events={events}
            guests={guests}
            suggestions={suggestions}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAddExpense={() => {
              setActiveTab('expenses');
              setIsAddExpenseModalOpen(true);
            }}
          />
        )}

        {activeTab === 'calculator' && (
          <CostEstimator
            params={params}
            onUpdateParams={setParams}
            onApplyEstimatesToBudget={handleApplyEstimatesToBudget}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseTracker
            expenses={expenses}
            events={events}
            currency={params.currency}
            totalBudget={params.totalBudget}
            params={params}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
            isAddModalOpen={isAddExpenseModalOpen}
            setIsAddModalOpen={setIsAddExpenseModalOpen}
          />
        )}

        {activeTab === 'events' && (
          <EventTimeline
            events={events}
            currency={params.currency}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorManagement
            vendors={vendors}
            currency={params.currency}
            onAddVendor={handleAddVendor}
            onUpdateVendorStatus={handleUpdateVendorStatus}
            onDeleteVendor={handleDeleteVendor}
          />
        )}

        {activeTab === 'guests' && (
          <GuestListRSVP
            guests={guests}
            events={events}
            targetGuestCount={params.guestCount}
            onAddGuest={handleAddGuest}
            onUpdateGuestStatus={handleUpdateGuestStatus}
            onDeleteGuest={handleDeleteGuest}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistView
            checklist={checklist}
            onToggleChecklist={handleToggleChecklist}
            onAddChecklist={handleAddChecklist}
            onDeleteChecklist={handleDeleteChecklist}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 <strong>WeddingWise</strong>. Built for stress-free luxury & budget wedding celebrations.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportPDF}
              className="text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Export PDF Financial Report
            </button>
            <span>•</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all wedding data back to clean blank state?')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Reset All Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
