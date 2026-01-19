
import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeDisplayProps {
  code: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group w-full bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <Terminal size={16} className="text-blue-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">PowerShell Script</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-6 overflow-x-auto text-sm code-font leading-relaxed">
        <code className="text-blue-100 whitespace-pre">
          {code || "# Your generated function will appear here..."}
        </code>
      </pre>
    </div>
  );
};
