
import React, { useState, useCallback } from 'react';
import { 
  Sparkles, 
  Settings2, 
  HelpCircle, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2,
  Info,
  Terminal
} from 'lucide-react';
import { generatePSFunction } from './services/geminiService';
import { PSFunctionRequest, PSFunctionResponse, AppStatus } from './types';
import { Sidebar } from './components/Sidebar';
import { CodeDisplay } from './components/CodeDisplay';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [request, setRequest] = useState<PSFunctionRequest>({
    description: '',
    complexity: 'standard',
    includeHelp: true,
    includeErrorHandling: true
  });
  const [result, setResult] = useState<PSFunctionResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!request.description.trim()) {
      setErrorMessage("Please describe what the function should do.");
      return;
    }

    setErrorMessage(null);
    setStatus(AppStatus.GENERATING);
    try {
      const data = await generatePSFunction(request);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setErrorMessage("Something went wrong while generating the code. Please try again.");
      setStatus(AppStatus.ERROR);
    }
  };

  const updateRequest = (updates: Partial<PSFunctionRequest>) => {
    setRequest(prev => ({ ...prev, ...updates }));
  };

  const handleTemplateSelect = (prompt: string) => {
    setRequest(prev => ({ ...prev, description: prompt }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#0f172a] text-slate-100">
      <Sidebar onSelectTemplate={handleTemplateSelect} />

      <main className="flex-1 p-6 lg:p-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <header className="mb-10 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">PowerShell <span className="text-blue-500">Pro</span> Architect</h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Describe your automation task and get production-ready PowerShell code following Microsoft's official best practices.
          </p>
        </header>

        {/* Input Section */}
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700 backdrop-blur-sm">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">
              Function Requirements
            </label>
            <textarea
              value={request.description}
              onChange={(e) => updateRequest({ description: e.target.value })}
              placeholder="e.g., Create a function that reads a CSV of users and creates them in AD if they don't exist..."
              className="w-full min-h-[120px] bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Complexity */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                <Settings2 size={14} /> Complexity
              </label>
              <select
                value={request.complexity}
                onChange={(e) => updateRequest({ complexity: e.target.value as any })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="simple">Simple (Basic task)</option>
                <option value="standard">Standard (Recommended)</option>
                <option value="advanced">Advanced (Enterprise)</option>
              </select>
            </div>

            {/* Documentation */}
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <input
                type="checkbox"
                id="includeHelp"
                checked={request.includeHelp}
                onChange={(e) => updateRequest({ includeHelp: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-800"
              />
              <label htmlFor="includeHelp" className="flex items-center gap-2 text-sm font-medium text-slate-300 cursor-pointer">
                <HelpCircle size={16} className="text-blue-400" /> Include Help Docs
              </label>
            </div>

            {/* Error Handling */}
            <div className="flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
              <input
                type="checkbox"
                id="includeErrorHandling"
                checked={request.includeErrorHandling}
                onChange={(e) => updateRequest({ includeErrorHandling: e.target.checked })}
                className="w-5 h-5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-800"
              />
              <label htmlFor="includeErrorHandling" className="flex items-center gap-2 text-sm font-medium text-slate-300 cursor-pointer">
                <AlertTriangle size={16} className="text-yellow-500" /> Error Handling
              </label>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={status === AppStatus.GENERATING}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/10 ${
              status === AppStatus.GENERATING 
              ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
              : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-[0.98]'
            }`}
          >
            {status === AppStatus.GENERATING ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Architecting Function...
              </>
            ) : (
              <>
                Generate Code <ArrowRight size={18} />
              </>
            )}
          </button>
          
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle size={16} /> {errorMessage}
            </div>
          )}
        </div>

        {/* Output Section */}
        {status !== AppStatus.IDLE && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Code */}
                  <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <CheckCircle2 className="text-green-500" size={20} /> Resulting Code
                    </h2>
                    <CodeDisplay code={result.code} />
                  </div>

                  {/* Right Column: Meta Info */}
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Info size={14} /> Explanation
                      </h3>
                      <div className="p-4 bg-slate-800/40 border border-slate-700 rounded-xl text-sm leading-relaxed text-slate-300">
                        {result.explanation}
                      </div>
                    </section>

                    <section>
                      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-blue-500" /> Best Practices Used
                      </h3>
                      <ul className="space-y-2">
                        {result.bestPractices.map((bp, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-400 bg-slate-800/20 p-2 rounded-lg border border-slate-700/30">
                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            {bp}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
        
        {status === AppStatus.IDLE && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
            <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700">
              <Terminal size={48} className="text-slate-500" />
            </div>
            <h2 className="text-xl font-medium text-slate-300">Waiting for instructions...</h2>
            <p className="text-sm text-slate-500 max-w-xs mt-2">
              Provide a description above or pick a template to get started with your PowerShell script.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
