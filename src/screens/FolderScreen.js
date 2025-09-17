import React, { useContext, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CountdownContext } from '../context/CountdownContext';
import CountdownCard from '../components/CountdownCard';
import AddCountdownModal from '../components/AddCountdownModal';
import EditCountdownModal from '../components/EditCountdownModal';
import { TaskType } from '../types';

export default function FolderScreen({ route, navigation }) {
  const { folderId, folderName } = route.params;
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { countdowns, folders, deleteCountdown, toggleCountdownComplete } = useContext(CountdownContext);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCountdowns, setSelectedCountdowns] = useState(new Set());

  // 获取当前文件夹的倒计时
  const folderCountdowns = countdowns.filter(c => {
    if (folderId === 'completed') return c.isCompleted;
    if (folderId === 'incomplete') return !c.isCompleted && !isOverdue(c.dueDate);
    if (folderId === 'overdue') return !c.isCompleted && isOverdue(c.dueDate);
    return c.folder === folderId;
  });

  const oneTimeCountdowns = folderCountdowns.filter(c => c.type === TaskType.ONE_TIME);
  const recurringCountdowns = folderCountdowns.filter(c => c.type === TaskType.RECURRING);

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const handleCountdownPress = useCallback((countdown) => {
    if (isSelectionMode) {
      toggleSelection(countdown.id);
    } else {
      setEditingCountdown(countdown);
      setShowEditModal(true);
    }
  }, [isSelectionMode]);

  const handleCountdownLongPress = useCallback((countdown) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedCountdowns(new Set([countdown.id]));
    }
  }, [isSelectionMode]);

  const toggleSelection = useCallback((countdownId) => {
    setSelectedCountdowns(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(countdownId)) {
        newSelected.delete(countdownId);
      } else {
        newSelected.add(countdownId);
      }
      return newSelected;
    });
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedCountdowns(new Set());
  }, []);

  const handleBatchComplete = useCallback(() => {
    selectedCountdowns.forEach(id => {
      toggleCountdownComplete(id);
    });
    exitSelectionMode();
  }, [selectedCountdowns, toggleCountdownComplete, exitSelectionMode]);

  const handleBatchDelete = useCallback(() => {
    Alert.alert(
      t('confirmDelete'),
      t('confirmBatchDelete', { count: selectedCountdowns.size }),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            selectedCountdowns.forEach(id => {
              deleteCountdown(id);
            });
            exitSelectionMode();
          },
        },
      ]
    );
  }, [selectedCountdowns, deleteCountdown, exitSelectionMode, t]);

  const getFolderColor = useCallback(() => {
    if (folderId === 'completed') return 'emerald';
    if (folderId === 'incomplete') return 'blue';
    if (folderId === 'overdue') return 'red';
    return folders.find(f => f.id === folderId)?.color || 'gray';
  }, [folderId, folders]);

  const renderCountdownItem = useCallback(({ item: countdown }) => (
    <CountdownCard 
      countdown={countdown} 
      folderColor={getFolderColor()}
      onPress={handleCountdownPress}
      onLongPress={handleCountdownLongPress}
      isSelectionMode={isSelectionMode}
      isSelected={selectedCountdowns.has(countdown.id)}
    />
  ), [getFolderColor, handleCountdownPress, handleCountdownLongPress, isSelectionMode, selectedCountdowns]);

  const renderCountdownSection = useCallback((title, data) => (
    <View style={styles.section}>
      <Text style={[styles.subSectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      <FlatList
        data={data}
        renderItem={renderCountdownItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={data.length > 1 ? styles.row : null}
        scrollEnabled={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  ), [theme.colors.text, renderCountdownItem]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={[
          { key: 'one-time', title: t('oneTimeTasks'), data: oneTimeCountdowns },
          { key: 'recurring', title: t('recurringTasks'), data: recurringCountdowns }
        ]}
        renderItem={({ item }) => renderCountdownSection(item.title, item.data)}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
      
      {/* 批量操作工具栏 */}
      {isSelectionMode && (
        <View style={[styles.selectionToolbar, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <View style={styles.toolbarContent}>
            <Text style={[styles.selectionCount, { color: theme.colors.text }]}>
              {t('selected')} {selectedCountdowns.size}
            </Text>
            <View style={styles.toolbarButtons}>
              <TouchableOpacity 
                style={[styles.toolbarButton, styles.completeButton]}
                onPress={handleBatchComplete}
              >
                <Text style={styles.toolbarButtonIcon}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toolbarButton, styles.deleteButton]}
                onPress={handleBatchDelete}
              >
                <Text style={styles.toolbarButtonIcon}>🗑</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toolbarButton, styles.cancelButton, { backgroundColor: theme.colors.border }]}
                onPress={exitSelectionMode}
              >
                <Text style={styles.toolbarButtonIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      
      {/* 浮动添加按钮 - 只在非系统文件夹显示 */}
      {!isSelectionMode && !['completed', 'incomplete', 'overdue'].includes(folderId) && (
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowCountdownModal(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* 模态框 */}
      <AddCountdownModal 
        visible={showCountdownModal} 
        onClose={() => setShowCountdownModal(false)}
        defaultFolder={folderId}
      />
      <EditCountdownModal 
        visible={showEditModal} 
        onClose={() => setShowEditModal(false)}
        countdown={editingCountdown}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 8,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectionToolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolbarContent: {
    padding: 16,
    paddingBottom: 20,
  },
  selectionCount: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  toolbarButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  toolbarButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#10b981',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  cancelButton: {
    // backgroundColor will be set dynamically
  },
  toolbarButtonIcon: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

