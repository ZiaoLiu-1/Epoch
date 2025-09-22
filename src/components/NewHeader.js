import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeContext } from '../context/ThemeContext';

export default function NewHeader({ onSettingsClick }) {
  const { theme } = useThemeContext();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
          colors={[theme.colors.primary, theme.colors.accent || theme.colors.primary]}
          style={styles.gradient}
        />
        <View style={styles.statusSection}>
          <Animated.View 
            style={[
              styles.statusDot, 
              { 
                backgroundColor: theme.colors.success || '#10B981',
                opacity: pulseAnim
              }
            ]} 
          />
          <Text style={[styles.statusText, { color: theme.colors.mutedForeground || theme.colors.text }]}>
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
            borderColor: theme.colors.cardBorder || theme.colors.border,
          }
        ]}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="settings-outline" 
          size={20} 
          color={theme.colors.mutedForeground || theme.colors.text} 
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