import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
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

export default function CountdownCard({ countdown, folderColor, onPress, onLongPress, isSelectionMode, isSelected }) {
  const { colors } = useTheme();
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
      return colors.border;
    }
    if (timeRemaining.isOverdue) {
      return '#ef4444';
    }
    if (isUpcoming(countdown.dueDate)) {
      return '#f59e0b';
    }
    return colors.text;
  };

  const getPriorityColor = () => {
    switch (countdown.priority) {
      case Priority.HIGH:
        return '#ef4444';
      case Priority.MEDIUM:
        return '#f59e0b';
      case Priority.LOW:
        return '#10b981';
      default:
        return colors.border;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: colors.card, shadowColor: colors.shadow },
        countdown.isCompleted && styles.completedCard,
        isSelected && styles.selectedCard,
        isSelectionMode && styles.selectionModeCard
      ]}
      onPress={() => onPress && onPress(countdown)}
      onLongPress={() => onLongPress && onLongPress(countdown)}
      delayLongPress={500}
      activeOpacity={0.7}
    >
      <View style={[styles.colorBar, { backgroundColor: folderColors[folderColor] || folderColors.gray }]} />
      
      {isSelectionMode && (
        <View style={[styles.selectionIndicator, { backgroundColor: isSelected ? colors.primary : 'transparent', borderColor: colors.border }]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[
            styles.title, 
            { color: colors.text },
            countdown.isCompleted && styles.completedText
          ]} numberOfLines={2}>
            {countdown.title}
          </Text>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
        </View>
        
        <Text style={[styles.time, { color: getTimeDisplayColor() }]}>
          {formatTimeDisplay(timeRemaining, countdown.isCompleted)}
        </Text>
        
        <Text style={[styles.date, { color: colors.border }]}>
          {formatDate(countdown.dueDate)} {formatTime(countdown.dueDate)}
        </Text>
        
        {countdown.description && (
          <Text style={[styles.description, { color: colors.border }]} numberOfLines={2}>
            {countdown.description}
          </Text>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.taskType, { color: colors.border }]}>
            {countdown.type === TaskType.RECURRING ? '循环' : '一次性'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    margin: 8,
    flex: 1,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 140,
  },
  completedCard: {
    opacity: 0.6,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  selectionModeCard: {
    transform: [{ scale: 0.95 }],
  },
  colorBar: {
    width: 6,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    marginLeft: 6,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  date: {
    fontSize: 12,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  taskType: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
});

