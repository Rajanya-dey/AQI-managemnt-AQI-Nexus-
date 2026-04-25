import React from 'react';
import { Lock, Construction, Cpu, Network, Terminal as TerminalIcon, ExternalLink } from 'lucide-react';

export default function DevConsole({
  devPassword,
  setDevPassword,
  isDevAuthenticated,
  handleDevAuth,
  devError,
  darkMode
}: any) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto animate-in fade-in duration-500 p-4">
        {!isDevAuthenticated ? (
            <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <div className="text-center space-y-3 opacity-80 mb-4">
                    <Construction size={80} className="mx-auto text-amber-500 animate-pulse" />
                    <h2 className="text-3xl font-black tracking-tight">Under Construction</h2>
                    <p className="font-medium opacity-70">This module is actively being built. Some features may be unstable.</p>
                </div>

                <div className={`p-8 rounded-[2rem] w-full text-center space-y-6 shadow-2xl border ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-center gap-2 mb-2 opacity-50 text-xs font-bold uppercase tracking-widest">
                        <Lock size={12}/> Developer Access
                    </div>
                    
                    <div className="space-y-4">
                        <input 
                        type="password" 
                        placeholder="Enter Access Token"
                        value={devPassword}
                        onChange={(e) => setDevPassword(e.target.value)}
                        className={`w-full p-4 rounded-xl text-center font-mono text-sm tracking-widest outline-none border focus:ring-2 ring-blue-500/50 transition-all ${darkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        />
                        {devError && <div className="text-red-500 text-xs font-bold animate-pulse">{devError}</div>}
                        
                        <button 
                            onClick={handleDevAuth}
                            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-transform active:scale-95 shadow-lg shadow-blue-500/30"
                        >
                            Authenticate to Preview
                        </button>
                    </div>
                </div>
            </div>
        ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-500`}>
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">System Internals</h2>
                    <p className="opacity-60 font-mono text-xs">v2.4.0-stable • Connected to Neural Backend</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className={`p-6 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'}`}>
                        <div className="p-3 bg-green-500/10 text-green-500 rounded-xl"><Cpu size={24} /></div>
                        <div>
                            <div className="text-sm font-bold opacity-50">Core Logic</div>
                            <div className="font-mono text-lg font-bold text-green-500">Active</div>
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border flex items-center gap-4 ${darkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-slate-200'}`}>
                        <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Network size={24} /></div>
                        <div>
                            <div className="text-sm font-bold opacity-50">API Latency</div>
                            <div className="font-mono text-lg font-bold text-purple-500">24ms</div>
                        </div>
                    </div>
                </div>

                <div className={`w-full p-6 rounded-3xl border space-y-4 font-mono text-xs relative overflow-hidden ${darkMode ? 'bg-black border-neutral-800 text-green-400' : 'bg-slate-900 border-slate-800 text-green-400'}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500/50"></div>
                    <div className="flex items-center gap-2 opacity-50 border-b border-white/10 pb-2 mb-2">
                        <TerminalIcon size={12} /> Console Output
                    </div>
                    <div className="space-y-1 opacity-80">
                        <div>[INFO] Initializing AirGuard Core...</div>
                        <div>[INFO] Loading MASK_DATA parameters... OK</div>
                        <div>[INFO] Connecting to CITIES database... OK</div>
                        <div>[AUTH] User authentication bypassed (HACK_THE_GALAXY)</div>
                        <div>[READY] System fully operational.</div>
                    </div>
                </div>

                <a href="#" onClick={(e) => { e.preventDefault(); alert("Redirecting to external documentation..."); }} className="flex items-center gap-2 text-blue-500 font-bold hover:underline">
                    <ExternalLink size={16} /> View Full Documentation
                </a>
            </div>
        )}
    </div>
  );
}
