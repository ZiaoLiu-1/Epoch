import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useFiles } from '../context/FileContext';

export default function FileUploadModal({ visible, onClose, folderId, folderName }) {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const { addFileToFolder } = useFiles();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFiles(result.assets);
      }
    } catch (error) {
      Alert.alert('错误', '文件选择失败');
      console.error('File pick error:', error);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      Alert.alert('提示', '请先选择要上传的文件');
      return;
    }

    try {
      setIsUploading(true);
      const uploadPromises = selectedFiles.map(file => 
        addFileToFolder(folderId, file)
      );
      
      await Promise.all(uploadPromises);
      
      Alert.alert(
        '上传成功',
        `成功上传 ${selectedFiles.length} 个文件到 "${folderName}" 文件夹`,
        [{ text: '确定', onPress: handleClose }]
      );
      
    } catch (error) {
      Alert.alert('错误', '文件上传失败');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFiles([]);
    onClose();
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) return '📄';
    if (['doc', 'docx'].includes(extension)) return '📝';
    if (['ppt', 'pptx'].includes(extension)) return '📊';
    if (['xls', 'xlsx'].includes(extension)) return '📈';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return '🖼️';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return '🎥';
    if (['mp3', 'wav', 'aac', 'm4a'].includes(extension)) return '🎵';
    if (['txt', 'md'].includes(extension)) return '📄';
    if (['zip', 'rar', '7z'].includes(extension)) return '🗜️';
    
    return '📎';
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
          <TouchableOpacity onPress={handleClose}>
            <Text style={[styles.cancelButton, { color: theme.colors.primary }]}>取消</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            上传文件到 {folderName}
          </Text>
          <TouchableOpacity 
            onPress={handleUpload}
            disabled={selectedFiles.length === 0 || isUploading}
          >
            <Text style={[
              styles.uploadButton, 
              { 
                color: selectedFiles.length > 0 && !isUploading ? theme.colors.primary : theme.colors.border 
              }
            ]}>
              {isUploading ? '上传中...' : '上传'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Upload Area */}
          <TouchableOpacity 
            style={[styles.uploadArea, { 
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            }]}
            onPress={handleFilePick}
            disabled={isUploading}
          >
            <Text style={[styles.uploadIcon, { color: theme.colors.primary }]}>📁</Text>
            <Text style={[styles.uploadText, { color: theme.colors.text }]}>
              点击选择文件
            </Text>
            <Text style={[styles.uploadSubtext, { color: theme.colors.border }]}>
              支持所有格式的文件
            </Text>
          </TouchableOpacity>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <View style={styles.selectedFiles}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                已选择文件 ({selectedFiles.length})
              </Text>
              
              {selectedFiles.map((file, index) => (
                <View 
                  key={index}
                  style={[styles.fileItem, { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                  }]}
                >
                  <View style={styles.fileInfo}>
                    <Text style={styles.fileIcon}>{getFileIcon(file.name)}</Text>
                    <View style={styles.fileDetails}>
                      <Text 
                        style={[styles.fileName, { color: theme.colors.text }]}
                        numberOfLines={1}
                      >
                        {file.name}
                      </Text>
                      <Text style={[styles.fileSize, { color: theme.colors.border }]}>
                        {formatFileSize(file.size)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    onPress={() => removeSelectedFile(index)}
                    style={styles.removeButton}
                    disabled={isUploading}
                  >
                    <Text style={[styles.removeButtonText, { color: '#e11d48' }]}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <View style={styles.uploadProgress}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.uploadingText, { color: theme.colors.text }]}>
                正在上传文件...
              </Text>
            </View>
          )}

          {/* Tips */}
          <View style={styles.tips}>
            <Text style={[styles.tipsTitle, { color: theme.colors.text }]}>💡 使用提示</Text>
            <Text style={[styles.tipsText, { color: theme.colors.border }]}>
              • 支持同时选择多个文件{'\n'}
              • 文件将保存在应用内部，确保安全性{'\n'}
              • 支持PDF、Word、PPT、图片、音频、视频等格式{'\n'}
              • 建议单个文件大小不超过100MB
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
  cancelButton: {
    fontSize: 16,
  },
  uploadButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  uploadSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedFiles: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadProgress: {
    alignItems: 'center',
    padding: 20,
  },
  uploadingText: {
    fontSize: 16,
    marginTop: 12,
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
