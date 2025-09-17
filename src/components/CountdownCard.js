import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateTimeRemaining, formatTimeDisplay, formatDate, formatTime, isUpcoming } from '../utils/dateUtils';
import { CountdownContext } from '../context/CountdownContext';
import { TaskType, Priority } from '../types';

const folderColors = {
  emerald: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f59e0b',
  red: '#ef4444',
  pink: '#ec4899',
  indigo: '#6366f1',
  gray: '#6b7280',
};

export default function CountdownCard({ countdown, folderColor, onPress, onLongPress, isSelectionMode, isSelected, onPanGesture }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { deleteCountdown, toggleCountdownComplete } = useContext(CountdownContext);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(countdown.dueDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(countdown.dueDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.dueDate]);

  const getTimeDisplayColor = () => {
    if (countdown.isCompleted) {
      return theme.colors.border;
    }
    if (timeRemaining.isOverdue) {
      return '#dc2626'; // 更自然的红色
    }
    if (isUpcoming(countdown.dueDate)) {
      return '#d97706'; // 更自然的橙色
    }
    return theme.colors.text;
  };

  const getPriorityColor = () => {
    switch (countdown.priority) {
      case Priority.HIGH:
        return '#dc2626'; // 更自然的红色
      case Priority.MEDIUM:
        return '#d97706'; // 更自然的橙色
      case Priority.LOW:
        return '#059669'; // 更自然的绿色
      default:
        return theme.colors.border;
    }
  };

  const handlePanGestureEvent = (event) => {
    if (isSelectionMode && onPanGesture) {
      onPanGesture(event, countdown);
    }
  };

  const cardContent = (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow },
        countdown.isCompleted && styles.completedCard,
        isSelected && [styles.selectedCard, { borderColor: theme.colors.primary }],
        isSelectionMode && styles.selectionModeCard
      ]}
      onPress={() => onPress && onPress(countdown)}
      onLongPress={() => onLongPress && onLongPress(countdown)}
      delayLongPress={500}
      activeOpacity={0.8}
    >
      <View style={[styles.colorBar, { backgroundColor: folderColors[folderColor] || folderColors.gray }]} />
      
      {isSelectionMode && (
        <View style={[
          styles.selectionIndicator, 
          { 
            backgroundColor: isSelected ? theme.colors.primary : 'transparent', 
            borderColor: isSelected ? theme.colors.primary : theme.colors.border 
          }
        ]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[
            styles.title, 
            { color: theme.colors.text },
            countdown.isCompleted && styles.completedText
          ]} numberOfLines={2}>
            {countdown.title}
          </Text>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
        </View>
        
        <Text style={[styles.time, { color: getTimeDisplayColor() }]}>
          {formatTimeDisplay(timeRemaining, countdown.isCompleted)}
        </Text>
        
        <Text style={[styles.date, { color: theme.colors.border }]}>
          {formatDate(countdown.dueDate)} {formatTime(countdown.dueDate)}
        </Text>
        
        {countdown.description ? (
          <Text style={theme.dark ? styles.descriptionDark : styles.description} numberOfLines={2}>
            {countdown.description}
          </Text>
        ) : (
          <View style={styles.descriptionPlaceholder} />
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.taskType, { color: theme.colors.border }]}>
            {countdown.type === TaskType.RECURRING ? t('recurring') : t('oneTime')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isSelectionMode && onPanGesture) {
    return (
      <PanGestureHandler
        onGestureEvent={handlePanGestureEvent}
        onHandlerStateChange={handlePanGestureEvent}
      >
        <View>
          {cardContent}
        </View>
      </PanGestureHandler>
    );
  }

  return cardContent;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    height: 160, // 固定高度确保一致性
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.6,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  selectionModeCard: {
    // 移除transform缩放，避免卡片变形
  },
  colorBar: {
    width: 6,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    marginLeft: 6,
    flex: 1,
    justifyContent: 'space-between', // 确保内容均匀分布
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8, // 减少间距
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
    lineHeight: 22, // 固定行高
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 4,
  },
  time: {
    fontSize: 18, // 统一字体大小
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 22, // 固定行高
  },
  date: {
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.7,
    lineHeight: 18, // 固定行高
  },
  description: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
    lineHeight: 18, // 固定行高
    height: 36, // 固定高度，最多显示2行
  },
  descriptionDark: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
    lineHeight: 18, // 固定行高
    height: 36, // 固定高度，最多显示2行
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    height: 20, // 固定底部高度
  },
  descriptionPlaceholder: {
    height: 36, // 与描述文字相同的高度
    marginBottom: 8,
  },
  taskType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 16, // 固定行高
  },
});

