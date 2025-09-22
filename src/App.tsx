import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { FilterChips } from './components/FilterChips';
import { StatsCards } from './components/StatsCards';
import { TaskSection } from './components/TaskSection';
import { FloatingActionButton } from './components/FloatingActionButton';
import { TaskDetail } from './components/TaskDetail';
import { Settings } from './components/Settings';
import { CategoryView } from './components/CategoryView';
import { CloudDecoration } from './components/CloudDecoration';

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

const initialOneTimeTasks: Task[] = [
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

const initialRecurringTasks: Task[] = [
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

function AppContent() {
  const { theme } = useTheme();
  const [currentView, setCurrentView] = useState<'home' | 'detail' | 'settings' | 'category'>('home');
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<FilterType>('all');
  const [oneTimeTasks, setOneTimeTasks] = useState(initialOneTimeTasks);
  const [recurringTasks, setRecurringTasks] = useState(initialRecurringTasks);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  const allTasks = [...oneTimeTasks, ...recurringTasks];

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('detail');
  };

  const handleCategoryClick = (category: FilterType) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedTask(undefined);
    setSelectedCategory('all');
    setCurrentFilter('all'); // Reset filter when going back to home
  };

  const handleSettingsClick = () => {
    setCurrentView('settings');
  };

  const handleSave = (updatedTask: Task) => {
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

  const handleDelete = (taskId: string) => {
    setOneTimeTasks(prev => prev.filter(task => task.id !== taskId));
    setRecurringTasks(prev => prev.filter(task => task.id !== taskId));
    setCurrentView('home');
  };

  const handleComplete = (taskId: string) => {
    // Mark task as completed
    const updateTaskStatus = (tasks: Task[]) =>
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
      type: '一次性' as const,
      priority: 'medium' as const,
      category: 'pending'
    };
    setSelectedTask(newTask as any);
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
  const getFilteredTasks = (tasks: Task[]) => {
    if (currentFilter === 'all') return tasks;
    return tasks.filter(task => task.category === currentFilter);
  };

  const filteredOneTimeTasks = getFilteredTasks(oneTimeTasks);
  const filteredRecurringTasks = getFilteredTasks(recurringTasks);

  return (
    <div 
      className="min-h-screen pb-24 relative"
      style={{ background: theme.styles.backgroundImage }}
    >
      <CloudDecoration />
      <div className="relative z-10 px-4 pt-6 pb-2">
        <Header onSettingsClick={handleSettingsClick} />
      </div>
      
      <div className="relative z-10 px-4 space-y-6">
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
          <div className="space-y-8">
            {filteredOneTimeTasks.length > 0 && (
              <TaskSection 
                title="所有倒计时 · 一次性任务" 
                tasks={filteredOneTimeTasks}
                onTaskClick={handleTaskClick}
              />
            )}
            {filteredRecurringTasks.length > 0 && (
              <TaskSection 
                title="循环任务" 
                tasks={filteredRecurringTasks}
                onTaskClick={handleTaskClick}
              />
            )}
          </div>
        ) : (
          <div 
            className={`p-8 rounded-2xl border text-center ${theme.styles.cardStyle}`}
            style={{
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.cardBorder,
            }}
          >
            <p style={{ color: theme.colors.mutedForeground }}>
              暂无符合条件的任务
            </p>
          </div>
        )}
      </div>
      
      <FloatingActionButton onClick={handleAddTask} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}