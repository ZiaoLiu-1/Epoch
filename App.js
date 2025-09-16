import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import FolderScreen from './src/screens/FolderScreen';
import { CountdownProvider } from './src/context/CountdownContext';
import { darkTheme, lightTheme } from './src/styles/theme';

const Stack = createStackNavigator();

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <CountdownProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.card,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
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
          </Stack.Navigator>
        </NavigationContainer>
      </CountdownProvider>
    </SafeAreaProvider>
  );
}

