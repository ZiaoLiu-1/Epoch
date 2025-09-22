import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import TaskCard from './TaskCard';
import FilterChips from './FilterChips';
import FloatingActionButton from './FloatingActionButton';
import StatsCards from './StatsCards';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing functions
const scale = (size) => (screenWidth / 375) * size;
const verticalScale = (size) => (screenHeight / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function AllTasksView({
  onBack,
  onTaskClick,
  onAddTask,
  onImportICS,
  onSettingsClick,
  onEventBookClick,
}) {
  const { theme } = useThemeContext();
  const { t, currentLanguage } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showActions, setShowActions] = useState(false);

  // Mock tasks data from all event books
  const [tasks] = useState([
    {
      id: '1',
      countdown: currentLanguage === 'zh' ? '期末考试' : 'Final Exam',
      deadline: '2024-06-15',
      title: currentLanguage === 'zh' ? '高等数学期末考试' : 'Advanced Mathematics Final',
      description: currentLanguage === 'zh' ? '复习所有章节' : 'Review all chapters',
      folderColor: '#3B82F6',
      type: '一次性',
      priority: 'high',
      category: 'pending',
      eventBookId: 'university',
      eventBookName: currentLanguage === 'zh' ? '大学生活' : 'University Life',
    },
    {
      id: '2',
      countdown: currentLanguage === 'zh' ? '项目截止' : 'Project Due',
      deadline: '2024-05-20',
      title: currentLanguage === 'zh' ? '软件工程大作业' : 'Software Engineering Project',
      description: currentLanguage === 'zh' ? '完成系统设计文档' : 'Complete system design document',
      folderColor: '#3B82F6',
      type: '一次性',
      priority: 'medium',
      category: 'pending',
      eventBookId: 'university',
      eventBookName: currentLanguage === 'zh' ? '大学生活' : 'University Life',
    },
    {
      id: '3',
      countdown: currentLanguage === 'zh' ? '健身目标' : 'Fitness Goal',
      deadline: '2024-05-01',
      title: currentLanguage === 'zh' ? '减重5公斤' : 'Lose 5kg',
      description: currentLanguage === 'zh' ? '坚持每天运动' : 'Exercise daily',
      folderColor: '#F59E0B',
      type: '一次性',
      priority: 'medium',
      category: 'pending',
      eventBookId: 'fitness',
      eventBookName: currentLanguage === 'zh' ? '健身计划' : 'Fitness Plan',
    },
    {
      id: '4',
      countdown: currentLanguage === 'zh' ? '季度报告' : 'Quarterly Report',
      deadline: '2024-04-30',
      title: currentLanguage === 'zh' ? 'Q2季度报告' : 'Q2 Report',
      description: currentLanguage === 'zh' ? '准备季度总结' : 'Prepare quarterly summary',
      folderColor: '#8B5CF6',
      type: '一次性',
      priority: 'high',
      category: 'completed',
      eventBookId: 'work',
      eventBookName: currentLanguage === 'zh' ? '工作项目' : 'Work Projects',
    },
    {
      id: '5',
      countdown: currentLanguage === 'zh' ? '生日' : 'Birthday',
      deadline: '2024-07-10',
      title: currentLanguage === 'zh' ? '妈妈的生日' : "Mom's Birthday",
      description: currentLanguage === 'zh' ? '准备生日礼物' : 'Prepare birthday gift',
      folderColor: '#10B981',
      type: '循环',
      priority: 'high',
      category: 'pending',
      eventBookId: 'life',
      eventBookName: currentLanguage === 'zh' ? '生活日常' : 'Daily Life',
    },
  ]);

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'completed') return task.category === 'completed';
    if (selectedFilter === 'pending') return task.category === 'pending';
    if (selectedFilter === 'overdue') {
      const deadline = new Date(task.deadline);
      return deadline < new Date() && task.category !== 'completed';
    }
    if (selectedFilter === 'high') return task.priority === 'high';
    return true;
  });

  // Group tasks by event book
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    if (!acc[task.eventBookId]) {
      acc[task.eventBookId] = {
        name: task.eventBookName,
        color: task.folderColor,
        tasks: [],
      };
    }
    acc[task.eventBookId].tasks.push(task);
    return acc;
  }, {});

  const handleActionPress = (action) => {
    setShowActions(false);
    if (action === 'add') {
      onAddTask();
    } else if (action === 'import') {
      onImportICS();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.dark 
          ? ['#1a1a1a', '#2a2a2a', '#1a1a1a']
          : ['#f0f9ff', '#e0f2fe', '#f0f9ff']
        }
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {currentLanguage === 'zh' ? '全部任务' : 'All Tasks'}
        </Text>

        <TouchableOpacity onPress={onSettingsClick} style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={moderateScale(20)} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <StatsCards tasks={tasks} />

      {/* Filter Chips */}
      <FilterChips
        tasks={tasks}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        filters={[
          { id: 'all', label: currentLanguage === 'zh' ? '全部' : 'All' },
          { id: 'pending', label: currentLanguage === 'zh' ? '进行中' : 'Pending' },
          { id: 'completed', label: currentLanguage === 'zh' ? '已完成' : 'Completed' },
          { id: 'overdue', label: currentLanguage === 'zh' ? '已过期' : 'Overdue' },
          { id: 'high', label: currentLanguage === 'zh' ? '高优先级' : 'High Priority' },
        ]}
      />

      {/* Tasks List Grouped by Event Book */}
      <ScrollView 
        style={styles.tasksList}
        contentContainerStyle={styles.tasksContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(groupedTasks).length > 0 ? (
          Object.entries(groupedTasks).map(([eventBookId, group]) => (
            <View key={eventBookId} style={styles.groupSection}>
              <TouchableOpacity 
                style={styles.groupHeader}
                onPress={() => onEventBookClick(eventBookId)}
              >
                <View style={[styles.groupIndicator, { backgroundColor: group.color }]} />
                <Text style={[styles.groupTitle, { color: theme.colors.text }]}>
                  {group.name}
                </Text>
                <Text style={[styles.groupCount, { color: theme.colors.text + '60' }]}>
                  {group.tasks.length}
                </Text>
                <Ionicons name="chevron-forward" size={moderateScale(16)} color={theme.colors.text + '60'} />
              </TouchableOpacity>
              
              {group.tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onPress={() => onTaskClick(task)}
                  showEventBook={false}
                />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="checkbox-outline" 
              size={moderateScale(48)} 
              color={theme.colors.text + '40'} 
            />
            <Text style={[styles.emptyText, { color: theme.colors.text + '60' }]}>
              {currentLanguage === 'zh' ? '没有任务' : 'No tasks'}
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.text + '40' }]}>
              {currentLanguage === 'zh' ? '点击下方按钮添加任务' : 'Tap the button below to add tasks'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button with Actions */}
      <FloatingActionButton
        onPress={() => setShowActions(!showActions)}
        icon="add"
        color={theme.colors.primary}
      />

      {/* Action Menu */}
      {showActions && (
        <View style={[styles.actionMenu, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleActionPress('add')}
          >
            <Ionicons name="add-circle" size={moderateScale(24)} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '添加任务' : 'Add Task'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleActionPress('import')}
          >
            <Ionicons name="download" size={moderateScale(24)} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '导入 ICS' : 'Import ICS'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: moderateScale(16),
  },
  moreButton: {
    padding: moderateScale(8),
  },
  tasksList: {
    flex: 1,
  },
  tasksContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(100),
  },
  groupSection: {
    marginBottom: verticalScale(20),
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    paddingHorizontal: moderateScale(4),
  },
  groupIndicator: {
    width: moderateScale(4),
    height: moderateScale(20),
    borderRadius: moderateScale(2),
    marginRight: moderateScale(12),
  },
  groupTitle: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  groupCount: {
    fontSize: moderateScale(14),
    marginRight: moderateScale(8),
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(100),
  },
  emptyText: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    marginTop: verticalScale(16),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
  actionMenu: {
    position: 'absolute',
    bottom: verticalScale(100),
    right: moderateScale(16),
    borderRadius: moderateScale(12),
    padding: moderateScale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(12),
    gap: moderateScale(12),
  },
  actionText: {
    fontSize: moderateScale(14),
  },
});
