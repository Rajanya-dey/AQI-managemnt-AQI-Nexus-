import React from 'react';
import { Shield, User, Briefcase, Heart, Activity, Sparkles } from 'lucide-react';
import { ROLES, ROLE_QUESTIONS, HEALTH_CONDITIONS } from '../constants';

export default function UserSetup({
  userName,
  setUserName,
  userAge,
  handleAgeChange,
  userRole,
  setUserRole,
  roleDetail,
  setRoleDetail,
  userConditions,
  handleConditionToggle,
  customCondition,
  setCustomCondition,
  loading,
  handleGenerate,
  darkMode,
  theme
}: any) {
  return (
    <div className="max-w-xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pt-10">
        <div className="text-center space-y-4">
            <div className={`inline-flex items-center justify-center p-4 rounded-3xl mb-2 shadow-2xl shadow-blue-500/30 bg-gradient-to-tr from-blue-600 to-cyan-400 text-white transform transition hover:scale-110 duration-300`}>
                <Shield size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-black tracking-tight">
            {userName ? `${userName}'s Air Shield` : "Setup Your Air Shield"}
            </h2>
            <p className={`${theme.textMuted} text-lg`}>Personalized health defense system active.</p>
        </div>

        <div className={`p-8 rounded-[2rem] border shadow-xl space-y-8 ${theme.card}`}>
            <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-50 font-bold text-xs uppercase tracking-widest">
                    <User size={12} /> Identity
                </div>
                <div className="grid grid-cols-5 gap-4">
                    <div className="col-span-3">
                        <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Your Name" className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-blue-500/50 transition-all font-medium text-lg ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-300'}`} />
                    </div>
                    <div className="col-span-2">
                        <input 
                            type="number" 
                            min="1"
                            value={userAge} 
                            onChange={handleAgeChange} 
                            placeholder="Age" 
                            className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-blue-500/50 transition-all font-medium text-lg ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-300'}`} 
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-50 font-bold text-xs uppercase tracking-widest">
                    <Briefcase size={12} /> Role
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {ROLES.map(role => (
                        <button key={role.id} onClick={() => setUserRole(role.id)} className={`p-3 rounded-2xl border text-sm font-medium transition-all flex flex-col items-center gap-2 hover:scale-105 active:scale-95 ${userRole === role.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30' : `${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-slate-200 hover:bg-slate-50'}`}`}>
                            <role.icon size={20} strokeWidth={1.5} />
                            {role.label}
                        </button>
                    ))}
                </div>
                
                {userRole && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <input 
                            value={roleDetail}
                            onChange={e => setRoleDetail(e.target.value)}
                            placeholder={ROLE_QUESTIONS[userRole]}
                            className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-blue-500/50 transition-all text-sm ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-400'}`}
                        />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 opacity-50 font-bold text-xs uppercase tracking-widest">
                    <Heart size={12} /> Health Status
                </div>
                <div className="flex flex-wrap gap-2">
                    {HEALTH_CONDITIONS.map(cond => {
                        const isSelected = userConditions.includes(cond.id);
                        return (
                            <button 
                                key={cond.id} 
                                onClick={() => handleConditionToggle(cond.id)} 
                                className={`px-4 py-2 rounded-full border text-sm font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${isSelected ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/30' : `${darkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-slate-200 hover:bg-slate-50'}`}`}
                            >
                                <cond.icon size={16} />
                                {cond.label}
                            </button>
                        );
                    })}
                </div>

                {userConditions.includes('other') && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <input 
                            value={customCondition}
                            onChange={e => setCustomCondition(e.target.value)}
                            placeholder="Please specify your health condition(s)..."
                            className={`w-full p-4 rounded-2xl border bg-transparent outline-none focus:ring-2 ring-rose-500/50 transition-all text-sm ${darkMode ? 'border-neutral-700 placeholder:text-neutral-600' : 'border-slate-200 placeholder:text-slate-400'}`}
                        />
                    </div>
                )}
            </div>

            <button onClick={handleGenerate} disabled={loading} className={`w-full py-5 rounded-2xl font-bold text-xl shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] ${theme.button}`}>
                {loading ? <Activity className="animate-spin" /> : <Sparkles className="fill-current" />}
                {loading ? 'Analyzing...' : 'Generate Report'}
            </button>
        </div>
    </div>
  );
}
