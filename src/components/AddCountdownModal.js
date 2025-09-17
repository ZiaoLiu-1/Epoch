import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CountdownContext } from '../context/CountdownContext';
import { TaskType, Priority } from '../types';

export default function AddCountdownModal({ visible, onClose }) {
  const { colors } = useTheme();
  const { folders, addCountdown } = useContext(CountdownContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('none');
  const [dueDate, setDueDate] = useState(null);
  const [hasDueDate, setHasDueDate] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [taskType, setTaskType] = useState(TaskType.ONE_TIME);
  const [priority, setPriority] = useState(Priority.MEDIUM);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('错误', '请输入倒计时标题');
      return;
    }

    const newCountdown = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      folder: selectedFolder === 'none' ? null : selectedFolder,
      dueDate: hasDueDate && dueDate ? dueDate.toISOString() : null,
      type: taskType,
      priority,
      isCompleted: false,
    };

    addCountdown(newCountdown);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedFolder('none');
    setDueDate(null);
    setHasDueDate(false);
    setTaskType(TaskType.ONE_TIME);
    setPriority(Priority.MEDIUM);
    onClose();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (!dueDate) {
        // 如果之前没有设置日期，创建新的日期对象
        const newDate = new Date(selectedDate);
        newDate.setHours(23, 59, 0, 0); // 默认设置为当天23:59
        setDueDate(newDate);
      } else {
        // 如果已有日期，只更新日期部分
        const newDate = new Date(dueDate);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        setDueDate(newDate);
      }
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime && dueDate) {
      const newDate = new Date(dueDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      newDate.setSeconds(0); // 设置秒为0，精度到分钟
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

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelButton, { color: colors.primary }]}>取消</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>添加倒计时</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: colors.primary }]}>保存</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
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
              <TouchableOpacity
                style={[
                  styles.folderOption,
                  { backgroundColor: selectedFolder === 'none' ? colors.primary : colors.card },
                  { borderColor: colors.border }
                ]}
                onPress={() => setSelectedFolder('none')}
              >
                <Text style={[
                  styles.folderOptionText,
                  { color: selectedFolder === 'none' ? '#fff' : colors.text }
                ]}>
                  无分类
                </Text>
              </TouchableOpacity>
              {folders.map((folder) => (
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

          <View style={styles.section}>
            <View style={styles.dueDateHeader}>
              <Text style={[styles.label, { color: colors.text }]}>设置截止时间</Text>
              <Switch
                value={hasDueDate}
                onValueChange={(value) => {
                  setHasDueDate(value);
                  if (value && !dueDate) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(23, 59, 0, 0);
                    setDueDate(tomorrow);
                  }
                }}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={hasDueDate ? '#fff' : '#f4f3f4'}
              />
            </View>
            
            {hasDueDate && (
              <View style={styles.dateTimeRow}>
                <View style={[styles.dateTimeSection, { marginRight: 8 }]}>
                  <Text style={[styles.subLabel, { color: colors.text }]}>日期</Text>
                  <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={[styles.dateButtonText, { color: colors.text }]}>
                      {dueDate ? formatDate(dueDate) : '选择日期'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.dateTimeSection, { marginLeft: 8 }]}>
                  <Text style={[styles.subLabel, { color: colors.text }]}>时间</Text>
                  <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={[styles.dateButtonText, { color: colors.text }]}>
                      {dueDate ? formatTime(dueDate) : '选择时间'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
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
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  dueDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  folderSelector: {
    flexDirection: 'row',
  },
  folderOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  folderOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
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
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

