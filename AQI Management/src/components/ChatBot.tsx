import React from 'react';
import { Bot, X, MessageCircle, Send } from 'lucide-react';
import type { ChatMessage } from '../types';

export default function ChatBot({
  chatOpen,
  setChatOpen,
  chatMessages,
  chatInput,
  setChatInput,
  handleSendMessage,
  isBotTyping,
  chatEndRef
}: any) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {chatOpen ? (
          <div className={`w-80 h-[500px] rounded-[2rem] shadow-2xl flex flex-col border overflow-hidden animate-in slide-in-from-bottom-10 fade-in bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800`}>
              <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                      <Bot size={20} /> <span className="font-bold">AirGuard AI</span>
                  </div>
                  <button onClick={() => setChatOpen(false)}><X size={20} /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-neutral-900 text-slate-800 dark:text-slate-200">
                  {chatMessages.map((msg: ChatMessage) => (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm 
                              ${msg.type === 'user' 
                                  ? 'bg-blue-600 text-white rounded-br-none' 
                                  : 'bg-white dark:bg-neutral-800 border border-slate-100 dark:border-neutral-700 rounded-bl-none text-slate-800 dark:text-slate-200'
                              }`}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
                  {isBotTyping && <div className="text-xs opacity-50 ml-4 animate-pulse text-slate-500 dark:text-slate-400">Thinking...</div>}
                  <div ref={chatEndRef}></div>
              </div>

              <div className="p-3 border-t border-slate-200 dark:border-neutral-800 flex gap-2 bg-white dark:bg-neutral-900">
                  <input 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                      placeholder="Ask anything..." 
                      className={`flex-1 p-3 rounded-xl text-sm outline-none bg-slate-100 dark:bg-neutral-800 text-slate-900 dark:text-white focus:ring-2 ring-blue-500/50 transition-all`} 
                  />
                  <button onClick={handleSendMessage} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"><Send size={18} /></button>
              </div>
          </div>
      ) : (
          <button onClick={() => setChatOpen(true)} className="p-4 rounded-full bg-blue-600 text-white shadow-xl hover:scale-110 transition-transform">
              <MessageCircle size={28} />
          </button>
      )}
    </div>
  );
}
