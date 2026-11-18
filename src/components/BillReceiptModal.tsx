import React from 'react';
import { 
  X, 
  FileText, 
  Printer, 
  Download, 
  CheckCircle, 
  Clock, 
  Building, 
  Calendar,
  CreditCard,
  User,
  MapPin
} from 'lucide-react';
import { ExpenseItem, WeddingParameters, WeddingEvent } from '../types/wedding';
import { CATEGORY_LABELS } from '../utils/budgetCalculations';

interface BillReceiptModalProps {
  item: ExpenseItem;
  params: WeddingParameters;
  event?: WeddingEvent;
  onClose: () => void;
}

export const BillReceiptModal: React.FC<BillReceiptModalProps> = ({
  item,
  params,
  event,
  onClose,
}) => {
  const currency = params.currency || '₹';
  const pending = item.actualCost - item.advancePaid;
  const catInfo = CATEGORY_LABELS[item.category] || {
    name: item.category,
    badgeBg: 'bg-slate-100 text-slate-800',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative print:p-0 print:border-none print:shadow-none">
        {/* Top Actions: Close & Print */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Official Expense Voucher & Invoice
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Voucher</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="mt-4 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-800 pb-5">
            <div>
              <h1 className="text-2xl font-black text-rose-600 tracking-tight">WeddingWise</h1>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                Wedding Financial Voucher
              </p>
              <div className="mt-2 text-xs text-slate-600">
                <p className="font-bold text-slate-800">{params.coupleName || 'Wedding Account'}</p>
                {params.city && <p>{params.city}</p>}
                {params.weddingDate && <p>Date: {params.weddingDate}</p>}
              </div>
            </div>

            <div className="sm:text-right text-xs text-slate-500 space-y-1">
              <div>
                <span className="font-bold text-slate-700">VOUCHER ID: </span>
                <span className="font-mono text-slate-900 font-bold uppercase">{item.id}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">ISSUED DATE: </span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              {item.dueDate && (
                <div>
                  <span className="font-bold text-rose-600">SETTLEMENT DUE: </span>
                  <span className="font-bold text-rose-700">{item.dueDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Vendor & Category Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Vendor / Service Merchant
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {item.vendorName || 'Independent Vendor / Direct Booking'}
              </p>
              <span className={`inline-block mt-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${catInfo.badgeBg}`}>
                {catInfo.name}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ceremony / Event Assigned
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {event ? `Day ${event.dayNumber}: ${event.title}` : 'Entire Wedding (Master Scope)'}
              </p>
              {event?.venue && (
                <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>{event.venue}</span>
                </p>
              )}
            </div>
          </div>

          {/* Item Description & Notes */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Service / Bill Description
            </span>
            <div className="text-base font-bold text-slate-900 bg-white p-3 rounded-xl border border-slate-200">
              {item.title}
            </div>
            {item.notes && (
              <p className="text-xs text-slate-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200/50 mt-2 leading-relaxed">
                <strong>Contract / Payment Notes:</strong> {item.notes}
              </p>
            )}
          </div>

          {/* Detailed Financial Calculation Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Financial Metric</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-medium text-slate-600">Initial Estimated Allocation</td>
                  <td className="p-3 text-right font-semibold text-slate-800">
                    {currency} {item.estimatedCost.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-slate-50/50 font-bold text-slate-900">
                  <td className="p-3">Final Contract / Actual Bill Amount</td>
                  <td className="p-3 text-right text-sm text-slate-900">
                    {currency} {item.actualCost.toLocaleString()}
                  </td>
                </tr>
                <tr className="text-emerald-700">
                  <td className="p-3 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Advance Deposit Paid</span>
                  </td>
                  <td className="p-3 text-right font-bold text-sm">
                    {currency} {item.advancePaid.toLocaleString()}
                  </td>
                </tr>
                <tr className="bg-amber-50/60 text-amber-900 font-bold">
                  <td className="p-3 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Outstanding / Pending Balance</span>
                  </td>
                  <td className="p-3 text-right text-base text-amber-700">
                    {currency} {pending.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Payment Status Bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Current Payment Status
              </span>
              <div className="text-sm font-extrabold capitalize mt-0.5">
                {item.status.replace('_', ' ')}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Percentage Settled
              </span>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {item.actualCost > 0 ? Math.round((item.advancePaid / item.actualCost) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-400 text-center mt-6">
          This digital bill receipt is generated by WeddingWise. Official records maintained in your personal workspace.
        </p>
      </div>
    </div>
  );
};
