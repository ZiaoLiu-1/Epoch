import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Settings({ onBack }) {
  const { theme, themeMode, changeTheme } = useThemeContext();
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>设置</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>主题</Text>
          
          <TouchableOpacity
            style={[styles.option, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => changeTheme('light')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="sunny-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>浅色模式</Text>
            </View>
            {themeMode === 'light' && (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => changeTheme('dark')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="moon-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>深色模式</Text>
            </View>
            {themeMode === 'dark' && (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => changeTheme('system')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="phone-portrait-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>跟随系统</Text>
            </View>
            {themeMode === 'system' && (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>语言</Text>
          
          <TouchableOpacity
            style={[styles.option, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => changeLanguage('zh')}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.flagEmoji}>🇨🇳</Text>
              <Text style={[styles.optionText, { color: theme.colors.text }]}>简体中文</Text>
            </View>
            {currentLanguage === 'zh' && (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => changeLanguage('en')}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.flagEmoji}>🇺🇸</Text>
              <Text style={[styles.optionText, { color: theme.colors.text }]}>English</Text>
            </View>
            {currentLanguage === 'en' && (
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>关于</Text>
          
          <View style={[styles.option, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.optionText, { color: theme.colors.text }]}>版本</Text>
            </View>
            <Text style={[styles.optionValue, { color: theme.colors.mutedForeground }]}>1.0.0</Text>
          </View>
        </View>
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
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
  },
  optionValue: {
    fontSize: 14,
  },
  flagEmoji: {
    fontSize: 20,
  },
});
