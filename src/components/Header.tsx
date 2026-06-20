import { Bell } from "lucide-react";

export interface HeaderProps {
  onAvatarClick?: () => void;
}

export default function Header({ onAvatarClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 pt-9 pb-3 bg-gray-50 shrink-0 sticky top-0 z-40">
      <button 
        id="header-profile-avatar-btn"
        className="flex items-center space-x-3 cursor-pointer group text-left border-none bg-transparent p-0 focus:outline-none"
        onClick={onAvatarClick}
        aria-label="View or reset profile preferences"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 overflow-hidden shrink-0">
          <img
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80"
            alt="User Profile Image"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-bold text-emerald-900 tracking-tight text-lg selection:bg-emerald-100">
          EcoTrack AI
        </span>
      </button>
      
      <button 
        id="header-notifications-btn"
        className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-all border-none bg-transparent focus:outline-none"
        aria-label="System notifications (1 new alert)"
      >
        <Bell className="w-5 h-5 text-gray-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
      </button>
    </header>
  );
}
