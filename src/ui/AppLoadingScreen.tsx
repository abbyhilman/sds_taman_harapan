import React from 'react';

interface AppLoadingScreenProps {
  label?: string;
}

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ 
  label = 'Menyiapkan halaman...' 
}) => {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#f8fbff]/95 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center text-center">
        {/* Logo memantul lembut menggunakan CSS Bounce murni yang disesuaikan */}
        <div className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-white shadow-xl shadow-cyan-100 animate-bounce">
          <img 
            src="/images/logo_tamhar.png" 
            alt="SDS Taman Harapan" 
            className="h-16 w-16 object-contain" 
          />
        </div>
        
        {/* Titik loading dengan staggered delay murni CSS */}
        <div className="mb-3 flex gap-1.5 justify-center">
          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '0ms' }} />
          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '150ms' }} />
          <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
        
        <p className="text-sm font-medium text-slate-700 animate-pulse">{label}</p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
