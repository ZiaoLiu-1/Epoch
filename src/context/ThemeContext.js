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
  dark: false,
  colors: {
    primary: '#3b82f6',
    background: '#ffffff',
    card: '#f8fafc',
    text: '#1f2937',
    border: '#9ca3af',
    notification: '#ef4444',
    shadow: '#000000',
  },
};

const darkTheme = {
  dark: true,
  colors: {
    primary: '#60a5fa',
    background: '#111827',
    card: '#1f2937',
    text: '#f9fafb',
    border: '#6b7280',
    notification: '#f87171',
    shadow: '#000000',
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

