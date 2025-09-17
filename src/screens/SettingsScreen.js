import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsScreen({ navigation }) {
  const { theme, themeMode, changeTheme } = useThemeContext();
  const { language, changeLanguage, t, availableLanguages } = useLanguage();

  const themeOptions = [
    { key: 'light', label: t('themeLight') },
    { key: 'dark', label: t('themeDark') },
    { key: 'system', label: t('themeSystem') },
  ];

  const handleThemeChange = (newTheme) => {
    changeTheme(newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage);
  };

  const renderOption = (title, options, currentValue, onSelect) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {title}
      </Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.key || option.code}
          style={[
            styles.optionItem,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
            (currentValue === (option.key || option.code)) && { borderColor: theme.colors.primary, borderWidth: 2 }
          ]}
          onPress={() => onSelect(option.key || option.code)}
        >
          <Text style={[
            styles.optionText,
            { color: theme.colors.text },
            (currentValue === (option.key || option.code)) && { color: theme.colors.primary, fontWeight: 'bold' }
          ]}>
            {option.label || option.name}
          </Text>
          {(currentValue === (option.key || option.code)) && (
            <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: theme.colors.primary }]}>← 返回</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>{t('settings')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderOption(t('language'), availableLanguages, language, handleLanguageChange)}
        {renderOption(t('theme'), themeOptions, themeMode, handleThemeChange)}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            关于
          </Text>
          <View style={[styles.infoCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.appName, { color: theme.colors.text }]}>
              倒计时管理器
            </Text>
            <Text style={[styles.version, { color: theme.colors.border }]}>
              版本 1.0.0
            </Text>
            <Text style={[styles.description, { color: theme.colors.border }]}>
              一个简洁优雅的倒计时管理应用，支持文件夹分类、优先级设置和批量操作。
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 50,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});

