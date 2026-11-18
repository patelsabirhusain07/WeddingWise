import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Calculator, 
  DollarSign, 
  ShieldCheck, 
  FileDown, 
  Users, 
  Store, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  PieChart
} from 'lucide-react';

interface LandingPageProps {
  onStartPlanning: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartPlanning,
  onOpenLogin,
}) => {
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-rose-800 to-amber-900 text-white p-8 sm:p-14 lg:p-16 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI-Powered Wedding Budget & Planning Workspace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Plan Your Dream Wedding <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-200 to-pink-200">Within Budget</span>
          </h1>

          <p className="text-rose-100 text-base sm:text-lg leading-relaxed max-w-2xl">
            <strong>WeddingWise</strong> is the all-in-one financial and logistics companion for modern couples. Enter your total budget, guest count, days, and event preferences to automatically estimate expenses, track advance payments, manage vendor bids, and generate downloadable PDF reports.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onStartPlanning}
              className="bg-white text-rose-800 hover:bg-rose-50 font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl text-sm sm:text-base transition-all cursor-pointer flex items-center gap-2 active:scale-95"
            >
              <span>Get Started — Free Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLogin}
              className="bg-rose-800/80 hover:bg-rose-700/80 text-white border border-white/30 font-semibold px-6 py-3.5 rounded-2xl text-sm sm:text-base transition-all cursor-pointer"
            >
              Log In With Email
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-rose-200 border-t border-white/15">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Email Verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Pre-Filled Junk Data</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant PDF Financial Export</span>
            </div>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-0 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* 3 Step Workflow */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
            How WeddingWise Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            From Blank Canvas to Complete Wedding Mastery
          </h2>
          <p className="text-sm text-slate-500">
            No pre-filled fictional numbers. You input your real wedding scale and the platform calculates everything.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black text-lg">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Register & Verify</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create an account with your couple names, wedding date, and real email address. Enter the 6-digit verification code to activate your private workspace.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Set Budget & Preferences</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define your financial cap, guest count, days, dining preferences, venue style, decor, and photography. The AI model instantly estimates category allocations.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-lg">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-lg">Track Real Expenses & RSVPs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Record actual vendor contracts, advance deposits, pending dues, scheduled ceremonies, guest headcounts, and export comprehensive PDF reports.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Comprehensive Suite of Wedding Tools
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to orchestrate multi-day weddings with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Cost Estimator</h4>
            <p className="text-xs text-slate-600">
              Dynamic category breakdown based on venue type, food preferences, decor themes, and photo styles.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Planned vs Actual Ledger</h4>
            <p className="text-xs text-slate-600">
              Track advances paid, pending balances, due dates, and remaining funds with zero confusion.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Vendor Comparison</h4>
            <p className="text-xs text-slate-600">
              Compare quotes side-by-side, verify package deliverables, and mark selected suppliers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Guest List & RSVPs</h4>
            <p className="text-xs text-slate-600">
              Group guests by family side, monitor dietary restrictions, and allocate rooms.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Multi-Day Ceremonies</h4>
            <p className="text-xs text-slate-600">
              Set budgets and timings for Mehendi, Sangeet, Pheras, and Reception events.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileDown className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">PDF Expense Reports</h4>
            <p className="text-xs text-slate-600">
              Generate formatted PDF financial dossiers with one click to share with family or planners.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="pt-6 text-center">
          <button
            onClick={onStartPlanning}
            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-rose-200 transition-all text-sm cursor-pointer"
          >
            Create Your Wedding Account Now →
          </button>
        </div>
      </section>
    </div>
  );
};
