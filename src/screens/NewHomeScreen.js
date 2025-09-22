import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeContext } from '../context/ThemeContext';
import NewHeader from '../components/NewHeader';
import FilterChips from '../components/FilterChips';
import StatsCards from '../components/StatsCards';
import NewTaskCard from '../components/NewTaskCard';
import FloatingActionButton from '../components/FloatingActionButton';
import TaskDetail from '../components/TaskDetail';
import Settings from '../components/Settings';
import CategoryView from '../components/CategoryView';

// Sample data - in a real app, this would come from context/state management
const initialOneTimeTasks = [
  {
    id: '1',
    countdown: '55天 15小时',
    deadline: '2025-11-13',
    title: '修复登录错误 #608',
    description: '检查并评论 PR，关注接口变更和潜在回归。',
    folderColor: '#F59E0B',
    type: '一次性',
    priority: 'medium',
    category: 'pending'
  },
  {
    id: '2',
    countdown: '35天 14小时',
    deadline: '2025-10-24',
    title: '撰写单元测试 671',
    description: '补充 README 中的使用示例和配置说明。',
    folderColor: '#3B82F6',
    type: '一次性',
    priority: 'high',
    category: 'pending'
  },
  {
    id: '3',
    countdown: '71天 15小时',
    deadline: '2025-11-29',
    title: '修复登录错误 #405',
    description: '分析慢查询并添加必要的索引或重写 SQL。',
    folderColor: '#F59E0B',
    type: '一次性',
    priority: 'low',
    category: 'pending'
  },
  {
    id: '6',
    countdown: '已完成',
    deadline: '2025-09-15',
    title: '完成项目文档',
    description: '编写完整的项目技术文档和使用说明。',
    folderColor: '#10B981',
    type: '一次性',
    priority: 'high',
    category: 'completed'
  },
  {
    id: '7',
    countdown: '已完成',
    deadline: '2025-09-10',
    title: '代码审查任务',
    description: '审查团队成员提交的代码并提供反馈。',
    folderColor: '#10B981',
    type: '一次性',
    priority: 'medium',
    category: 'completed'
  },
  {
    id: '8',
    countdown: '逾期 3天',
    deadline: '2025-09-15',
    title: 'CSC3 课程作业提交',
    description: 'CSC3计算机科学课程的期中项目作业。',
    folderColor: '#EF4444',
    type: '一次性',
    priority: 'high',
    category: 'overdue'
  },
  {
    id: '9',
    countdown: '2天 10小时',
    deadline: '2025-09-21',
    title: 'CSC3 实验报告',
    description: '完成CSC3课程的实验3报告。',
    folderColor: '#8B5CF6',
    type: '一次性',
    priority: 'medium',
    category: 'csc3'
  },
  {
    id: '10',
    countdown: '5天 8小时',
    deadline: '2025-09-24',
    title: 'CSC3 期末复习',
    description: 'CSC3课程期末考试复习计划。',
    folderColor: '#8B5CF6',
    type: '一次性',
    priority: 'high',
    category: 'csc3'
  }
];

const initialRecurringTasks = [
  {
    id: '4',
    countdown: '每周二 10:00',
    title: '每周团队会议',
    description: '定期团队同步会议（讨论本周进度与阻碍）。',
    folderColor: '#9B69FB',
    type: '循环',
    duration: '1小时',
    priority: 'medium',
    category: 'pending'
  },
  {
    id: '5',
    countdown: '每周四 19:00',
    title: '每周学习计划',
    description: '每周固定学习/复习时段（专注深度学习）。',
    folderColor: '#3B82F6',
    type: '循环',
    duration: '1小时',
    priority: 'medium',
    category: 'pending'
  }
];

