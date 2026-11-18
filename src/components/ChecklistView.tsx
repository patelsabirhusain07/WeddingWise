import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  Sparkles, 
  X,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChecklistItem } from '../types/wedding';

interface ChecklistViewProps {
  checklist: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onAddChecklist: (item: Omit<ChecklistItem, 'id'>) => void;
  onDeleteChecklist: (id: string) => void;
}

export const ChecklistView: React.FC<ChecklistViewProps> = ({
  checklist,
  onToggleChecklist,
  onAddChecklist,
  onDeleteChecklist,
}) => {
  const [selectedTimeline, setSelectedTimeline] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newItem, setNewItem] = useState<Omit<ChecklistItem, 'id'>>({
    title: '',
    category: 'General',
    timeline: '1-2 Months Before',
    isCompleted: false,
    assignedTo: '',
    dueDate: '',
  });

  const completedCount = checklist.filter((c) => c.isCompleted).length;
  const progressPct = Math.round((completedCount / (checklist.length || 1)) * 100);

  const timelines = [
    '6-12 Months Before',
    '4-6 Months Before',
    '2-3 Months Before',
    '1-2 Months Before',
    '1 Month Before',
    '2 Weeks Before',
    '1 Week Before',
    'Wedding Day',
  ];

  const handleToggle = (id: string, currentStatus: boolean) => {
    onToggleChecklist(id);
    if (!currentStatus) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e11d48', '#f59e0b', '#ec4899', '#10b981'],
      });
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim()) return;

    onAddChecklist(newItem);
    setIsAddOpen(false);
    setNewItem({
      title: '',
      category: 'General',
      timeline: '1-2 Months Before',
      isCompleted: false,
      assignedTo: '',
      dueDate: '',
    });
  };

  const filteredItems = checklist.filter(
    (item) => selectedTimeline === 'all' || item.timeline === selectedTimeline
  );

  return (
    <div className="space-y-6">
      {/* Header & Progress Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Master Wedding Roadmap</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Wedding Planning Checklist & Milestones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay on track from 12 months out all the way to the wedding day without missing any detail.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-slate-800">
            {completedCount} of {checklist.length} Tasks Accomplished
          </span>
          <span className="font-extrabold text-rose-600">{progressPct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Timeline Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedTimeline('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
            selectedTimeline === 'all'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Milestones ({checklist.length})
        </button>
        {timelines.map((phase) => {
          const count = checklist.filter((c) => c.timeline === phase).length;
          return (
            <button
              key={phase}
              onClick={() => setSelectedTimeline(phase)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-all ${
                selectedTimeline === phase
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {phase} ({count})
            </button>
          );
        })}
      </div>

      {/* Checklist items */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-3">
        {filteredItems.length === 0 ? (
          <p className="py-8 text-center text-slate-400 text-sm">
            No tasks listed under this timeline.
          </p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                item.isCompleted
                  ? 'bg-slate-50/60 border-slate-200 opacity-80'
                  : 'bg-white border-slate-200 hover:border-rose-300'
              }`}
            >
              <div
                className="flex items-start gap-3 flex-1 cursor-pointer"
                onClick={() => handleToggle(item.id, item.isCompleted)}
              >
                <button
                  type="button"
                  className={`mt-0.5 rounded-md p-0.5 transition-colors ${
                    item.isCompleted
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-300 hover:text-rose-500'
                  }`}
                >
                  {item.isCompleted ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-100" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div>
                  <h4
                    className={`text-sm font-semibold text-slate-900 leading-snug ${
                      item.isCompleted ? 'line-through text-slate-400' : ''
                    }`}
                  >
                    {item.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.timeline}
                    </span>
                    {item.assignedTo && (
                      <>
                        <span className="text-slate-400">•</span>
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {item.assignedTo}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onDeleteChecklist(item.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer ml-2"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add Checklist Milestone</h3>
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
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule final trial for bridal henna"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Catering, Attire, Legal"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Timeline Phase
                  </label>
                  <select
                    value={newItem.timeline}
                    onChange={(e) => setNewItem({ ...newItem, timeline: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    {timelines.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assign To (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Diya, Groom, Best Man"
                  value={newItem.assignedTo}
                  onChange={(e) => setNewItem({ ...newItem, assignedTo: e.target.value })}
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
