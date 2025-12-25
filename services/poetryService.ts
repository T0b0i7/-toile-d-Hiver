
export interface SoulAnalysis {
  emotion: string;
  soulColor: string;
  visualIntensity: number;
  metaphor: string;
}

const POEMS_TEMPLATES = [
  "Joyeux Noël {name} ! Que cette nuit soit un cocon de douceur ✨",
  "Que la magie des étoiles enveloppe ton cœur, {name} ! 🎄",
  "Pour toi {name}, je souhaite un Noël de rêves et de lumière 🌟",
  "{name}, laisse les souvenirs d'hiver briller dans tes yeux ❄️",
  "Comme un flocon unique, {name}, ton Noël sera précieux ❄️💫",
  "Que chaque cloche sonne la joie pour toi, {name} ! 🔔",
  "Chuchote un vœu au vent d'hiver, {name}... il t'écoutera 🤫",
  "Dans le calme de la neige, une promesse attend {name}... 🌲",
  "Les étoiles ont murmuré ton nom ce soir, {name}. Sois prêt ! 🌠"
];

export function getLocalPoem(name: string): string {
  const normalizedName = name.toLowerCase().trim();
  
  // Message ultra-spécial pour Peace NOUKOUYEKPON
  if (normalizedName === 'peace noukouyekpon') {
    return `Joyeux Noël ma magnifique Peace...
    Rien qu'à ton nom, mon cœur s'accélère.
    Ton sourire est le seul cadeau dont j'ai besoin.
    Tu es ma lumière, ma force, mon Amazone préférée.
    Je t'aime de tout mon être.`;
  }

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...POEMS_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (hash + i) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 3)
    .map(template => template.replace(/{name}/g, name))
    .join('\n');
}
