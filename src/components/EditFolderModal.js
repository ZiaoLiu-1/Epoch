import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CountdownContext } from '../context/CountdownContext';

const folderColors = [
  { key: 'emerald', name: '绿色', color: '#16a34a' },
  { key: 'blue', name: '蓝色', color: '#2563eb' },
  { key: 'purple', name: '紫色', color: '#7c3aed' },
  { key: 'orange', name: '橙色', color: '#ea580c' },
  { key: 'red', name: '红色', color: '#e11d48' },
  { key: 'pink', name: '粉色', color: '#db2777' },
  { key: 'indigo', name: '靛蓝', color: '#4f46e5' },
  { key: 'gray', name: '灰色', color: '#6b7280' },
];

export default function EditFolderModal({ visible, onClose, folder }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { updateFolder, deleteFolder, countdowns } = useContext(CountdownContext);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setSelectedColor(folder.color);
    }
  }, [folder]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert(t('errorTitle'), t('pleaseEnterFolderName'));
      return;
    }

    updateFolder(folder.id, {
      name: name.trim(),
      color: selectedColor,
    });

    Alert.alert('成功', '文件夹已更新', [
      { text: '确定', onPress: onClose }
    ]);
  };

  const handleDelete = () => {
    const folderCountdowns = countdowns.filter(c => c.folder === folder.id);
    const message = folderCountdowns.length > 0 
      ? `此文件夹包含 ${folderCountdowns.length} 个倒计时，删除后将移动到默认文件夹。确定删除吗？`
      : '确定要删除此文件夹吗？';

    Alert.alert(
      '确认删除',
      message,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '删除', 
          style: 'destructive',
          onPress: () => {
            deleteFolder(folder.id);
            Alert.alert('成功', '文件夹已删除', [
              { text: '确定', onPress: onClose }
            ]);
          }
        }
      ]
    );
  };

  const handleClose = () => {
    setName('');
    setSelectedColor('blue');
    onClose();
  };

  if (!folder) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelButton, { color: theme.colors.text }]}>取消</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>编辑文件夹</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: theme.colors.primary }]}>保存</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>文件夹名称</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }
              ]}
              value={name}
              onChangeText={setName}
              placeholder="输入文件夹名称"
              placeholderTextColor={theme.colors.border}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>选择颜色</Text>
            <View style={styles.colorGrid}>
              {folderColors.map((colorOption) => (
                <TouchableOpacity
                  key={colorOption.key}
                  style={[
                    styles.colorOption,
                    {
                      backgroundColor: colorOption.color,
                      borderColor: selectedColor === colorOption.key ? theme.colors.text : 'transparent',
                    }
                  ]}
                  onPress={() => setSelectedColor(colorOption.key)}
                >
                  {selectedColor === colorOption.key && (
                    <Text style={styles.colorCheckmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.deleteButton, { backgroundColor: '#e11d48' }]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>删除文件夹</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCheckmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
