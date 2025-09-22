import React, { useContext, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CountdownContext } from '../context/CountdownContext';
import { useFiles } from '../context/FileContext';
import CountdownCard from '../components/CountdownCard';
import AddCountdownModal from '../components/AddCountdownModal';
import EditCountdownModal from '../components/EditCountdownModal';
import FileUploadModal from '../components/FileUploadModal';
import FileListModal from '../components/FileListModal';
import { TaskType } from '../types';

export default function FolderScreen({ route, navigation }) {
  const { folderId, folderName } = route.params;
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { countdowns, folders, deleteCountdown, toggleCountdownComplete } = useContext(CountdownContext);
  const { getFolderFiles } = useFiles();
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCountdowns, setSelectedCountdowns] = useState(new Set());
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showFileListModal, setShowFileListModal] = useState(false);

  // 获取当前文件夹的倒计时
  const folderCountdowns = countdowns.filter(c => {
    if (folderId === 'completed') return c.isCompleted;
    if (folderId === 'incomplete') return !c.isCompleted && (!c.dueDate || new Date(c.dueDate) >= new Date());
    if (folderId === 'overdue') return !c.isCompleted && c.dueDate && new Date(c.dueDate) < new Date();
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

  const folderFiles = getFolderFiles(folderId);
  const isSystemFolder = ['completed', 'incomplete', 'overdue'].includes(folderId);

  const renderHeader = useCallback(() => (
    <View style={styles.headerSection}>
      {/* 文件管理区域 - 只在非系统文件夹显示 */}
      {!isSystemFolder && (
        <View style={styles.fileSection}>
          <View style={styles.fileSectionHeader}>
            <Text style={[styles.fileSectionTitle, { color: theme.colors.text }]}>
              📁 文件管理
            </Text>
            <Text style={[styles.fileCount, { color: theme.colors.border }]}>
              {folderFiles.length} 个文件
            </Text>
          </View>
          
          <View style={styles.fileButtons}>
            <TouchableOpacity 
              style={[styles.fileButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setShowFileUploadModal(true)}
            >
              <Text style={styles.fileButtonIcon}>📤</Text>
              <Text style={styles.fileButtonText}>上传文件</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.fileButton, { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                borderWidth: 1,
              }]}
              onPress={() => setShowFileListModal(true)}
            >
              <Text style={[styles.fileButtonIcon, { color: theme.colors.text }]}>📋</Text>
              <Text style={[styles.fileButtonText, { color: theme.colors.text }]}>查看文件</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  ), [theme.colors, folderFiles.length, isSystemFolder]);

  const renderCountdownSection = useCallback((title, data) => (
    <View style={styles.section}>
      <Text style={[styles.subSectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      <View style={styles.singleColumnContainer}>
        {data.map((item, index) => (
          <CountdownCard 
            key={item.id}
            countdown={item} 
            folderColor={getFolderColor()}
            onPress={handleCountdownPress}
            onLongPress={handleCountdownLongPress}
            isSelectionMode={isSelectionMode}
            isSelected={selectedCountdowns.has(item.id)}
          />
        ))}
      </View>
    </View>
  ), [theme.colors.text, getFolderColor, handleCountdownPress, handleCountdownLongPress, isSelectionMode, selectedCountdowns]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={[
          { key: 'one-time', title: t('oneTimeTasks'), data: oneTimeCountdowns },
          { key: 'recurring', title: t('recurringTasks'), data: recurringCountdowns }
        ]}
        renderItem={({ item }) => renderCountdownSection(item.title, item.data)}
        keyExtractor={item => item.key}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
        updateCellsBatchingPeriod={100}
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
      <FileUploadModal 
        visible={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        folderId={folderId}
        folderName={folderName}
      />
      <FileListModal 
        visible={showFileListModal}
        onClose={() => setShowFileListModal(false)}
        folderId={folderId}
        folderName={folderName}
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
  singleColumnContainer: {
    paddingHorizontal: 16,
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
  // 文件管理样式
  headerSection: {
    marginBottom: 16,
  },
  fileSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fileSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  fileCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  fileButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  fileButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  fileButtonIcon: {
    fontSize: 16,
  },
  fileButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

