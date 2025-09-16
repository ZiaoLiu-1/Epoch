import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CountdownContext } from '../context/CountdownContext';
import CountdownCard from '../components/CountdownCard';
import FolderItem from '../components/FolderItem';
import { TaskType } from '../types';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { countdowns, folders } = useContext(CountdownContext);

  const oneTimeCountdowns = countdowns.filter(c => c.type === TaskType.ONE_TIME);
  const recurringCountdowns = countdowns.filter(c => c.type === TaskType.RECURRING);

  const renderHeader = () => (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>文件夹</Text>
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
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
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
});

