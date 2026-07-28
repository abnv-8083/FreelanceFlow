import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { CalendarEvent } from '../../../types';
import { Badge } from '../../common/Badge';
import { Modal } from '../../common/Modal';
import { Calendar as CalendarIcon, Plus, Video, Clock, CheckCircle2, VideoOff } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { calendarEvents, clients, projects, addCalendarEvent } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Event Form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-07-30');
  const [time, setTime] = useState('11:00 AM');
  const [type, setType] = useState<'Meeting' | 'Deadline' | 'Invoice Due' | 'Task'>('Meeting');
  const [meetingLink, setMeetingLink] = useState('https://zoom.us/j/9988776655');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCalendarEvent({
      title: title.trim(),
      date,
      time,
      type,
      meetingLink: type === 'Meeting' ? meetingLink : undefined,
      status: 'Scheduled'
    });

    setTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-7 h-7 text-accent-500" />
            Integrated Calendar & Meetings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Google Calendar & Zoom sync simulation for client calls, task deadlines, and invoice dues.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-500/25 hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Meeting / Event</span>
        </button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {calendarEvents.map(evt => (
          <div
            key={evt.id}
            className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-4 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between">
              <Badge variant={evt.type === 'Meeting' ? 'purple' : evt.type === 'Deadline' ? 'rose' : 'emerald'}>
                {evt.type}
              </Badge>

              <span className="text-xs font-mono font-bold text-slate-400">
                {evt.time || 'All Day'}
              </span>
            </div>

            <div>
              <div className="text-xs font-mono font-bold text-accent-500 mb-1">{evt.date}</div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {evt.title}
              </h3>
              {evt.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {evt.description}
                </p>
              )}
            </div>

            {evt.meetingLink && (
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <a
                  href={evt.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-purple-500 text-white font-bold text-xs shadow hover:bg-purple-600 transition-colors flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Zoom Meeting</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Schedule Meeting Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Meeting / Calendar Event"
        subtitle="Generates video call links and sends reminders"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Nexus Sprint Alignment Call"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Event Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Time
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="11:00 AM"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Event Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white"
              >
                <option value="Meeting">Zoom / Meet Call</option>
                <option value="Deadline">Project Deadline</option>
                <option value="Invoice Due">Invoice Due</option>
                <option value="Task">Task</option>
              </select>
            </div>

            {type === 'Meeting' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Zoom / Meet Link
                </label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none text-slate-900 dark:text-white font-mono"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold bg-accent-500 text-white shadow-lg shadow-accent-500/25 hover:bg-accent-600"
            >
              Schedule Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
