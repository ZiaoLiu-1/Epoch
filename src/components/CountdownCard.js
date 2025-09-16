import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { calculateTimeRemaining, formatTimeDisplay, formatDate, formatTime, isUpcoming } from '../utils/dateUtils';

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

export default function CountdownCard({ countdown, folderColor }) {
  const { colors } = useTheme();
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

  return (
    <View style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
      <View style={[styles.colorBar, { backgroundColor: folderColors[folderColor] || folderColors.gray }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{countdown.title}</Text>
        <Text style={[styles.time, { color: getTimeDisplayColor() }]}>
          {formatTimeDisplay(timeRemaining, countdown.isCompleted)}
        </Text>
        <Text style={[styles.date, { color: colors.border }]}>
          {formatDate(countdown.dueDate)} {formatTime(countdown.dueDate)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    margin: 8,
    flex: 1,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorBar: {
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    padding: 16,
    marginLeft: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
});

