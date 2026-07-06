# AI Research Partner - Complete Deployment Guide

## Table of Contents
1. [Build the App](#build-the-app)
2. [Deploy to Pen Drive](#deploy-to-pen-drive)
3. [Installation on Target Device](#installation-on-target-device)
4. [Troubleshooting](#troubleshooting)

---

## Build the App

### Prerequisites
- Node.js 18+ and pnpm installed
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI for building (`npm install -g eas-cli`)

### Step 1: Build for iOS (if needed)
```bash
cd /home/ubuntu/research-partner-app

# Build for iOS
eas build --platform ios --non-interactive

# Or build locally for simulator
npm run ios
```

### Step 2: Build for Android
```bash
# Build APK for Android
eas build --platform android --non-interactive

# Or build locally
npm run android
```

### Step 3: Build Web Version (Optional)
```bash
# Build for web
npm run build

# This creates a dist/ folder with static files
```

---

## Deploy to Pen Drive

### Method 1: Complete Project Source Code (Recommended for Development)

This method copies the entire project to the pen drive so you can build/develop anywhere.

#### Step 1: Prepare Pen Drive
```bash
# Insert pen drive and identify it
lsblk  # or df -h

# Format pen drive (WARNING: This erases all data!)
# Replace sdX with your pen drive identifier
sudo mkfs.ext4 /dev/sdX1

# Mount pen drive
mkdir -p ~/mnt/pendrive
sudo mount /dev/sdX1 ~/mnt/pendrive
sudo chown -R $USER ~/mnt/pendrive
```

#### Step 2: Copy Project to Pen Drive
```bash
# Navigate to project
cd /home/ubuntu/research-partner-app

# Copy entire project (excluding node_modules to save space)
rsync -av --exclude='node_modules' --exclude='.git' --exclude='dist' \
  /home/ubuntu/research-partner-app/ ~/mnt/pendrive/research-partner-app/

# Copy node_modules separately (optional, ~500MB)
# rsync -av node_modules/ ~/mnt/pendrive/research-partner-app/node_modules/

# Verify copy
ls -lh ~/mnt/pendrive/research-partner-app/
```

#### Step 3: Create Setup Script
Create a file `~/mnt/pendrive/SETUP.sh`:

```bash
#!/bin/bash

# AI Research Partner - Setup Script
# Run this on the target machine to set up the project

echo "🤖 AI Research Partner - Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"

# Navigate to project
cd "$(dirname "$0")/research-partner-app"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local..."
    cp .env.example .env.local || echo "VITE_APP_ID=your_app_id" > .env.local
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  cd research-partner-app"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  npm run build"
echo ""
```

Make it executable:
```bash
chmod +x ~/mnt/pendrive/SETUP.sh
```

---

### Method 2: Built APK Only (For Direct Installation)

This method is smaller and ready to install directly on Android devices.

#### Step 1: Build APK
```bash
cd /home/ubuntu/research-partner-app

# Build APK
eas build --platform android --non-interactive

# Download the APK when ready
# File will be named: research-partner-app-<version>.apk
```

#### Step 2: Copy to Pen Drive
```bash
# Mount pen drive (if not already mounted)
mkdir -p ~/mnt/pendrive
sudo mount /dev/sdX1 ~/mnt/pendrive

# Copy APK
cp ~/Downloads/research-partner-app-*.apk ~/mnt/pendrive/

# Create installation guide
cat > ~/mnt/pendrive/INSTALL_ANDROID.txt << 'EOF'
AI Research Partner - Android Installation
============================================

1. Transfer this APK file to your Android device
2. Enable "Unknown Sources" in Settings > Security
3. Open file manager and tap the APK file
4. Follow installation prompts
5. Launch "Research Partner" from app drawer

For issues:
- Ensure Android 8.0+ (API 24+)
- Check storage space (min 200MB)
- Allow permissions when prompted

EOF
```

---

### Method 3: Docker Container (For Any Platform)

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy project files
COPY . .

# Install dependencies
RUN npm install

# Expose ports
EXPOSE 3000 8081

# Start dev server
CMD ["npm", "run", "dev"]
```

Build and copy:
```bash
# Build Docker image
docker build -t research-partner:latest .

# Save as tar (can be moved to pen drive)
docker save research-partner:latest -o ~/mnt/pendrive/research-partner.tar

# Load on target machine
docker load -i research-partner.tar
docker run -p 3000:3000 -p 8081:8081 research-partner:latest
```

---

## Installation on Target Device

### For Development (From Source)

```bash
# 1. Copy pen drive contents to target machine
cp -r /media/pendrive/research-partner-app ~/

# 2. Run setup script
bash ~/research-partner-app/SETUP.sh

# 3. Start development server
cd ~/research-partner-app
npm run dev

# 4. Access in browser
# Metro: http://localhost:8081
# API: http://localhost:3000
```

### For Android (Direct APK)

```bash
# 1. Connect Android device via USB
adb devices

# 2. Install APK
adb install ~/mnt/pendrive/research-partner-app-*.apk

# 3. Launch app
adb shell am start -n com.example.researchpartner/.MainActivity

# Or open from app drawer
```

### For iOS (From Source)

```bash
# 1. On Mac with Xcode
cd ~/research-partner-app

# 2. Build for simulator
npm run ios

# 3. Or build for device
eas build --platform ios
# Follow prompts to install on device
```

---

## Troubleshooting

### Issue: "node_modules not found"
**Solution:**
```bash
cd research-partner-app
npm install
```

### Issue: "Port 3000 or 8081 already in use"
**Solution:**
```bash
# Kill process using port
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue: "Database connection failed"
**Solution:**
```bash
# Check DATABASE_URL in .env.local
# Ensure MySQL is running
mysql -u root -p

# Or use SQLite for development
# Update drizzle.config.ts to use sqlite
```

### Issue: "APK installation fails on Android"
**Solution:**
- Check Android version (min 8.0)
- Enable installation from unknown sources
- Clear app cache: `adb shell pm clear com.example.researchpartner`
- Reinstall: `adb uninstall com.example.researchpartner && adb install app.apk`

### Issue: "JARVIS AI not responding"
**Solution:**
```bash
# Check API keys in environment
echo $OPENAI_API_KEY
echo $PERPLEXITY_API_KEY

# Verify backend is running
curl http://localhost:3000/health

# Check server logs
tail -f .manus-logs/devserver.log
```

---

## Pen Drive File Structure

```
pendrive/
├── research-partner-app/          # Full project source
│   ├── app/
│   ├── server/
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
├── SETUP.sh                        # Setup script
├── INSTALL_ANDROID.txt             # Android installation guide
├── research-partner-app-*.apk      # Built APK (if Method 2)
├── research-partner.tar            # Docker image (if Method 3)
└── README.md                       # This guide
```

---

## Quick Reference

### Start Development
```bash
cd research-partner-app
npm install
npm run dev
```

### Build for Production
```bash
# Android APK
eas build --platform android

# iOS
eas build --platform ios

# Web
npm run build
```

### Deploy to Pen Drive
```bash
# Method 1: Full source
rsync -av --exclude='node_modules' /home/ubuntu/research-partner-app/ /mnt/pendrive/

# Method 2: APK only
cp research-partner-app-*.apk /mnt/pendrive/

# Method 3: Docker
docker save research-partner:latest -o /mnt/pendrive/research-partner.tar
```

### Unmount Pen Drive Safely
```bash
sudo umount /mnt/pendrive
# Now safe to remove
```

---

## Support & Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **Drizzle ORM**: https://orm.drizzle.team
- **tRPC**: https://trpc.io

---

**Last Updated**: July 2026
**Version**: 1.0.0
