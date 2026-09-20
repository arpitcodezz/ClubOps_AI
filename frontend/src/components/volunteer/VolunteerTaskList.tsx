'use client';

import React, { useState } from 'react';
import { VolunteerTask, TaskPriority } from '../../types/volunteer';

interface VolunteerTaskListProps {
  tasks: VolunteerTask[];
  onToggleTask: (taskId: string) => void;
}

export const VolunteerTaskList: React.FC<VolunteerTaskListProps> = ({
  tasks,
  onToggleTask,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | TaskPriority>('all');

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    return task.priority === activeFilter;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-800 ring-rose-200/70';
      case 'upcoming':
        return 'bg-amber-50 text-amber-800 ring-amber-200/70';
      case 'completed':
        return 'bg-emerald-50 text-emerald-800 ring-emerald-200/70';
    }
  };

  const getCount = (priority: 'all' | TaskPriority) => {
    if (priority === 'all') return tasks.length;
    return tasks.filter((t) => t.priority === priority).length;
  };

  return (
    <section className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/70 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            • CHECKLIST
          </span>
          <h2 className="font-serif text-2xl font-normal text-zinc-950 tracking-tight mt-1">
            My Action Items
          </h2>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100/80 border border-stone-200/60 text-xs font-medium">
          {(['all', 'urgent', 'upcoming', 'completed'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all cursor-pointer capitalize ${
                  isActive
                    ? 'bg-white text-zinc-950 shadow-2xs font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    isActive ? 'bg-zinc-100 text-zinc-800' : 'text-zinc-400'
                  }`}
                >
                  {getCount(filter)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="divide-y divide-stone-200/70 rounded-2xl border border-stone-200/80 bg-white overflow-hidden shadow-2xs">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-sm text-zinc-500">
            No tasks found in this category.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className="flex items-start gap-4 p-4 sm:p-5 hover:bg-stone-50/70 transition-colors group"
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all cursor-pointer ${
                    isDone
                      ? 'bg-zinc-950 border-zinc-950 text-white'
                      : 'border-stone-300 bg-white hover:border-zinc-950'
                  }`}
                >
                  {isDone && (
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>

                {/* Task Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`text-sm font-medium ${
                        isDone ? 'text-zinc-400 line-through' : 'text-zinc-950'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span className="font-medium text-zinc-800">{task.eventName}</span>
                    <span>•</span>
                    <span>Due: {task.dueDate} at {task.dueTime}</span>
                    {task.location && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-[200px]">{task.location}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>By: {task.assignedBy}</span>
                  </div>
                </div>

                {/* Priority Badge */}
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset capitalize ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
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
