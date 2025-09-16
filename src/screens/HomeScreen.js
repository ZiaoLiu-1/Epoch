import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CountdownContext } from '../context/CountdownContext';
import CountdownCard from '../components/CountdownCard';
import FolderItem from '../components/FolderItem';
import AddCountdownModal from '../components/AddCountdownModal';
import AddFolderModal from '../components/AddFolderModal';
import { TaskType } from '../types';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { countdowns, folders } = useContext(CountdownContext);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);

  const oneTimeCountdowns = countdowns.filter(c => c.type === TaskType.ONE_TIME);
  const recurringCountdowns = countdowns.filter(c => c.type === TaskType.RECURRING);

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
        data={[{ key: 'one-time', data: oneTimeCountdowns }, { key: 'recurring', data: recurringCountdowns }]}
        renderItem={({ item }) => (
          <View>
            <Text style={[styles.subSectionTitle, { color: colors.text }]}>
              {item.key === 'one-time' ? '一次性任务' : '循环任务'}
            </Text>
            <FlatList
              data={item.data}
              renderItem={({ item: countdown }) => (
                <CountdownCard countdown={countdown} folderColor={folders.find(f => f.id === countdown.folder)?.color || 'gray'} />
              )}
              keyExtractor={countdown => countdown.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
            />
          </View>
        )}
        keyExtractor={item => item.key}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.content}
      />
      
      {/* 浮动添加按钮 */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setShowCountdownModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 模态框 */}
      <AddCountdownModal 
        visible={showCountdownModal} 
        onClose={() => setShowCountdownModal(false)} 
      />
      <AddFolderModal 
        visible={showFolderModal} 
        onClose={() => setShowFolderModal(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 10,
    paddingBottom: 80, // 为浮动按钮留出空间
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
  },
  folderList: {
    marginBottom: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
});

