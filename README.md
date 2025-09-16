# 倒计时管理器 (React Native)

一个功能强大的React Native倒计时管理应用，支持iOS和Android，采用高级黑白配色方案，支持文件夹分类管理功能。

**✨ 现已升级到 Expo SDK 54，与最新的 Expo Go 应用完全兼容！**

## 功能特点

- **跨平台支持**: 基于React Native和Expo，可轻松编译成iOS和Android应用。
- **文件夹分类**: 创建文件夹，为不同类别的倒计时分组。
- **颜色区分**: 为每个文件夹设置不同颜色，在主屏幕清晰区分。
- **整体视图**: 在主屏幕统一查看所有文件夹下的倒计时。
- **任务分类**: 自动区分一次性任务和循环任务。
- **数据持久化**: 使用AsyncStorage在设备本地保存数据。
- **深色模式**: 自动适应系统的深色/浅色模式。
- **新架构支持**: 启用React Native新架构，获得更好的性能。

## 技术栈

- **框架**: React Native (Expo SDK 54)
- **React Native版本**: 0.76.5 (支持新架构)
- **导航**: React Navigation
- **状态管理**: React Context + Hooks
- **本地存储**: `@react-native-async-storage/async-storage`
- **样式**: StyleSheet + 自定义主题

## 项目结构

```
countdown-app-rn/
├── src/
│   ├── components/       # React组件
│   │   ├── CountdownCard.js
│   │   └── FolderItem.js
│   ├── context/          # React Context
│   │   └── CountdownContext.js
│   ├── screens/          # 屏幕组件
│   │   ├── HomeScreen.js
│   │   └── FolderScreen.js
│   ├── styles/           # 样式和主题
│   │   └── theme.js
│   ├── types/            # 类型定义
│   │   └── index.js
│   └── utils/            # 工具函数
│       └── dateUtils.js
├── assets/               # 应用资源
├── App.js                # 应用主入口
├── app.json              # Expo配置
├── babel.config.js       # Babel配置
└── package.json          # 依赖和脚本
```

## 开发和运行

### 1. 环境准备

确保你已经安装了Node.js 18+和最新的Expo CLI。

```bash
npm install -g @expo/cli
```

### 2. 安装依赖

在项目根目录下运行：

```bash
npm install
# 或
yarn install
```

### 3. 启动应用

```bash
npm start
# 或
expo start
```

### 4. 在手机上运行

- **iOS**: 在App Store下载最新版本的Expo Go应用，扫描命令行输出的二维码。
- **Android**: 在Google Play下载最新版本的Expo Go应用，扫描命令行输出的二维码。

**重要**: 确保使用支持SDK 54的最新版本Expo Go应用。

你也可以在模拟器上运行应用：

- 按 `i` 在iOS模拟器上运行。
- 按 `a` 在Android模拟器上运行。

## 如何使用

- **查看所有倒计时**: 主屏幕会显示所有文件夹下的倒计时，并按一次性/循环任务分类。
- **按文件夹查看**: 点击主屏幕上方的文件夹卡片，可以进入该文件夹，只查看该分类下的倒计时。
- **创建/编辑倒计时**: (待实现) 未来可以添加创建、编辑、删除倒计时和文件夹的功能。

## 版本信息

- **当前版本**: 1.0.0
- **Expo SDK**: 54.0.0
- **React Native**: 0.76.5
- **新架构**: 已启用 (Fabric + TurboModules)
- **兼容性**: 与最新版本的 Expo Go 应用完全兼容

## SDK 54 新特性

- **React Native 0.76.5**: 最新版本，包含性能优化和稳定性改进
- **新架构支持**: 完全支持Fabric渲染器和TurboModules
- **Android 14支持**: 完全支持Android 14 (API 35)
- **iOS 17支持**: 完全支持最新的iOS版本
- **更好的开发体验**: 改进的Fast Refresh和错误报告

## 后续开发计划

- [ ] 添加创建、编辑、删除倒计时的功能。
- [ ] 添加创建、编辑、删除文件夹的功能。
- [ ] 实现更丰富的过滤和排序选项。
- [ ] 优化UI，增加动画效果。
- [ ] 增加推送通知功能。
- [ ] 添加数据导入导出功能。
- [ ] 利用新架构优化性能。

## 升级说明

如果您使用的是之前的版本，请查看 `UPGRADE_GUIDE.md` 了解从SDK 50升级到SDK 54的详细信息。

## 故障排除

如果遇到问题：

1. 确保使用最新版本的Expo Go应用
2. 清理缓存: `expo start --clear`
3. 重新安装依赖: `rm -rf node_modules && npm install`

