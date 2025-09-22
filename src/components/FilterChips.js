import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

export default function FilterChips({ tasks = [], selectedFilter, onFilterChange }) {
  const { theme } = useThemeContext();
  
  const getTaskCount = (filter) => {
    if (filter === 'all') return tasks.length;
    return tasks.filter(task => task.category === filter).length;
  };

  const filterOptions = [
    { id: 'all', label: '全部', count: getTaskCount('all') },
    { id: 'completed', label: '已完成', count: getTaskCount('completed') },
    { id: 'pending', label: '未完成', count: getTaskCount('pending') },
    { id: 'overdue', label: '逾期', count: getTaskCount('overdue') },
    { id: 'csc3', label: 'CSC3', count: getTaskCount('csc3') }
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
                : theme.colors.cardBorder || theme.colors.border,
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
                  : theme.colors.mutedForeground || theme.colors.text,
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
                  : theme.colors.cardBorder || theme.colors.border,
              }
            ]}
          >
            <Text 
              style={[
                styles.countText,
                {
                  color: selectedFilter === option.id 
                    ? theme.colors.primary 
                    : theme.colors.mutedForeground || theme.colors.text,
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
    marginBottom: 16,
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