import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CountdownContext } from '../context/CountdownContext';
import CountdownCard from '../components/CountdownCard';
import FolderItem from '../components/FolderItem';
import AddCountdownModal from '../components/AddCountdownModal';
import AddFolderModal from '../components/AddFolderModal';
import EditCountdownModal from '../components/EditCountdownModal';
import { TaskType } from '../types';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { countdowns, folders, deleteCountdown, toggleCountdownComplete } = useContext(CountdownContext);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedCountdowns, setSelectedCountdowns] = useState(new Set());

  const oneTimeCountdowns = countdowns.filter(c => c.type === TaskType.ONE_TIME);
  const recurringCountdowns = countdowns.filter(c => c.type === TaskType.RECURRING);

  const handleCountdownPress = (countdown) => {
    if (isSelectionMode) {
      toggleSelection(countdown.id);
    } else {
      setEditingCountdown(countdown);
      setShowEditModal(true);
    }
  };

  const handleCountdownLongPress = (countdown) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedCountdowns(new Set([countdown.id]));
    }
  };

  const toggleSelection = (countdownId) => {
    const newSelected = new Set(selectedCountdowns);
    if (newSelected.has(countdownId)) {
      newSelected.delete(countdownId);
    } else {
      newSelected.add(countdownId);
    }
    setSelectedCountdowns(newSelected);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedCountdowns(new Set());
  };

  const handleBatchComplete = () => {
    selectedCountdowns.forEach(id => {
      toggleCountdownComplete(id);
    });
    exitSelectionMode();
  };

  const handleBatchDelete = () => {
    Alert.alert(
      '确认删除',
      `确定要删除选中的 ${selectedCountdowns.size} 个倒计时吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
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
  };

  const getFolderColor = (folderId) => {
    if (!folderId) return 'gray';
    return folders.find(f => f.id === folderId)?.color || 'gray';
  };

  const renderCountdownSection = (title, data) => (
    <View style={styles.section}>
      <Text style={[styles.subSectionTitle, { color: colors.text }]}>
        {title}
      </Text>
      <FlatList
        data={data}
        renderItem={({ item: countdown }) => (
          <CountdownCard 
            countdown={countdown} 
            folderColor={getFolderColor(countdown.folder)}
            onPress={handleCountdownPress}
            onLongPress={handleCountdownLongPress}
            isSelectionMode={isSelectionMode}
            isSelected={selectedCountdowns.has(countdown.id)}
          />
        )}
        keyExtractor={countdown => countdown.id}
        numColumns={2}
        columnWrapperStyle={data.length > 1 ? styles.row : null}
        scrollEnabled={false}
      />
    </View>
  );

  const renderHeader = () => (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>文件夹</Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowFolderModal(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={folders}
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
      <Text style={[styles.sectionTitle, { color: colors.text }]}>所有倒计时</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[
          { key: 'one-time', title: '一次性任务', data: oneTimeCountdowns },
          { key: 'recurring', title: '循环任务', data: recurringCountdowns }
        ]}
        renderItem={({ item }) => renderCountdownSection(item.title, item.data)}
        keyExtractor={item => item.key}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
      
      {/* 批量操作工具栏 */}
      {isSelectionMode && (
        <View style={[styles.selectionToolbar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TouchableOpacity 
            style={[styles.toolbarButton, { backgroundColor: colors.primary }]}
            onPress={handleBatchComplete}
          >
            <Text style={styles.toolbarButtonText}>完成</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, { backgroundColor: '#ef4444' }]}
            onPress={handleBatchDelete}
          >
            <Text style={styles.toolbarButtonText}>删除</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toolbarButton, { backgroundColor: colors.border }]}
            onPress={exitSelectionMode}
          >
            <Text style={styles.toolbarButtonText}>取消</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* 浮动添加按钮 */}
      {!isSelectionMode && (
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colors.primary }]}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 8,
  },
  folderList: {
    marginBottom: 24,
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  toolbarButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  toolbarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

