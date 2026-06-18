/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageCircle, RefreshCw, Feather, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CoopStyle, OracleMessage } from '../types';

interface CoopOracleProps {
  userName: string;
  style: CoopStyle;
  styleTitle: string;
}

const PRESET_PROMPTS = [
  "How can I ask my boss for a raise without getting pecked?",
  "My roommate is incredibly messy. How do I manage their nesting habits?",
  "I'm feeling overwhelmed by daily chores. What is your bird wisdom?",
  "How can I attract a suitable partner to my section of the yard?"
];

export default function CoopOracle({ userName, style, styleTitle }: CoopOracleProps) {
  const [messages, setMessages] = useState<OracleMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `*BWA-KAAAK!* Adjusts spectacles and pecks at a shiny gold medal... Greetings, human! Ah, I see you are none other than ${userName || 'a mysterious stranger'} — newly certified as a prestigious ${styleTitle}! \n\nI am Clarissa, Keeper of the Sacred Shavings and Speaker of the Coop. Ask me any secular question about your weird human life, and I shall decode its ultimate feather-ruffling agricultural meaning! Cluck away!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Reset error
    setErrorMsg(null);

    const userMsg: OracleMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Gather latest messages context for Gemini (limit to last 10 messages for speed / economy)
      const messagePayload = [...messages, userMsg].map(m => ({
        role: m.role,
        text: m.text
      })).slice(-10);

      const response = await fetch('/api/coop-oracle/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagePayload,
          style: style,
          userName: userName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'The oracle did not respond cluckingly.');
      }

      const data = await response.json();

      const modelMsg: OracleMessage = {
        id: `m-${Date.now()}`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, modelMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || 
        'Could not communicate with the Coop Oracle. Make sure your GEMINI_API_KEY is configured in Settings > Secrets!'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: `m-${Date.now()}`,
        role: 'model',
        text: `*bobs head with energetic alertness* A clean nesting box! Let us begin our agricultural counseling anew. What is vexing your tiny human feathers, ${userName || 'my friend'}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setErrorMsg(null);
  };

  return (
    <div id="oracle-chamber" className="w-full max-w-3xl mx-auto rounded-3xl bg-stone-900 border-4 border-[#3D405B] p-4 sm:p-6 text-stone-100 shadow-[6px_6px_0px_0px_rgba(61,64,91,1)] relative overflow-hidden">
      
      {/* Dynamic background accents */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#E07A5F]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#81B29A]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-stone-800 pb-4 mb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#F2CC8F] bg-stone-800 flex items-center justify-center relative shadow-inner overflow-hidden">
            {/* Custom vector like chicken eye look or avatar */}
            <span className="text-2xl pt-1">👁️</span>
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F2CC8F] animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-black text-lg text-amber-100 flex items-center gap-1.5 leading-tight">
              Clarissa the Wise Clucker
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest font-mono font-bold">
                Coop Oracle
              </span>
            </h4>
            <p className="text-xs text-stone-400 font-serif italic">
              "Weighing human existential questions one seed at a time"
            </p>
          </div>
        </div>

        <button
          onClick={resetChat}
          id="btn-reset-oracle"
          className="flex items-center gap-1.5 text-xs text-stone-300 hover:text-[#F2CC8F] transition-colors bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-xl border border-stone-700 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Clear Shavings (Reset)
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="h-[360px] overflow-y-auto mb-4 pr-1 space-y-4 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-2.5 text-[#3D405B] text-sm leading-relaxed shadow-md ${
                  msg.role === 'user'
                    ? 'bg-[#E07A5F] text-white rounded-br-none font-bold'
                    : 'bg-stone-800 text-stone-100 rounded-bl-none border border-stone-700'
                }`}
              >
                {/* Style italic text segments inside Clarissa's comical action parameters cleanly */}
                <div className="whitespace-pre-wrap font-sans">
                  {msg.role === 'model' ? (
                    msg.text.split('*').map((part, index) => {
                      if (index % 2 === 1) {
                        return <span key={index} className="italic text-[#F2CC8F] font-bold font-serif">*{part}*</span>;
                      }
                      return part;
                    })
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
              <span className="text-[9px] text-[#A89F91] mt-1 font-mono px-1">
                {msg.timestamp}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-stone-800 text-stone-300 rounded-xl rounded-bl-none px-4 py-3 border border-stone-700 shadow-md flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-[#F2CC8F] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#F2CC8F] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#F2CC8F] animate-bounce" />
              </div>
              <span className="font-serif italic text-xs text-stone-400 flex items-center gap-1">
                <Feather className="w-3 h-3 animate-spin text-[#F2CC8F]" />
                Clarissa is scraping the dirt...
              </span>
            </div>
          </div>
        )}

        {/* Error Notification with helpful instructions */}
        {errorMsg && (
          <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-red-200 text-xs flex flex-col gap-2">
            <p className="font-semibold flex items-center gap-1.5 text-red-300">
              ⚠️ Oracle Communication Failure
            </p>
            <p>{errorMsg}</p>
            <p className="text-red-400/80 leading-relaxed font-mono text-[10px]">
              Tip: Go to the <strong className="text-red-300">Settings &gt; Secrets</strong> panel in the top-right of the AI Studio UI, make sure your <span className="underline">GEMINI_API_KEY</span> is assigned, then refresh. Live preview functions!
            </p>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Preset Suggestions for User Convenience */}
      <div className="mb-4">
        <span className="text-[10px] text-stone-400 font-mono tracking-widest uppercase block mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#F2CC8F]" />
          Choose a pre-written human hurdle to solve:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_PROMPTS.map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(promptText)}
              disabled={isLoading}
              className="text-left text-xs bg-stone-800 hover:bg-[#81B29A]/20 hover:text-emerald-100 hover:border-[#81B29A]/40 text-stone-300 border border-stone-700 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Input controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={`"How do I deal with..." (Clarissa will translate to chicken logic!)`}
          id="oracle-user-input"
          className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-4 py-3 text-sm text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#F2CC8F] focus:border-transparent placeholder-stone-500 disabled:opacity-50"
          maxLength={300}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          id="btn-oracle-send"
          className="wood-button rounded-xl flex items-center justify-center p-3 cursor-pointer disabled:opacity-40 text-[#3D405B]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Footer advice */}
      <p className="text-center text-stone-500 font-sans text-[10px] mt-3 flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-[#F2CC8F]" />
        Your daily advice queries are routed server-side via the Gemini-3.5 model. No client API exposure.
      </p>

    </div>
  );
}
