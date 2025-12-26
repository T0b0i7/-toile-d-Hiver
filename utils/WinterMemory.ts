interface UserData {
  fullName: string;
  isSpecial?: boolean;
}

interface ExperienceData {
  theme: string;
  duration: number;
  interactions: number;
  wish?: string;
}

interface Memory {
  user: UserData;
  experience: ExperienceData;
  date: string;
  season: string;
  weather?: any;
}

export class WinterMemory {
  private memories: Record<string, Memory> = {};

  constructor() {
    this.loadMemories();
  }

  private loadMemories() {
    const stored = localStorage.getItem('winterMemories');
    if (stored) {
      this.memories = JSON.parse(stored);
    }
  }

  saveMemory(userData: UserData, experienceData: ExperienceData): string {
    const memoryId = `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.memories[memoryId] = {
      user: userData,
      experience: experienceData,
      date: new Date().toISOString(),
      season: this.getCurrentSeason(),
      weather: null // Could integrate with weather API
    };

    localStorage.setItem('winterMemories', JSON.stringify(this.memories));

    // Return a shareable link
    return `${window.location.origin}/memory/${memoryId}`;
  }

  loadMemory(memoryId: string): Memory | null {
    return this.memories[memoryId] || null;
  }

  getCurrentSeason(): string {
    const month = new Date().getMonth();
    if (month >= 11 || month <= 1) return 'deep-winter';
    if (month >= 2 && month <= 4) return 'spring-winter';
    if (month >= 5 && month <= 7) return 'summer-winter';
    return 'autumn-winter';
  }

  generateNewElements(memory: Memory): any {
    // Generate new elements based on previous experience
    const timeDiff = Date.now() - new Date(memory.date).getTime();
    const daysSince = timeDiff / (1000 * 60 * 60 * 24);

    return {
      newThemes: daysSince > 30 ? ['evolved-theme'] : [],
      specialMessage: daysSince > 7 ? "Ton étoile brille toujours..." : null,
      returnBonus: daysSince > 1 ? 'bonus-particles' : null
    };
  }

  getAllMemories(): Record<string, Memory> {
    return { ...this.memories };
  }
}

export const createPersonalizedOutro = (userData: UserData, experienceData: ExperienceData) => {
  const memory = new WinterMemory();

  const outroMessages = {
    PEACE: {
      title: "Pour mon Amazone Éternelle",
      message: `À toi, ${userData.fullName}, qui illumines chaque hiver,\nQue chaque étoile garde le souvenir de cette nuit.\nTon guerrier t'attendra toujours sous la même constellation.`,
      gift: "constellation-custom.png"
    },
    default: {
      title: "Merci d'avoir partagé ce moment",
      message: "Que la magie de l'hiver accompagne tes pas.\nReviens quand ton cœur aura besoin de poésie.",
      gift: "winter-star.png"
    }
  };

  const outro = userData.isSpecial ? outroMessages.PEACE : outroMessages.default;

  // Create memory image (simulated)
  const memoryCanvas = document.createElement('canvas');
  memoryCanvas.width = 400;
  memoryCanvas.height = 300;
  const ctx = memoryCanvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Souvenir de ${userData.fullName}`, 200, 150);
    ctx.fillText(new Date().toLocaleDateString(), 200, 180);
  }

  // Generate return code
  const returnCode = btoa(`${userData.fullName}_${Date.now()}_${Math.random()}`).substr(0, 16);

  // Save memory
  const memoryLink = memory.saveMemory(userData, experienceData);

  return {
    ...outro,
    memory: memoryCanvas.toDataURL(),
    returnCode,
    shareable: memoryLink,
    memoryId: returnCode
  };
};