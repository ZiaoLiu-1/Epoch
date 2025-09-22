import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

interface Task {
  id: string;
  countdown: string;
  deadline?: string;
  title: string;
  description: string;
  folderColor: string;
  type: '一次性' | '循环';
  duration?: string;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
}

type FilterType = 'all' | 'completed' | 'pending' | 'overdue' | 'csc3';

interface FilterChipsProps {
  tasks: Task[];
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterChips({ tasks, selectedFilter, onFilterChange }: FilterChipsProps) {
  const { theme } = useThemeContext();
  
  const getTaskCount = (filter: FilterType) => {
    if (filter === 'all') return tasks.length;
    return tasks.filter(task => task.category === filter).length;
  };

  const filterOptions = [
    { id: 'all' as FilterType, label: '全部', count: getTaskCount('all') },
    { id: 'completed' as FilterType, label: '已完成', count: getTaskCount('completed') },
    { id: 'pending' as FilterType, label: '未完成', count: getTaskCount('pending') },
    { id: 'overdue' as FilterType, label: '逾期', count: getTaskCount('overdue') },
    { id: 'csc3' as FilterType, label: 'CSC3', count: getTaskCount('csc3') }
  ];
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {filterOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          onPress={() => onFilterChange(option.id)}
          style={[
            styles.filterChip,
            {
              backgroundColor: selectedFilter === option.id 
                ? theme.colors.primary + '20' 
                : theme.colors.card,
              borderColor: selectedFilter === option.id 
                ? theme.colors.primary 
                : theme.colors.cardBorder,
              borderWidth: selectedFilter === option.id ? 2 : 1,
            }
          ]}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.filterLabel,
              {
                color: selectedFilter === option.id 
                  ? theme.colors.primary 
                  : theme.colors.mutedForeground,
              }
            ]}
          >
            {option.label}
          </Text>
          <View 
            style={[
              styles.countBadge,
              {
                backgroundColor: selectedFilter === option.id 
                  ? theme.colors.primary + '30' 
                  : theme.colors.cardBorder,
              }
            ]}
          >
            <Text 
              style={[
                styles.countText,
                {
                  color: selectedFilter === option.id 
                    ? theme.colors.primary 
                    : theme.colors.mutedForeground,
                }
              ]}
            >
              {option.count}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 8,
  },
  container: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  countText: {
    fontSize: 12,
  },
});