import { useState } from "react";
import { 
  Globe, 
  Car, 
  Train, 
  Bike, 
  Footprints, 
  Utensils, 
  Beef, 
  Salad, 
  Leaf, 
  Zap, 
  ArrowRight, 
  ArrowLeft 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export interface QuestionnaireViewProps {
  key?: string;
  onCompleted: (results: {
    region: 'ID' | 'US' | 'EU';
    transport: string;
    diet: string;
    energy: string;
    calculatedCO2: number;
  }) => void;
  onBack?: () => void;
}

export default function QuestionnaireView({ onCompleted, onBack }: QuestionnaireViewProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections state
  const [region, setRegion] = useState<'ID' | 'US' | 'EU'>("US");
  const [transport, setTransport] = useState<string>("transit");
  const [diet, setDiet] = useState<string>("average");
  const [energy, setEnergy] = useState<string>("medium");

  // Step information
  // Step 1: Region
  // Step 2: Transport
  // Step 3: Diet
  // Step 4: Household energy

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate footprint
      let transportEffort = 50;
      if (transport === "car") transportEffort = 180;
      if (transport === "cycling" || transport === "walking") transportEffort = 0;

      let dietEffort = 110;
      if (diet === "heavy") dietEffort = 160;
      if (diet === "vegetarian") dietEffort = 45;
      if (diet === "vegan") dietEffort = 20;

      let kwh = 250;
      if (energy === "low") kwh = 100;
      if (energy === "high") kwh = 500;

      let factor = 0.38; // US default
      if (region === "ID") factor = 0.82;
      if (region === "EU") factor = 0.25;

      const calculatedCO2 = Math.round(transportEffort + dietEffort + (kwh * factor));

      onCompleted({
        region,
        transport,
        diet,
        energy,
        calculatedCO2
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  // Content for each step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full">
                1. Regional Context
              </span>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-bold">
                <span>Step 1 of 4</span>
                <span>25% Complete</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full w-1/4 transition-all duration-500" />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-[24px] font-black text-emerald-950 leading-tight">
                Where are you located?
              </h1>
              <p className="mt-2 text-xs text-gray-500 font-semibold leading-relaxed">
                Dynamic calculations will calibrate to your regional grid emission constants.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {[
                { id: "ID", name: "Indonesia (ID)", detail: "High carbon grid (0.82 kg CO2e/kWh)", icon: Globe },
                { id: "US", name: "United States (US)", detail: "Average carbon grid (0.38 kg CO2e/kWh)", icon: Globe },
                { id: "EU", name: "European Union (EU)", detail: "Lower carbon grid (0.25 kg CO2e/kWh)", icon: Globe },
              ].map((loc) => {
                const isSelected = region === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setRegion(loc.id as 'ID' | 'US' | 'EU')}
                    className={`flex items-center space-x-4 p-4 rounded-3xl border-2 text-left transition-all duration-300 w-full ${
                      isSelected
                        ? "bg-white border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-600/30 font-medium"
                        : "bg-white border-transparent text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl transition-all duration-300 ${
                      isSelected ? "bg-emerald-50 text-emerald-800" : "bg-gray-50 text-neutral-400"
                    }`}>
                      <loc.icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-extrabold ${isSelected ? "text-emerald-900" : "text-gray-700"}`}>
                        {loc.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{loc.detail}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full">
                2. Transportation
              </span>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-bold">
                <span>Step 2 of 4</span>
                <span>50% Complete</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full w-2/4 transition-all duration-500" />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-[24px] font-black text-emerald-950 leading-tight">
                How do you primarily commute?
              </h1>
              <p className="mt-2 text-xs text-gray-500 font-semibold leading-relaxed">
                Mobility types heavily specify your direct particulate impact.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-4">
              {[
                { id: "car", label: "Car", icon: Car },
                { id: "transit", label: "Public Transit", icon: Train },
                { id: "cycling", label: "Cycling", icon: Bike },
                { id: "walking", label: "Walking", icon: Footprints },
              ].map((opt) => {
                const isSelected = transport === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTransport(opt.id)}
                    className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 text-center aspect-square transition-all duration-300 ${
                      isSelected
                        ? "bg-white border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-600/30 font-medium"
                        : "bg-white border-transparent text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-3.5 rounded-2xl transition-all duration-300 ${
                      isSelected ? "bg-emerald-50 text-emerald-800" : "bg-gray-50 text-neutral-400"
                    }`}>
                      <opt.icon className="w-7 h-7 stroke-[2]" />
                    </div>
                    <span className={`mt-3.5 text-xs ${isSelected ? "text-emerald-900 font-extrabold" : "text-gray-500 font-semibold"}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full">
                3. Dietary Intake
              </span>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-bold">
                <span>Step 3 of 4</span>
                <span>75% Complete</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full w-3/4 transition-all duration-500" />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-[24px] font-black text-emerald-950 leading-tight">
                Describe your typical diet
              </h1>
              <p className="mt-2 text-xs text-gray-500 font-semibold leading-relaxed">
                Agriculture can exceed transport footprints in greenhouse loads.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 mt-4">
              {[
                { id: "heavy", label: "Heavy Meat", icon: Beef },
                { id: "average", label: "Average Meat", icon: Utensils },
                { id: "vegetarian", label: "Vegetarian", icon: Salad },
                { id: "vegan", label: "Vegan Diet", icon: Leaf },
              ].map((opt) => {
                const isSelected = diet === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setDiet(opt.id)}
                    className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 text-center aspect-square transition-all duration-300 ${
                      isSelected
                        ? "bg-white border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-600/30 font-medium"
                        : "bg-white border-transparent text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-3.5 rounded-2xl transition-all duration-300 ${
                      isSelected ? "bg-emerald-50 text-emerald-800" : "bg-gray-50 text-neutral-400"
                    }`}>
                      <opt.icon className="w-7 h-7 stroke-[2]" />
                    </div>
                    <span className={`mt-3.5 text-xs ${isSelected ? "text-emerald-900 font-extrabold" : "text-gray-500 font-semibold"}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8b5a2b] bg-amber-50 px-3 py-1.5 rounded-full">
                4. Energy & Utilities
              </span>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-bold">
                <span>Step 4 of 4</span>
                <span>99% Complete</span>
              </div>
              <div className="mt-2 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-700 rounded-full w-full transition-all duration-500" />
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-[24px] font-black text-emerald-950 leading-tight">
                Household Electric Load
              </h1>
              <p className="mt-2 text-xs text-gray-500 font-semibold leading-relaxed">
                Region-aware energy mix maps of {region} will automatically process this.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              {[
                { id: "low", label: "Low consumption", desc: "100 kWh / Month", icon: Zap },
                { id: "medium", label: "Moderate consumption", desc: "250 kWh / Month", icon: Zap },
                { id: "high", label: "High consumption", desc: "500 kWh / Month", icon: Zap },
              ].map((opt) => {
                const isSelected = energy === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setEnergy(opt.id)}
                    className={`flex items-center space-x-4 p-4 rounded-3xl border-2 text-left transition-all duration-300 w-full ${
                      isSelected
                        ? "bg-white border-emerald-600 text-emerald-950 shadow-sm ring-1 ring-emerald-600/30 font-medium"
                        : "bg-white border-transparent text-gray-400 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl transition-all duration-300 ${
                      isSelected ? "bg-emerald-50 text-emerald-800" : "bg-gray-50 text-neutral-400"
                    }`}>
                      <opt.icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-extrabold ${isSelected ? "text-emerald-900" : "text-gray-700"}`}>
                        {opt.label}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 overflow-y-auto px-5 py-6 flex flex-col justify-between"
    >
      <div className="flex-1">
        {renderStepContent()}
      </div>

      {/* Button Actions */}
      <div className="mt-10 flex items-center justify-between pt-5 border-t border-gray-100 shrink-0 select-none">
        <button
          onClick={handleBack}
          className="flex items-center space-x-1 py-3 px-4 font-bold text-emerald-700 hover:text-emerald-900 transition-colors text-xs uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider py-3.5 px-6 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer"
        >
          <span>{currentStep === 4 ? "Done" : "Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
