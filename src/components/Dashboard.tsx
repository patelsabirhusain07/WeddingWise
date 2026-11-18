import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  CalendarDays, 
  Users, 
  ArrowUpRight,
  Plus,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { WeddingParameters, ExpenseItem, WeddingEvent, Guest, AISuggestion } from '../types/wedding';
import { CATEGORY_LABELS } from '../utils/budgetCalculations';

interface DashboardProps {
  params: WeddingParameters;
  expenses: ExpenseItem[];
  events: WeddingEvent[];
  guests: Guest[];
  suggestions: AISuggestion[];
  onNavigate: (tab: string) => void;
  onOpenAddExpense: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  params,
  expenses,
  events,
  guests,
  suggestions,
  onNavigate,
  onOpenAddExpense,
}) => {
  const currency = params.currency || '₹';
  const totalBudget = params.totalBudget || 0;
  const totalEstimated = expenses.reduce((acc, curr) => acc + curr.estimatedCost, 0);
  const totalActual = expenses.reduce((acc, curr) => acc + curr.actualCost, 0);
  const totalAdvance = expenses.reduce((acc, curr) => acc + curr.advancePaid, 0);
  const totalPending = totalActual - totalAdvance;
  const remaining = totalBudget - totalActual;
  const budgetUtilization = totalBudget > 0 ? Math.min(100, Math.round((totalActual / totalBudget) * 100)) : 0;

  // Has the user configured their budget yet?
  const isBudgetUnset = totalBudget === 0;
  const hasNoExpenses = expenses.length === 0;

  // Category breakdown for bars & donut
  const categoryTotals = expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.actualCost;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // Guest count statistics
  const confirmedGuests = guests
    .filter((g) => g.rsvpStatus === 'attending')
    .reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);
  const tentativeGuests = guests
    .filter((g) => g.rsvpStatus === 'tentative')
    .reduce((acc, g) => acc + 1 + (g.plusOnes || 0), 0);

  // Days until wedding
  let daysLeft: number | null = null;
  if (params.weddingDate) {
    const weddingDateObj = new Date(params.weddingDate);
    const today = new Date();
    const diffTime = weddingDateObj.getTime() - today.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {daysLeft !== null && daysLeft > 0
                  ? `Countdown: ${daysLeft} Days to go!`
                  : 'Welcome to your wedding planner'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {params.coupleName ? `${params.coupleName}’s Wedding` : 'Your Wedding Workspace'}
            </h1>
            <p className="mt-2 text-rose-100 text-sm sm:text-base leading-relaxed">
              {params.city ? `${params.city} • ` : ''}
              {params.totalDays} Days of Festivities • {params.guestCount} Target Guests
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('calculator')}
              className="bg-white text-rose-700 hover:bg-rose-50 font-bold px-4 py-2.5 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Configure Budget & Estimates</span>
            </button>
            <button
              onClick={onOpenAddExpense}
              className="bg-rose-800/80 hover:bg-rose-900 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs text-sm transition-all cursor-pointer flex items-center gap-1.5 border border-white/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle blur */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Zero Budget / New User First Step Callout */}
      {isBudgetUnset && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border-2 border-dashed border-rose-300 rounded-2xl p-6 sm:p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-900">Step 1: Set Your Wedding Budget & Guest Scale</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Your wedding dashboard is completely clean and ready. Open the Cost Estimator to enter your total budget, guest count, days, and event styling to automatically compute itemized estimates.
            </p>
          </div>
          <div>
            <button
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-rose-200 text-sm transition-all cursor-pointer"
            >
              <span>Set Wedding Budget & Generate Estimates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Planned Budget</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {currency} {totalBudget.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              Estimated: {currency} {totalEstimated.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Actual Committed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Actual Committed</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {currency} {totalActual.toLocaleString()}
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full ${totalBudget > 0 && totalActual > totalBudget ? 'bg-red-500' : 'bg-rose-500'}`} 
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {budgetUtilization}% of budget committed
            </p>
          </div>
        </div>

        {/* Advance Paid */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Advance Paid</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-emerald-700">
              {currency} {totalAdvance.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {totalActual > 0 ? Math.round((totalAdvance / totalActual) * 100) : 0}% settled with vendors
            </p>
          </div>
        </div>

        {/* Pending Balances */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Balances</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-amber-600">
              {currency} {totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Remaining: <span className={remaining >= 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-bold'}>{currency} {remaining.toLocaleString()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Visuals & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Category Spending Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Spending by Category Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Category-wise Expenditure</h2>
                <p className="text-xs text-slate-500">Actual committed spend across all major wedding areas</p>
              </div>
              <button
                onClick={() => onNavigate('expenses')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                View Details <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {hasNoExpenses ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 space-y-2">
                <p className="text-xs">No expenses entered yet. Set your budget and sync estimates or record vendor items.</p>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Generate Estimates in Step 1 →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedCategories.map(([catKey, amount]) => {
                  const labelInfo = CATEGORY_LABELS[catKey as keyof typeof CATEGORY_LABELS] || {
                    name: catKey,
                    color: '#e11d48',
                    badgeBg: 'bg-rose-100 text-rose-700',
                  };
                  const percentage = totalActual > 0 ? Math.round((amount / totalActual) * 100) : 0;

                  return (
                    <div key={catKey} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: labelInfo.color }}
                          />
                          <span className="font-semibold text-slate-800">{labelInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-medium">{percentage}%</span>
                          <span className="font-bold text-slate-900">
                            {currency} {amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: labelInfo.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Event-wise Itinerary & Estimated Budget */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Scheduled Wedding Ceremonies</h2>
                <p className="text-xs text-slate-500">Planned events and financial allocation</p>
              </div>
              <button
                onClick={() => onNavigate('events')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                Manage Schedule <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {events.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-xs">
                No events added yet. Go to Events & Timeline to schedule your ceremonies (Mehendi, Sangeet, Wedding, Reception).
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-rose-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-100 text-rose-700 px-2 py-0.5 rounded-md">
                        Day {evt.dayNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {currency} {evt.estimatedBudget.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{evt.title}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.time}</span>
                    </div>
                    {evt.theme && <p className="text-xs text-slate-600 italic line-clamp-1">Theme: {evt.theme}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): AI Planner Insights & Guest Overview */}
        <div className="space-y-6">
          {/* AI-Powered Budget Assistant */}
          <div className="bg-gradient-to-b from-rose-50/80 to-pink-50/40 rounded-2xl p-5 border border-rose-200/60 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-rose-600 rounded-lg text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">AI Wedding Assistant</h3>
                <p className="text-xs text-slate-500">Smart cost optimizations & risk alerts</p>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {suggestions.length === 0 ? (
                <div className="p-4 bg-white rounded-xl text-center text-slate-400 text-xs">
                  Set your budget parameters to receive personalized AI financial recommendations and saving strategies.
                </div>
              ) : (
                suggestions.slice(0, 3).map((sug) => (
                  <div
                    key={sug.id}
                    className="p-3.5 bg-white rounded-xl border border-rose-100/80 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-start gap-2">
                      {sug.type === 'risk_warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{sug.title}</h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {sug.description}
                        </p>
                        {sug.potentialSavings && (
                          <div className="mt-1.5 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Est. Savings: {currency} {sug.potentialSavings.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick RSVP & Guest Attendance Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Guest RSVPs</h3>
              </div>
              <button
                onClick={() => onNavigate('guests')}
                className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500">Confirmed (Attending)</span>
                <div className="text-xl font-extrabold text-emerald-600 mt-1">
                  {confirmedGuests}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500">Tentative / Pending</span>
                <div className="text-xl font-extrabold text-amber-600 mt-1">
                  {tentativeGuests}
                </div>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-500 text-center">
              Target Capacity: <strong className="text-slate-800">{params.guestCount} guests</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
