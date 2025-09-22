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

export default function FolderItem({ folder, onPress, onLongPress, isSelectionMode, isSelected, isFilterMode, isFiltered }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      onPress={onPress} 
      onLongPress={folder.isAll ? undefined : onLongPress} // "全部"文件夹不支持长按
      delayLongPress={500}
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        isSelected && styles.selectedFolder,
        isSelectionMode && styles.selectionModeFolder,
        isFilterMode && isFiltered && styles.filteredFolder,
      ]}
    >
      {isSelectionMode && (
        <View style={[
          styles.selectionIndicator,
          { 
            backgroundColor: isSelected ? colors.primary : 'transparent',
            borderColor: isSelected ? colors.primary : colors.border,
          }
        ]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      )}
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
  selectedFolder: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  selectionModeFolder: {
    transform: [{ scale: 0.95 }],
  },
  selectionIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filteredFolder: {
    borderWidth: 2,
    borderColor: '#3b82f6',
    backgroundColor: '#e0f2fe',
  },
});

