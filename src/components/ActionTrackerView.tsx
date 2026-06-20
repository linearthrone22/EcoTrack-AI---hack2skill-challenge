import React, { useState, useRef } from "react";
import { 
  Flame, 
  Check, 
  Sparkles, 
  Bus, 
  Utensils, 
  Zap, 
  Trash2, 
  CheckCircle2, 
  Camera, 
  Upload, 
  X, 
  Image as ImageIcon,
  CheckCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Task } from "../types";

export interface ActionTrackerViewProps {
  key?: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onVerifyTask: (id: string, proofName: string) => void;
  currentPoints: number;
}

export default function ActionTrackerView({
  tasks,
  onToggleTask,
  onVerifyTask,
  currentPoints
}: ActionTrackerViewProps) {
  const [activeChip, setActiveChip] = useState<string>("All Actions");
  const [verifyingTaskId, setVerifyingTaskId] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chips = ["All Actions", "Transport", "Diet", "Household"];

  // Filter tasks based on activeChip
  const filteredTasks = tasks.filter((task) => {
    if (activeChip === "All Actions") return true;
    return task.category === activeChip;
  });

  // Calculate SVG circular stroke properties for the point ring
  const maxPtsValue = 500;
  const radius = 54;
  const strokeWidth = 8;
  const circumference = Math.PI * 2 * radius;
  const progressRatio = Math.min(currentPoints / maxPtsValue, 1);
  const strokeDashoffset = circumference - progressRatio * circumference;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  const triggerUploadInput = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmVerification = () => {
    if (verifyingTaskId) {
      const finalName = selectedFileName || "commute_proof.jpg";
      onVerifyTask(verifyingTaskId, finalName);
      setVerifyingTaskId(null);
      setSelectedFileName(null);
    }
  };

  const targetTask = tasks.find(t => t.id === verifyingTaskId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 overflow-y-auto px-5 py-6 pb-24 flex flex-col space-y-5"
    >
      {/* Hero Header */}
      <div>
        <h1 className="text-[25px] font-black text-emerald-950 tracking-tight leading-none mb-1">
          Keep up the momentum!
        </h1>
        <p className="text-[11px] text-gray-500 font-semibold leading-relaxed">
          Your AI-optimized impact path is looking strong today. Every action counts.
        </p>
      </div>

      {/* Point Progress Ring Card - Wrapped in a rounded-[2.5rem] white card for Geometric Harmony */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-gray-100 shadow-sm flex flex-col items-center">
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-2 text-center">
          Checklist Milestones
        </span>
        <div className="relative w-36 h-36 flex items-center justify-center select-none">
          {/* Circular point display inside */}
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Base grey track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
            />
            {/* Primary active progress trace */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#047857"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Points labels */}
          <div className="text-center z-10">
            <span className="block text-3xl font-black text-emerald-900 tracking-tight leading-none mb-1">
              {currentPoints}
            </span>
            <span className="text-[9px] font-bold tracking-wider text-emerald-800/80 uppercase">
              POINTS
            </span>
          </div>
        </div>
      </div>

      {/* Brown wooden streak container */}
      <div className="bg-[#8b5a2b] text-white rounded-[2rem] p-5 flex items-center justify-between shadow-sm border border-[#734923]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm leading-tight">5 Day Streak!</h3>
            <p className="text-[10px] text-white/70 font-semibold mt-0.5">
              You're in the top 10% this week.
            </p>
          </div>
        </div>
        <button 
          aria-label="View rewards catalog and achievements program"
          className="bg-white hover:bg-neutral-50 text-amber-950 font-bold text-[10px] py-1.5 px-3 rounded-lg shadow-sm shrink-0 transition-colors cursor-pointer"
        >
          Rewards
        </button>
      </div>

      {/* Horizontal categories scrolls */}
      <div 
        role="tablist" 
        aria-label="Filter tasks list by carbon category" 
        className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1"
      >
        {chips.map((chip) => {
          const isActive = activeChip === chip;
          return (
            <button
              key={chip}
              id={`tasks-category-chip-${chip.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setActiveChip(chip)}
              role="tab"
              aria-selected={isActive}
              aria-label={`Show ${chip} carbon commitments`}
              className={`text-[10px] uppercase tracking-wider font-extrabold px-4 py-2 rounded-full cursor-pointer transition-all duration-300 shrink-0 ${
                isActive
                  ? "bg-emerald-805 bg-emerald-800 text-white shadow-sm"
                  : "bg-white text-gray-400 hover:bg-slate-100 border border-gray-100"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Task List with interactive Verification drawer triggers */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task) => {
            const isCompleted = task.checked;

            // Simple custom icons based on action type
            const getIcon = (name: string) => {
              const lower = name.toLowerCase();
              if (lower.includes("transport") || lower.includes("transit") || lower.includes("cycle")) return <Bus className="w-4 h-4 text-emerald-800" />;
              if (lower.includes("meal") || lower.includes("food") || lower.includes("meat")) return <Utensils className="w-4 h-4 text-amber-700" />;
              if (lower.includes("laundry") || lower.includes("energy") || lower.includes("off-peak") || lower.includes("sorting")) return <Zap className="w-4 h-4 text-yellow-600" />;
              return <Trash2 className="w-4 h-4 text-emerald-800" />;
            };

            return (
              <motion.div
                key={task.id}
                layoutId={`task-${task.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-[2rem] border transition-all duration-300 flex flex-col justify-center ${
                  isCompleted
                    ? "bg-emerald-50/40 border-emerald-100 shadow-xs"
                    : "bg-white border-transparent shadow-xs hover:border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <button 
                    onClick={() => onToggleTask(task.id)}
                    aria-label={`Toggle task completion: ${task.name}`}
                    aria-pressed={isCompleted}
                    className="flex-1 flex items-center space-x-3.5 min-w-0 cursor-pointer border-none bg-transparent text-left focus:outline-none p-0"
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted ? "bg-emerald-100/50" : "bg-gray-50"
                    }`}>
                      {getIcon(task.name)}
                    </div>
                    <div className="min-w-0">
                      <h4 className={`text-xs font-bold transition-all ${
                        isCompleted ? "text-gray-400 line-through font-semibold" : "text-slate-800"
                      }`}>
                        {task.name}
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                        +{task.points} pts
                      </span>
                    </div>
                  </button>

                  {/* Check action circle indicator */}
                  <button 
                    onClick={() => onToggleTask(task.id)}
                    aria-label={`Checklist marker for ${task.name}`}
                    aria-pressed={isCompleted}
                    className="relative shrink-0 pr-1 cursor-pointer border-none bg-transparent focus:outline-none p-0"
                  >
                    <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${
                      isCompleted
                        ? "bg-emerald-600 border-emerald-600 shadow-sm scale-110"
                        : "border-slate-300 hover:border-emerald-600"
                    }`}>
                      {isCompleted && <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />}
                    </div>
                  </button>
                </div>

                {/* Verification sub-tier for completed unverified task */}
                {isCompleted && (
                  <div className="mt-3 pt-3 border-t border-dashed border-emerald-200/50 flex items-center justify-between">
                    {task.verified ? (
                      <div className="flex items-center space-x-1.5 text-emerald-700 bg-emerald-100/40 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider select-none">
                        <CheckCircle className="w-3 h-3 stroke-[2.5]" />
                        <span>Verified: {task.proofName} (+10 pts issued)</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[10px] text-emerald-800/80 font-bold italic">
                          📸 Earn +10 bonus pts verification!
                        </span>
                        <button
                          onClick={() => setVerifyingTaskId(task.id)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                        >
                          Verify Action
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Verification Evidence Modal (Flow 3 of technical blueprint) */}
      <AnimatePresence>
        {verifyingTaskId && targetTask && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-end justify-center z-50">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white w-full rounded-t-[2.5rem] p-6 shadow-2xl pb-10 flex flex-col space-y-4 max-h-[85%] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-50 rounded-xl text-emerald-800">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-slate-800">Verify Checklist Action</h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">
                      Earn +10 bonus points
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setVerifyingTaskId(null);
                    setSelectedFileName(null);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Active Commitment Name
                </span>
                <p className="text-xs font-extrabold text-emerald-900 bg-emerald-50 px-3 py-2 rounded-xl">
                  {targetTask.name}
                </p>
              </div>

              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerUploadInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    triggerUploadInput();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Verification evidence upload dropzone. Drag and drop your commuter ticket or photo receipt, or select to choose from local device files."
                className={`border-2 border-dashed rounded-3xl p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 ${
                  dragActive
                    ? "border-emerald-600 bg-emerald-500/10"
                    : selectedFileName
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                
                {selectedFileName ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-slate-800 select-none max-w-[200px] truncate">
                      {selectedFileName}
                    </p>
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase">
                      Ready for validation
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-3 bg-gray-50 text-gray-400 rounded-2xl group-hover:scale-105 transition-transform">
                      <Upload className="w-8 h-8 stroke-[1.8]" />
                    </div>
                    <p className="text-xs font-bold text-slate-700 select-none">
                      Drag & Drop ticket/photo here
                    </p>
                    <p className="text-[9px] text-gray-400 font-semibold select-none">
                      Or click manual selection (Any image up to 10MB)
                    </p>
                  </div>
                )}
              </div>

              {/* Simulated verification evidence gallery selector */}
              {!selectedFileName && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">
                    Or select pre-loaded proof simulation:
                  </span>
                  <div className="flex gap-2">
                    {[
                      "commute_receipt.png",
                      "salad_lunch_plate.png",
                      "smart_energy_invoice.png"
                    ].map((simFile) => (
                      <button
                        key={simFile}
                        onClick={() => setSelectedFileName(simFile)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-100 p-2 text-[9px] font-bold text-gray-600 rounded-xl transition-all truncate"
                      >
                        {simFile}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification confirming footer action buttons */}
              <div className="pt-4 flex space-x-3 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setVerifyingTaskId(null);
                    setSelectedFileName(null);
                  }}
                  className="flex-1 border border-gray-100 hover:bg-gray-50 text-slate-700 text-xs font-extrabold uppercase tracking-wide py-3 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  disabled={!selectedFileName}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold uppercase tracking-wide py-3 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Proof
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Primary Factoid Widget */}
      <div className="bg-emerald-50/50 border border-emerald-100/40 p-4 rounded-[24px] flex items-start space-x-3">
        <div className="p-2 bg-emerald-100/50 rounded-xl text-emerald-700 shrink-0">
          <Sparkles className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
        </div>
        <div>
          <span className="block text-[9px] font-bold text-emerald-800 uppercase tracking-widest mb-1">
            AI INSIGHT
          </span>
          <p className="text-[11px] font-medium text-emerald-950/80 leading-relaxed">
            By switching to public transport today, you've saved approximately <span className="font-bold text-emerald-800">2.4kg of CO2</span>. That's equivalent to charging a smartphone 290 times!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
