import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskType, Priority } from '../types';

export const CountdownContext = createContext();

const defaultFolders = [
  { id: 'csc367', name: 'CSC367', color: 'emerald' },
  { id: 'csc387', name: 'CSC387', color: 'blue' },
  { id: 'personal', name: '个人事务', color: 'gray' },
];

const defaultCountdowns = [
  {
    id: '1',
    title: 'Assignment 1 Due',
    description: 'Complete the first programming assignment for CSC367',
    folder: 'csc367',
    dueDate: '2024-12-20T23:59:00',
    type: TaskType.ONE_TIME,
    priority: Priority.HIGH,
    isCompleted: false,
  },
  {
    id: '2',
    title: 'Midterm Exam',
    description: 'Study for the midterm examination',
    folder: 'csc367',
    dueDate: '2024-12-25T14:00:00',
    type: TaskType.ONE_TIME,
    priority: Priority.HIGH,
    isCompleted: false,
  },
  {
    id: '3',
    title: 'Project Presentation',
    folder: 'csc387',
    dueDate: '2024-12-22T10:00:00',
    type: TaskType.ONE_TIME,
    priority: Priority.MEDIUM,
    isCompleted: false,
  },
  {
    id: '4',
    title: 'Weekly Meeting',
    description: 'Team standup meeting every Monday',
    folder: 'personal',
    dueDate: '2024-12-23T09:00:00',
    type: TaskType.RECURRING,
    priority: Priority.LOW,
    isCompleted: false,
  },
];

export const CountdownProvider = ({ children }) => {
  const [folders, setFolders] = useState([]);
  const [countdowns, setCountdowns] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFolders = await AsyncStorage.getItem('folders');
        const storedCountdowns = await AsyncStorage.getItem('countdowns');

        if (storedFolders) {
          setFolders(JSON.parse(storedFolders));
        } else {
          setFolders(defaultFolders);
        }

        if (storedCountdowns) {
          setCountdowns(JSON.parse(storedCountdowns));
        } else {
          setCountdowns(defaultCountdowns);
        }
      } catch (e) {
        console.error('Failed to load data from storage', e);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('folders', JSON.stringify(folders));
        await AsyncStorage.setItem('countdowns', JSON.stringify(countdowns));
      } catch (e) {
        console.error('Failed to save data to storage', e);
      }
    };

    saveData();
  }, [folders, countdowns]);

  return (
    <CountdownContext.Provider value={{ folders, setFolders, countdowns, setCountdowns }}>
      {children}
    </CountdownContext.Provider>
  );
};

