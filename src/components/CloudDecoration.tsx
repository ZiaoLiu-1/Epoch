import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../contexts/ThemeContext';

export function CloudDecoration() {
  const { theme, currentTheme } = useTheme();
  
  // Only show for warm (Ghibli) theme
  if (currentTheme !== 'warm') return null;
  
  return (
    <View style={styles.container} pointerEvents="none">
      {/* Background clouds */}
      <View style={[styles.cloud, styles.cloud1, { opacity: 0.3 }]}>
        <CloudShape size="lg" />
      </View>
      <View style={[styles.cloud, styles.cloud2, { opacity: 0.2 }]}>
        <CloudShape size="md" />
      </View>
      <View style={[styles.cloud, styles.cloud3, { opacity: 0.25 }]}>
        <CloudShape size="sm" />
      </View>
      <View style={[styles.cloud, styles.cloud4, { opacity: 0.15 }]}>
        <CloudShape size="lg" />
      </View>
      <View style={[styles.cloud, styles.cloud5, { opacity: 0.2 }]}>
        <CloudShape size="md" />
      </View>
    </View>
  );
}

function CloudShape({ size }: { size: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { width: 64, height: 40 },
    md: { width: 96, height: 56 }, 
    lg: { width: 128, height: 72 }
  };
  
  const { width, height } = sizes[size];
  
  return (
    <Svg 
      width={width}
      height={height}
      viewBox="0 0 100 60"
    >
      <Path
        d="M25 45c-8 0-15-7-15-15s7-15 15-15c1 0 3 0 4 1 3-5 8-8 14-8 9 0 16 7 16 16 0 1 0 2-1 3 4 2 7 6 7 11 0 7-6 13-13 13H25z"
        fill="rgba(255, 255, 255, 0.4)"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="1"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  cloud: {
    position: 'absolute',
  },
  cloud1: {
    top: 40,
    right: 32,
  },
  cloud2: {
    top: 128,
    left: 16,
  },
  cloud3: {
    top: 256,
    right: 64,
  },
  cloud4: {
    bottom: 384,
    left: 32,
  },
  cloud5: {
    bottom: 128,
    right: 24,
  },
});