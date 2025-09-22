import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';

const statsData = [
  {
    id: 'pending',
    label: '进行中',
    value: '8',
    icon: 'time-outline',
    trend: '+2',
    trendUp: true
  },
  {
    id: 'completed',
    label: '已完成',
    value: '24',
    icon: 'checkmark-circle-outline',
    trend: '+5',
    trendUp: true
  },
  {
    id: 'overdue',
    label: '逾期',
    value: '2',
    icon: 'alert-circle-outline',
    trend: '-1',
    trendUp: false
  },
  {
    id: 'efficiency',
    label: '效率',
    value: '92%',
    icon: 'trending-up-outline',
    trend: '+8%',
    trendUp: true
  }
];

export function StatsCards() {
  const { theme } = useThemeContext();
  
  return (
    <View style={styles.container}>
      {statsData.map((stat) => (
        <View
          key={stat.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.cardBorder,
            }
          ]}
        >
          <View style={styles.cardHeader}>
            <View 
              style={[
                styles.iconContainer,
                { 
                  backgroundColor: theme.colors.primary + (theme.id === 'dark' ? '20' : '10'),
                }
              ]}
            >
              <Ionicons 
                name={stat.icon as any}
                size={16} 
                color={theme.colors.primary}
              />
            </View>
            <View 
              style={[
                styles.trendContainer,
                {
                  backgroundColor: stat.trendUp 
                    ? theme.colors.success + '20' 
                    : theme.colors.destructive + '20',
                }
              ]}
            >
              <Text 
                style={[
                  styles.trendText,
                  {
                    color: stat.trendUp ? theme.colors.success : theme.colors.destructive,
                  }
                ]}
              >
                {stat.trend}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text 
              style={[
                styles.label,
                { color: theme.colors.mutedForeground }
              ]}
            >
              {stat.label}
            </Text>
            <Text 
              style={[
                styles.value,
                { color: theme.colors.foreground }
              ]}
            >
              {stat.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 12,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
  },
  cardContent: {
    gap: 4,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});