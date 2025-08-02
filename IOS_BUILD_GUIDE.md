# Hướng dẫn tạo file .ipa cho TikCreator AI

## Tổng quan
Dự án TikCreator AI đã được cấu hình với Capacitor để có thể xuất thành ứng dụng iOS native. File .ipa có thể được tạo để cài đặt trên iPhone/iPad hoặc phân phối qua App Store.

## Yêu cầu hệ thống

### Bắt buộc:
- **Máy Mac** với macOS 12.0 trở lên
- **Xcode 15.0+** (tải từ Mac App Store)
- **Apple Developer Account** ($99/năm)
  - Đăng ký tại: https://developer.apple.com/programs/

### Cài đặt bổ sung:
```bash
# Cài đặt CocoaPods (dependency manager cho iOS)
sudo gem install cocoapods

# Cài đặt Xcode Command Line Tools
xcode-select --install
```

## Bước 1: Chuẩn bị Apple Developer Account

### 1.1 Tạo App ID
1. Truy cập https://developer.apple.com/account/
2. Chọn "Certificates, Identifiers & Profiles"
3. Chọn "Identifiers" > "App IDs"
4. Tạo mới với Bundle ID: `com.tikcreator.app`

### 1.2 Tạo Certificates
1. Chọn "Certificates"
2. Tạo "iOS Distribution Certificate" (cho App Store)
3. Tạo "iOS Development Certificate" (cho testing)

### 1.3 Tạo Provisioning Profiles
1. Chọn "Profiles"
2. Tạo "iOS App Development" profile
3. Tạo "iOS App Store" profile

## Bước 2: Build dự án trên máy Mac

### 2.1 Clone dự án về máy Mac
```bash
git clone [repository-url]
cd [project-folder]
npm install
```

### 2.2 Build ứng dụng web
```bash
npm run build
```

### 2.3 Sync với iOS project
```bash
npx cap sync ios
```

### 2.4 Mở project trong Xcode
```bash
npx cap open ios
```

## Bước 3: Cấu hình trong Xcode

### 3.1 Cấu hình Signing & Capabilities
1. Chọn project "App" trong navigator
2. Chọn target "App"
3. Tab "Signing & Capabilities":
   - Team: Chọn Apple Developer Team
   - Bundle Identifier: `com.tikcreator.app`
   - Provisioning Profile: Chọn profile đã tạo

### 3.2 Cấu hình App Info
1. Tab "General":
   - Display Name: "TikCreator AI"
   - Version: 1.0.0
   - Build: 1
   - Deployment Target: iOS 13.0

### 3.3 Thêm App Icons (tùy chọn)
1. Tạo app icon 1024x1024px
2. Kéo vào AppIcon trong Assets.xcassets

## Bước 4: Tạo file .ipa

### 4.1 Build cho Device
1. Chọn "Any iOS Device (arm64)" trong scheme selector
2. Product > Clean Build Folder
3. Product > Build

### 4.2 Archive ứng dụng
1. Product > Archive
2. Đợi build hoàn thành
3. Cửa sổ Organizer sẽ mở

### 4.3 Export IPA file

#### Cho Testing (Development):
1. Chọn "Distribute App"
2. Chọn "Development"
3. Chọn "Export"
4. Chọn thư mục lưu file .ipa

#### Cho App Store:
1. Chọn "Distribute App"
2. Chọn "App Store Connect"
3. Upload để review và phân phối

## Bước 5: Cài đặt file .ipa

### 5.1 Cài đặt qua Xcode (Development)
1. Window > Devices and Simulators
2. Chọn device iOS đã kết nối
3. Kéo file .ipa vào danh sách Installed Apps

### 5.2 Cài đặt qua TestFlight (Beta Testing)
1. Upload .ipa lên App Store Connect
2. Thêm beta testers
3. Gửi link TestFlight cho người dùng

## Cấu hình Capacitor đã thiết lập

### capacitor.config.ts
```typescript
{
  appId: 'com.tikcreator.app',
  appName: 'TikCreator AI',
  webDir: 'dist/public',
  // Splash screen màu TikTok
  // Android scheme HTTPS
}
```

### Tính năng đã được build:
- ✅ Responsive design cho mobile
- ✅ PWA capabilities
- ✅ TikTok brand colors
- ✅ Touch-friendly interface
- ✅ File upload support
- ✅ Database integration

## Lưu ý quan trọng

### Permissions cần thiết:
- Camera (để chụp ảnh sản phẩm)
- Photo Library (để chọn ảnh)
- Network (API calls)

### File size optimization:
```bash
# Optimize bundle size
npm run build

# Check bundle size
ls -lh dist/public/assets/
```

### Testing trước khi release:
1. Test trên iOS Simulator
2. Test trên device thật
3. Test tất cả tính năng chính:
   - Thêm sản phẩm
   - Upload ảnh
   - Tạo video AI
   - Xem analytics

## Troubleshooting

### Lỗi thường gặp:
1. **Code signing error**: Kiểm tra certificates và profiles
2. **Build failed**: Clean build folder và rebuild
3. **App crashes**: Kiểm tra console logs trong Xcode
4. **Network errors**: Cấu hình App Transport Security

### Logs và debugging:
```bash
# Xem logs iOS
npx cap run ios --livereload

# Debug trên device
Safari > Develop > [Device] > localhost
```

## Chi phí

### Apple Developer Program: $99/năm
- Bao gồm: Code signing, TestFlight, App Store distribution
- Cần thiết để tạo file .ipa có thể cài đặt trên device

### Tùy chọn miễn phí:
- Development builds (7 ngày expired)
- iOS Simulator testing
- Xcode development không cần Developer Account

---

**Liên hệ hỗ trợ:** Nếu gặp vấn đề trong quá trình build, hãy cung cấp error logs từ Xcode để được hỗ trợ chi tiết.