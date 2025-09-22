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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import TaskCard from './TaskCard';
import FilterChips from './FilterChips';
import FloatingActionButton from './FloatingActionButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing functions
const scale = (size) => (screenWidth / 375) * size;
const verticalScale = (size) => (screenHeight / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function EventBookDetail({
  eventBook,
  onBack,
  onTaskClick,
  onAddTask,
  onImportICS,
  onSettingsClick,
  onFileStorage,
  onCategoryManagement,
}) {
  const { theme } = useThemeContext();
  const { t, currentLanguage } = useLanguage();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showActions, setShowActions] = useState(false);

  // Mock tasks data - in real app, this would come from state/context
  const [tasks] = useState([
    {
      id: '1',
      countdown: currentLanguage === 'zh' ? '期末考试' : 'Final Exam',
      deadline: '2024-06-15',
      title: currentLanguage === 'zh' ? '高等数学期末考试' : 'Advanced Mathematics Final',
      description: currentLanguage === 'zh' ? '复习所有章节' : 'Review all chapters',
      folderColor: eventBook.color,
      type: '一次性',
      priority: 'high',
      category: 'pending',
      eventBookId: eventBook.id,
    },
    {
      id: '2',
      countdown: currentLanguage === 'zh' ? '项目截止' : 'Project Due',
      deadline: '2024-05-20',
      title: currentLanguage === 'zh' ? '软件工程大作业' : 'Software Engineering Project',
      description: currentLanguage === 'zh' ? '完成系统设计文档' : 'Complete system design document',
      folderColor: eventBook.color,
      type: '一次性',
      priority: 'medium',
      category: 'pending',
      eventBookId: eventBook.id,
    },
    {
      id: '3',
      countdown: currentLanguage === 'zh' ? '生日' : 'Birthday',
      deadline: '2024-07-10',
      title: currentLanguage === 'zh' ? '妈妈的生日' : "Mom's Birthday",
      description: currentLanguage === 'zh' ? '准备生日礼物' : 'Prepare birthday gift',
      folderColor: eventBook.color,
      type: '循环',
      priority: 'high',
      category: 'pending',
      eventBookId: eventBook.id,
    },
  ]);

  const getIconComponent = (iconName, size = moderateScale(24), color) => {
    const iconMap = {
      'graduation-cap': () => <FontAwesome5 name="graduation-cap" size={size} color={color} />,
      'home': () => <Ionicons name="home" size={size} color={color} />,
      'dumbbell': () => <MaterialCommunityIcons name="dumbbell" size={size} color={color} />,
      'briefcase': () => <Ionicons name="briefcase" size={size} color={color} />,
      'book-open': () => <Ionicons name="book" size={size} color={color} />,
      'heart': () => <Ionicons name="heart" size={size} color={color} />
    };
    const IconComponent = iconMap[iconName] || iconMap['book-open'];
    return IconComponent();
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'completed') return task.category === 'completed';
    if (selectedFilter === 'pending') return task.category === 'pending';
    if (selectedFilter === 'overdue') {
      const deadline = new Date(task.deadline);
      return deadline < new Date() && task.category !== 'completed';
    }
    return true;
  });

  const handleActionPress = (action) => {
    setShowActions(false);
    switch(action) {
      case 'add':
        onAddTask();
        break;
      case 'import':
        onImportICS();
        break;
      case 'files':
        onFileStorage();
        break;
      case 'categories':
        onCategoryManagement();
        break;
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
        
        <View style={styles.headerCenter}>
          <View style={[styles.headerIcon, { backgroundColor: eventBook.color + '20' }]}>
            {getIconComponent(eventBook.icon, moderateScale(20), eventBook.color)}
          </View>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {eventBook.name}
          </Text>
        </View>

        <TouchableOpacity onPress={onSettingsClick} style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={moderateScale(20)} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{tasks.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
            {currentLanguage === 'zh' ? '总任务' : 'Total Tasks'}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {tasks.filter(t => t.category === 'completed').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
            {currentLanguage === 'zh' ? '已完成' : 'Completed'}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>
            {tasks.filter(t => t.category === 'pending').length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
            {currentLanguage === 'zh' ? '进行中' : 'In Progress'}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>
            {tasks.filter(t => {
              const deadline = new Date(t.deadline);
              return deadline < new Date() && t.category !== 'completed';
            }).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
            {currentLanguage === 'zh' ? '已过期' : 'Overdue'}
          </Text>
        </View>
      </ScrollView>

      {/* Filter Chips */}
      <FilterChips
        selected={selectedFilter}
        onSelect={setSelectedFilter}
        filters={[
          { id: 'all', label: currentLanguage === 'zh' ? '全部' : 'All' },
          { id: 'pending', label: currentLanguage === 'zh' ? '进行中' : 'Pending' },
          { id: 'completed', label: currentLanguage === 'zh' ? '已完成' : 'Completed' },
          { id: 'overdue', label: currentLanguage === 'zh' ? '已过期' : 'Overdue' },
        ]}
      />

      {/* Tasks List */}
      <ScrollView 
        style={styles.tasksList}
        contentContainerStyle={styles.tasksContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onPress={() => onTaskClick(task)}
            />
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
        color={eventBook.color}
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
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleActionPress('files')}
          >
            <Ionicons name="folder" size={moderateScale(24)} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '文件存储' : 'File Storage'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => handleActionPress('categories')}
          >
            <Ionicons name="pricetags" size={moderateScale(24)} color={theme.colors.primary} />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '分类管理' : 'Categories'}
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
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(16),
  },
  headerIcon: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
  },
  moreButton: {
    padding: moderateScale(8),
  },
  statsContainer: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(16),
    maxHeight: verticalScale(100),
  },
  statCard: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    marginRight: moderateScale(12),
    borderWidth: 1,
    minWidth: moderateScale(100),
    alignItems: 'center',
  },
  statValue: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(12),
  },
  tasksList: {
    flex: 1,
  },
  tasksContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(100),
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
