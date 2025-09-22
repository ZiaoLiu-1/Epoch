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
import EditFolderModal from '../components/EditFolderModal';
import ImportICSModal from '../components/ImportICSModal';
import { TaskType } from '../types';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { countdowns, folders, deleteCountdown, toggleCountdownComplete, deleteFolder } = useContext(CountdownContext);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCountdowns, setSelectedCountdowns] = useState(new Set());
  const [isFolderSelectionMode, setIsFolderSelectionMode] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState(new Set());
  const [isFilterMode, setIsFilterMode] = useState(false);
  const [filteredFolders, setFilteredFolders] = useState(new Set());

  // 筛选逻辑
  const getFilteredCountdowns = useCallback((countdownList) => {
    if (!isFilterMode || filteredFolders.size === 0) {
      return countdownList;
    }
    
    // 如果选择了"全部"，显示所有任务
    if (filteredFolders.has('all')) {
      return countdownList;
    }
    
    // 否则只显示选中文件夹的任务
    return countdownList.filter(c => filteredFolders.has(c.folder));
  }, [isFilterMode, filteredFolders]);

  const oneTimeCountdowns = getFilteredCountdowns(countdowns.filter(c => c.type === TaskType.ONE_TIME));
  const recurringCountdowns = getFilteredCountdowns(countdowns.filter(c => c.type === TaskType.RECURRING));

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

  const handleFolderLongPress = useCallback((folder) => {
    if (folder.isSystem) return; // 系统文件夹不能编辑
    if (isFolderSelectionMode) {
      toggleFolderSelection(folder.id);
    } else {
      setEditingFolder(folder);
      setShowEditFolderModal(true);
    }
  }, [isFolderSelectionMode]);

  const handleFolderPress = useCallback((folder) => {
    if (isFolderSelectionMode) {
      toggleFolderSelection(folder.id);
    } else if (isFilterMode) {
      toggleFolderFilter(folder.id);
    } else {
      navigation.navigate('Folder', { folderId: folder.id, folderName: folder.name });
    }
  }, [isFolderSelectionMode, isFilterMode, navigation]);

  const toggleFolderFilter = useCallback((folderId) => {
    setFilteredFolders(prev => {
      const newFiltered = new Set(prev);
      
      // 如果点击"全部"，清除所有其他筛选
      if (folderId === 'all') {
        return new Set(['all']);
      }
      
      // 如果当前有"全部"选中，先移除它
      if (newFiltered.has('all')) {
        newFiltered.delete('all');
      }
      
      // 切换当前文件夹
      if (newFiltered.has(folderId)) {
        newFiltered.delete(folderId);
      } else {
        newFiltered.add(folderId);
      }
      
      return newFiltered;
    });
  }, []);

  const startFilterMode = useCallback(() => {
    setIsFilterMode(true);
    setFilteredFolders(new Set(['all'])); // 默认选中"全部"
  }, []);

  const exitFilterMode = useCallback(() => {
    setIsFilterMode(false);
    setFilteredFolders(new Set());
  }, []);

  const toggleFolderSelection = useCallback((folderId) => {
    setSelectedFolders(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(folderId)) {
        newSelected.delete(folderId);
      } else {
        newSelected.add(folderId);
      }
      return newSelected;
    });
  }, []);

  const exitFolderSelectionMode = useCallback(() => {
    setIsFolderSelectionMode(false);
    setSelectedFolders(new Set());
  }, []);

  const handleBatchDeleteFolders = useCallback(() => {
    const foldersToDelete = Array.from(selectedFolders).map(id => 
      folders.find(f => f.id === id)
    ).filter(Boolean);

    if (foldersToDelete.length === 0) return;

    const totalTasks = foldersToDelete.reduce((sum, folder) => 
      sum + countdowns.filter(c => c.folder === folder.id).length, 0
    );

    if (totalTasks > 0) {
      Alert.alert(
        '删除文件夹',
        `即将删除 ${foldersToDelete.length} 个文件夹，其中包含 ${totalTasks} 个任务。\n\n请选择如何处理这些任务：`,
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '保留任务', 
            onPress: () => deleteFoldersWithTaskHandling(foldersToDelete, false)
          },
          { 
            text: '删除任务', 
            style: 'destructive',
            onPress: () => deleteFoldersWithTaskHandling(foldersToDelete, true)
          }
        ]
      );
    } else {
      Alert.alert(
        '确认删除',
        `确定要删除 ${foldersToDelete.length} 个文件夹吗？`,
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '删除', 
            style: 'destructive',
            onPress: () => deleteFoldersWithTaskHandling(foldersToDelete, false)
          }
        ]
      );
    }
  }, [selectedFolders, folders, countdowns]);

  const deleteFoldersWithTaskHandling = useCallback((foldersToDelete, deleteTasks) => {
    try {
      foldersToDelete.forEach(folder => {
        if (deleteTasks) {
          // 删除文件夹内的所有任务
          const folderTasks = countdowns.filter(c => c.folder === folder.id);
          folderTasks.forEach(task => deleteCountdown(task.id));
        }
        // 删除文件夹（如果不删除任务，deleteFolder会自动处理任务迁移）
        deleteFolder(folder.id);
      });

      exitFolderSelectionMode();
      Alert.alert(
        '删除成功',
        `已删除 ${foldersToDelete.length} 个文件夹${deleteTasks ? '及其包含的任务' : '，任务已移动到默认文件夹'}`,
        [{ text: '确定' }]
      );
    } catch (error) {
      Alert.alert('错误', '删除过程中发生错误');
      console.error('Batch delete folders error:', error);
    }
  }, [countdowns, deleteCountdown, deleteFolder, exitFolderSelectionMode]);

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
       <View style={styles.singleColumnContainer}>
         {data.map((item, index) => (
           <CountdownCard 
             key={item.id}
             countdown={item} 
             folderColor={getFolderColor(item.folder)}
             onPress={handleCountdownPress}
             onLongPress={handleCountdownLongPress}
             onPanGesture={handlePanGesture}
             isSelectionMode={isSelectionMode}
             isSelected={selectedCountdowns.has(item.id)}
           />
         ))}
       </View>
    </View>
  ), [theme.colors.text, getFolderColor, handleCountdownPress, handleCountdownLongPress, handlePanGesture, isSelectionMode, selectedCountdowns]);

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
      case 'completed': return '#16a34a'; // 更柔和的绿色
      case 'incomplete': return '#2563eb'; // 保持蓝色
      case 'overdue': return '#e11d48'; // 更柔和的红色
      default: return '#6b7280';
    }
  };

  const renderHeader = useCallback(() => {
    return (
    <>
      <View style={styles.topBar}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('folders')}</Text>
          <View style={styles.headerButtons}>
            {!isFolderSelectionMode && !isFilterMode ? (
              <>
                <TouchableOpacity
                  style={[styles.importButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                  onPress={() => setShowImportModal(true)}
                >
                  <Text style={[styles.importButtonText, { color: theme.colors.text }]}>📅</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setShowFolderModal(true)}
                >
                  <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.filterButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                  onPress={startFilterMode}
                >
                  <Text style={[styles.filterButtonText, { color: theme.colors.text }]}>筛选</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.selectButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                  onPress={() => setIsFolderSelectionMode(true)}
                >
                  <Text style={[styles.selectButtonText, { color: theme.colors.text }]}>选择</Text>
                </TouchableOpacity>
              </>
            ) : isFilterMode ? (
              <TouchableOpacity
                style={[styles.exitFilterButton, { backgroundColor: theme.colors.primary }]}
                onPress={exitFilterMode}
              >
                <Text style={[styles.exitFilterButtonText, { color: '#fff' }]}>退出筛选</Text>
              </TouchableOpacity>
            ) : isFolderSelectionMode ? (
              <>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                  onPress={exitFolderSelectionMode}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>取消</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.deleteButton, 
                    { backgroundColor: selectedFolders.size > 0 ? '#e11d48' : theme.colors.border }
                  ]}
                  onPress={handleBatchDeleteFolders}
                  disabled={selectedFolders.size === 0}
                >
                  <Text style={[styles.deleteButtonText, { color: '#fff' }]}>
                    删除 ({selectedFolders.size})
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.settingsButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={[styles.settingsButtonText, { color: theme.colors.text }]}>⚙️</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={[
          { id: 'all', name: '全部', color: 'blue', isAll: true },
          ...folders.filter(f => !f.isSystem)
        ]}
        renderItem={({ item }) => (
          <FolderItem 
            folder={item} 
            onPress={() => handleFolderPress(item)}
            onLongPress={() => handleFolderLongPress(item)}
            isSelectionMode={isFolderSelectionMode}
            isSelected={selectedFolders.has(item.id)}
            isFilterMode={isFilterMode}
            isFiltered={filteredFolders.has(item.id)}
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
    </>
  );
  }, [theme.colors, t, folders, navigation, getSystemFolderCount]);

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
      <ImportICSModal 
        visible={showImportModal} 
        onClose={() => setShowImportModal(false)} 
      />
      <EditFolderModal 
        visible={showEditFolderModal} 
        onClose={() => {
          setShowEditFolderModal(false);
          setEditingFolder(null);
        }}
        folder={editingFolder}
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  singleColumnContainer: {
    paddingHorizontal: 16,
  },
  importButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButtonText: {
    fontSize: 16,
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
  selectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  deleteButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  exitFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  exitFilterButtonText: {
    fontSize: 12,
    fontWeight: '600',
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
    backgroundColor: '#16a34a', // 更柔和的绿色
  },
  deleteButton: {
    backgroundColor: '#e11d48', // 更柔和的红色
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

