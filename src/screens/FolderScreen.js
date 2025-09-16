import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CountdownContext } from '../context/CountdownContext';
import CountdownCard from '../components/CountdownCard';

export default function FolderScreen({ route }) {
  const { folderId } = route.params;
  const { colors } = useTheme();
  const { countdowns, folders } = useContext(CountdownContext);

  const folderCountdowns = countdowns.filter(c => c.folder === folderId);
  const folder = folders.find(f => f.id === folderId);

  return (
    <View style={styles.container}>
      <FlatList
        data={folderCountdowns}
        renderItem={({ item }) => (
          <CountdownCard countdown={item} folderColor={folder?.color || 'gray'} />
        )}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
});

