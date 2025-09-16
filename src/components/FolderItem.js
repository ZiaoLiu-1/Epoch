import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

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

export default function FolderItem({ folder, onPress }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={[styles.colorDot, { backgroundColor: folderColors[folder.color] || folderColors.gray }]} />
      <Text style={[styles.name, { color: colors.text }]}>{folder.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    elevation: 2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
});

