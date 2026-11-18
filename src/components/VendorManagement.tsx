import React, { useState } from 'react';
import { 
  Store, 
  Plus, 
  Star, 
  Phone, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  Search, 
  ArrowUpDown,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { VendorQuote, ExpenseCategory } from '../types/wedding';
import { CATEGORY_LABELS } from '../utils/budgetCalculations';

interface VendorManagementProps {
  vendors: VendorQuote[];
  currency: string;
  onAddVendor: (vendor: Omit<VendorQuote, 'id'>) => void;
  onUpdateVendorStatus: (id: string, status: VendorQuote['status']) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorManagement: React.FC<VendorManagementProps> = ({
  vendors,
  currency,
  onAddVendor,
  onUpdateVendorStatus,
  onDeleteVendor,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newVendor, setNewVendor] = useState<Omit<VendorQuote, 'id'>>({
    vendorId: '',
    vendorName: '',
    category: 'venue',
    quotedAmount: 100000,
    packageDetails: '',
    contactNumber: '',
    email: '',
    rating: 5,
    status: 'in_discussion',
    notes: '',
  });

  const filteredVendors = vendors.filter((v) => {
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch =
      v.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.packageDetails.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Group vendors by category for direct comparison
  const groupedByCategory = filteredVendors.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, VendorQuote[]>);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendor.vendorName.trim()) return;

    onAddVendor({
      ...newVendor,
      vendorId: newVendor.vendorName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    });

    setIsAddOpen(false);
    setNewVendor({
      vendorId: '',
      vendorName: '',
      category: 'venue',
      quotedAmount: 100000,
      packageDetails: '',
      contactNumber: '',
      email: '',
      rating: 5,
      status: 'in_discussion',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
            <Store className="w-3.5 h-3.5" />
            <span>Vendor Directory & Quotation Matrix</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Vendor Quotations & Contract Comparison
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare bids side-by-side, verify inclusions, check reviews, and mark selected suppliers.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vendor Quote</span>
        </button>
      </div>

      {/* Filter and Category tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative min-w-[240px] flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor or package specifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-rose-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Vendors ({vendors.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => {
            const count = vendors.filter((v) => v.category === catKey).length;
            if (count === 0 && selectedCategory !== catKey) return null;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedCategory === catKey
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {info.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Sections Grouped By Category */}
      <div className="space-y-6">
        {Object.keys(groupedByCategory).length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 text-slate-400">
            No vendor quotes recorded for this selection. Click "Add Vendor Quote" to record one.
          </div>
        ) : (
          Object.entries(groupedByCategory).map(([catKey, categoryVendors]) => {
            const catInfo = CATEGORY_LABELS[catKey as ExpenseCategory] || {
              name: catKey,
              color: '#e11d48',
              badgeBg: 'bg-rose-100 text-rose-700',
            };

            return (
              <div key={catKey} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: catInfo.color }} />
                    <h2 className="text-lg font-bold text-slate-900">{catInfo.name} Quotes</h2>
                    <span className="text-xs text-slate-400">({categoryVendors.length} options compared)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryVendors.map((vendor) => {
                    const isSelected = vendor.status === 'selected';
                    const isRejected = vendor.status === 'rejected';

                    return (
                      <div
                        key={vendor.id}
                        className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/20 shadow-xs'
                            : isRejected
                            ? 'border-slate-200 bg-slate-50/60 opacity-75'
                            : 'border-slate-200 bg-white hover:border-rose-300'
                        }`}
                      >
                        <div>
                          {/* Top Tag & Rating */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : vendor.status === 'backup'
                                  ? 'bg-indigo-100 text-indigo-800'
                                  : isRejected
                                  ? 'bg-slate-200 text-slate-600 line-through'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {vendor.status.replace('_', ' ')}
                            </span>

                            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>{vendor.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                            {vendor.vendorName}
                          </h3>

                          {/* Price */}
                          <div className="mt-2 text-xl font-extrabold text-slate-900">
                            {currency} {vendor.quotedAmount.toLocaleString()}
                          </div>

                          {/* Package Inclusions */}
                          <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                            {vendor.packageDetails}
                          </p>

                          {/* Notes */}
                          {vendor.notes && (
                            <p className="mt-2 text-[11px] text-slate-500 italic">
                              Note: {vendor.notes}
                            </p>
                          )}

                          {/* Contact Info */}
                          <div className="mt-4 space-y-1 text-xs text-slate-600 border-t border-slate-100 pt-3">
                            {vendor.contactNumber && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                <span>{vendor.contactNumber}</span>
                              </div>
                            )}
                            {vendor.email && (
                              <div className="flex items-center gap-2 truncate">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{vendor.email}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status switcher action buttons */}
                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onUpdateVendorStatus(vendor.id, 'selected')}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                              }`}
                            >
                              Select
                            </button>
                            <button
                              onClick={() => onUpdateVendorStatus(vendor.id, 'backup')}
                              className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                            >
                              Backup
                            </button>
                            <button
                              onClick={() => onUpdateVendorStatus(vendor.id, 'rejected')}
                              className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>

                          <button
                            onClick={() => onDeleteVendor(vendor.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                            title="Remove Quotation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Vendor Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Vendor Quotation</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor / Business Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dreamscape Sound & Lightings"
                  value={newVendor.vendorName}
                  onChange={(e) => setNewVendor({ ...newVendor, vendorName: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Category
                  </label>
                  <select
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as ExpenseCategory })}
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
                    Quoted Amount ({currency}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newVendor.quotedAmount}
                    onChange={(e) => setNewVendor({ ...newVendor, quotedAmount: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Package Details & Deliverables *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. 2 DJ sets, line array sound, truss lighting, smoke machines, 4 hours continuous music."
                  value={newVendor.packageDetails}
                  onChange={(e) => setNewVendor({ ...newVendor, packageDetails: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={newVendor.contactNumber}
                    onChange={(e) => setNewVendor({ ...newVendor, contactNumber: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rating (1 - 5 Stars)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={newVendor.rating}
                    onChange={(e) => setNewVendor({ ...newVendor, rating: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={newVendor.status}
                  onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value as any })}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="in_discussion">In Discussion</option>
                  <option value="selected">Selected (Official Partner)</option>
                  <option value="backup">Backup Option</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Willing to give 10% discount if advance paid by end of week."
                  value={newVendor.notes}
                  onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Save Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
