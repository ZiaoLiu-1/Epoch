import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Share,
  Linking,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useFiles } from '../context/FileContext';

export default function FileListModal({ visible, onClose, folderId, folderName }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { getFolderFiles, deleteFile, renameFile, formatFileSize, getFileIcon } = useFiles();
  const [editingFileId, setEditingFileId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const folderFiles = getFolderFiles(folderId);

  const handleDeleteFile = (file) => {
    Alert.alert(
      '删除文件',
      `确定要删除文件 "${file.name}" 吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFile(file.id);
              Alert.alert('成功', '文件已删除');
            } catch (error) {
              Alert.alert('错误', '删除文件失败');
            }
          },
        },
      ]
    );
  };

  const handleRenameFile = (file) => {
    setEditingFileId(file.id);
    setEditingName(file.name);
  };

  const saveRename = async () => {
    if (!editingName.trim()) {
      Alert.alert('错误', '文件名不能为空');
      return;
    }

    try {
      await renameFile(editingFileId, editingName.trim());
      setEditingFileId(null);
      setEditingName('');
      Alert.alert('成功', '文件重命名成功');
    } catch (error) {
      Alert.alert('错误', '重命名失败');
    }
  };

  const cancelRename = () => {
    setEditingFileId(null);
    setEditingName('');
  };

  const handleShareFile = async (file) => {
    try {
      await Share.share({
        url: file.localUri,
        title: file.name,
      });
    } catch (error) {
      Alert.alert('错误', '分享失败');
    }
  };

  const handleOpenFile = async (file) => {
    try {
      // 尝试用系统默认应用打开文件
      const canOpen = await Linking.canOpenURL(file.localUri);
      if (canOpen) {
        await Linking.openURL(file.localUri);
      } else {
        Alert.alert('提示', '无法打开此类型的文件');
      }
    } catch (error) {
      Alert.alert('错误', '打开文件失败');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onClose}>
            <Text style={[styles.closeButton, { color: theme.colors.primary }]}>关闭</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {folderName} 的文件
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          {folderFiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyIcon, { color: theme.colors.border }]}>📁</Text>
              <Text style={[styles.emptyText, { color: theme.colors.border }]}>
                此文件夹暂无文件
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.border }]}>
                点击文件夹中的上传按钮添加文件
              </Text>
            </View>
          ) : (
            <View style={styles.filesList}>
              <Text style={[styles.filesCount, { color: theme.colors.text }]}>
                共 {folderFiles.length} 个文件
              </Text>
              
              {folderFiles.map((file) => (
                <View 
                  key={file.id}
                  style={[styles.fileItem, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }]}
                >
                  <TouchableOpacity 
                    style={styles.fileContent}
                    onPress={() => handleOpenFile(file)}
                  >
                    <View style={styles.fileInfo}>
                      <Text style={styles.fileIcon}>{getFileIcon(file.type)}</Text>
                      <View style={styles.fileDetails}>
                        {editingFileId === file.id ? (
                          <TextInput
                            style={[styles.editInput, { 
                              color: theme.colors.text,
                              borderColor: theme.colors.border,
                            }]}
                            value={editingName}
                            onChangeText={setEditingName}
                            onSubmitEditing={saveRename}
                            autoFocus
                          />
                        ) : (
                          <Text 
                            style={[styles.fileName, { color: theme.colors.text }]}
                            numberOfLines={2}
                          >
                            {file.name}
                          </Text>
                        )}
                        <Text style={[styles.fileMetadata, { color: theme.colors.border }]}>
                          {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.fileActions}>
                    {editingFileId === file.id ? (
                      <>
                        <TouchableOpacity 
                          onPress={saveRename}
                          style={[styles.actionButton, styles.saveButton]}
                        >
                          <Text style={styles.saveButtonText}>✓</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={cancelRename}
                          style={[styles.actionButton, styles.cancelButton]}
                        >
                          <Text style={styles.cancelButtonText}>✕</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity 
                          onPress={() => handleShareFile(file)}
                          style={styles.actionButton}
                        >
                          <Text style={[styles.actionIcon, { color: theme.colors.primary }]}>↗️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleRenameFile(file)}
                          style={styles.actionButton}
                        >
                          <Text style={[styles.actionIcon, { color: theme.colors.primary }]}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleDeleteFile(file)}
                          style={styles.actionButton}
                        >
                          <Text style={[styles.actionIcon, { color: '#e11d48' }]}>🗑️</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Usage Tips */}
          <View style={styles.tips}>
            <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>💡 使用提示</Text>
            <Text style={[styles.tipsText, { color: theme.colors.border }]}>
              • 点击文件名可尝试打开文件{'\n'}
              • 点击分享按钮可将文件分享给其他应用{'\n'}
              • 点击编辑按钮可重命名文件{'\n'}
              • 点击删除按钮可删除文件
            </Text>
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
  closeButton: {
    fontSize: 16,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  filesList: {
    flex: 1,
  },
  filesCount: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  fileContent: {
    flex: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  fileMetadata: {
    fontSize: 12,
  },
  editInput: {
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  fileActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  actionIcon: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#16a34a',
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#e11d48',
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tips: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
