
import React from 'react';
import { FileCode, Zap, ShieldCheck, Database, Server } from 'lucide-react';

const TEMPLATES = [
  { id: '1', title: 'Folder Cleanup', icon: Zap, prompt: 'A function that deletes files older than X days in a specific folder.' },
  { id: '2', title: 'AD User Audit', icon: ShieldCheck, prompt: 'A function that gets all Active Directory users who havent logged in for 90 days.' },
  { id: '3', title: 'SQL Connection', icon: Database, prompt: 'An advanced function to execute a SQL query and return results as a custom object.' },
  { id: '4', title: 'Rest API Client', icon: Server, prompt: 'A function to call a REST API with Bearer token authentication and error handling.' },
];

interface SidebarProps {
  onSelectTemplate: (prompt: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSelectTemplate }) => {
  return (
    <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6">
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Templates</h3>
        <div className="space-y-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate(t.prompt)}
              className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-slate-800 transition-all group"
            >
              <div className="p-2 bg-slate-800 group-hover:bg-slate-700 rounded-md transition-colors">
                <t.icon size={18} className="text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white">{t.title}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-auto pt-6 border-t border-slate-800 text-slate-500 text-xs leading-relaxed">
        <p>Built with Gemini 3 Pro</p>
        <p>Expert PowerShell Architect v1.0</p>
      </div>
    </aside>
  );
};
