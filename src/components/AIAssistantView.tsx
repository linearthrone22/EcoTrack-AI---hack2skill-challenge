import React, { useState, useRef, useEffect } from "react";
import { Send, Plus, Map, Bike, Train, Users, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Message } from "../types";

export interface AIAssistantViewProps {
  key?: string;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onAddAllToPlan: () => void;
  isAddingAllPlan?: boolean;
}

export default function AIAssistantView({
  messages,
  onSendMessage,
  onAddAllToPlan,
  isAddingAllPlan = false
}: AIAssistantViewProps) {
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages load/append
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative bg-gray-50">
      {/* Scrollable Chat Bubbles Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5 pb-32">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.sender === "user";

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                {/* Header label for AI assistant */}
                {!isUser && (
                  <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase mb-1.5 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                    <span>ECOTRACK AI ASSISTANT</span>
                  </span>
                )}

                {/* Main Message Bubble */}
                <div
                  className={`max-w-[85%] rounded-[20px] p-4 text-xs leading-relaxed ${
                    isUser
                      ? "bg-emerald-700 text-white rounded-br-none font-semibold shadow-sm"
                      : "bg-white text-gray-700 rounded-bl-none shadow-sm border border-slate-100"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Custom Nested AI Roadmap Component */}
                {!isUser && msg.isRoadmap && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-3.5 w-full max-w-[95%] bg-emerald-50 rounded-[2rem] border border-emerald-100 p-5 shadow-sm flex flex-col space-y-4"
                  >
                    {/* Roadmap Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Map className="w-4 h-4 text-emerald-800" />
                        <span className="font-extrabold text-xs text-emerald-950">
                          Reduction Roadmap
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-1 rounded-full shrink-0">
                        -12.8 kg CO2e / week
                      </span>
                    </div>

                    {/* Roadmap Option rows - Using bg-white and precise border ratios */}
                    <div className="space-y-2">
                      {/* Option 1: Cycling */}
                      <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0">
                            <Bike className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-[11px] text-slate-800 truncate">
                              Cycle to the Office
                            </h5>
                            <span className="text-[9px] text-gray-500 font-medium block mt-0.5">
                              Estimated 25 min travel time
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 shrink-0 select-none">
                          -4.2 kg
                        </span>
                      </div>

                      {/* Option 2: Train */}
                      <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0">
                            <Train className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-[11px] text-slate-800 truncate">
                              Electric Light Rail
                            </h5>
                            <span className="text-[9px] text-gray-500 font-medium block mt-0.5">
                              Use for inter-city trips
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 shrink-0 select-none">
                          -5.8 kg
                        </span>
                      </div>

                      {/* Option 3: Carpooling */}
                      <div className="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-xs">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800 shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-extrabold text-[11px] text-slate-800 truncate">
                              Carpooling (3+ people)
                            </h5>
                            <span className="text-[9px] text-gray-500 font-medium block mt-0.5">
                              Available for Friday morning
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 shrink-0 select-none">
                          -2.8 kg
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action button */}
                    <button
                      onClick={onAddAllToPlan}
                      disabled={isAddingAllPlan}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[11px] py-3 rounded-2xl transition-all shadow-sm shrink-0 flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-60"
                    >
                      <span>{isAddingAllPlan ? "Adding tasks..." : "Add all to My Plan >"}</span>
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed bottom chat bar right above main tab navigation */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-3xl border border-gray-100 shadow-lg px-4 py-3 z-20 flex items-center space-x-3.5" role="form" aria-label="EcoTrack AI Chatbot Input">
        <button 
          className="text-gray-400 hover:text-emerald-700 p-1.5 rounded-full hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
          aria-label="Add optional files or reference documents to conversation context"
          id="chat-plus-attachment-btn"
        >
          <Plus className="w-5 h-5 stroke-[2]" />
        </button>

        <input
          type="text"
          id="chatbot-text-input-field"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your footprint..."
          aria-label="Type your carbon footprint or sustainability question here"
          className="flex-1 bg-transparent text-xs text-gray-800 placeholder-gray-400 focus:outline-none py-1.5 focus:ring-0"
        />

        <button
          onClick={handleSend}
          id="chatbot-send-message-btn"
          aria-label="Send message to EcoTrack AI assistant"
          className="w-8 h-8 bg-emerald-800 hover:bg-emerald-900 text-white rounded-full flex items-center justify-center hover:scale-105 shrink-0 transition-all cursor-pointer shadow-sm focus:outline-none"
        >
          <Send className="w-3.5 h-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}
