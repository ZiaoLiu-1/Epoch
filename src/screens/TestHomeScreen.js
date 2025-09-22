import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeContext } from '../context/ThemeContext';

// Test with components one at a time
import NewHeader from '../components/NewHeader';
import FilterChips from '../components/FilterChips';
import StatsCards from '../components/StatsCards';

export default function TestHomeScreen({ navigation }) {
  const { theme } = useThemeContext();
  const [currentFilter, setCurrentFilter] = useState('all');
  
  // Sample tasks for testing
  const sampleTasks = [
    { id: '1', category: 'pending', title: 'Test Task 1' },
    { id: '2', category: 'completed', title: 'Test Task 2' },
    { id: '3', category: 'overdue', title: 'Test Task 3' },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={
          theme.dark 
            ? ['#1e293b', '#0a0f1c', '#020617']
            : ['#f0f9ff', '#e0f2fe', '#f0f9ff']
        }
        style={styles.background}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <NewHeader onSettingsClick={() => console.log('Settings clicked')} />
          </View>
          
          <View style={styles.content}>
            <FilterChips
              tasks={sampleTasks}
              selectedFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
            <StatsCards tasks={sampleTasks} />
            
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Test Home Screen
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.mutedForeground }]}>
              Testing FilterChips and StatsCards components
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
