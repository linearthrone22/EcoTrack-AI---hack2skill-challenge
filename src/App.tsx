import { useState } from "react";
import { Home, ClipboardList, Sparkles, User, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Header from "./components/Header";
import QuestionnaireView from "./components/QuestionnaireView";
import DashboardView from "./components/DashboardView";
import ActionTrackerView from "./components/ActionTrackerView";
import AIAssistantView from "./components/AIAssistantView";
import { Task, Message, ViewType } from "./types";

export default function App() {
  // Navigation active view state initialized to 'questionnaire' so user starts with profiling
  const [activeView, setActiveView] = useState<ViewType>("questionnaire");

  // User state profiles according to blueprint
  const [points, setPoints] = useState<number>(340);
  const [originalBaseline, setOriginalBaseline] = useState<number>(342);
  const [baselineCO2, setBaselineCO2] = useState<number>(342);

  const [region, setRegion] = useState<'ID' | 'US' | 'EU'>("US");
  const [transportType, setTransportType] = useState<string>("transit");
  const [dietType, setDietType] = useState<string>("average");
  const [energyType, setEnergyType] = useState<string>("medium");

  // Active Task list (Checklist tracker items)
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", name: "Public Transport", points: 50, category: "Transport", checked: false, co2Saved: 2.4 },
    { id: "2", name: "Meat-Free Meal", points: 30, category: "Diet", checked: false, co2Saved: 1.8 },
    { id: "3", name: "Off-Peak Laundry", points: 20, category: "Household", checked: false, co2Saved: 0.9 },
    { id: "4", name: "Proper Sorting", points: 15, category: "Household", checked: false, co2Saved: 0.4 },
  ]);

  // Seeded messages for AI assistant chat exactly answering the user's transportation query
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "seeded-user-1",
      sender: "user",
      text: "How can I reduce my transportation emissions?",
      timestamp: "10:32 AM",
    },
    {
      id: "seeded-ai-1",
      sender: "assistant",
      text: "I've generated a personalized Reduction Roadmap based on your recent commute patterns and regional infrastructure. Switching to these alternatives could significantly lower your monthly footprint.",
      timestamp: "10:33 AM",
      isRoadmap: true,
      roadmapItems: [
        { id: "rm-1", title: "Cycle to the Office", sub: "Estimated 25 min travel time", co2: "-4.2 kg", icon: "Bike" },
        { id: "rm-2", title: "Electric Light Rail", sub: "Use for inter-city trips", co2: "-5.8 kg", icon: "Train" },
        { id: "rm-3", title: "Carpooling (3+ people)", sub: "Available for Friday morning", co2: "-2.8 kg", icon: "Users" },
      ],
    },
  ]);

  // Alert notifier state for planning activities
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddingAllPlan, setIsAddingAllPlan] = useState<boolean>(false);

  // Trigger task complete toggle
  const handleToggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const newChecked = !task.checked;
          // Apply dynamic score increment or decrement in real time
          setPoints((prevPts) => (newChecked ? prevPts + task.points : prevPts - task.points));
          // Subtract or add CO2 in real time
          setBaselineCO2((prevCO2) => (newChecked ? prevCO2 - task.co2Saved : prevCO2 + task.co2Saved));
          
          // Revert verified state if task is unchecked
          return { 
            ...task, 
            checked: newChecked,
            verified: newChecked ? task.verified : false 
          };
        }
        return task;
      })
    );
  };

  // Verification handling (Flow 3 of technical blueprint)
  const handleVerifyTask = (id: string, proofName: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id && !task.verified) {
          // Award verification bonus (+10 points)
          setPoints((pts) => pts + 10);
          showToast(`Evidence verified! +10 Points awarded.`);
          return { ...task, verified: true, proofName };
        }
        return task;
      })
    );
  };

  // Onboarding sequence completed handler
  const handleOnboardingCompleted = (results: {
    region: 'ID' | 'US' | 'EU';
    transport: string;
    diet: string;
    energy: string;
    calculatedCO2: number;
  }) => {
    setRegion(results.region);
    setTransportType(results.transport);
    setDietType(results.diet);
    setEnergyType(results.energy);
    setOriginalBaseline(results.calculatedCO2);
    setBaselineCO2(results.calculatedCO2);
    setActiveView("dashboard");
    showToast("Carbon Onboarding Profile finalized!");
  };

  // Trigger 'Add all to My Plan' from the AI Assistant View
  const handleAddAllToPlan = () => {
    setIsAddingAllPlan(true);

    // Filter roadmap tasks to add them to user's daily Action Checklist
    setTimeout(() => {
      const cycleExists = tasks.some(t => t.name === "Cycle to the Office");
      
      if (!cycleExists) {
        const newPlannedTasks: Task[] = [
          { id: "plan-cycle", name: "Cycle to the Office", points: 40, category: "Transport", checked: false, co2Saved: 4.2 },
          { id: "plan-rail", name: "Electric Light Rail", points: 30, category: "Transport", checked: false, co2Saved: 5.8 },
          { id: "plan-carpool", name: "Carpooling (3+ people)", points: 25, category: "Transport", checked: false, co2Saved: 2.8 },
        ];
        setTasks(prev => [...prev, ...newPlannedTasks]);
        showToast("Roadmap actions added to your Tracker!");
      } else {
        showToast("These tasks are already in your checklist!");
      }

      setIsAddingAllPlan(false);
      // Navigate to Action Tracker so they see the result immediately
      setActiveView("tracker");
    }, 850);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Manage client-to-server chat message relay with dynamic context payload (Section 3.A of blueprint)
  const handleSendMessage = async (text: string) => {
    // 1. Create and append the user's text bubble
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 2. Generate a typing model placeholder
    const typingId = `typing-${Date.now()}`;
    const typingMsg: Message = {
      id: typingId,
      sender: "assistant",
      text: "Calculating emission analytics...",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, typingMsg]);

    try {
      // Proxy prompt through backend server endpoints to protect Gemini secret keys
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: text,
          stats: {
            region,
            transportType,
            dietType,
            energyType
          }
        }),
      });
      if (!res.ok) throw new Error("Server communication fault");
      const data = await res.json();

      // Replace typing indicator with server-backed advice
      setMessages((prev) =>
        prev.map((m) => (m.id === typingId ? { ...m, text: data.text } : m))
      );
    } catch (err) {
      console.warn("Express endpoint missing or offline, falling back to simulated eco guidelines.", err);
      
      // Resilient local counselor engine for robust offline operation
      let mockReply = "I've logged your carbon query! Practicing selective transportation commutes (like cycling/busing), shifting appliance loads, and picking meatless menus represent highly reliable carbon reduction habits.";
      const lower = text.toLowerCase();
      
      if (lower.includes("transit") || lower.includes("commute") || lower.includes("car") || lower.includes("bike")) {
        mockReply = "Reducing combustion daily drives cuts individual carbon emissions by 4-5 kg per week. Incorporating cycles or electric grid travel also rewards you with up to 50 Activity Tracker points!";
      } else if (lower.includes("diet") || lower.includes("food") || lower.includes("beef") || lower.includes("meat")) {
        mockReply = "Cutting meat standard portions twice a week prevents agricultural methane footprints, reducing individual emissions by roughly 15.4 kg CO2e a month.";
      } else if (lower.includes("wash") || lower.includes("home") || lower.includes("appliance")) {
        mockReply = "Running energy-heavy activities (like laundry) in off-peak blocks prevents standard peak oil generator kickbacks, conserving resource allocations locally.";
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === typingId ? { ...m, text: mockReply } : m))
      );
    }
  };

  // Support restarting the questionnaire sequence
  const handleRedoQuestionnaire = () => {
    setActiveView("questionnaire");
    showToast("Profile Questionnaire reset!");
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center py-6 px-4 font-sans select-none antialiased">
      {/* 
        High-fidelity mobile wrap mockup - Styled for Geometric Balance
      */}
      <div className="relative w-[375px] h-[730px] bg-gray-55 bg-gray-50 rounded-[3rem] shadow-2xl border-[8px] border-gray-950 overflow-hidden flex flex-col">
        {/* Apple Dynamic Notch overlay mimic */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-[18px] bg-gray-950 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-neutral-800 rounded-full mb-1" />
        </div>

        {/* Persistent top bar header */}
        <Header onAvatarClick={handleRedoQuestionnaire} />

        {/* Core view active component selector */}
        <div className="flex-1 overflow-hidden flex flex-col bg-gray-50 pt-1.5">
          <AnimatePresence mode="wait">
            {activeView === "questionnaire" && (
              <QuestionnaireView
                key="questionnaire"
                onCompleted={handleOnboardingCompleted}
                onBack={() => {
                  setActiveView("dashboard");
                }}
              />
            )}

            {activeView === "dashboard" && (
              <DashboardView
                key="dashboard"
                onNavigateToAssistant={() => setActiveView("assistant")}
                onNavigateToTracker={() => setActiveView("tracker")}
                originalBaseline={originalBaseline}
                currentPace={parseFloat(baselineCO2.toFixed(1))}
                region={region}
                transportType={transportType}
                dietType={dietType}
                energyType={energyType}
              />
            )}

            {activeView === "tracker" && (
              <ActionTrackerView
                key="tracker"
                tasks={tasks}
                onToggleTask={handleToggleTask}
                onVerifyTask={handleVerifyTask}
                currentPoints={points}
              />
            )}

            {activeView === "assistant" && (
              <AIAssistantView
                key="assistant"
                messages={messages}
                onSendMessage={handleSendMessage}
                onAddAllToPlan={handleAddAllToPlan}
                isAddingAllPlan={isAddingAllPlan}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Global Toast Notifier */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute bottom-24 left-6 right-6 bg-slate-950 text-white text-[11px] font-semibold py-3 px-4 rounded-xl shadow-lg z-50 text-center flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 
          Fixed Navigation Bottom Tab Bar - Geometric Balance (Height 24 with bottom padding)
        */}
        <nav className="h-24 bg-white border-t border-gray-100 flex items-center justify-around px-4 pb-4 shrink-0 z-40 select-none">
          {/* Home Tab */}
          <button
            onClick={() => setActiveView("dashboard")}
            className={`flex flex-col items-center justify-center w-14 h-14 transition-all ${
              activeView === "dashboard" ? "text-emerald-700 font-bold" : "text-gray-400 hover:text-slate-500"
            }`}
          >
            <div className={`p-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
              activeView === "dashboard" ? "bg-emerald-50" : ""
            }`}>
              <Home className="w-[20px] h-[20px] stroke-[2.2]" />
              <span className="text-[10px] mt-1 uppercase tracking-tighter">Home</span>
            </div>
          </button>

          {/* Track Tab */}
          <button
            onClick={() => setActiveView("tracker")}
            className={`flex flex-col items-center justify-center w-14 h-14 transition-all ${
              activeView === "tracker" ? "text-emerald-700 font-bold" : "text-gray-400 hover:text-slate-500"
            }`}
          >
            <div className={`p-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
              activeView === "tracker" ? "bg-emerald-50" : ""
            }`}>
              <ClipboardList className="w-[20px] h-[20px] stroke-[2.2]" />
              <span className="text-[10px] mt-1 uppercase tracking-tighter">Track</span>
            </div>
          </button>

          {/* Insights (AI Assistant) Tab */}
          <button
            onClick={() => setActiveView("assistant")}
            className={`flex flex-col items-center justify-center w-14 h-14 transition-all ${
              activeView === "assistant" ? "text-emerald-700 font-bold" : "text-gray-400 hover:text-slate-500"
            }`}
          >
            <div className={`p-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
              activeView === "assistant" ? "bg-emerald-50" : ""
            }`}>
              <Sparkles className="w-[20px] h-[20px] stroke-[2.2]" />
              <span className="text-[10px] mt-1 uppercase tracking-tighter">Insights</span>
            </div>
          </button>

          {/* Profile (Questionnaire Setup/redo) Tab */}
          <button
            onClick={() => setActiveView("questionnaire")}
            className={`flex flex-col items-center justify-center w-14 h-14 transition-all ${
              activeView === "questionnaire" ? "text-emerald-700 font-bold" : "text-gray-400 hover:text-slate-500"
            }`}
          >
            <div className={`p-1.5 px-3 rounded-full flex flex-col items-center justify-center transition-all ${
              activeView === "questionnaire" ? "bg-emerald-50" : ""
            }`}>
              <User className="w-[20px] h-[20px] stroke-[2.2]" />
              <span className="text-[10px] mt-1 uppercase tracking-tighter">Profile</span>
            </div>
          </button>
        </nav>
      </div>
    </div>
  );
}
