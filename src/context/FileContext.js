import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

export const FileContext = createContext();

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 文件存储目录
  const documentsDir = FileSystem.documentDirectory + 'folder_files/';

  useEffect(() => {
    loadFiles();
    ensureDirectoryExists();
  }, []);

  // 确保存储目录存在
  const ensureDirectoryExists = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(documentsDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(documentsDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Error creating directory:', error);
    }
  };

  // 加载文件列表
  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const storedFiles = await AsyncStorage.getItem('folder_files');
      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles);
        // 验证文件是否仍然存在
        const validFiles = await validateFiles(parsedFiles);
        setFiles(validFiles);
      }
    } catch (error) {
      console.error('Error loading files:', error);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 验证文件是否存在
  const validateFiles = async (fileList) => {
    const validFiles = [];
    for (const file of fileList) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(file.localUri, { size: false });
        if (fileInfo.exists) {
          validFiles.push(file);
        }
      } catch (error) {
        console.log('File no longer exists:', file.name);
      }
    }
    return validFiles;
  };

  // 保存文件列表到AsyncStorage
  const saveFiles = async (updatedFiles) => {
    try {
      await AsyncStorage.setItem('folder_files', JSON.stringify(updatedFiles));
      setFiles(updatedFiles);
    } catch (error) {
      console.error('Error saving files:', error);
    }
  };

  // 添加文件到文件夹
  const addFileToFolder = async (folderId, fileData) => {
    try {
      const fileName = `${Date.now()}_${fileData.name}`;
      const localUri = documentsDir + fileName;
      
      // 复制文件到应用目录
      await FileSystem.copyAsync({
        from: fileData.uri,
        to: localUri,
      });

      // 获取文件信息
      const fileInfo = await FileSystem.getInfoAsync(localUri, { size: false });
      
      const newFile = {
        id: Date.now().toString(),
        name: fileData.name,
        originalName: fileData.name,
        mimeType: fileData.mimeType || 'application/octet-stream',
        size: fileInfo.size,
        folderId: folderId,
        localUri: localUri,
        uploadDate: new Date().toISOString(),
        type: getFileType(fileData.name),
      };

      const updatedFiles = [...files, newFile];
      await saveFiles(updatedFiles);
      return newFile;
    } catch (error) {
      console.error('Error adding file:', error);
      throw error;
    }
  };

  // 获取文件类型
  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'document';
    if (['ppt', 'pptx'].includes(extension)) return 'presentation';
    if (['xls', 'xlsx'].includes(extension)) return 'spreadsheet';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv'].includes(extension)) return 'video';
    if (['mp3', 'wav', 'aac', 'm4a'].includes(extension)) return 'audio';
    if (['txt', 'md'].includes(extension)) return 'text';
    if (['zip', 'rar', '7z'].includes(extension)) return 'archive';
    
    return 'other';
  };

  // 获取文件夹的文件列表
  const getFolderFiles = (folderId) => {
    return files.filter(file => file.folderId === folderId);
  };

  // 删除文件
  const deleteFile = async (fileId) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (file) {
        // 删除本地文件
        const fileInfo = await FileSystem.getInfoAsync(file.localUri, { size: false });
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(file.localUri);
        }
        
        // 更新文件列表
        const updatedFiles = files.filter(f => f.id !== fileId);
        await saveFiles(updatedFiles);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  // 重命名文件
  const renameFile = async (fileId, newName) => {
    try {
      const updatedFiles = files.map(file => {
        if (file.id === fileId) {
          return { ...file, name: newName };
        }
        return file;
      });
      await saveFiles(updatedFiles);
    } catch (error) {
      console.error('Error renaming file:', error);
      throw error;
    }
  };

  // 获取文件大小格式化字符串
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // 获取文件图标
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'document': return '📝';
      case 'presentation': return '📊';
      case 'spreadsheet': return '📈';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'text': return '📄';
      case 'archive': return '🗜️';
      default: return '📎';
    }
  };

  // 清理文件夹下的所有文件（当文件夹被删除时调用）
  const clearFolderFiles = async (folderId) => {
    try {
      const folderFiles = files.filter(f => f.folderId === folderId);
      
      // 删除所有本地文件
      for (const file of folderFiles) {
        try {
          const fileInfo = await FileSystem.getInfoAsync(file.localUri, { size: false });
          if (fileInfo.exists) {
            await FileSystem.deleteAsync(file.localUri);
          }
        } catch (error) {
          console.log('Error deleting file:', file.name, error);
        }
      }
      
      // 更新文件列表
      const updatedFiles = files.filter(f => f.folderId !== folderId);
      await saveFiles(updatedFiles);
    } catch (error) {
      console.error('Error clearing folder files:', error);
    }
  };

  const value = {
    files,
    isLoading,
    addFileToFolder,
    getFolderFiles,
    deleteFile,
    renameFile,
    formatFileSize,
    getFileIcon,
    clearFolderFiles,
    loadFiles,
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};
