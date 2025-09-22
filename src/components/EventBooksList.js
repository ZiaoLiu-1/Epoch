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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing functions
const scale = (size) => (screenWidth / 375) * size;
const verticalScale = (size) => (screenHeight / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export default function EventBooksList({
  onSelectBook,
  onCreateBook,
  onSettingsClick,
  onViewAllTasks,
  navigation
}) {
  const { theme } = useThemeContext();
  const { t, currentLanguage } = useLanguage();
  
  // Create localized event books data
  const defaultEventBooks = [
    {
      id: 'university',
      name: currentLanguage === 'zh' ? '大学生活' : 'University Life',
      description: currentLanguage === 'zh' ? '学习、考试和校园活动' : 'Study, exams and campus activities',
      icon: 'graduation-cap',
      color: '#3B82F6',
      taskCount: 8,
      completedCount: 3,
      createdAt: '2024-01-15'
    },
    {
      id: 'life',
      name: currentLanguage === 'zh' ? '生活日常' : 'Daily Life',
      description: currentLanguage === 'zh' ? '日常任务和个人事务' : 'Daily tasks and personal matters',
      icon: 'home',
      color: '#10B981',
      taskCount: 5,
      completedCount: 2,
      createdAt: '2024-01-10'
    },
    {
      id: 'fitness',
      name: currentLanguage === 'zh' ? '健身计划' : 'Fitness Plan',
      description: currentLanguage === 'zh' ? '运动目标和健康追踪' : 'Exercise goals and health tracking',
      icon: 'dumbbell',
      color: '#F59E0B',
      taskCount: 3,
      completedCount: 1,
      createdAt: '2024-01-20'
    },
    {
      id: 'work',
      name: currentLanguage === 'zh' ? '工作项目' : 'Work Projects',
      description: currentLanguage === 'zh' ? '工作任务和截止日期' : 'Work tasks and deadlines',
      icon: 'briefcase',
      color: '#8B5CF6',
      taskCount: 12,
      completedCount: 7,
      createdAt: '2024-01-08'
    }
  ];
  
  const [eventBooks] = useState(defaultEventBooks);

  const getIconComponent = (iconName, size = moderateScale(28), color) => {
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

  const calculateProgress = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const totalTasks = eventBooks.reduce((sum, book) => sum + book.taskCount, 0);
  const totalCompleted = eventBooks.reduce((sum, book) => sum + book.completedCount, 0);
  const overallProgress = calculateProgress(totalCompleted, totalTasks);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.dark 
          ? ['#1a1a1a', '#2a2a2a', '#1a1a1a']
          : ['#f0f9ff', '#e0f2fe', '#f0f9ff']
        }
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '事件簿' : 'Event Books'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text + '80' }]}>
              {currentLanguage === 'zh' ? '管理你的倒计时集合' : 'Manage your countdown collections'}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={onSettingsClick}
            style={[styles.settingsButton, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            }]}
          >
            <Ionicons name="ellipsis-horizontal" size={moderateScale(20)} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Event Books Grid */}
        <View style={styles.cardsContainer}>
          {/* View All Tasks Button */}
          <TouchableOpacity
            onPress={onViewAllTasks}
            style={[styles.card, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            }]}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              {/* Icon */}
              <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="filter" size={moderateScale(28)} color={theme.colors.primary} />
              </View>

              {/* Content */}
              <View style={styles.cardTextContent}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                    {currentLanguage === 'zh' ? '全部任务' : 'All Tasks'}
                  </Text>
                  <Ionicons name="chevron-forward" size={moderateScale(20)} color={theme.colors.text + '60'} />
                </View>
                
                <Text style={[styles.cardDescription, { color: theme.colors.text + '80' }]}>
                  {currentLanguage === 'zh' ? '查看所有事件簿中的任务' : 'View tasks from all event books'}
                </Text>

                {/* Total Stats */}
                <View style={styles.progressContainer}>
                  <Text style={[styles.progressText, { color: theme.colors.text + '80' }]}>
                    {totalCompleted}/{totalTasks} {currentLanguage === 'zh' ? '已完成' : 'completed'}
                  </Text>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            backgroundColor: theme.colors.primary,
                            width: `${overallProgress}%`
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressPercent, { color: theme.colors.text + '60' }]}>
                      {overallProgress}%
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          {/* Event Books */}
          {eventBooks.map((book) => {
            const progress = calculateProgress(book.completedCount, book.taskCount);
            
            return (
              <TouchableOpacity
                key={book.id}
                onPress={() => onSelectBook(book)}
                style={[styles.card, { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                }]}
                activeOpacity={0.7}
              >
                <View style={styles.cardContent}>
                  {/* Icon */}
                  <View style={[styles.iconContainer, { backgroundColor: book.color + '20' }]}>
                    {getIconComponent(book.icon, moderateScale(28), book.color)}
                  </View>

                  {/* Content */}
                  <View style={styles.cardTextContent}>
                    <View style={styles.cardHeader}>
                      <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
                        {book.name}
                      </Text>
                      <Ionicons name="chevron-forward" size={moderateScale(20)} color={theme.colors.text + '60'} />
                    </View>
                    
                    <Text style={[styles.cardDescription, { color: theme.colors.text + '80' }]}>
                      {book.description}
                    </Text>

                    {/* Progress and Stats */}
                    <View style={styles.progressContainer}>
                      <Text style={[styles.progressText, { color: theme.colors.text + '80' }]}>
                        {book.completedCount}/{book.taskCount} {currentLanguage === 'zh' ? '已完成' : 'completed'}
                      </Text>
                      <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                          <View 
                            style={[
                              styles.progressFill, 
                              { 
                                backgroundColor: book.color,
                                width: `${progress}%`
                              }
                            ]}
                          />
                        </View>
                        <Text style={[styles.progressPercent, { color: theme.colors.text + '60' }]}>
                          {progress}%
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Create New Event Book Button */}
          <TouchableOpacity
            onPress={onCreateBook}
            style={[styles.card, styles.createCard, { 
              backgroundColor: theme.colors.card + '80',
              borderColor: theme.colors.primary + '50',
            }]}
            activeOpacity={0.7}
          >
            <View style={styles.createCardContent}>
              <View style={[styles.createIconContainer, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="add" size={moderateScale(24)} color={theme.colors.primary} />
              </View>
              <View style={styles.createTextContent}>
                <Text style={[styles.createTitle, { color: theme.colors.primary }]}>
                  {currentLanguage === 'zh' ? '创建新事件簿' : 'Create New Event Book'}
                </Text>
                <Text style={[styles.createDescription, { color: theme.colors.text + '80' }]}>
                  {currentLanguage === 'zh' ? '组织你的倒计时' : 'Organize your countdowns'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={[styles.statsCard, { 
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
        }]}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {currentLanguage === 'zh' ? '总任务' : 'Total Tasks'}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {totalTasks}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {currentLanguage === 'zh' ? '已完成' : 'Completed'}
              </Text>
              <Text style={[styles.statValue, { color: '#10B981' }]}>
                {totalCompleted}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.colors.text + '80' }]}>
                {currentLanguage === 'zh' ? '事件簿' : 'Event Books'}
              </Text>
              <Text style={[styles.statValue, { color: theme.colors.primary }]}>
                {eventBooks.length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: verticalScale(100),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingTop: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(40),
    paddingBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
  },
  settingsButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cardsContainer: {
    paddingHorizontal: moderateScale(16),
  },
  card: {
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  createCard: {
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  cardTextContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  cardTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(12),
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12),
  },
  progressText: {
    fontSize: moderateScale(13),
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressBar: {
    flex: 1,
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: moderateScale(4),
  },
  progressPercent: {
    fontSize: moderateScale(11),
    marginLeft: moderateScale(8),
  },
  createCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(12),
  },
  createTextContent: {
    flex: 1,
  },
  createTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  createDescription: {
    fontSize: moderateScale(14),
  },
  statsCard: {
    marginHorizontal: moderateScale(16),
    marginTop: verticalScale(24),
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: moderateScale(13),
    marginBottom: verticalScale(4),
  },
  statValue: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: 'bold',
  },
});
