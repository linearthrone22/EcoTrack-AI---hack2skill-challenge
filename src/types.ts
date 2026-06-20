export interface Task {
  id: string;
  name: string;
  points: number;
  category: 'Transport' | 'Diet' | 'Household' | 'Other';
  checked: boolean;
  co2Saved: number; // in kg CO2
  verified?: boolean;
  proofName?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isRoadmap?: boolean;
  roadmapItems?: {
    id: string;
    title: string;
    sub: string;
    co2: string;
    icon: string;
    applied?: boolean;
  }[];
}

export type ViewType = 'questionnaire' | 'dashboard' | 'tracker' | 'assistant';

export interface UserStats {
  score: number;
  streak: number;
  baselineFootprint: number; // e.g. 342 kg CO2e
  completedCount: number;
  region: 'ID' | 'US' | 'EU';
  transportType: string;
  dietType: string;
  energyType: string;
}

