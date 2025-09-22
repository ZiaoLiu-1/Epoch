import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';
import NewTaskCard from './NewTaskCard';

export default function CategoryView({ category, tasks, onBack, onTaskClick }) {
  const { theme } = useThemeContext();
  
  const categoryLabels = {
    'all': '全部任务',
    'completed': '已完成',
    'pending': '进行中',
    'overdue': '逾期',
    'csc3': 'CSC3课程'
  };

  const categoryColors = {
    'all': '#3B82F6',
    'completed': '#10B981',
    'pending': '#F59E0B',
    'overdue': '#EF4444',
    'csc3': '#8B5CF6'
  };

  const filteredTasks = category === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === category);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {categoryLabels[category] || category}
          </Text>
          <View style={[styles.badge, { backgroundColor: categoryColors[category] + '20' }]}>
            <Text style={[styles.badgeText, { color: categoryColors[category] }]}>
              {filteredTasks.length}
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.length > 0 ? (
          <View style={styles.taskList}>
            {filteredTasks.map((task) => (
              <NewTaskCard
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
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Ionicons 
              name="folder-open-outline" 
              size={48} 
              color={theme.colors.mutedForeground} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.mutedForeground }]}>
              该分类下暂无任务
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  taskList: {
    gap: 12,
  },
  emptyState: {
    marginTop: 100,
    padding: 48,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});