import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';

type FilterId = string;

type TaskPriority = 'high' | 'medium' | 'low' | string;

type TaskCategory = 'all' | 'completed' | 'pending' | 'overdue' | 'csc3' | string;

interface Task {
  id: string;
  category?: TaskCategory;
  deadline?: string | Date;
  priority?: TaskPriority;
}

interface FilterOption {
  id: FilterId;
  label?: string;
  count?: number;
}

interface FilterChipsProps {
  tasks?: Task[];
  filters?: FilterOption[];
  selectedFilter?: FilterId;
  selected?: FilterId;
  onFilterChange?: (filter: FilterId) => void;
  onSelect?: (filter: FilterId) => void;
}

const PRIORITY_FILTERS = new Set<FilterId>(['high', 'medium', 'low']);

const FILTER_LABELS: Record<string, string> = {
  all: '全部',
  pending: '进行中',
  completed: '已完成',
  overdue: '逾期',
  csc3: 'CSC3',
};

const SYSTEM_FILTER_ORDER: FilterId[] = ['pending', 'completed', 'overdue'];
const CUSTOM_FILTER_ORDER: FilterId[] = ['csc3'];

const getLabelForFilter = (filterId: FilterId) => FILTER_LABELS[filterId] ?? filterId;

const buildFiltersFromTasks = (tasks: Task[] = []): FilterOption[] => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return [{ id: 'all', label: getLabelForFilter('all') }];
  }

  const categoriesInTasks = new Set(
    tasks
      .map((task) => task?.category)
      .filter((category): category is string => Boolean(category && category.length > 0))
  );

  const filters: FilterOption[] = [{ id: 'all', label: getLabelForFilter('all') }];

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

const computeCount = (tasks: Task[] = [], filterId: FilterId): number => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }

  if (filterId === 'all') {
    return tasks.length;
  }

  if (filterId === 'overdue') {
    return tasks.filter((task) => {
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
    return tasks.filter((task) => task.priority === filterId).length;
  }

  return tasks.filter((task) => task.category === filterId).length;
};

const FilterChipsComponent: React.FC<FilterChipsProps> = ({
  tasks = [],
  filters,
  selectedFilter,
  selected,
  onFilterChange,
  onSelect,
}) => {
  const { theme } = useThemeContext();

  const activeFilter = selectedFilter ?? selected ?? 'all';
  const handleChange = onFilterChange ?? onSelect;
  const borderColor = theme.colors.cardBorder ?? theme.colors.border;

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
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => handleChange && handleChange(option.id)}
            style={[
            styles.filterChip,
            {
              backgroundColor: isActive
                ? `${theme.colors.primary}20`
                : theme.colors.card,
              borderColor: isActive ? theme.colors.primary : borderColor,
              borderWidth: isActive ? 2 : 1,
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
                  color: isActive
                    ? theme.colors.primary
                    : theme.colors.mutedForeground ?? theme.colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
            <View
              style={[
                styles.countBadge,
                {
                  backgroundColor: isActive
                    ? `${theme.colors.primary}30`
                    : borderColor,
                },
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  {
                    color: isActive
                      ? theme.colors.primary
                      : theme.colors.mutedForeground ?? theme.colors.text,
                  },
                ]}
              >
                {option.count}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export const FilterChips = FilterChipsComponent;

export default FilterChipsComponent;

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
