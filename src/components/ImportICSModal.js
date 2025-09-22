import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { CountdownContext } from '../context/CountdownContext';
import { TaskType, Priority } from '../types';

const availableColors = ['emerald', 'blue', 'purple', 'orange', 'red', 'pink', 'indigo', 'gray'];

export default function ImportICSModal({ visible, onClose }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { addCountdown, addFolder, folders } = useContext(CountdownContext);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedEvents, setParsedEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState(new Set());
  const [folderName, setFolderName] = useState('导入事件');
  const [showFolderInput, setShowFolderInput] = useState(false);

  const getRandomUnusedColor = useCallback(() => {
    const usedColors = folders.map(f => f.color);
    const unusedColors = availableColors.filter(color => !usedColors.includes(color));
    
    if (unusedColors.length > 0) {
      return unusedColors[Math.floor(Math.random() * unusedColors.length)];
    }
    
    // 如果所有颜色都被使用了，就随机返回一个
    return availableColors[Math.floor(Math.random() * availableColors.length)];
  }, [folders]);

  const parseICSFile = async (fileUri) => {
    try {
      const response = await fetch(fileUri);
      const icsContent = await response.text();
      
      // Enhanced ICS parser supporting both VEVENT and VTODO
      const events = [];
      const lines = icsContent.split('\n');
      let currentEvent = {};
      let inEvent = false;
      let eventType = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === 'BEGIN:VEVENT' || line === 'BEGIN:VTODO') {
          inEvent = true;
          eventType = line === 'BEGIN:VEVENT' ? 'VEVENT' : 'VTODO';
          currentEvent = { type: eventType };
        } else if ((line === 'END:VEVENT' || line === 'END:VTODO') && inEvent) {
          // For VTODO, use DUE date as the start time if no DTSTART
          if (eventType === 'VTODO' && !currentEvent.dtstart && currentEvent.due) {
            currentEvent.dtstart = currentEvent.due;
          }
          
          if (currentEvent.summary && currentEvent.dtstart) {
            events.push(currentEvent);
          }
          inEvent = false;
          currentEvent = {};
          eventType = null;
        } else if (inEvent) {
          if (line.startsWith('SUMMARY:')) {
            currentEvent.summary = line.substring(8).replace(/\\,/g, ',').replace(/\\;/g, ';');
          } else if (line.startsWith('DESCRIPTION:')) {
            currentEvent.description = line.substring(12).replace(/\\,/g, ',').replace(/\\;/g, ';');
          } else if (line.startsWith('DTSTART')) {
            const dateStr = line.includes(':') ? line.split(':')[1] : line.split(';')[1];
            currentEvent.dtstart = parseICSDate(dateStr);
          } else if (line.startsWith('DTEND')) {
            const dateStr = line.includes(':') ? line.split(':')[1] : line.split(';')[1];
            currentEvent.dtend = parseICSDate(dateStr);
          } else if (line.startsWith('DUE')) {
            // Handle VTODO due date
            const dateStr = line.includes(':') ? line.split(':')[1] : line.split(';')[1];
            currentEvent.due = parseICSDate(dateStr);
          } else if (line.startsWith('RRULE:')) {
            currentEvent.rrule = line.substring(6);
          } else if (line.startsWith('LOCATION:')) {
            currentEvent.location = line.substring(9).replace(/\\,/g, ',').replace(/\\;/g, ';');
          } else if (line.startsWith('PRIORITY:')) {
            currentEvent.priority = parseInt(line.substring(9));
          } else if (line.startsWith('STATUS:')) {
            currentEvent.status = line.substring(7);
          }
        }
      }
      
      return events;
    } catch (error) {
      console.error('Error parsing ICS file:', error);
      throw new Error('Failed to parse ICS file');
    }
  };

  const parseICSDate = (dateStr) => {
    // Handle different ICS date formats
    if (dateStr.length === 8) {
      // YYYYMMDD format
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return new Date(year, month - 1, day);
    } else if (dateStr.length === 15) {
      // YYYYMMDDTHHMMSS format
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(9, 11);
      const minute = dateStr.substring(11, 13);
      const second = dateStr.substring(13, 15);
      return new Date(year, month - 1, day, hour, minute, second);
    } else if (dateStr.includes('T') && dateStr.includes('Z')) {
      // ISO format with timezone
      return new Date(dateStr);
    }
    return new Date(dateStr);
  };

  const handleFilePick = async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'text/calendar',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const events = await parseICSFile(file.uri);
        setParsedEvents(events);
        setSelectedEvents(new Set(events.map((_, index) => index)));
        setShowFolderInput(true);
      }
    } catch (error) {
      Alert.alert(t('errorTitle'), 'Failed to import ICS file');
      console.error('File pick error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEventSelection = (index) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedEvents(newSelected);
  };

  const createCountdownFromEvent = (event, targetFolderId) => {
    const isRecurring = !!event.rrule;
    const dueDate = event.dtstart;
    
    // Determine priority based on event properties and ICS priority
    let priority = Priority.MEDIUM;
    
    // ICS priority: 1-4 = HIGH, 5 = MEDIUM, 6-9 = LOW
    if (event.priority) {
      if (event.priority <= 4) {
        priority = Priority.HIGH;
      } else if (event.priority >= 6) {
        priority = Priority.LOW;
      }
    } else {
      // Fallback to text-based priority detection
      if (event.summary.toLowerCase().includes('urgent') || 
          event.summary.toLowerCase().includes('important')) {
        priority = Priority.HIGH;
      } else if (event.summary.toLowerCase().includes('optional') ||
                 event.summary.toLowerCase().includes('reminder')) {
        priority = Priority.LOW;
      }
    }

    return {
      id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: event.summary || '未命名事件',
      description: event.description || event.location || '',
      folder: targetFolderId,
      dueDate: dueDate.toISOString(),
      type: isRecurring ? TaskType.RECURRING : TaskType.ONE_TIME,
      priority: priority,
      isCompleted: event.status === 'COMPLETED',
      rrule: event.rrule || null,
    };
  };

  const handleImport = () => {
    const eventsToImport = parsedEvents.filter((_, index) => selectedEvents.has(index));
    
    if (eventsToImport.length === 0) {
      Alert.alert(t('errorTitle'), '请选择要导入的事件');
      return;
    }

    if (!folderName.trim()) {
      Alert.alert(t('errorTitle'), '请输入文件夹名称');
      return;
    }

    try {
      // Find or create the target folder
      let targetFolderId;
      const existingFolder = folders.find(f => f.name === folderName.trim());
      
      if (existingFolder) {
        targetFolderId = existingFolder.id;
      } else {
        // Create a new folder with random unused color
        const newFolder = {
          id: `imported_${Date.now()}`,
          name: folderName.trim(),
          color: getRandomUnusedColor(),
        };
        addFolder(newFolder);
        targetFolderId = newFolder.id;
      }

      // Import all events into the same folder
      eventsToImport.forEach(event => {
        const countdown = createCountdownFromEvent(event, targetFolderId);
        addCountdown(countdown);
      });

      Alert.alert(
        '导入成功',
        `成功导入 ${eventsToImport.length} 个事件到文件夹 "${folderName.trim()}"`,
        [{ text: '确定', onPress: handleClose }]
      );
      
    } catch (error) {
      Alert.alert(t('errorTitle'), '导入过程中发生错误');
      console.error('Import error:', error);
    }
  };

  const handleClose = () => {
    setParsedEvents([]);
    setSelectedEvents(new Set());
    setFolderName('导入事件');
    setShowFolderInput(false);
    onClose();
  };

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
          <Text style={[styles.title, { color: theme.colors.text }]}>导入 ICS 文件</Text>
          <TouchableOpacity onPress={handleImport} disabled={selectedEvents.size === 0}>
            <Text style={[
              styles.importButton,
              { color: selectedEvents.size > 0 ? theme.colors.primary : theme.colors.border }
            ]}>
              导入 ({selectedEvents.size})
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {parsedEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.colors.border }]}>
                选择 ICS 文件开始导入
              </Text>
              <TouchableOpacity
                style={[styles.pickButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleFilePick}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.pickButtonText}>选择文件</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {showFolderInput && (
                <View style={styles.folderInputSection}>
                  <Text style={[styles.folderInputLabel, { color: theme.colors.text }]}>
                    文件夹名称
                  </Text>
                  <TextInput
                    style={[
                      styles.folderInput,
                      { 
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                        color: theme.colors.text,
                      }
                    ]}
                    value={folderName}
                    onChangeText={setFolderName}
                    placeholder="输入文件夹名称"
                    placeholderTextColor={theme.colors.border}
                  />
                </View>
              )}
            </>
          )}
          
          {parsedEvents.length > 0 && (
            <View style={styles.eventsList}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                发现 {parsedEvents.length} 个事件
              </Text>
              {parsedEvents.map((event, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.eventItem,
                    { 
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.border,
                      borderLeftColor: selectedEvents.has(index) ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => toggleEventSelection(index)}
                >
                  <View style={styles.eventContent}>
                    <Text style={[styles.eventTitle, { color: theme.colors.text }]}>
                      {event.summary || '未命名事件'}
                    </Text>
                    {event.description && (
                      <Text style={[styles.eventDescription, { color: theme.colors.border }]}>
                        {event.description}
                      </Text>
                    )}
                    <Text style={[styles.eventDate, { color: theme.colors.border }]}>
                      {event.dtstart.toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                    <View style={styles.eventLabels}>
                      {event.rrule && (
                        <Text style={[styles.recurringLabel, { color: theme.colors.primary }]}>
                          循环事件
                        </Text>
                      )}
                      {event.type === 'VTODO' && (
                        <Text style={[styles.todoLabel, { color: '#f59e0b' }]}>
                          待办事项
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={[
                    styles.checkbox,
                    { 
                      backgroundColor: selectedEvents.has(index) ? theme.colors.primary : 'transparent',
                      borderColor: theme.colors.border,
                    }
                  ]}>
                    {selectedEvents.has(index) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    color: '#007AFF',
  },
  importButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  pickButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  folderInputSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  folderInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  folderInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  eventsList: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  eventContent: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    marginBottom: 4,
  },
  eventLabels: {
    flexDirection: 'row',
    gap: 8,
  },
  recurringLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  todoLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
