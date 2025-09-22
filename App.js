import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import NewHomeScreen from './src/screens/NewHomeScreen';
import SimpleHomeScreen from './src/screens/SimpleHomeScreen';
import TestHomeScreen from './src/screens/TestHomeScreen';
import FolderScreen from './src/screens/FolderScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// New Components
import EventBooksList from './src/components/EventBooksList';
import EventBookDetail from './src/components/EventBookDetail';
import CreateEventBook from './src/components/CreateEventBook';
import AllTasksView from './src/components/AllTasksView';
import TaskDetail from './src/components/TaskDetail';
import ImportICSModal from './src/components/ImportICSModal';
import FileUploadModal from './src/components/FileUploadModal';
import CategoryView from './src/components/CategoryView';

// Contexts
import { CountdownProvider } from './src/context/CountdownContext';
import { FileProvider } from './src/context/FileContext';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { initializeNotifications, handleNotificationResponse } from './src/utils/notifications';

const Stack = createStackNavigator();

function AppNavigator() {
  const { theme } = useThemeContext();
  const { t } = useLanguage();
  const [eventBooks, setEventBooks] = useState([]);

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* Main Home Screen - matching web app design */}
        <Stack.Screen 
          name="Home" 
          component={TestHomeScreen}
          options={{ headerShown: false }}
        />
        
        {/* Event Books Flow (alternative navigation) */}
        <Stack.Screen 
          name="EventBooks" 
          options={{ headerShown: false }}
        >
          {(props) => (
            <EventBooksList 
              {...props}
              onSelectBook={(book) => props.navigation.navigate('EventBookDetail', { eventBook: book })}
              onCreateBook={() => props.navigation.navigate('CreateEventBook')}
              onSettingsClick={() => props.navigation.navigate('Settings')}
              onViewAllTasks={() => props.navigation.navigate('AllTasks')}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen 
          name="EventBookDetail"
          options={{ headerShown: false }}
        >
          {(props) => (
            <EventBookDetail
              {...props}
              eventBook={props.route.params?.eventBook}
              onBack={() => props.navigation.goBack()}
              onTaskClick={(task) => props.navigation.navigate('TaskDetail', { task, eventBook: props.route.params?.eventBook })}
              onAddTask={() => props.navigation.navigate('TaskDetail', { eventBook: props.route.params?.eventBook, isNew: true })}
              onImportICS={() => props.navigation.navigate('ImportICS', { eventBook: props.route.params?.eventBook })}
              onSettingsClick={() => props.navigation.navigate('Settings')}
              onFileStorage={() => props.navigation.navigate('FileStorage', { eventBook: props.route.params?.eventBook })}
              onCategoryManagement={() => props.navigation.navigate('CategoryManagement', { eventBook: props.route.params?.eventBook })}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen 
          name="CreateEventBook"
          options={{ headerShown: false }}
        >
          {(props) => (
            <CreateEventBook
              {...props}
              onBack={() => props.navigation.goBack()}
              onSave={(eventBookData) => {
                // Handle save logic here
                console.log('Saving event book:', eventBookData);
                props.navigation.goBack();
              }}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen 
          name="AllTasks"
          options={{ headerShown: false }}
        >
          {(props) => (
            <AllTasksView
              {...props}
              onBack={() => props.navigation.goBack()}
              onTaskClick={(task) => props.navigation.navigate('TaskDetail', { task })}
              onAddTask={() => props.navigation.navigate('TaskDetail', { isNew: true })}
              onImportICS={() => props.navigation.navigate('ImportICS')}
              onSettingsClick={() => props.navigation.navigate('Settings')}
              onEventBookClick={(eventBookId) => {
                // Find and navigate to event book
                console.log('Navigate to event book:', eventBookId);
              }}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen 
          name="TaskDetail"
          options={{ headerShown: false }}
        >
          {(props) => (
            <TaskDetail
              {...props}
              task={props.route.params?.task}
              isNew={props.route.params?.isNew}
              eventBook={props.route.params?.eventBook}
              onBack={() => props.navigation.goBack()}
              onSave={(taskData) => {
                // Handle save logic
                console.log('Saving task:', taskData);
                props.navigation.goBack();
              }}
              onDelete={(taskId) => {
                // Handle delete logic
                console.log('Deleting task:', taskId);
                props.navigation.goBack();
              }}
              onComplete={(taskId) => {
                // Handle complete logic
                console.log('Completing task:', taskId);
                props.navigation.goBack();
              }}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen 
          name="ImportICS"
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }}
        >
          {(props) => (
            <ImportICSModal
              {...props}
              eventBook={props.route.params?.eventBook}
              onBack={() => props.navigation.goBack()}
              onImport={(importedTasks) => {
                console.log('Importing tasks:', importedTasks);
                props.navigation.goBack();
              }}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen 
          name="FileStorage"
          options={{ 
            headerShown: false,
            presentation: 'modal'
          }}
        >
          {(props) => (
            <FileUploadModal
              {...props}
              eventBook={props.route.params?.eventBook}
              onBack={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>
        
        <Stack.Screen 
          name="CategoryManagement"
          options={{ headerShown: false }}
        >
          {(props) => (
            <CategoryView
              {...props}
              eventBook={props.route.params?.eventBook}
            />
          )}
        </Stack.Screen>

        {/* Legacy Screens */}
        <Stack.Screen 
          name="OldHome" 
          component={HomeScreen} 
          options={{ title: '倒计时管理器 (旧版)' }}
        />
        <Stack.Screen 
          name="Folder"
          component={FolderScreen} 
          options={({ route }) => ({ title: route.params.folderName })}
        />
        <Stack.Screen 
          name="Settings"
          component={SettingsScreen} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    // 初始化通知系统
    initializeNotifications([]);
    
    // 设置通知响应监听器
    const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    
    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CountdownProvider>
              <FileProvider>
                <AppNavigator />
              </FileProvider>
            </CountdownProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

