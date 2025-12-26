export interface EmotionalTheme {
  primary: string;
  secondary: string;
  gradient: string;
  particles: 'snowflakes' | 'hearts' | 'rose-petals' | 'sparkles';
  music: string;
  font: string;
}

export const emotionalThemes: Record<string, EmotionalTheme> = {
  PEACE: {
    primary: '#ff69b4', // Rose passion
    secondary: '#ff1493', // Rose profond
    gradient: 'linear-gradient(135deg, #ff69b4, #ff1493)',
    particles: 'hearts', // Cœurs au lieu de neige
    music: 'romantic-piano.mp3',
    font: 'Dancing Script'
  },
  LOVE: {
    primary: '#dc143c', // Rouge cramoisi
    secondary: '#ff6347', // Rouge tomate
    gradient: 'linear-gradient(135deg, #dc143c, #ff6347)',
    particles: 'rose-petals',
    music: 'love-song.mp3',
    font: 'Great Vibes'
  },
  JOY: {
    primary: '#ffd700', // Or
    secondary: '#ffa500', // Orange
    gradient: 'linear-gradient(135deg, #ffd700, #ffa500)',
    particles: 'sparkles',
    music: 'joyful-bells.mp3',
    font: 'Mountains of Christmas'
  },
  DEFAULT: {
    primary: '#0ea5e9', // Bleu saphir
    secondary: '#8b5cf6', // Violet
    gradient: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)',
    particles: 'snowflakes',
    music: 'winter-piano.mp3',
    font: 'Inter'
  }
};

export const getEmotionalTheme = (name: string): EmotionalTheme => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('peace') || lowerName.includes('noukouyekpon') || lowerName.includes('isabelle') || lowerName.includes('corache')) {
    return emotionalThemes.PEACE;
  }
  // Add more conditions for other themes if needed
  return emotionalThemes.DEFAULT;
};