// SABA'S MEMORIES — REPLACE OR ADD REAL PHOTOS
// Images have been removed as requested. You can easily add real photo paths or upload anytime!

export interface MemoryItem {
  id: string;
  image?: string;
  caption: string;
  note: string;
  date?: string;
  rotation: string; // e.g. "-rotate-2", "rotate-3"
  tapeColor?: 'pink' | 'lavender' | 'gold';
  tapePosition?: 'top' | 'top-left' | 'top-right' | 'corners';
  aspect?: 'portrait' | 'landscape' | 'square';
  tag?: string;
  icon?: string;
}

export const diwaliConfig = {
  name: "Saba",
  sender: "Satish Gupta",
  year: "2026",
};

export const memories: MemoryItem[] = [
  {
    id: "mem-1",
    image: "",
    caption: "this one still makes me smile",
    note: "Steaming hot chai, endless conversations, and completely losing track of time. Some talks just stay with you.",
    date: "A quiet winter evening",
    rotation: "-rotate-2",
    tapeColor: "pink",
    tapePosition: "top",
    aspect: "landscape",
    tag: "Chai & Conversations",
    icon: "☕"
  },
  {
    id: "mem-2",
    image: "",
    caption: "some moments deserve to stay",
    note: "Holding sparklers until our fingers were warm and the sky was full of smoke and golden sparkles. Truly unmatched festive happiness.",
    date: "Diwali festivities",
    rotation: "rotate-3",
    tapeColor: "gold",
    tapePosition: "top-right",
    aspect: "portrait",
    tag: "Golden Sparks",
    icon: "✨"
  },
  {
    id: "mem-3",
    image: "",
    caption: "okay this was actually funny 😂",
    note: "Uncontrollable laughing over the stupidest joke that nobody else in the world would ever understand. My stomach literally hurt.",
    date: "Sunny afternoon",
    rotation: "-rotate-1",
    tapeColor: "lavender",
    tapePosition: "top-left",
    aspect: "landscape",
    tag: "Pure Chaos",
    icon: "😂"
  },
  {
    id: "mem-4",
    image: "",
    caption: "one for the memory box",
    note: "Opening the fresh mithai box and debating whether Kaju Katli is superior to all other sweets (we both already know it is).",
    date: "Sweet traditions",
    rotation: "rotate-2",
    tapeColor: "pink",
    tapePosition: "top",
    aspect: "square",
    tag: "Festive Joy",
    icon: "🍬"
  }
];
