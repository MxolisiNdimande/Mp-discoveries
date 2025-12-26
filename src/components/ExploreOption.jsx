import React from 'react';

export function ExploreOption({ Icon, title, subtitle, onClick, className = '', compact = false, topbar = false }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') onClick && onClick();
  };

  // Topbar variant matches the Current Time block sizing and spacing
  const containerClasses = `bg-black/60 backdrop-blur-md rounded-2xl ${topbar ? 'px-8 py-4' : compact ? 'px-2 py-1' : 'px-6 py-4'} border border-white/20 cursor-pointer ${className} ${topbar ? 'w-auto min-w-[140px]' : compact ? 'w-12 sm:w-44' : 'w-full sm:w-64 md:w-72'} flex items-center transform transition-transform duration-200 hover:scale-105 focus:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50`;
  const innerGap = `${topbar ? 'gap-3' : compact ? 'gap-2 md:gap-4' : 'gap-4 md:gap-8'}`;
  const iconClass = `${topbar ? 'h-6 w-6' : compact ? 'h-5 w-5 md:h-7 md:w-7' : 'h-8 w-8 md:h-9 md:w-9'}`;
  const dividerClass = `${topbar ? 'h-12' : compact ? 'h-8' : 'h-10 md:h-12'} w-px bg-white/20 md:bg-white/30`;
  const titleClass = `${topbar ? 'text-xl' : compact ? 'text-sm md:text-base' : 'text-lg md:text-xl'}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={containerClasses}
    >
      <div className={`flex items-center ${innerGap}`}>
        {Icon && <Icon className={iconClass} />}
        <div className={dividerClass} />
        <div>
          {subtitle && <p className="text-sm opacity-80 hidden sm:block">{subtitle}</p>}
          <p className={`${titleClass} ${compact ? 'hidden sm:block' : ''}`}>{title}</p>
        </div>
      </div>
    </div>
  );
}
