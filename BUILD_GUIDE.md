# 📱 倒计时管理器 - 真机测试部署指南

## 🚀 方法一：EAS Build（推荐）

### 前置要求
- 注册 [Expo 账户](https://expo.dev/)
- 安装 Node.js 18+

### 步骤 1：安装 EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 步骤 2：登录 Expo
```bash
eas login
```

### 步骤 3：初始化项目
```bash
cd Epoch
eas build:configure
```

### 步骤 4：构建应用

#### Android APK（推荐新手）
```bash
eas build --platform android --profile preview
```

#### Android AAB（Google Play）
```bash
eas build --platform android --profile production
```

#### iOS（需要 Apple Developer 账户）
```bash
eas build --platform ios --profile preview
```

### 步骤 5：下载安装
1. 构建完成后，EAS 会提供下载链接
2. **Android**: 下载 APK 文件，直接安装到手机
3. **iOS**: 通过 TestFlight 或企业证书安装

---

## 📱 方法二：本地构建（高级用户）

### Android 本地构建

#### 前置要求
- Android Studio
- Java JDK 17
- Android SDK

#### 步骤
```bash
# 1. 预构建
npx expo prebuild --platform android

# 2. 构建 APK
cd android
./gradlew assembleRelease

# 3. APK 位置
# android/app/build/outputs/apk/release/app-release.apk
```

### iOS 本地构建

#### 前置要求
- macOS
- Xcode 15+
- Apple Developer 账户

#### 步骤
```bash
# 1. 预构建
npx expo prebuild --platform ios

# 2. 在 Xcode 中打开项目
open ios/CountdownApp.xcworkspace

# 3. 在 Xcode 中构建和安装
```

---

## 🔧 配置说明

### 应用标识符
- **Android**: `com.yourcompany.countdownapp`
- **iOS**: `com.yourcompany.countdownapp`

### 权限说明
- **通知权限**: 用于每日提醒功能
- **唤醒权限**: 确保通知正常工作
- **振动权限**: 通知振动反馈

---

## 📋 发布检查清单

### 构建前检查
- [ ] 更新 `app.json` 中的应用名称和版本
- [ ] 确认包名/Bundle ID 唯一性
- [ ] 测试所有功能正常工作
- [ ] 检查通知权限配置

### Android 发布
- [ ] 生成签名密钥
- [ ] 配置 Google Play Console
- [ ] 上传 AAB 文件

### iOS 发布
- [ ] 配置 Apple Developer 账户
- [ ] 创建 App Store Connect 记录
- [ ] 通过 TestFlight 测试

---

## 🛠 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清理缓存
npx expo install --fix
npm install

# 重新构建
eas build --platform android --clear-cache
```

#### 2. 通知不工作
- 检查设备通知权限
- 确认 `expo-notifications` 插件配置
- 验证 Android 权限声明

#### 3. 应用无法安装
- **Android**: 启用"未知来源"安装
- **iOS**: 信任开发者证书

### 调试技巧
```bash
# 查看构建日志
eas build:list

# 本地调试
npx expo run:android
npx expo run:ios
```

---

## 📞 支持

如果遇到问题：
1. 查看 [Expo 官方文档](https://docs.expo.dev/)
2. 检查 [EAS Build 指南](https://docs.expo.dev/build/introduction/)
3. 参考 [React Native 调试指南](https://reactnative.dev/docs/debugging)

---

## 🎯 快速开始

**最简单的方式（推荐）：**
```bash
# 1. 安装 EAS CLI
npm install -g @expo/eas-cli

# 2. 登录
eas login

# 3. 进入项目目录
cd Epoch

# 4. 构建 Android APK
eas build --platform android --profile preview

# 5. 等待构建完成，下载 APK 安装到手机
```

构建时间通常为 10-20 分钟，完成后您将获得一个可以直接安装到 Android 手机的 APK 文件！