export default function NewHomeScreen({ navigation }) {
  const { theme } = useThemeContext();
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'detail' | 'settings' | 'category'
  const [selectedTask, setSelectedTask] = useState(undefined);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [oneTimeTasks, setOneTimeTasks] = useState(initialOneTimeTasks);
  const [recurringTasks, setRecurringTasks] = useState(initialRecurringTasks);
  const [currentFilter, setCurrentFilter] = useState('all');

  const allTasks = [...oneTimeTasks, ...recurringTasks];

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setCurrentView('detail');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedTask(undefined);
    setSelectedCategory('all');
    setCurrentFilter('all');
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  const handleSave = (updatedTask) => {
    // For new tasks (no existing selectedTask or no ID), generate new ID and set proper countdown
    if (!selectedTask?.id) {
      const newTask = {
        ...updatedTask,
        id: Date.now().toString(),
        countdown: updatedTask.countdown || '新任务'
      };
      
      if (newTask.type === '一次性') {
        setOneTimeTasks(prev => [...prev, newTask]);
      } else {
        setRecurringTasks(prev => [...prev, newTask]);
      }
    } else {
      // Update existing task
      if (updatedTask.type === '一次性') {
        setOneTimeTasks(prev => 
          prev.map(task => task.id === updatedTask.id ? updatedTask : task)
        );
      } else {
        setRecurringTasks(prev => 
          prev.map(task => task.id === updatedTask.id ? updatedTask : task)
        );
      }
    }
    setCurrentView('home');
  };

  const handleDelete = (taskId) => {
    setOneTimeTasks(prev => prev.filter(task => task.id !== taskId));
    setRecurringTasks(prev => prev.filter(task => task.id !== taskId));
    setCurrentView('home');
  };

  const handleComplete = (taskId) => {
    // Mark task as completed
    const updateTaskStatus = (tasks) =>
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, category: 'completed' }
          : task
      );
    
    setOneTimeTasks(updateTaskStatus);
    setRecurringTasks(updateTaskStatus);
    setCurrentView('home');
  };

  const handleAddTask = () => {
    const newTask = {
      countdown: '新任务',
      title: '',
      description: '',
      folderColor: '#3B82F6',
      type: '一次性',
      priority: 'medium',
      category: 'pending'
    };
    setSelectedTask(newTask);
    setCurrentView('detail');
  };

  if (currentView === 'settings') {
    return <Settings onBack={handleBack} />;
  }

  if (currentView === 'detail') {
    return (
      <TaskDetail
        task={selectedTask}
        onBack={handleBack}
        onSave={handleSave}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />
    );
  }

  if (currentView === 'category') {
    return (
      <CategoryView
        category={selectedCategory}
        tasks={allTasks}
        onBack={handleBack}
        onTaskClick={handleTaskClick}
      />
    );
  }

  // Filter tasks for home view based on current filter
  const getFilteredTasks = (tasks) => {
    if (currentFilter === 'all') return tasks;
    return tasks.filter(task => task.category === currentFilter);
  };

  const filteredOneTimeTasks = getFilteredTasks(oneTimeTasks);
  const filteredRecurringTasks = getFilteredTasks(recurringTasks);

  return (
    <SafeAreaView style={styles.container}>
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
            <NewHeader onSettingsClick={handleSettingsClick} />
          </View>
          
          <View style={styles.content}>
            <FilterChips 
              tasks={allTasks}
              selectedFilter={currentFilter}
              onFilterChange={(filter) => {
                setCurrentFilter(filter);
                // Only go to category view for specific filters, not "all"
                if (filter !== 'all') {
                  handleCategoryClick(filter);
                }
              }}
            />
            <StatsCards />
            
            {filteredOneTimeTasks.length > 0 || filteredRecurringTasks.length > 0 ? (
              <View style={styles.taskSections}>
                {filteredOneTimeTasks.length > 0 && (
                  <View>
                    <Text style={[styles.sectionTitle, { color: theme.colors.mutedForeground }]}>
                      所有倒计时 · 一次性任务
                    </Text>
                    {filteredOneTimeTasks.map((task) => (
                      <NewTaskCard
                        key={task.id}
                        countdown={task.countdown}
                        deadline={task.deadline}
                        title={task.title}
                        description={task.description}
                        folderColor={task.folderColor}
                        type={task.type}
                        duration={task.duration}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </View>
                )}
                {filteredRecurringTasks.length > 0 && (
                  <View style={{ marginTop: 24 }}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.mutedForeground }]}>
                      循环任务
                    </Text>
                    {filteredRecurringTasks.map((task) => (
                      <NewTaskCard
                        key={task.id}
                        countdown={task.countdown}
                        deadline={task.deadline}
                        title={task.title}
                        description={task.description}
                        folderColor={task.folderColor}
                        type={task.type}
                        duration={task.duration}
                        onClick={() => handleTaskClick(task)}
                      />
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <View 
                style={[
                  styles.emptyState,
                  {
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.cardBorder,
                  }
                ]}
              >
                <Text style={[styles.emptyText, { color: theme.colors.mutedForeground }]}>
                  暂无符合条件的任务
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        <FloatingActionButton onClick={handleAddTask} icon="add" />
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
    paddingBottom: 100, // Space for floating action button
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
  taskSections: {
    gap: 32,
  },
  emptyState: {
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
  },
});
