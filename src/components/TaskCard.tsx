import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';

interface TaskCardProps {
  countdown: string;
  deadline?: string;
  title: string;
  description: string;
  folderColor: string;
  type: '一次性' | '循环';
  duration?: string;
  onClick?: () => void;
}

export function TaskCard({
  countdown,
  deadline,
  title,
  description,
  folderColor,
  type,
  duration,
  onClick
}: TaskCardProps) {
  const { theme } = useThemeContext();
  const isRecurring = type === '循环';
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.98,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
          }
        ]}
        onPress={onClick}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        {/* Decorative background gradient */}
        <LinearGradient
          colors={
            theme.id === 'dark' 
              ? [folderColor + '40', 'transparent']
              : [folderColor + '10', 'transparent']
          }
          style={styles.backgroundGradient}
          start={{ x: 0.2, y: 0.2 }}
          end={{ x: 1, y: 1 }}
        />
        
        <View style={styles.content}>
          {/* Left section - Countdown */}
          <View style={styles.leftSection}>
            <Text style={[styles.countdown, { color: theme.colors.foreground }]}>
              {countdown}
            </Text>
            <View style={styles.metaInfo}>
              <Ionicons 
                name={isRecurring ? "refresh-outline" : "calendar-outline"} 
                size={12} 
                color={theme.colors.mutedForeground}
              />
              <Text style={[styles.metaText, { color: theme.colors.mutedForeground }]}>
                {isRecurring ? duration : deadline}
              </Text>
            </View>
          </View>

          {/* Right section - Content */}
          <View style={styles.rightSection}>
            <View style={styles.titleRow}>
              <Text 
                style={[styles.title, { color: theme.colors.foreground }]}
                numberOfLines={2}
              >
                {title}
              </Text>
              <View
                style={[
                  styles.colorDot,
                  { 
                    backgroundColor: folderColor,
                    shadowColor: folderColor,
                    shadowOpacity: theme.id === 'dark' ? 0.4 : 0.3,
                    shadowRadius: theme.id === 'dark' ? 4 : 2,
                    elevation: 2,
                  }
                ]}
              />
            </View>
            
            <Text 
              style={[styles.description, { color: theme.colors.mutedForeground }]}
              numberOfLines={2}
            >
              {description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
  },
  content: {
    flexDirection: 'row',
    gap: 16,
    zIndex: 10,
  },
  leftSection: {
    width: 112,
    flexShrink: 0,
  },
  countdown: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
  },
  rightSection: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    flexShrink: 0,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});