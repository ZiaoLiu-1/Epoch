import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CountdownContext } from '../context/CountdownContext';
import { TaskType, Priority } from '../types';

export default function EditCountdownModal({ visible, onClose, countdown }) {
  const { colors } = useTheme();
  const { folders, updateCountdown, deleteCountdown, toggleCountdownComplete } = useContext(CountdownContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [taskType, setTaskType] = useState(TaskType.ONE_TIME);
  const [priority, setPriority] = useState(Priority.MEDIUM);

  useEffect(() => {
    if (countdown) {
      setTitle(countdown.title || '');
      setDescription(countdown.description || '');
      setSelectedFolder(countdown.folder || 'none');
      setDueDate(new Date(countdown.dueDate));
      setTaskType(countdown.type || TaskType.ONE_TIME);
      setPriority(countdown.priority || Priority.MEDIUM);
    }
  }, [countdown]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('错误', '请输入倒计时标题');
      return;
    }

    const updates = {
      title: title.trim(),
      description: description.trim(),
      folder: selectedFolder === 'none' ? null : selectedFolder,
      dueDate: dueDate.toISOString(),
      type: taskType,
      priority,
    };

    updateCountdown(countdown.id, updates);
    handleClose();
  };

  const handleClose = () => {
    onClose();
  };

  const handleToggleComplete = () => {
    toggleCountdownComplete(countdown.id);
    handleClose();
  };

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      `确定要删除"${countdown.title}"吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteCountdown(countdown.id);
            handleClose();
          },
        },
      ]
    );
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(dueDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDueDate(newDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const allFolders = [
    { id: 'none', name: '无分类', color: 'gray' },
    ...folders
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelButton, { color: colors.primary }]}>取消</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>编辑倒计时</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: colors.primary }]}>保存</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>标题 *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={title}
              onChangeText={setTitle}
              placeholder="输入倒计时标题"
              placeholderTextColor={colors.border}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>描述</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
              value={description}
              onChangeText={setDescription}
              placeholder="输入描述（可选）"
              placeholderTextColor={colors.border}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>分类</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.folderSelector}>
              {allFolders.map((folder) => (
                <TouchableOpacity
                  key={folder.id}
                  style={[
                    styles.folderOption,
                    { backgroundColor: selectedFolder === folder.id ? colors.primary : colors.card },
                    { borderColor: colors.border }
                  ]}
                  onPress={() => setSelectedFolder(folder.id)}
                >
                  <Text style={[
                    styles.folderOptionText,
                    { color: selectedFolder === folder.id ? '#fff' : colors.text }
                  ]}>
                    {folder.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.dateTimeRow}>
            <View style={[styles.dateTimeSection, { marginRight: 8 }]}>
              <Text style={[styles.label, { color: colors.text }]}>截止日期</Text>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: colors.text }]}>
                  {formatDate(dueDate)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.dateTimeSection, { marginLeft: 8 }]}>
              <Text style={[styles.label, { color: colors.text }]}>截止时间</Text>
              <TouchableOpacity
                style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: colors.text }]}>
                  {formatTime(dueDate)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>任务类型</Text>
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  { backgroundColor: taskType === TaskType.ONE_TIME ? colors.primary : colors.card },
                  { borderColor: colors.border }
                ]}
                onPress={() => setTaskType(TaskType.ONE_TIME)}
              >
                <Text style={[
                  styles.typeOptionText,
                  { color: taskType === TaskType.ONE_TIME ? '#fff' : colors.text }
                ]}>
                  一次性任务
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeOption,
                  { backgroundColor: taskType === TaskType.RECURRING ? colors.primary : colors.card },
                  { borderColor: colors.border }
                ]}
                onPress={() => setTaskType(TaskType.RECURRING)}
              >
                <Text style={[
                  styles.typeOptionText,
                  { color: taskType === TaskType.RECURRING ? '#fff' : colors.text }
                ]}>
                  循环任务
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text }]}>优先级</Text>
            <View style={styles.prioritySelector}>
              {[
                { key: Priority.HIGH, label: '高', color: '#ef4444' },
                { key: Priority.MEDIUM, label: '中', color: '#f59e0b' },
                { key: Priority.LOW, label: '低', color: '#10b981' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={[
                    styles.priorityOption,
                    { backgroundColor: priority === item.key ? item.color : colors.card },
                    { borderColor: colors.border }
                  ]}
                  onPress={() => setPriority(item.key)}
                >
                  <Text style={[
                    styles.priorityOptionText,
                    { color: priority === item.key ? '#fff' : colors.text }
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 操作按钮 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={handleToggleComplete}
            >
              <Text style={styles.actionButtonText}>
                {countdown?.isCompleted ? '标记为未完成' : '标记为完成'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.actionButtonText}>删除</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={dueDate}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
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
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  folderSelector: {
    flexDirection: 'row',
  },
  folderOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  folderOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dateTimeSection: {
    flex: 1,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#10b981',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

