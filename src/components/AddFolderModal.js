import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CountdownContext } from '../context/CountdownContext';

const folderColors = [
  { key: 'emerald', name: '翠绿', color: '#10b981' },
  { key: 'blue', name: '蓝色', color: '#3b82f6' },
  { key: 'purple', name: '紫色', color: '#8b5cf6' },
  { key: 'orange', name: '橙色', color: '#f59e0b' },
  { key: 'red', name: '红色', color: '#ef4444' },
  { key: 'pink', name: '粉色', color: '#ec4899' },
  { key: 'indigo', name: '靛蓝', color: '#6366f1' },
  { key: 'gray', name: '灰色', color: '#6b7280' },
];

export default function AddFolderModal({ visible, onClose }) {
  const { colors } = useTheme();
  const { addFolder } = useContext(CountdownContext);

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('emerald');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('错误', '请输入文件夹名称');
      return;
    }

    const newFolder = {
      id: Date.now().toString(),
      name: name.trim(),
      color: selectedColor,
    };

    addFolder(newFolder);
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setSelectedColor('emerald');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelButton, { color: colors.primary }]}>取消</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>添加文件夹</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: colors.primary }]}>保存</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>文件夹名称 *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={name}
              onChangeText={setName}
              placeholder="输入文件夹名称"
              placeholderTextColor={colors.border}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>选择颜色</Text>
            <View style={styles.colorGrid}>
              {folderColors.map((colorOption) => (
                <TouchableOpacity
                  key={colorOption.key}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorOption.color },
                    selectedColor === colorOption.key && styles.selectedColor
                  ]}
                  onPress={() => setSelectedColor(colorOption.key)}
                >
                  {selectedColor === colorOption.key && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.colorName, { color: colors.border }]}>
              {folderColors.find(c => c.key === selectedColor)?.name}
            </Text>
          </View>
        </View>
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
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  checkmark: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  colorName: {
    fontSize: 14,
    textAlign: 'center',
  },
});

