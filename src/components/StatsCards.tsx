import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';

type TaskCategory = 'pending' | 'completed' | 'overdue' | string;
type TaskPriority = 'high' | 'medium' | 'low' | string;

interface Task {
  category?: TaskCategory;
  deadline?: string | Date;
  priority?: TaskPriority;
}

interface TaskMetrics {
  total: number;
  pending: number;
  completed: number;
  overdue: number;
  efficiency: number;
}

interface StatsCardsProps {
  tasks?: Task[];
}

const getTaskMetrics = (tasks: Task[] = []): TaskMetrics => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return {
      total: 0,
      pending: 0,
      completed: 0,
      overdue: 0,
      efficiency: 0,
    };
  }

  const now = new Date();

  const metrics = tasks.reduce(
    (acc, task) => {
      const category = task.category;

      if (category === 'completed') {
        acc.completed += 1;
      } else if (category === 'pending') {
        acc.pending += 1;
      }

      const isOverdue = (() => {
        if (category === 'overdue') {
          return true;
        }

        if (!task.deadline || category === 'completed') {
          return false;
        }

        const deadlineDate = new Date(task.deadline);
        return !Number.isNaN(deadlineDate.getTime()) && deadlineDate < now;
      })();

      if (isOverdue) {
        acc.overdue += 1;
      }

      return acc;
    },
    { pending: 0, completed: 0, overdue: 0 }
  );

  const total = tasks.length;
  const efficiency = total > 0 ? Math.round((metrics.completed / total) * 100) : 0;

  return {
    total,
    pending: metrics.pending,
    completed: metrics.completed,
    overdue: metrics.overdue,
    efficiency,
  };
};

const StatsCardsComponent: React.FC<StatsCardsProps> = ({ tasks = [] }) => {
  const { theme } = useThemeContext();

  const metrics = useMemo(() => getTaskMetrics(tasks), [tasks]);
  const borderColor = theme.colors.cardBorder ?? theme.colors.border;
  const successColor = theme.colors.success ?? '#10B981';
  const destructiveColor = theme.colors.destructive ?? '#EF4444';

  const statsData = [
    {
      id: 'pending',
      label: '进行中',
      value: String(metrics.pending),
      icon: 'time-outline' as const,
      trend: metrics.total > 0 ? `+${metrics.pending}` : '+0',
      trendUp: metrics.pending <= metrics.total / 2,
    },
    {
      id: 'completed',
      label: '已完成',
      value: String(metrics.completed),
      icon: 'checkmark-circle-outline' as const,
      trend: `+${metrics.completed}`,
      trendUp: true,
    },
    {
      id: 'overdue',
      label: '逾期',
      value: String(metrics.overdue),
      icon: 'alert-circle-outline' as const,
      trend: `-${metrics.overdue}`,
      trendUp: false,
    },
    {
      id: 'efficiency',
      label: '完成效率',
      value: `${metrics.efficiency}%`,
      icon: 'trending-up-outline' as const,
      trend: metrics.total > 0 ? `+${metrics.efficiency}%` : '+0%',
      trendUp: metrics.efficiency >= 50,
    },
  ];

  return (
    <View style={styles.container}>
      {statsData.map((stat) => {
        const isTrendUp = stat.trendUp;
        return (
          <View
            key={stat.id}
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.card,
                borderColor,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: `${theme.colors.primary}${theme.dark ? '20' : '10'}`,
                  },
                ]}
              >
                <Ionicons name={stat.icon} size={16} color={theme.colors.primary} />
              </View>
              <View
                style={[
                  styles.trendContainer,
                  {
                    backgroundColor: isTrendUp
                      ? `${successColor}20`
                      : `${destructiveColor}20`,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.trendText,
                    { color: isTrendUp ? successColor : destructiveColor },
                  ]}
                >
                  {stat.trend}
                </Text>
              </View>
            </View>

            <View style={styles.cardContent}>
              <Text
                style={[
                  styles.label,
                  { color: theme.colors.mutedForeground ?? theme.colors.text },
                ]}
              >
                {stat.label}
              </Text>
              <Text style={[styles.value, { color: theme.colors.text }]}>{stat.value}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export const StatsCards = StatsCardsComponent;

export default StatsCardsComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },
  card: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 16,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
