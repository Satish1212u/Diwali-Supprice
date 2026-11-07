import React, { useEffect, useState } from 'react';

interface SectionMarker {
  id: string;
  icon: string;
  label: string;
}

const sections: SectionMarker[] = [
  { id: 'intro-section', icon: '🪔', label: 'Diwali Blessing' },
  { id: 'letter-section', icon: '♡', label: 'Personal Note' },
  { id: 'guestbook-section', icon: '📜', label: 'Friendship Guestbook' },
  { id: 'wishes-section', icon: '✦', label: 'Diwali Wishes' },
  { id: 'evening-celebration', icon: '🎆', label: 'Fireworks Sky' },
];

export const ScrollProgress: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro-section');
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowProgress(scrollY > 200);

      const sectionElements = sections.map((s) => ({
        id: s.id,
        el: document.getElementById(s.id),
      }));

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const item = sectionElements[i];
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!showProgress) return null;

  return (
    <nav
      aria-label="Story chapter progression"
      className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center gap-3.5 p-2 rounded-full bg-[#FFFDF9]/85 backdrop-blur-xs border border-[#FADDE8] shadow-xs"
    >
      {/* Subtle guide line behind icons */}
      <div className="absolute top-4 bottom-4 left-1/2 -translate-x-1/2 w-[1px] bg-[#DCCCF4]/50 pointer-events-none" />

      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            title={section.label}
            className={`group relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none ${
              isActive
                ? 'bg-[#FFF8F2] scale-110 shadow-xs border border-[#9E3045]/40 text-[#9E3045]'
                : 'text-[#DCCCF4] hover:text-[#9E3045]/70 hover:scale-105'
            }`}
          >
            <span
              className={`text-sm transition-transform ${
                isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(158,48,69,0.4)]' : 'grayscale opacity-75'
              }`}
            >
              {section.icon}
            </span>

            {/* Hover tooltip label */}
            <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-[#FFFDF9] border border-[#FADDE8] text-[11px] font-serif-cormorant font-medium text-[#9E3045] whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
              {section.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
