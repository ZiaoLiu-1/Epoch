import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { theme } = useTheme();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);
  
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.accent]}
          style={styles.gradient}
        />
        <View style={styles.statusSection}>
          <Animated.View 
            style={[
              styles.statusDot, 
              { 
                backgroundColor: theme.colors.success,
                opacity: pulseAnim
              }
            ]} 
          />
          <Text style={[styles.statusText, { color: theme.colors.mutedForeground }]}>
            实时同步
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        onPress={onSettingsClick}
        style={[
          styles.settingsButton,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.cardBorder,
          }
        ]}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="settings-outline" 
          size={20} 
          color={theme.colors.mutedForeground} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gradient: {
    width: 8,
    height: 32,
    borderRadius: 4,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
});