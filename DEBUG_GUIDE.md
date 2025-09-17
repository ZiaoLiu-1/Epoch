# 🐛 调试指南 - 系统文件夹问题

## 问题诊断

### 1. 系统文件夹不显示的可能原因

#### **检查数据加载**
```javascript
// 在 HomeScreen.js 中添加调试日志
console.log('Folders:', folders);
console.log('System folders:', folders.filter(f => f.isSystem));
```

#### **检查Context初始化**
```javascript
// 在 CountdownContext.js 中添加调试
console.log('Loading folders:', loadedFolders);
console.log('System folders exist:', loadedFolders.filter(f => f.isSystem));
```

### 2. 清除缓存重新初始化

#### **方法1: 清除AsyncStorage**
```javascript
// 在应用中临时添加这个函数
const clearStorage = async () => {
  await AsyncStorage.clear();
  console.log('Storage cleared');
};
```

#### **方法2: 强制重新初始化**
```javascript
// 在 CountdownContext.js 中强制使用默认数据
setFolders(defaultFolders); // 临时强制设置
```

## 快速修复步骤

### 1. 检查系统文件夹是否存在
在 `HomeScreen.js` 的 `renderHeader` 函数中添加调试：

```javascript
console.log('All folders:', folders);
console.log('System folders:', folders.filter(f => f.isSystem));
```

### 2. 强制显示系统文件夹
临时修改 `HomeScreen.js`：

```javascript
// 临时硬编码系统文件夹用于测试
const systemFolders = [
  { id: 'completed', name: '已完成', isSystem: true },
  { id: 'incomplete', name: '未完成', isSystem: true },
  { id: 'overdue', name: '逾期', isSystem: true },
];

// 在渲染中使用
{systemFolders.map(folder => {
  // 渲染逻辑
})}
```

### 3. 检查样式问题
确保系统文件夹容器有正确的样式：

```javascript
systemFolders: {
  marginBottom: 20,
  paddingHorizontal: 16,
},
systemFoldersTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 12,
},
systemFoldersRow: {
  flexDirection: 'row',
  gap: 8,
},
```

## 通知警告解决方案

### Expo Go 限制
- Expo Go 不支持推送通知功能
- 需要使用 Development Build 或 EAS Build

### 临时禁用通知
在 `App.js` 中注释掉通知相关代码：

```javascript
// 临时注释掉通知初始化
// useEffect(() => {
//   initializeNotifications([]);
//   const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
//   return () => subscription.remove();
// }, []);
```

## 测试步骤

1. **重启应用** - 完全关闭并重新启动
2. **清除缓存** - 使用 `expo start --clear`
3. **检查日志** - 查看控制台输出
4. **手动验证** - 确认数据结构正确

## 预期结果

修复后应该看到：
- 系统文件夹区域显示三个文件夹
- 每个文件夹有图标、名称和计数
- 点击可以正常导航
- 颜色更加自然柔和

