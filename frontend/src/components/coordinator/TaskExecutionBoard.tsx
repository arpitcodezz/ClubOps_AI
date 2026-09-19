'use client';

import React, { useState } from 'react';
import { OperationalTask, TaskPriority } from '../../types/coordinator';

interface TaskExecutionBoardProps {
  initialTasks: OperationalTask[];
}

export const TaskExecutionBoard: React.FC<TaskExecutionBoardProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState<OperationalTask[]>(initialTasks);
  const [activeFilter, setActiveFilter] = useState<'all' | TaskPriority>('all');

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'Completed' ? 'In Progress' : 'Completed';
          const nextPriority = nextStatus === 'Completed' ? 'completed' : t.priority;
          return {
            ...t,
            status: nextStatus,
            priority: nextPriority,
          };
        }
        return t;
      })
    );
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'all') return true;
    return t.priority === activeFilter;
  });

  const urgentCount = tasks.filter((t) => t.priority === 'urgent' && t.status !== 'Completed').length;
  const upcomingCount = tasks.filter((t) => t.priority === 'upcoming' && t.status !== 'Completed').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <section id="tasks-section" className="space-y-4">
      {/* Section Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-stone-200/80 pb-3">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-stone-500 uppercase">
            • EXECUTION ROSTER
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-normal tracking-tight text-zinc-950 mt-1">
            Tasks &amp; Operational Milestones
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-stone-200/80 bg-white p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-zinc-950 text-white'
                : 'text-stone-600 hover:text-zinc-950 hover:bg-stone-50'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('urgent')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'urgent'
                ? 'bg-zinc-950 text-white'
                : 'text-stone-600 hover:text-zinc-950 hover:bg-stone-50'
            }`}
          >
            Urgent ({urgentCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('upcoming')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'upcoming'
                ? 'bg-zinc-950 text-white'
                : 'text-stone-600 hover:text-zinc-950 hover:bg-stone-50'
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('completed')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              activeFilter === 'completed'
                ? 'bg-zinc-950 text-white'
                : 'text-stone-600 hover:text-zinc-950 hover:bg-stone-50'
            }`}
          >
            Done ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-stone-200/70 rounded-2xl border border-stone-200/90 bg-white shadow-2xs overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-stone-500 font-sans">
            No tasks found matching current filter.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Completed';
            const isOverdue = task.status === 'Overdue';
            const isUrgent = task.priority === 'urgent' && !isDone;

            return (
              <div
                key={task.id}
                className={`flex items-start justify-between gap-4 p-4 sm:p-5 transition-colors ${
                  isDone ? 'bg-stone-50/40 opacity-70' : 'hover:bg-stone-50/60'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Status Checkbox Toggle */}
                  <button
                    type="button"
                    onClick={() => handleToggleTask(task.id)}
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      isDone
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-stone-300 bg-white hover:border-zinc-900'
                    }`}
                    aria-label={`Mark task as ${isDone ? 'incomplete' : 'complete'}`}
                  >
                    {isDone && <span className="text-[10px] leading-none">✓</span>}
                  </button>

                  {/* Task Content */}
                  <div className="space-y-1">
                    <p
                      className={`text-xs sm:text-sm font-medium leading-snug ${
                        isDone ? 'text-stone-400 line-through' : 'text-zinc-950'
                      }`}
                    >
                      {task.title}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                      <span className="font-medium text-stone-700">{task.eventName}</span>
                      <span className="text-stone-300">•</span>
                      <span>Owner: <strong className="font-medium text-zinc-900">{task.owner}</strong></span>
                      <span className="text-stone-300">•</span>
                      <span className={isOverdue ? 'text-rose-700 font-medium' : isUrgent ? 'text-amber-800 font-medium' : ''}>
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Priority / Status Badge */}
                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      isDone
                        ? 'bg-stone-100 text-stone-600'
                        : isOverdue
                        ? 'bg-rose-50 text-rose-800 ring-1 ring-rose-600/20'
                        : isUrgent
                        ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-600/20'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
