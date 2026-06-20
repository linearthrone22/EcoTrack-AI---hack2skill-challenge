import { Sparkles, Car, Utensils, Home, ArrowDown, Trees, Milestone, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

export interface DashboardViewProps {
  key?: string;
  onNavigateToAssistant: () => void;
  onNavigateToTracker: () => void;
  originalBaseline: number;
  currentPace: number;
  region?: 'ID' | 'US' | 'EU';
  transportType?: string;
  dietType?: string;
  energyType?: string;
}

export default function DashboardView({
  onNavigateToAssistant,
  onNavigateToTracker,
  originalBaseline = 342,
  currentPace = 342,
  region = 'US',
  transportType = 'transit',
  dietType = 'average',
  energyType = 'medium'
}: DashboardViewProps) {
  
  // Calculate dynamic annual savings and tree equivalents
  const monthlySavings = Math.max(0, originalBaseline - currentPace);
  const annualSavings = Math.round(monthlySavings * 12);
  const treesSaved = Math.max(1, Math.round(annualSavings / 25));

  // Percentage for the gauge
  const maxCapacity = originalBaseline || 342;
  const percentage = Math.min(100, Math.max(15, Math.round((currentPace / maxCapacity) * 100)));
  const radius = 64;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - ((100 - percentage) / 100) * circumference;

  // Render category values based on types or default formulas
  const transportVal = transportType === 'car' ? 180 : transportType === 'transit' ? 50 : 0;
  const dietVal = dietType === 'heavy' ? 160 : dietType === 'average' ? 110 : dietType === 'vegetarian' ? 45 : 20;
  
  let kwh = 250;
  if (energyType === 'low') kwh = 100;
  if (energyType === 'high') kwh = 500;
  let factor = 0.38;
  if (region === "ID") factor = 0.82;
  if (region === "EU") factor = 0.25;
  const energyVal = Math.round(kwh * factor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 overflow-y-auto px-5 py-6 pb-24 flex flex-col space-y-5"
    >
      {/* Hero Footprint section - Styled with Geometric Balance [2.5rem] rounded corners */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center border border-gray-100">
        <span className="text-[11px] font-bold text-gray-400 tracking-widest uppercase mb-4 text-center">
          Current Month Footprint ({region} Region)
        </span>

        {/* Semi-Circle SVG Display */}
        <div className="relative w-48 h-32 flex items-end justify-center overflow-hidden">
          <svg viewBox="0 0 100 60" className="w-full h-full transform translate-y-2">
            {/* Background track */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Active filled path */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="#047857"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Metric label in center */}
          <div className="absolute bottom-2 flex flex-col items-center">
            <span className="text-3xl font-black text-emerald-950 tracking-tight leading-none mb-0.5">
              {Math.round(currentPace)}
            </span>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              kg CO2e
            </span>
          </div>
        </div>

        {/* Improvement Badge */}
        <div className="mt-4 px-4 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 flex items-center space-x-1">
          {monthlySavings > 0 ? (
            <span>↓ Saving {monthlySavings.toFixed(1)} kg CO2e this month!</span>
          ) : (
            <span>↓ 12% lower than national baseline</span>
          )}
        </div>
      </div>

      {/* Dynamic Impact projection card (Flow 2 of technical blueprint) */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-[2.2rem] p-6 shadow-md border border-emerald-700/30">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-9 h-9 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <TrendingDown className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <h3 className="font-extrabold text-[13px] tracking-wide uppercase text-emerald-300">
              Future Projection
            </h3>
            <span className="text-[10px] font-medium text-emerald-100/70 block">Dynamic carbon metrics</span>
          </div>
        </div>

        <div className="space-y-3 mt-1">
          <p className="text-xs font-semibold leading-relaxed text-emerald-50">
            If you maintain this active plan, you will save <span className="text-amber-300 font-extrabold text-sm">{annualSavings} kg CO₂</span> this year.
          </p>
          
          <div className="flex items-center space-x-3 bg-white/5 rounded-2xl p-3 border border-white/5">
            <div className="p-2 bg-emerald-700/60 rounded-xl shrink-0">
              <Trees className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Equivalency Offset</p>
              <p className="text-[12px] font-semibold text-white">This equates to planting <span className="font-extrabold text-amber-300">{treesSaved} trees</span> annually.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown (Individual rounded-3xl cards for Geometric rhythm) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
          <span>Your Emission Sources</span>
          <button
            onClick={onNavigateToTracker}
            className="text-emerald-700 hover:text-emerald-950 font-bold tracking-normal transition-all cursor-pointer"
          >
            Details
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Transportation */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="text-gray-700 flex items-center space-x-2">
                <Car className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Transportation</span>
              </span>
              <span className="text-emerald-950 font-bold shrink-0">{transportVal} kg</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-700 rounded-full" style={{ width: `${Math.min(100, Math.max(10, (transportVal / 250) * 100))}%` }} />
            </div>
          </div>

          {/* Diet */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="text-gray-700 flex items-center space-x-2">
                <Utensils className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Diet</span>
              </span>
              <span className="text-emerald-950 font-bold shrink-0">{dietVal} kg</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${Math.min(100, Math.max(10, (dietVal / 250) * 100))}%` }} />
            </div>
          </div>

          {/* Household */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
            <div className="flex justify-between text-sm mb-2 font-semibold">
              <span className="text-gray-700 flex items-center space-x-2">
                <Home className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Household Grid Energy</span>
              </span>
              <span className="text-emerald-950 font-bold shrink-0">{energyVal} kg</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-700/80 rounded-full" style={{ width: `${Math.min(100, Math.max(10, (energyVal / 250) * 100))}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Card with stylized left-margin and roundings */}
      <div 
        onClick={onNavigateToAssistant}
        className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100 flex gap-4 transition-colors hover:bg-emerald-100/50 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm text-emerald-600">
          <Sparkles className="w-5 h-5 fill-emerald-600 text-emerald-600 animate-pulse" />
        </div>
        <div className="flex-1">
          <span className="block text-[9px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5">
            AI Insight
          </span>
          <p className="text-xs leading-relaxed text-emerald-950 font-semibold italic">
            "Reducing your red meat intake by 2 days a week could lower your monthly footprint by another 15.4 kg CO2e!"
          </p>
        </div>
      </div>

      {/* Forest Image Card in Rounded-[2rem] Geometry */}
      <div className="relative h-32 rounded-[2rem] overflow-hidden shadow-sm transition-transform hover:scale-[1.01]">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
          alt="Forest"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-emerald-900/40 flex flex-col justify-end p-5">
          <p className="text-white font-extrabold leading-tight">Your actions protect this.</p>
          <p className="text-emerald-50/80 text-[10px] font-semibold mt-1">124 trees saved since Jan</p>
        </div>
      </div>
    </motion.div>
  );
}
