// 从Figma设计转换的新主题系统
export const themes = {
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
      // React Native特有颜色
      text: '#F8FAFC',
      border: 'rgba(255, 255, 255, 0.1)',
    },
    styles: {
      backgroundGradient: ['#1e293b', '#0a0f1c', '#020617'],
      cardStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
      },
      buttonStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }
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
      // React Native特有颜色
      text: '#1A1A1A',
      border: '#E5E5E5',
    },
    styles: {
      backgroundGradient: ['#FFFFFF', '#FAFAFA'],
      cardStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      },
      buttonStyle: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }
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
      // React Native特有颜色
      text: '#4A4137',
      border: 'rgba(139, 125, 96, 0.15)',
    },
    styles: {
      backgroundGradient: ['#E6F3FF', '#F0F8E8', '#FFF8DC', '#F5F5DC', '#F7F3E7'],
      cardStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(139, 125, 96, 0.15)',
        shadowColor: '#6B8E23',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
      },
      buttonStyle: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 16,
        shadowColor: '#6B8E23',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }
    }
  }
};

// 获取当前主题的工具函数
export const getCurrentTheme = (themeId = 'dark') => {
  return themes[themeId] || themes.dark;
};

// 主题相关的样式工具
export const createThemedStyles = (theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    ...theme.styles.cardStyle,
    padding: 16,
    margin: 8,
  },
  button: {
    ...theme.styles.buttonStyle,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.colors.text,
  },
  mutedText: {
    color: theme.colors.mutedForeground,
  },
  primaryText: {
    color: theme.colors.primary,
  },
});

export default themes;
