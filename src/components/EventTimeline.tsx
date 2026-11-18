import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Trash2, 
  Edit3, 
  X,
  Palette,
  Sparkles
} from 'lucide-react';
import { WeddingEvent } from '../types/wedding';

interface EventTimelineProps {
  events: WeddingEvent[];
  currency: string;
  onAddEvent: (event: Omit<WeddingEvent, 'id'>) => void;
  onUpdateEvent: (event: WeddingEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  currency,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<WeddingEvent | null>(null);

  const [newEvent, setNewEvent] = useState<Omit<WeddingEvent, 'id'>>({
    title: '',
    date: '2027-02-12',
    time: '11:00 AM - 03:00 PM',
    dayNumber: 1,
    venue: '',
    guestCount: 200,
    theme: '',
    dressCode: '',
    estimatedBudget: 250000,
    notes: '',
  });

  const sortedEvents = [...events].sort((a, b) => a.dayNumber - b.dayNumber);
  const totalEventBudgets = events.reduce((sum, e) => sum + e.estimatedBudget, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    onAddEvent(newEvent);
    setIsAddOpen(false);
    setNewEvent({
      title: '',
      date: '2027-02-12',
      time: '11:00 AM - 03:00 PM',
      dayNumber: 1,
      venue: '',
      guestCount: 200,
      theme: '',
      dressCode: '',
      estimatedBudget: 250000,
      notes: '',
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    onUpdateEvent(editingEvent);
    setEditingEvent(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Multi-Day Itinerary & Event Sequencing</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Wedding Events & Celebration Schedule
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure Mehendi, Sangeet, Pheras, and Reception with allocated budgets, dress codes, and guest counts.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Ceremony / Event</span>
        </button>
      </div>

      {/* Events Timeline Cards */}
      <div className="space-y-4">
        {sortedEvents.map((evt, idx) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:border-rose-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Left Col: Day Badge & Info */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-rose-600 text-white px-2.5 py-1 rounded-lg">
                  Day {evt.dayNumber}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {evt.date}
                </span>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {evt.time}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{evt.title}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span className="font-semibold text-slate-700">{evt.venue}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>{evt.guestCount} Expected Guests</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-bold text-slate-900">
                    Allocated: {currency} {evt.estimatedBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              {evt.theme && (
                <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-2">
                  <Palette className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Theme:</span> {evt.theme}
                    {evt.dressCode && (
                      <span className="ml-2 pl-2 border-l border-slate-200">
                        <strong className="text-slate-800">Dress Code:</strong> {evt.dressCode}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {evt.notes && (
                <p className="text-[11px] text-slate-500 italic mt-1">
                  Highlights: {evt.notes}
                </p>
              )}
            </div>

            {/* Right Col: Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => setEditingEvent(evt)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                title="Edit Ceremony"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteEvent(evt.id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title="Delete Ceremony"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Ceremony Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Ceremony / Event</h3>
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
                  Ceremony / Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Traditional Haldi & Chuda Ceremony"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newEvent.dayNumber}
                    onChange={(e) => setNewEvent({ ...newEvent, dayNumber: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Timings
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 05:00 PM - 10:00 PM"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Poolside Lawns"
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newEvent.guestCount}
                    onChange={(e) => setNewEvent({ ...newEvent, guestCount: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Allocated Budget ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newEvent.estimatedBudget}
                    onChange={(e) => setNewEvent({ ...newEvent, estimatedBudget: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aesthetic Theme
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Yellow Marigold Bohemia"
                    value={newEvent.theme}
                    onChange={(e) => setNewEvent({ ...newEvent, theme: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Suggested Dress Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shades of Mustard & Coral"
                    value={newEvent.dressCode}
                    onChange={(e) => setNewEvent({ ...newEvent, dressCode: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ceremony Notes & Special Arrangements
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Flower petal shower during entry, floral jewelry for bride"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
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
                  Save Ceremony
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ceremony Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Ceremony Details</h3>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ceremony / Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Day Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingEvent.dayNumber}
                    onChange={(e) => setEditingEvent({ ...editingEvent, dayNumber: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editingEvent.date}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Timings
                  </label>
                  <input
                    type="text"
                    value={editingEvent.time}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={editingEvent.venue}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    value={editingEvent.guestCount}
                    onChange={(e) => setEditingEvent({ ...editingEvent, guestCount: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Budget ({currency})
                  </label>
                  <input
                    type="number"
                    value={editingEvent.estimatedBudget}
                    onChange={(e) => setEditingEvent({ ...editingEvent, estimatedBudget: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Theme & Dress Code
                </label>
                <input
                  type="text"
                  value={editingEvent.theme}
                  onChange={(e) => setEditingEvent({ ...editingEvent, theme: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Update Ceremony
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
