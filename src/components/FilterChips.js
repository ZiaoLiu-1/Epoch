import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

const PRIORITY_FILTERS = new Set(['high', 'medium', 'low']);

const FILTER_LABELS = {
  all: '全部',
  pending: '进行中',
  completed: '已完成',
  overdue: '逾期',
  csc3: 'CSC3',
};

const SYSTEM_FILTER_ORDER = ['pending', 'completed', 'overdue'];
const CUSTOM_FILTER_ORDER = ['csc3'];

const getLabelForFilter = (filterId) => FILTER_LABELS[filterId] || filterId;

const buildFiltersFromTasks = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [{ id: 'all', label: getLabelForFilter('all') }];
  }

  const categoriesInTasks = new Set(
    tasks
      .map((task) => task?.category)
      .filter((category) => typeof category === 'string' && category.length > 0)
  );

  const filters = [{ id: 'all', label: getLabelForFilter('all') }];

  SYSTEM_FILTER_ORDER.forEach((filterId) => {
    if (categoriesInTasks.has(filterId)) {
      filters.push({ id: filterId, label: getLabelForFilter(filterId) });
    }
  });

  CUSTOM_FILTER_ORDER.forEach((filterId) => {
    if (categoriesInTasks.has(filterId)) {
      filters.push({ id: filterId, label: getLabelForFilter(filterId) });
    }
  });

  categoriesInTasks.forEach((category) => {
    if (!filters.some((filter) => filter.id === category)) {
      filters.push({ id: category, label: getLabelForFilter(category) });
    }
  });

  return filters;
};

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

  const providedFilters = Array.isArray(filters) && filters.length > 0
    ? filters
    : buildFiltersFromTasks(tasks);

  const filterOptions = providedFilters.map((option) => ({
    ...option,
    label: option.label ?? getLabelForFilter(option.id),
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
              backgroundColor:
                activeFilter === option.id
                  ? theme.colors.primary + '20'
                  : theme.colors.card,
              borderColor:
                activeFilter === option.id
                  ? theme.colors.primary
                  : theme.colors.cardBorder || theme.colors.border,
              borderWidth: activeFilter === option.id ? 2 : 1,
              opacity: handleChange ? 1 : 0.6,
            },
          ]}
          activeOpacity={0.7}
          disabled={!handleChange}
        >
          <Text
            style={[
              styles.filterLabel,
              {
                color:
                  activeFilter === option.id
                    ? theme.colors.primary
                    : theme.colors.mutedForeground || theme.colors.text,
              },
            ]}
          >
            {option.label}
          </Text>
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor:
                  activeFilter === option.id
                    ? theme.colors.primary + '30'
                    : theme.colors.cardBorder || theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.countText,
                {
                  color:
                    activeFilter === option.id
                      ? theme.colors.primary
                      : theme.colors.mutedForeground || theme.colors.text,
                },
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
    alignItems: 'center',
    paddingHorizontal: 4,
    columnGap: 12,
    rowGap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
