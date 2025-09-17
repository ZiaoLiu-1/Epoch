import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from './src/screens/HomeScreen';
import FolderScreen from './src/screens/FolderScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { CountdownProvider } from './src/context/CountdownContext';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';

const Stack = createStackNavigator();

function AppNavigator() {
  const { theme } = useThemeContext();
  const { t } = useLanguage();

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
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '倒计时管理器' }}
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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <LanguageProvider>
            <CountdownProvider>
              <AppNavigator />
            </CountdownProvider>
          </LanguageProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

