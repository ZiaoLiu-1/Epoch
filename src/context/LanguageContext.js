import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  zh: {
    // 主界面
    folders: '文件夹',
    allCountdowns: '所有倒计时',
    oneTimeTasks: '一次性任务',
    recurringTasks: '循环任务',
    
    // 倒计时状态
    overdue: '已逾期',
    completed: '已完成',
    oneTime: '一次性',
    recurring: '循环',
    
    // 优先级
    high: '高',
    medium: '中',
    low: '低',
    
    // 操作
    add: '添加',
    edit: '编辑',
    delete: '删除',
    complete: '完成',
    cancel: '取消',
    save: '保存',
    
    // 表单
    title: '标题',
    description: '描述',
    category: '分类',
    dueDate: '截止日期',
    dueTime: '截止时间',
    taskType: '任务类型',
    priority: '优先级',
    
    // 模态框
    addCountdown: '添加倒计时',
    editCountdown: '编辑倒计时',
    addFolder: '添加文件夹',
    folderName: '文件夹名称',
    selectColor: '选择颜色',
    
    // 分类
    uncategorized: '无分类',
    
    // 设置
    settings: '设置',
    language: '语言',
    theme: '主题',
    themeLight: '浅色',
    themeDark: '深色',
    themeSystem: '跟随系统',
    
    // 确认对话框
    confirmDelete: '确认删除',
    confirmDeleteMessage: '确定要删除吗？',
    confirmBatchDelete: '确定要删除选中的 {count} 个倒计时吗？',
    
    // 选择状态
    selected: '已选择',
    
    // 错误信息
    errorTitle: '错误',
    pleaseEnterTitle: '请输入倒计时标题',
    pleaseEnterFolderName: '请输入文件夹名称',
  },
  en: {
    // Main interface
    folders: 'Folders',
    allCountdowns: 'All Countdowns',
    oneTimeTasks: 'One-time Tasks',
    recurringTasks: 'Recurring Tasks',
    
    // Countdown status
    overdue: 'Overdue',
    completed: 'Completed',
    oneTime: 'One-time',
    recurring: 'Recurring',
    
    // Priority
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    
    // Actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    complete: 'Complete',
    cancel: 'Cancel',
    save: 'Save',
    
    // Form
    title: 'Title',
    description: 'Description',
    category: 'Category',
    dueDate: 'Due Date',
    dueTime: 'Due Time',
    taskType: 'Task Type',
    priority: 'Priority',
    
    // Modals
    addCountdown: 'Add Countdown',
    editCountdown: 'Edit Countdown',
    addFolder: 'Add Folder',
    folderName: 'Folder Name',
    selectColor: 'Select Color',
    
    // Categories
    uncategorized: 'Uncategorized',
    
    // Settings
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'Follow System',
    
    // Confirmation dialogs
    confirmDelete: 'Confirm Delete',
    confirmDeleteMessage: 'Are you sure you want to delete?',
    confirmBatchDelete: 'Are you sure you want to delete {count} selected countdowns?',
    
    // Selection status
    selected: 'Selected',
    
    // Error messages
    errorTitle: 'Error',
    pleaseEnterTitle: 'Please enter countdown title',
    pleaseEnterFolderName: 'Please enter folder name',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('zh');

  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Failed to load language preference:', error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  const t = (key, params = {}) => {
    let text = translations[language]?.[key] || translations.zh[key] || key;
    
    // 替换参数
    Object.keys(params).forEach(param => {
      text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        availableLanguages: [
          { code: 'zh', name: '中文' },
          { code: 'en', name: 'English' },
        ],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

