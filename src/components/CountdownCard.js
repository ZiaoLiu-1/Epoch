import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { calculateTimeRemaining, formatTimeDisplay, formatDate, formatTime, isUpcoming } from '../utils/dateUtils';
import { CountdownContext } from '../context/CountdownContext';
import { TaskType, Priority } from '../types';

const folderColors = {
  emerald: '#16a34a', // 更柔和的绿色
  blue: '#2563eb',    // 保持蓝色
  purple: '#7c3aed',  // 更柔和的紫色
  orange: '#ea580c',  // 更柔和的橙色
  red: '#e11d48',     // 更柔和的红色
  pink: '#db2777',    // 更柔和的粉色
  indigo: '#4f46e5',  // 更柔和的靛蓝
  gray: '#6b7280',    // 保持灰色
};

export default function CountdownCard({ countdown, folderColor, onPress, onLongPress, isSelectionMode, isSelected, onPanGesture }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { deleteCountdown, toggleCountdownComplete } = useContext(CountdownContext);
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(countdown.dueDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(countdown.dueDate));
    }, 5000); // 减少到5秒刷新一次，提高性能

    return () => clearInterval(timer);
  }, [countdown.dueDate]);

  const getTimeDisplayColor = () => {
    if (countdown.isCompleted) {
      return theme.colors.border;
    }
    if (timeRemaining.isOverdue) {
      return '#e11d48'; // 更柔和的红色
    }
    if (isUpcoming(countdown.dueDate)) {
      return '#ea580c'; // 更柔和的橙色
    }
    return theme.colors.text;
  };

  const getPriorityColor = () => {
    switch (countdown.priority) {
      case Priority.HIGH:
        return '#e11d48'; // 更柔和的红色
      case Priority.MEDIUM:
        return '#ea580c'; // 更柔和的橙色
      case Priority.LOW:
        return '#16a34a'; // 更柔和的绿色
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
          ]} 
          numberOfLines={2}
          ellipsizeMode="tail"
          >
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
          <Text 
            style={[
              theme.dark ? styles.descriptionDark : styles.description,
              { color: theme.dark ? '#d1d5db' : '#6b7280' }
            ]} 
            numberOfLines={2}
            ellipsizeMode="tail"
          >
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
    borderRadius: 16,
    marginVertical: 6,
    marginHorizontal: 0,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 120,
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
    padding: 16,
    marginLeft: 6,
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
    lineHeight: 18,
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.7,
    lineHeight: 16,
  },
  description: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
    maxHeight: 32, // 最多显示2行
  },
  descriptionDark: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
    maxHeight: 32, // 最多显示2行
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    height: 18,
  },
  descriptionPlaceholder: {
    height: 34, // 与描述文字相同的高度
    marginBottom: 10,
  },
  taskType: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    lineHeight: 14,
  },
});

