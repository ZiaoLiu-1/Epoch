import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TaskCard } from './TaskCard';
import { useTheme } from '../contexts/ThemeContext';

interface Task {
  id: string;
  countdown: string;
  deadline?: string;
  title: string;
  description: string;
  folderColor: string;
  type: '一次性' | '循环';
  duration?: string;
}

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function TaskSection({ title, tasks, onTaskClick }: TaskSectionProps) {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.mutedForeground }]}>
          {title}
        </Text>
        <View style={styles.dividerContainer}>
          <LinearGradient
            colors={
              theme.id === 'dark' 
                ? ['rgba(100, 116, 139, 0.5)', 'transparent']
                : [theme.colors.cardBorder, 'transparent']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.divider}
          />
        </View>
        <View 
          style={[
            styles.badge,
            {
              backgroundColor: theme.colors.card,
            }
          ]}
        >
          <Text 
            style={[
              styles.badgeText,
              { color: theme.colors.mutedForeground }
            ]}
          >
            {tasks.length}
          </Text>
        </View>
      </View>
      
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            countdown={task.countdown}
            deadline={task.deadline}
            title={task.title}
            description={task.description}
            folderColor={task.folderColor}
            type={task.type}
            duration={task.duration}
            onClick={() => onTaskClick(task)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 14,
    margin: 0,
  },
  dividerContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
  },
  taskList: {
    gap: 12,
  },
});