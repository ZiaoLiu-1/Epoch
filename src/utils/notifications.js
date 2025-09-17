import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 配置通知处理
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 请求通知权限
export const requestNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

// 获取即将到期的任务（本周内）
const getUpcomingTasks = (countdowns) => {
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return countdowns.filter(countdown => {
    if (countdown.isCompleted || !countdown.dueDate) return false;
    
    const dueDate = new Date(countdown.dueDate);
    return dueDate >= now && dueDate <= oneWeekFromNow;
  }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

// 格式化任务列表为通知文本
const formatTasksForNotification = (tasks) => {
  if (tasks.length === 0) return null;
  
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  
  const todayTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === today.toDateString();
  });
  
  const tomorrowTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === tomorrow.toDateString();
  });
  
  const thisWeekTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate > tomorrow && dueDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  });
  
  let message = '';
  
  if (todayTasks.length > 0) {
    message += `今天到期 (${todayTasks.length}个): ${todayTasks.map(t => t.title).join(', ')}\n`;
  }
  
  if (tomorrowTasks.length > 0) {
    message += `明天到期 (${tomorrowTasks.length}个): ${tomorrowTasks.map(t => t.title).join(', ')}\n`;
  }
  
  if (thisWeekTasks.length > 0) {
    message += `本周到期 (${thisWeekTasks.length}个): ${thisWeekTasks.map(t => t.title).join(', ')}`;
  }
  
  return message.trim();
};

// 发送每日提醒通知
export const sendDailyReminder = async (countdowns) => {
  const upcomingTasks = getUpcomingTasks(countdowns);
  const notificationText = formatTasksForNotification(upcomingTasks);
  
  if (!notificationText) {
    // 如果没有即将到期的任务，发送一个简单的提醒
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '倒计时管理器',
        body: '今天没有即将到期的任务，继续保持！',
        data: { type: 'daily_reminder' },
      },
      trigger: null, // 立即发送
    });
    return;
  }
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `即将到期提醒 (${upcomingTasks.length}个任务)`,
      body: notificationText,
      data: { 
        type: 'daily_reminder',
        taskCount: upcomingTasks.length 
      },
    },
    trigger: null, // 立即发送
  });
};

// 设置每日定时通知（每天早上8点）
export const scheduleDailyNotifications = async (countdowns) => {
  // 取消之前的定时通知
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  // 设置每天早上8点的通知
  const trigger = {
    hour: 8,
    minute: 0,
    repeats: true,
  };
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '倒计时管理器',
      body: '查看今天的任务安排',
      data: { type: 'daily_scheduled' },
    },
    trigger,
  });
};

// 初始化通知系统
export const initializeNotifications = async (countdowns) => {
  const hasPermission = await requestNotificationPermissions();
  
  if (hasPermission) {
    await scheduleDailyNotifications(countdowns);
    return true;
  }
  
  return false;
};

// 处理通知点击事件
export const handleNotificationResponse = (response) => {
  const data = response.notification.request.content.data;
  
  if (data.type === 'daily_reminder' || data.type === 'daily_scheduled') {
    // 可以在这里导航到特定页面或执行特定操作
    console.log('Daily reminder notification clicked');
  }
};

