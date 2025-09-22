import { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'dark' | 'undraw' | 'warm' | 'morandi';

interface Theme {
  id: ThemeType;
  name: string;
  colors: {
    background: string;
    backgroundSecondary: string;
    foreground: string;
    card: string;
    cardHover: string;
    cardBorder: string;
    muted: string;
    mutedForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    destructive: string;
  };
  styles: {
    backgroundImage: string;
    cardStyle: string;
    buttonStyle: string;
    shadowStyle: string;
  };
}

const themes: Record<ThemeType, Theme> = {
  dark: {
    id: 'dark',
    name: '深色玻璃',
    colors: {
      background: '#0A0F1C',
      backgroundSecondary: '#0F1724',
      foreground: '#F8FAFC',
      card: 'rgba(255, 255, 255, 0.05)',
      cardHover: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(255, 255, 255, 0.1)',
      muted: '#64748B',
      mutedForeground: '#94A3B8',
      primary: '#3B82F6',
      primaryForeground: '#FFFFFF',
      secondary: '#1E293B',
      accent: '#60A5FA',
      success: '#10B981',
      warning: '#F59E0B',
      destructive: '#EF4444',
    },
    styles: {
      backgroundImage: 'radial-gradient(ellipse at top, #1e293b 0%, #0a0f1c 50%, #020617 100%)',
      cardStyle: 'backdrop-blur-sm',
      buttonStyle: 'backdrop-blur-sm',
      shadowStyle: 'shadow-xl shadow-black/25',
    }
  },
  undraw: {
    id: 'undraw',
    name: '白色简约',
    colors: {
      background: '#FFFFFF',
      backgroundSecondary: '#FAFAFA',
      foreground: '#1A1A1A',
      card: '#FFFFFF',
      cardHover: '#F8F8F8',
      cardBorder: '#E5E5E5',
      muted: '#6B7280',
      mutedForeground: '#9CA3AF',
      primary: '#000000',
      primaryForeground: '#FFFFFF',
      secondary: '#F3F4F6',
      accent: '#374151',
      success: '#059669',
      warning: '#D97706',
      destructive: '#DC2626',
    },
    styles: {
      backgroundImage: '#FFFFFF',
      cardStyle: 'shadow-sm border',
      buttonStyle: 'shadow-sm',
      shadowStyle: 'shadow-sm shadow-gray-100',
    }
  },
  warm: {
    id: 'warm',
    name: '宫崎骏风格',
    colors: {
      background: '#F7F3E7',
      backgroundSecondary: '#ECE6D2',
      foreground: '#4A4137',
      card: 'rgba(255, 255, 255, 0.85)',
      cardHover: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(139, 125, 96, 0.15)',
      muted: '#8B7D60',
      mutedForeground: '#6B6554',
      primary: '#6B8E23',
      primaryForeground: '#FFFFFF',
      secondary: '#DDD6C1',
      accent: '#CD853F',
      success: '#228B22',
      warning: '#DAA520',
      destructive: '#CD5C5C',
    },
    styles: {
      backgroundImage: 'linear-gradient(135deg, #E6F3FF 0%, #F0F8E8 25%, #FFF8DC 50%, #F5F5DC 75%, #F7F3E7 100%)',
      cardStyle: 'backdrop-blur-sm border shadow-lg rounded-3xl',
      buttonStyle: 'shadow-md rounded-2xl',
      shadowStyle: 'shadow-xl shadow-green-200/30',
    }
  },
  morandi: {
    id: 'morandi',
    name: '莫兰迪色系',
    colors: {
      background: '#F5F2F0',
      backgroundSecondary: '#EAE7E4',
      foreground: '#4A453F',
      card: '#FDFCFB',
      cardHover: '#F8F6F4',
      cardBorder: '#D1CECB',
      muted: '#9C9188',
      mutedForeground: '#6F6B63',
      primary: '#A0938A',
      primaryForeground: '#FFFFFF',
      secondary: '#E8E4E1',
      accent: '#C4B5A0',
      success: '#8B9B8A',
      warning: '#D4B896',
      destructive: '#C89B9B',
    },
    styles: {
      backgroundImage: 'linear-gradient(135deg, #F5F2F0 0%, #ECE8E5 25%, #E8E4E1 50%, #E4DFD8 75%, #DFD9D1 100%)',
      cardStyle: 'shadow-lg border rounded-2xl',
      buttonStyle: 'shadow-md rounded-xl',
      shadowStyle: 'shadow-xl shadow-gray-300/20',
    }
  }
};

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
  themes: Record<ThemeType, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('morandi');

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      theme: themes[currentTheme],
      setTheme,
      themes
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}