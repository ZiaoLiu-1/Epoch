import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';

interface FloatingActionButtonProps {
  onClick?: () => void;
  onPress?: () => void;
  icon?: string;
  color?: string;
}

export default function FloatingActionButton({ onClick, onPress, icon = 'add', color }: FloatingActionButtonProps) {
  const { theme } = useThemeContext();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePress = () => {
    if (onPress) onPress();
    if (onClick) onClick();
  };

  React.useEffect(() => {
    if (theme.dark) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [theme.id, pulseAnim]);
  
  const handleAddTask = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (onClick) {
      onClick();
    }
  };

  const getGradientColors = () => {
    switch (theme.id) {
      case 'dark':
        return ['#3B82F6', '#1D4ED8', '#1E40AF'];
      case 'undraw':
        return [theme.colors.primary, theme.colors.accent];
      default:
        return [theme.colors.primary, theme.colors.accent];
    }
  };

  return (
    <View style={styles.container}>
      {/* Pulse effect background for dark theme */}
      {theme.id === 'dark' && (
        <Animated.View 
          style={[
            styles.pulseBackground,
            {
              transform: [{ scale: pulseAnim }],
              opacity: pulseAnim.interpolate({
                inputRange: [1, 1.1],
                outputRange: [0.3, 0.1],
              }),
            }
          ]}
        >
          <LinearGradient
            colors={['#60A5FA', '#3B82F6']}
            style={styles.pulseGradient}
          />
        </Animated.View>
      )}
      
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getGradientColors()}
            style={styles.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Overlay gradient for glass effect */}
            <LinearGradient
              colors={[
                theme.id === 'dark' 
                  ? 'rgba(255,255,255,0.1)' 
                  : theme.id === 'undraw'
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.2)',
                'transparent'
              ]}
              style={styles.overlay}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            
            <View style={styles.iconContainer}>
              <Ionicons 
                name={icon as any} 
                size={28} 
                color={color || theme.colors.text}
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    zIndex: 50,
  },
  pulseBackground: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  pulseGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});