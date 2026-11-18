import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Search, 
  Mail, 
  Phone, 
  Trash2, 
  Edit3, 
  X,
  Send,
  Hotel
} from 'lucide-react';
import { Guest, WeddingEvent } from '../types/wedding';

interface GuestListRSVPProps {
  guests: Guest[];
  events: WeddingEvent[];
  targetGuestCount: number;
  onAddGuest: (guest: Omit<Guest, 'id'>) => void;
  onUpdateGuestStatus: (id: string, status: Guest['rsvpStatus']) => void;
  onDeleteGuest: (id: string) => void;
}

export const GuestListRSVP: React.FC<GuestListRSVPProps> = ({
  guests,
  events,
  targetGuestCount,
  onAddGuest,
  onUpdateGuestStatus,
  onDeleteGuest,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sideFilter, setSideFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newGuest, setNewGuest] = useState<Omit<Guest, 'id'>>({
    name: '',
    side: 'mutual',
    relation: 'Friend',
    phone: '',
    email: '',
    rsvpStatus: 'attending',
    eventsInvited: events.map((e) => e.id),
    plusOnes: 0,
    dietaryNotes: '',
    tableOrRoom: '',
  });

  // RSVP metrics
  const totalHeads = guests.reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const attendingHeads = guests
    .filter((g) => g.rsvpStatus === 'attending')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const tentativeHeads = guests
    .filter((g) => g.rsvpStatus === 'tentative')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);
  const declinedHeads = guests
    .filter((g) => g.rsvpStatus === 'not_attending')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.tableOrRoom && g.tableOrRoom.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSide = sideFilter === 'all' || g.side === sideFilter;
    const matchesStatus = statusFilter === 'all' || g.rsvpStatus === statusFilter;
    return matchesSearch && matchesSide && matchesStatus;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;

    onAddGuest(newGuest);
    setIsAddOpen(false);
    setNewGuest({
      name: '',
      side: 'mutual',
      relation: 'Friend',
      phone: '',
      email: '',
      rsvpStatus: 'attending',
      eventsInvited: events.map((ev) => ev.id),
      plusOnes: 0,
      dietaryNotes: '',
      tableOrRoom: '',
    });
  };

  const handleToggleEventInvite = (eventId: string) => {
    setNewGuest((prev) => {
      const exists = prev.eventsInvited.includes(eventId);
      return {
        ...prev,
        eventsInvited: exists
          ? prev.eventsInvited.filter((id) => id !== eventId)
          : [...prev.eventsInvited, eventId],
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Attendance & Hospitality Matrix</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Guest List, RSVPs & Room Allocations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track family sides, dietary requirements, confirmed headcounts, and assigned hotel rooms.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer text-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Guest / Family</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Confirmed Attendees</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{attendingHeads}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Target: {targetGuestCount} Capacity</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Tentative / Pending</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{tentativeHeads}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Awaiting phone follow-up</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Declined / Regrets</span>
          <div className="text-2xl font-black text-rose-600 mt-1">{declinedHeads}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Not attending</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <span className="text-[11px] font-semibold uppercase text-slate-500">Total In Invitations</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalHeads}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">{guests.length} invitation entries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search guest name, relation, or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={sideFilter}
          onChange={(e) => setSideFilter(e.target.value)}
          className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 bg-white"
        >
          <option value="all">All Sides</option>
          <option value="bride">Bride’s Side</option>
          <option value="groom">Groom’s Side</option>
          <option value="mutual">Mutual Friends</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 bg-white"
        >
          <option value="all">All RSVP Statuses</option>
          <option value="attending">Confirmed Attending</option>
          <option value="tentative">Tentative</option>
          <option value="invited">Invited (No reply)</option>
          <option value="not_attending">Declined</option>
        </select>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <th className="py-3.5 px-4">Guest / Family</th>
                <th className="py-3.5 px-3">Affiliation</th>
                <th className="py-3.5 px-3 text-center">Party Size</th>
                <th className="py-3.5 px-3">Room / Table</th>
                <th className="py-3.5 px-3">Dietary / Notes</th>
                <th className="py-3.5 px-3 text-center">RSVP Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No guests found matching the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  const totalCount = 1 + (guest.plusOnes || 0);

                  return (
                    <tr key={guest.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 leading-snug">{guest.name}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{guest.relation}</span>
                          {guest.phone && <span>• {guest.phone}</span>}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            guest.side === 'bride'
                              ? 'bg-pink-100 text-pink-700'
                              : guest.side === 'groom'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}
                        >
                          {guest.side}’s side
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-slate-800 whitespace-nowrap">
                        {totalCount} {totalCount > 1 ? `(${guest.plusOnes} +1s)` : ''}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                        {guest.tableOrRoom ? (
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                            <Hotel className="w-3.5 h-3.5 text-rose-500" />
                            <span>{guest.tableOrRoom}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-xs text-slate-600 max-w-[200px]">
                        {guest.dietaryNotes ? (
                          <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md text-[11px] font-medium inline-block truncate max-w-full">
                            {guest.dietaryNotes}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <select
                          value={guest.rsvpStatus}
                          onChange={(e) => onUpdateGuestStatus(guest.id, e.target.value as any)}
                          className={`text-[11px] font-bold uppercase px-2 py-1 rounded-lg border-0 cursor-pointer focus:ring-2 focus:ring-rose-500 ${
                            guest.rsvpStatus === 'attending'
                              ? 'bg-emerald-100 text-emerald-800'
                              : guest.rsvpStatus === 'tentative'
                              ? 'bg-amber-100 text-amber-800'
                              : guest.rsvpStatus === 'not_attending'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <option value="attending">Attending</option>
                          <option value="tentative">Tentative</option>
                          <option value="invited">Invited</option>
                          <option value="not_attending">Declined</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onDeleteGuest(guest.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                          title="Remove guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Guest Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Guest / Party</h3>
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
                  Primary Guest / Family Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Priya Patel"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Side
                  </label>
                  <select
                    value={newGuest.side}
                    onChange={(e) => setNewGuest({ ...newGuest, side: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="bride">Bride’s Family / Friends</option>
                    <option value="groom">Groom’s Family / Friends</option>
                    <option value="mutual">Mutual Friends & Colleagues</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maternal Uncle, College Friend"
                    value={newGuest.relation}
                    onChange={(e) => setNewGuest({ ...newGuest, relation: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newGuest.phone}
                    onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Plus-Ones / Family Members
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={newGuest.plusOnes}
                    onChange={(e) => setNewGuest({ ...newGuest, plusOnes: Number(e.target.value) })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={newGuest.rsvpStatus}
                    onChange={(e) => setNewGuest({ ...newGuest, rsvpStatus: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="attending">Confirmed Attending</option>
                    <option value="tentative">Tentative</option>
                    <option value="invited">Invited (Awaiting)</option>
                    <option value="not_attending">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Room / Table Allocation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Room 204 - Heritage Wing"
                    value={newGuest.tableOrRoom}
                    onChange={(e) => setNewGuest({ ...newGuest, tableOrRoom: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dietary Preferences / Special Assistance
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jain food only, Wheelchair access needed"
                  value={newGuest.dietaryNotes}
                  onChange={(e) => setNewGuest({ ...newGuest, dietaryNotes: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Event checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Invited to Events:
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {events.map((evt) => (
                    <label key={evt.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newGuest.eventsInvited.includes(evt.id)}
                        onChange={() => handleToggleEventInvite(evt.id)}
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span>Day {evt.dayNumber}: {evt.title}</span>
                    </label>
                  ))}
                </div>
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
                  Add Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
