import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

const PRIORITY_FILTERS = new Set(['high', 'medium', 'low']);

const DEFAULT_FILTERS = [
  { id: 'all', label: '全部' },
  { id: 'completed', label: '已完成' },
  { id: 'pending', label: '未完成' },
  { id: 'overdue', label: '逾期' },
  { id: 'csc3', label: 'CSC3' }
];

const computeCount = (tasks, filterId) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }

  if (filterId === 'all') {
    return tasks.length;
  }

  if (filterId === 'overdue') {
    return tasks.filter(task => {
      if (task.category === 'overdue') {
        return true;
      }

      if (!task.deadline || task.category === 'completed') {
        return false;
      }

      const dueDate = new Date(task.deadline);
      return !Number.isNaN(dueDate.getTime()) && dueDate < new Date();
    }).length;
  }

  if (PRIORITY_FILTERS.has(filterId)) {
    return tasks.filter(task => task.priority === filterId).length;
  }

  return tasks.filter(task => task.category === filterId).length;
};

export default function FilterChips({
  tasks = [],
  filters,
  selectedFilter,
  selected,
  onFilterChange,
  onSelect
}) {
  const { theme } = useThemeContext();

  const activeFilter = selectedFilter ?? selected ?? 'all';
  const handleChange = onFilterChange ?? onSelect;

  const filterOptions = (filters && filters.length ? filters : DEFAULT_FILTERS).map(option => ({
    ...option,
    count: option.count ?? computeCount(tasks, option.id),
  }));

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
          onPress={() => handleChange && handleChange(option.id)}
          style={[
            styles.filterChip,
            {
              backgroundColor: activeFilter === option.id
                ? theme.colors.primary + '20'
                : theme.colors.card,
              borderColor: activeFilter === option.id
                ? theme.colors.primary
                : theme.colors.cardBorder || theme.colors.border,
              borderWidth: activeFilter === option.id ? 2 : 1,
              opacity: handleChange ? 1 : 0.6,
            }
          ]}
          activeOpacity={0.7}
          disabled={!handleChange}
        >
          <Text
            style={[
              styles.filterLabel,
              {
                color: activeFilter === option.id
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
                backgroundColor: activeFilter === option.id
                  ? theme.colors.primary + '30'
                  : theme.colors.cardBorder || theme.colors.border,
              }
            ]}
          >
            <Text
              style={[
                styles.countText,
                {
                  color: activeFilter === option.id
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
