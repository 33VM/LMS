import React from 'react';
import { LayoutDashboard, Book, Users, Repeat, Sparkles, Library } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'BOOKS', label: 'Books Catalog', icon: Book },
    { id: 'STUDENTS', label: 'Students', icon: Users },
    { id: 'CIRCULATION', label: 'Circulation', icon: Repeat },
    { id: 'AI_LIBRARIAN', label: 'AI Librarian', icon: Sparkles },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full shadow-xl">
      <div className="p-6 flex items-center gap-3 border-b border-slate-700">
        <div className="p-2 bg-indigo-500 rounded-lg">
            <Library size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Athena</h1>
          <p className="text-xs text-slate-400">School Library Manager</p>
        </div>
      </div>
      
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-xs text-slate-400 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-400">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};
