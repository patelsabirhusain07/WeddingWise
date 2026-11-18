import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye,
  FileText,
  Calendar,
  X,
  CreditCard,
  Clock,
  CheckCircle,
  Building2,
  DollarSign,
  Printer
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, WeddingEvent, WeddingParameters } from '../types/wedding';
import { CATEGORY_LABELS } from '../utils/budgetCalculations';
import { BillReceiptModal } from './BillReceiptModal';

interface ExpenseTrackerProps {
  expenses: ExpenseItem[];
  events: WeddingEvent[];
  currency: string;
  totalBudget: number;
  params: WeddingParameters;
  onAddExpense: (item: Omit<ExpenseItem, 'id'>) => void;
  onUpdateExpense: (item: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  events,
  currency,
  totalBudget,
  params,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Selected item for viewing complete bill receipt
  const [viewingBillItem, setViewingBillItem] = useState<ExpenseItem | null>(null);

  // Edit State
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  // New item modal form state
  const [newItem, setNewItem] = useState<Omit<ExpenseItem, 'id'>>({
    title: '',
    category: 'venue',
    eventId: 'all',
    estimatedCost: 0,
    actualCost: 0,
    advancePaid: 0,
    vendorName: '',
    dueDate: '',
    notes: '',
    status: 'planned',
  });

  // Calculate totals
  const totalEstimated = expenses.reduce((sum, e) => sum + e.estimatedCost, 0);
  const totalActual = expenses.reduce((sum, e) => sum + e.actualCost, 0);
  const totalAdvance = expenses.reduce((sum, e) => sum + e.advancePaid, 0);
  const totalPending = totalActual - totalAdvance;

  // Filtered List
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesEvent = eventFilter === 'all' || item.eventId === eventFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesEvent;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    let computedStatus: ExpenseItem['status'] = 'planned';
    if (newItem.advancePaid >= newItem.actualCost && newItem.actualCost > 0) {
      computedStatus = 'paid_in_full';
    } else if (newItem.advancePaid > 0) {
      computedStatus = 'partially_paid';
    }

    onAddExpense({
      ...newItem,
      status: computedStatus,
    });

    setIsAddModalOpen(false);
    setNewItem({
      title: '',
      category: 'venue',
      eventId: 'all',
      estimatedCost: 0,
      actualCost: 0,
      advancePaid: 0,
      vendorName: '',
      dueDate: '',
      notes: '',
      status: 'planned',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let computedStatus: ExpenseItem['status'] = 'planned';
    if (editingItem.advancePaid >= editingItem.actualCost && editingItem.actualCost > 0) {
      computedStatus = 'paid_in_full';
    } else if (editingItem.advancePaid > 0) {
      computedStatus = 'partially_paid';
    }

    onUpdateExpense({
      ...editingItem,
      status: computedStatus,
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Quick Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Bill & Invoice Ledger</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bills, Expenses & Advance Payments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View detailed bill vouchers, track deposits, monitor due dates, and print invoices.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Invoice Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              Table View
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Bill / Expense</span>
          </button>
        </div>
      </div>

      {/* Mini KPI Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="p-3 bg-slate-50 rounded-xl">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Total Planned</span>
          <div className="text-lg font-bold text-slate-900 mt-0.5">
            {currency} {totalEstimated.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-rose-50/50 rounded-xl">
          <span className="text-[11px] font-semibold uppercase text-rose-600">Total Actual Bills</span>
          <div className="text-lg font-bold text-rose-700 mt-0.5">
            {currency} {totalActual.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-emerald-50/50 rounded-xl">
          <span className="text-[11px] font-semibold uppercase text-emerald-600">Advances Settled</span>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">
            {currency} {totalAdvance.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-amber-50/50 rounded-xl">
          <span className="text-[11px] font-semibold uppercase text-amber-600">Pending Balances</span>
          <div className="text-lg font-bold text-amber-700 mt-0.5">
            {currency} {totalPending.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by bill title or vendor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 bg-white"
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => (
            <option key={catKey} value={catKey}>
              {info.name}
            </option>
          ))}
        </select>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 bg-white"
        >
          <option value="all">All Events</option>
          <option value="all">Entire Wedding (Shared)</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              Day {evt.dayNumber}: {evt.title}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="planned">Planned (Unpaid)</option>
          <option value="partially_paid">Partially Paid</option>
          <option value="paid_in_full">Paid in Full</option>
        </select>
      </div>

      {/* VIEW 1: DETAILED BILL CARDS (Clean, highly visible layout) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100 text-slate-400">
              No bills found. Click "Add Bill / Expense" to create one.
            </div>
          ) : (
            filteredExpenses.map((item) => {
              const pending = item.actualCost - item.advancePaid;
              const catInfo = CATEGORY_LABELS[item.category] || {
                name: item.category,
                badgeBg: 'bg-slate-100 text-slate-700',
              };
              const eventObj = events.find((e) => e.id === item.eventId);
              const eventName = eventObj ? `Day ${eventObj.dayNumber}: ${eventObj.title}` : 'Entire Wedding';
              const percentSettled = item.actualCost > 0 ? Math.round((item.advancePaid / item.actualCost) * 100) : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-rose-300 hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${catInfo.badgeBg}`}>
                        {catInfo.name}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          item.status === 'paid_in_full'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'partially_paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Bill Title & Vendor */}
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Vendor: <strong className="text-slate-700">{item.vendorName || 'Not Assigned'}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Scope: {eventName}
                      </p>
                    </div>

                    {/* Financial Snapshot Box */}
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">Actual Bill Total:</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {currency} {item.actualCost.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Advance Settled:</span>
                        </span>
                        <span className="font-bold text-emerald-700">
                          {currency} {item.advancePaid.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs border-t border-slate-200/60 pt-1.5">
                        <span className="text-amber-800 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending Balance:</span>
                        </span>
                        <span className="font-black text-amber-700 text-sm">
                          {currency} {pending.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Payment */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Paid: {percentSettled}%</span>
                        {item.dueDate && <span>Due: {item.dueDate}</span>}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            percentSettled >= 100 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, percentSettled)}%` }}
                        />
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-xs text-slate-500 italic bg-amber-50/40 p-2 rounded-lg border border-amber-100 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setViewingBillItem(item)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Full Bill</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteExpense(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Bill"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW 2: TRADITIONAL FULL TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                  <th className="py-3.5 px-4">Item & Details</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Associated Event</th>
                  <th className="py-3.5 px-3 text-right">Planned Est.</th>
                  <th className="py-3.5 px-3 text-right">Actual Cost</th>
                  <th className="py-3.5 px-3 text-right">Advance Paid</th>
                  <th className="py-3.5 px-3 text-right">Pending</th>
                  <th className="py-3.5 px-3 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      No expense items match your search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((item) => {
                    const pending = item.actualCost - item.advancePaid;
                    const catInfo = CATEGORY_LABELS[item.category] || {
                      name: item.category,
                      badgeBg: 'bg-slate-100 text-slate-700',
                    };
                    const eventObj = events.find((e) => e.id === item.eventId);
                    const eventName = eventObj ? eventObj.title : 'Entire Wedding';

                    return (
                      <tr key={item.id} className="hover:bg-rose-50/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 leading-snug">{item.title}</div>
                          {item.vendorName && (
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              Vendor: <strong className="text-slate-700">{item.vendorName}</strong>
                            </div>
                          )}
                          {item.notes && (
                            <div className="text-[11px] text-slate-400 italic line-clamp-1 mt-0.5">
                              {item.notes}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md ${catInfo.badgeBg}`}>
                            {catInfo.name}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-600">
                          {eventName}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-slate-500 whitespace-nowrap">
                          {currency} {item.estimatedCost.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                          {currency} {item.actualCost.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right font-medium text-emerald-600 whitespace-nowrap">
                          {currency} {item.advancePaid.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold text-amber-600 whitespace-nowrap">
                          {currency} {pending.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              item.status === 'paid_in_full'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'partially_paid'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setViewingBillItem(item)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="View Official Bill Receipt"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                              title="Edit Expense"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteExpense(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                              title="Delete Expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bill Receipt Modal (When user clicks View Bill) */}
      {viewingBillItem && (
        <BillReceiptModal
          item={viewingBillItem}
          params={params}
          event={events.find((e) => e.id === viewingBillItem.eventId)}
          onClose={() => setViewingBillItem(null)}
        />
      )}

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add New Bill / Expense Item</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding Cake & Dessert Tier"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as ExpenseCategory })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event
                  </label>
                  <select
                    value={newItem.eventId}
                    onChange={(e) => setNewItem({ ...newItem, eventId: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="all">Entire Wedding (Shared)</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        Day {e.dayNumber}: {e.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItem.estimatedCost}
                    onChange={(e) => setNewItem({ ...newItem, estimatedCost: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Actual Bill Cost ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItem.actualCost}
                    onChange={(e) => setNewItem({ ...newItem, actualCost: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Advance Paid ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newItem.advancePaid}
                    onChange={(e) => setNewItem({ ...newItem, advancePaid: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vendor / Merchant Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Confectionery"
                    value={newItem.vendorName}
                    onChange={(e) => setNewItem({ ...newItem, vendorName: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={newItem.dueDate}
                    onChange={(e) => setNewItem({ ...newItem, dueDate: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes & Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 50% balance payable upon setup completion on the wedding morning."
                  value={newItem.notes}
                  onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Expense Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Bill / Expense</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as ExpenseCategory })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Event
                  </label>
                  <select
                    value={editingItem.eventId}
                    onChange={(e) => setEditingItem({ ...editingItem, eventId: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="all">Entire Wedding (Shared)</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        Day {e.dayNumber}: {e.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.estimatedCost}
                    onChange={(e) => setEditingItem({ ...editingItem, estimatedCost: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Actual Bill ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.actualCost}
                    onChange={(e) => setEditingItem({ ...editingItem, actualCost: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Advance Paid ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.advancePaid}
                    onChange={(e) => setEditingItem({ ...editingItem, advancePaid: Number(e.target.value) })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 font-medium text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vendor / Merchant Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.vendorName || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, vendorName: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={editingItem.dueDate || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, dueDate: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={editingItem.notes || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Update Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
