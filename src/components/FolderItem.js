import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

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

