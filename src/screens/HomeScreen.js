import React, { useContext, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import { State } from 'react-native-gesture-handler';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CountdownContext } from '../context/CountdownContext';
import CountdownCard from '../components/CountdownCard';
import FolderItem from '../components/FolderItem';
import AddCountdownModal from '../components/AddCountdownModal';
import AddFolderModal from '../components/AddFolderModal';
import EditCountdownModal from '../components/EditCountdownModal';
import { TaskType } from '../types';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { countdowns, folders, deleteCountdown, toggleCountdownComplete } = useContext(CountdownContext);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCountdowns, setSelectedCountdowns] = useState(new Set());

  const oneTimeCountdowns = countdowns.filter(c => c.type === TaskType.ONE_TIME);
  const recurringCountdowns = countdowns.filter(c => c.type === TaskType.RECURRING);

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

  const handlePanGesture = useCallback((event, countdown) => {
    if (!isSelectionMode) return;

    const { state, x, y } = event.nativeEvent;
    
    if (state === State.ACTIVE) {
      // 计算当前手势位置对应的卡片
      const cardWidth = (screenWidth - 48) / 2; // 考虑padding和margin
      const cardHeight = 140;
      const cardsPerRow = 2;
      
      // 简单的碰撞检测逻辑
      const allCountdowns = [...oneTimeCountdowns, ...recurringCountdowns];
      allCountdowns.forEach((item, index) => {
        const row = Math.floor(index / cardsPerRow);
        const col = index % cardsPerRow;
        const cardX = col * (cardWidth + 16) + 24;
        const cardY = row * (cardHeight + 16) + 200; // 估算的起始Y位置
        
        if (x >= cardX && x <= cardX + cardWidth && 
            y >= cardY && y <= cardY + cardHeight) {
          toggleSelection(item.id);
        }
      });
    }
  }, [isSelectionMode, oneTimeCountdowns, recurringCountdowns]);

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

  const getFolderColor = useCallback((folderId) => {
    if (!folderId) return 'gray';
    return folders.find(f => f.id === folderId)?.color || 'gray';
  }, [folders]);

  const renderCountdownItem = useCallback(({ item: countdown }) => (
    <CountdownCard 
      countdown={countdown} 
      folderColor={getFolderColor(countdown.folder)}
      onPress={handleCountdownPress}
      onLongPress={handleCountdownLongPress}
      onPanGesture={handlePanGesture}
      isSelectionMode={isSelectionMode}
      isSelected={selectedCountdowns.has(countdown.id)}
    />
  ), [getFolderColor, handleCountdownPress, handleCountdownLongPress, handlePanGesture, isSelectionMode, selectedCountdowns]);

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
        getItemLayout={(data, index) => ({
          length: 140,
          offset: 140 * Math.floor(index / 2),
          index,
        })}
      />
    </View>
  ), [theme.colors.text, renderCountdownItem]);

  const getSystemFolderCount = useCallback((folderId) => {
    return countdowns.filter(c => {
      if (folderId === 'completed') return c.isCompleted;
      if (folderId === 'incomplete') return !c.isCompleted && (!c.dueDate || new Date(c.dueDate) >= new Date());
      if (folderId === 'overdue') return !c.isCompleted && c.dueDate && new Date(c.dueDate) < new Date();
      return false;
    }).length;
  }, [countdowns]);

  const getSystemFolderIcon = (folderId) => {
    switch (folderId) {
      case 'completed': return '✓';
      case 'incomplete': return '○';
      case 'overdue': return '⚠';
      default: return '○';
    }
  };

  const getSystemFolderColor = (folderId) => {
    switch (folderId) {
      case 'completed': return '#10b981';
      case 'incomplete': return '#3b82f6';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const renderHeader = useCallback(() => (
      <View style={styles.topBar}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('folders')}</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setShowFolderModal(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.settingsButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.settingsButtonText, { color: theme.colors.text }]}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={folders.filter(f => !f.isSystem)}
        renderItem={({ item }) => (
          <FolderItem 
            folder={item} 
            onPress={() => navigation.navigate('Folder', { folderId: item.id, folderName: item.name })}
          />
        )}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.folderList}
      />
      
      {/* 系统文件夹 */}
      <View style={styles.systemFolders}>
        <Text style={[styles.systemFoldersTitle, { color: theme.colors.text }]}>系统文件夹</Text>
        <View style={styles.systemFoldersRow}>
          {folders.filter(f => f.isSystem).map(folder => {
            const taskCount = getSystemFolderCount(folder.id);
            return (
              <TouchableOpacity
                key={folder.id}
                style={[styles.systemFolderItem, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                onPress={() => navigation.navigate('Folder', { folderId: folder.id, folderName: folder.name })}
              >
                <View style={styles.systemFolderContent}>
                  <Text style={[styles.systemFolderIcon, { color: getSystemFolderColor(folder.id) }]}>
                    {getSystemFolderIcon(folder.id)}
                  </Text>
                  <Text style={[styles.systemFolderText, { color: theme.colors.text }]}>{folder.name}</Text>
                  <Text style={[styles.systemFolderCount, { color: theme.colors.border }]}>{taskCount}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('allCountdowns')}</Text>
    </View>
  ), [theme.colors, t, folders, navigation]);

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
        maxToRenderPerBatch={5}
        windowSize={10}
      />
      
      {/* 优化的批量操作工具栏 */}
      {isSelectionMode && (
        <View style={[styles.selectionToolbar, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <View style={styles.toolbarContent}>
            <Text style={[styles.selectionCount, { color: theme.colors.text }]}>
              {t('selected', { count: selectedCountdowns.size })} {selectedCountdowns.size}
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
      
      {/* 浮动添加按钮 */}
      {!isSelectionMode && (
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
      />
      <AddFolderModal 
        visible={showFolderModal} 
        onClose={() => setShowFolderModal(false)} 
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 12,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 8,
  },
  folderList: {
    marginBottom: 16,
  },
  systemFolders: {
    marginBottom: 24,
  },
  systemFoldersTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 8,
  },
  systemFoldersRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
  },
  systemFolderItem: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 80,
  },
  systemFolderContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  systemFolderIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  systemFolderText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  systemFolderCount: {
    fontSize: 10,
    fontWeight: '500',
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  settingsButtonText: {
    fontSize: 18,
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
  toolbarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

