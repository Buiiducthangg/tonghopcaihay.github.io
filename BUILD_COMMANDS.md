# Lệnh Build iOS cho TikCreator AI

## Lệnh cơ bản (chạy trên máy Mac)

### 1. Build ứng dụng web và sync với iOS
```bash
npm run build
npx cap sync ios
```

### 2. Mở project trong Xcode
```bash
npx cap open ios
```

### 3. Build và chạy trên iOS Simulator
```bash
npx cap run ios
```

### 4. Build với live reload (development)
```bash
npx cap run ios --livereload
```

## Tạo file .ipa trong Xcode

### Bước 1: Chuẩn bị
1. Đảm bảo đã có Apple Developer Account
2. Cài đặt certificates và provisioning profiles
3. Chọn "Any iOS Device (arm64)" trong Xcode

### Bước 2: Archive
1. Product → Clean Build Folder
2. Product → Archive
3. Chờ build hoàn thành

### Bước 3: Export IPA
1. Trong Organizer, chọn "Distribute App"
2. Chọn method:
   - **Development**: Cho testing trên device
   - **App Store**: Cho phân phối chính thức
3. Export và lưu file .ipa

## Files quan trọng đã tạo

- `capacitor.config.ts` - Cấu hình Capacitor
- `ios/` - Thư mục chứa iOS project
- `IOS_BUILD_GUIDE.md` - Hướng dẫn chi tiết
- `BUILD_COMMANDS.md` - File này với các lệnh cần thiết

## Lưu ý
- Cần máy Mac để build file .ipa
- Apple Developer Account cần $99/năm
- File .ipa có thể cài đặt trên iPhone/iPad hoặc upload lên App Store