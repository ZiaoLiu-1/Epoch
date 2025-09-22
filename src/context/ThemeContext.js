import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

const lightTheme = {
  id: 'light',
  dark: false,
  colors: {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    card: '#ffffff',
    cardBorder: '#e5e7eb',
    text: '#1f2937',
    border: '#e5e7eb',
    notification: '#ef4444',
    shadow: '#000000',
    // Additional colors for compatibility
    foreground: '#1f2937',
    mutedForeground: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    accent: '#e9ebef',
  },
  styles: {
    backgroundImage: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)',
    cardStyle: 'shadow-sm',
    shadowStyle: 'shadow-lg',
  },
};

const darkTheme = {
  id: 'dark',
  dark: true,
  colors: {
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    background: '#0a0f1c',
    backgroundSecondary: '#0f1724',
    card: '#111827',
    cardBorder: '#1f2937',
    text: '#f8fafc',
    border: '#1f2937',
    notification: '#f87171',
    shadow: '#000000',
    // Additional colors for compatibility
    foreground: '#f8fafc',
    mutedForeground: '#94a3b8',
    success: '#10b981',
    warning: '#f59e0b',
    destructive: '#ef4444',
    accent: '#60a5fa',
  },
  styles: {
    backgroundImage: 'radial-gradient(ellipse at top, #1e293b 0%, #0a0f1c 50%, #020617 100%)',
    cardStyle: 'shadow-lg',
    shadowStyle: 'shadow-xl',
  },
};

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system'); // 'light', 'dark', 'system'
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    updateTheme();
  }, [themeMode, systemColorScheme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme) {
        setThemeMode(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme preference:', error);
    }
  };

  const updateTheme = () => {
    let theme;
    if (themeMode === 'system') {
      theme = systemColorScheme === 'dark' ? darkTheme : lightTheme;
    } else {
      theme = themeMode === 'dark' ? darkTheme : lightTheme;
    }
    setCurrentTheme(theme);
  };

  const changeTheme = async (mode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        themeMode,
        changeTheme,
        isDark: currentTheme.dark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

