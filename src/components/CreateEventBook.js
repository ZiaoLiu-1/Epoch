import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StyleSheet,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useThemeContext } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive sizing functions
const scale = (size) => (screenWidth / 375) * size;
const verticalScale = (size) => (screenHeight / 812) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

const ICONS = [
  { id: 'graduation-cap', component: FontAwesome5, name: 'graduation-cap' },
  { id: 'home', component: Ionicons, name: 'home' },
  { id: 'briefcase', component: Ionicons, name: 'briefcase' },
  { id: 'dumbbell', component: MaterialCommunityIcons, name: 'dumbbell' },
  { id: 'heart', component: Ionicons, name: 'heart' },
  { id: 'book', component: Ionicons, name: 'book' },
  { id: 'airplane', component: Ionicons, name: 'airplane' },
  { id: 'camera', component: Ionicons, name: 'camera' },
  { id: 'game-controller', component: Ionicons, name: 'game-controller' },
  { id: 'musical-notes', component: Ionicons, name: 'musical-notes' },
  { id: 'restaurant', component: Ionicons, name: 'restaurant' },
  { id: 'cart', component: Ionicons, name: 'cart' },
];

const COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EF4444', // Red
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#A855F7', // Violet
];

export default function CreateEventBook({ onBack, onSave }) {
  const { theme } = useThemeContext();
  const { t, currentLanguage } = useLanguage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('graduation-cap');
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        description: description.trim(),
        icon: selectedIcon,
        color: selectedColor,
      });
    }
  };

  const renderIcon = (iconData, size = moderateScale(24), color = theme.colors.text) => {
    const IconComponent = iconData.component;
    return <IconComponent name={iconData.name} size={size} color={color} />;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={theme.dark 
          ? ['#1a1a1a', '#2a2a2a', '#1a1a1a']
          : ['#f0f9ff', '#e0f2fe', '#f0f9ff']
        }
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={moderateScale(24)} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            {currentLanguage === 'zh' ? '创建事件簿' : 'Create Event Book'}
          </Text>

          <TouchableOpacity 
            onPress={handleSave}
            style={[styles.saveButton, { opacity: name.trim() ? 1 : 0.5 }]}
            disabled={!name.trim()}
          >
            <Text style={[styles.saveButtonText, { color: theme.colors.primary }]}>
              {currentLanguage === 'zh' ? '保存' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Preview Card */}
          <View style={[styles.previewCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={[styles.previewIcon, { backgroundColor: selectedColor + '20' }]}>
              {renderIcon(ICONS.find(i => i.id === selectedIcon), moderateScale(32), selectedColor)}
            </View>
            <View style={styles.previewContent}>
              <Text style={[styles.previewName, { color: theme.colors.text }]}>
                {name || (currentLanguage === 'zh' ? '事件簿名称' : 'Event Book Name')}
              </Text>
              <Text style={[styles.previewDescription, { color: theme.colors.text + '80' }]}>
                {description || (currentLanguage === 'zh' ? '添加描述...' : 'Add description...')}
              </Text>
            </View>
          </View>

          {/* Name Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '名称' : 'Name'}
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.colors.card, 
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]}
              value={name}
              onChangeText={setName}
              placeholder={currentLanguage === 'zh' ? '输入事件簿名称' : 'Enter event book name'}
              placeholderTextColor={theme.colors.text + '60'}
              maxLength={30}
            />
            <Text style={[styles.charCount, { color: theme.colors.text + '60' }]}>
              {name.length}/30
            </Text>
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '描述' : 'Description'}
            </Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: theme.colors.card, 
                borderColor: theme.colors.border,
                color: theme.colors.text
              }]}
              value={description}
              onChangeText={setDescription}
              placeholder={currentLanguage === 'zh' ? '添加描述（可选）' : 'Add description (optional)'}
              placeholderTextColor={theme.colors.text + '60'}
              multiline
              numberOfLines={3}
              maxLength={100}
            />
            <Text style={[styles.charCount, { color: theme.colors.text + '60' }]}>
              {description.length}/100
            </Text>
          </View>

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '图标' : 'Icon'}
            </Text>
            <View style={styles.iconGrid}>
              {ICONS.map((icon) => (
                <TouchableOpacity
                  key={icon.id}
                  style={[
                    styles.iconOption,
                    { 
                      backgroundColor: theme.colors.card,
                      borderColor: selectedIcon === icon.id ? selectedColor : theme.colors.border,
                      borderWidth: selectedIcon === icon.id ? 2 : 1,
                    }
                  ]}
                  onPress={() => setSelectedIcon(icon.id)}
                >
                  {renderIcon(icon, moderateScale(24), selectedIcon === icon.id ? selectedColor : theme.colors.text)}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {currentLanguage === 'zh' ? '颜色' : 'Color'}
            </Text>
            <View style={styles.colorGrid}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color }
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons name="checkmark" size={moderateScale(20)} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
  },
  backButton: {
    padding: moderateScale(8),
  },
  headerTitle: {
    flex: 1,
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: moderateScale(16),
  },
  saveButton: {
    padding: moderateScale(8),
  },
  saveButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: verticalScale(40),
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(24),
  },
  previewIcon: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: moderateScale(16),
  },
  previewContent: {
    flex: 1,
  },
  previewName: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  previewDescription: {
    fontSize: moderateScale(14),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
  },
  textArea: {
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: moderateScale(12),
    textAlign: 'right',
    marginTop: verticalScale(4),
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(12),
  },
  iconOption: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(12),
  },
  colorOption: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
