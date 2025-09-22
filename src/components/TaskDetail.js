import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';

export default function TaskDetail({ task, onBack, onSave, onDelete, onComplete }) {
  const { theme } = useThemeContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [deadline, setDeadline] = useState(task?.deadline || '');
  const [taskType, setTaskType] = useState(task?.type || '一次性');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [category, setCategory] = useState(task?.category || 'pending');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('错误', '请输入任务标题');
      return;
    }

    const updatedTask = {
      ...task,
      id: task?.id || Date.now().toString(),
      title,
      description,
      deadline,
      type: taskType,
      priority,
      category,
      folderColor: task?.folderColor || '#3B82F6',
      countdown: task?.countdown || '新任务'
    };

    onSave(updatedTask);
  };

  const handleDelete = () => {
    if (task?.id) {
      Alert.alert(
        '确认删除',
        '确定要删除这个任务吗？',
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '删除', 
            style: 'destructive',
            onPress: () => onDelete && onDelete(task.id)
          }
        ]
      );
    }
  };

  const handleComplete = () => {
    if (task?.id && onComplete) {
      onComplete(task.id);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          {task?.id ? '编辑任务' : '新建任务'}
        </Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={[styles.saveButtonText, { color: theme.colors.primary }]}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>任务标题</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }]}
            value={title}
            onChangeText={setTitle}
            placeholder="输入任务标题"
            placeholderTextColor={theme.colors.mutedForeground}
          />
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>任务描述</Text>
          <TextInput
            style={[styles.textArea, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }]}
            value={description}
            onChangeText={setDescription}
            placeholder="输入任务描述"
            placeholderTextColor={theme.colors.mutedForeground}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Deadline Input */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>截止日期</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }]}
            value={deadline}
            onChangeText={setDeadline}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={theme.colors.mutedForeground}
          />
        </View>

        {/* Task Type Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>任务类型</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                taskType === '一次性' && styles.optionButtonActive,
                { 
                  borderColor: taskType === '一次性' ? theme.colors.primary : theme.colors.border,
                  backgroundColor: taskType === '一次性' ? theme.colors.primary + '20' : theme.colors.card
                }
              ]}
              onPress={() => setTaskType('一次性')}
            >
              <Text style={[
                styles.optionButtonText,
                { color: taskType === '一次性' ? theme.colors.primary : theme.colors.text }
              ]}>
                一次性
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                taskType === '循环' && styles.optionButtonActive,
                { 
                  borderColor: taskType === '循环' ? theme.colors.primary : theme.colors.border,
                  backgroundColor: taskType === '循环' ? theme.colors.primary + '20' : theme.colors.card
                }
              ]}
              onPress={() => setTaskType('循环')}
            >
              <Text style={[
                styles.optionButtonText,
                { color: taskType === '循环' ? theme.colors.primary : theme.colors.text }
              ]}>
                循环
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Priority Selection */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.colors.text }]}>优先级</Text>
          <View style={styles.buttonGroup}>
            {['high', 'medium', 'low'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.optionButton,
                  priority === p && styles.optionButtonActive,
                  { 
                    borderColor: priority === p ? theme.colors.primary : theme.colors.border,
                    backgroundColor: priority === p ? theme.colors.primary + '20' : theme.colors.card
                  }
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.optionButtonText,
                  { color: priority === p ? theme.colors.primary : theme.colors.text }
                ]}>
                  {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        {task?.id && (
          <View style={styles.actionButtons}>
            {onComplete && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.success + '20' }]}
                onPress={handleComplete}
              >
                <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
                <Text style={[styles.actionButtonText, { color: theme.colors.success }]}>
                  标记完成
                </Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.destructive + '20' }]}
                onPress={handleDelete}
              >
                <Ionicons name="trash" size={24} color={theme.colors.destructive} />
                <Text style={[styles.actionButtonText, { color: theme.colors.destructive }]}>
                  删除任务
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionButtonActive: {
    borderWidth: 2,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    marginTop: 32,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
