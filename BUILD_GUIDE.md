# AI Research Partner - Complete Build Guide
## Step-by-Step Instructions with Verification Checkpoints

---

## PHASE 1: Project Setup & Environment
**Estimated Time:** 15 minutes

### Step 1.1: Install Prerequisites
```bash
# Check Node.js version (should be 18+)
node -v

# Check npm version (should be 9+)
npm -v

# Install pnpm globally
npm install -g pnpm

# Install Expo CLI
npm install -g expo-cli

# Install EAS CLI (for building)
npm install -g eas-cli
```

**✅ Verification Checkpoint:**
```bash
# All should show version numbers
node -v && npm -v && pnpm -v && expo -v && eas -v
```

---

### Step 1.2: Clone or Access the Project
```bash
# Navigate to project directory
cd /home/ubuntu/research-partner-app

# Check if project exists
ls -la

# You should see:
# - app/
# - server/
# - components/
# - package.json
# - tsconfig.json
```

**✅ Verification Checkpoint:**
```bash
# Verify project structure
ls -la | grep -E "^d" | head -10
# Should show: app, server, components, lib, etc.
```

---

### Step 1.3: Install Dependencies
```bash
cd /home/ubuntu/research-partner-app

# Install all npm packages
pnpm install

# This will take 2-3 minutes
# Watch for any error messages
```

**✅ Verification Checkpoint:**
```bash
# Check if node_modules exists and has packages
ls node_modules | wc -l
# Should show 1000+ packages

# Verify key packages installed
pnpm list | grep -E "expo|react|typescript"
# Should show versions for expo, react, typescript
```

---

## PHASE 2: Database Setup
**Estimated Time:** 10 minutes

### Step 2.1: Configure Database
```bash
# Check if .env.local exists
cat .env.local

# If not, create it with database URL
# For development, you can use SQLite or MySQL
# Example for SQLite (development):
echo "DATABASE_URL=file:./dev.db" > .env.local
```

**✅ Verification Checkpoint:**
```bash
# Verify .env.local exists
test -f .env.local && echo "✅ .env.local exists" || echo "❌ Missing .env.local"

# Check content
cat .env.local | grep DATABASE_URL
```

---

### Step 2.2: Generate Database Schema
```bash
# Generate Drizzle migrations
pnpm run db:push

# This creates the database schema
```

**✅ Verification Checkpoint:**
```bash
# Check if database file was created
ls -la | grep -E "\.db|drizzle"

# Should show:
# - dev.db (SQLite database file)
# - drizzle/ (migrations folder)
```

---

## PHASE 3: Backend Server Setup
**Estimated Time:** 10 minutes

### Step 3.1: Verify Backend Files
```bash
# Check if all backend files exist
ls -la server/

# Should include:
# - _core/index.ts (main server)
# - _core/trpc.ts (API routes)
# - routers.ts (API endpoints)
# - jarvis-assistant.ts (AI assistant)
# - pdf-generator.ts (PDF export)
# - export-service.ts (Export formats)
```

**✅ Verification Checkpoint:**
```bash
# Verify all backend services exist
test -f server/_core/index.ts && echo "✅ Server core exists"
test -f server/routers.ts && echo "✅ API routes exist"
test -f server/jarvis-assistant.ts && echo "✅ JARVIS AI exists"
test -f server/pdf-generator.ts && echo "✅ PDF generator exists"
```

---

### Step 3.2: Check TypeScript Compilation
```bash
# Compile TypeScript
pnpm check

# Should complete without errors
```

**✅ Verification Checkpoint:**
```bash
# Run type check
pnpm check 2>&1 | tail -5

# Should show:
# "Found 0 errors"
```

---

## PHASE 4: Frontend Setup
**Estimated Time:** 15 minutes

### Step 4.1: Verify Frontend Structure
```bash
# Check app directory structure
ls -la app/

# Should include:
# - (tabs)/ (tab navigation)
# - _layout.tsx (root layout)
# - paper-detail.tsx (paper screen)
# - saved.tsx (collections screen)
# - settings.tsx (settings screen)
# - search.tsx (search screen)
```

**✅ Verification Checkpoint:**
```bash
# Verify all screens exist
test -f app/\(tabs\)/index.tsx && echo "✅ Home screen exists"
test -f app/paper-detail.tsx && echo "✅ Paper detail exists"
test -f app/saved.tsx && echo "✅ Saved screen exists"
test -f app/settings.tsx && echo "✅ Settings screen exists"
test -f app/search.tsx && echo "✅ Search screen exists"
```

---

### Step 4.2: Check Components
```bash
# List all components
ls -la components/

# Should include:
# - screen-container.tsx
# - pdf-export-button.tsx
# - ui/ (UI components)
```

**✅ Verification Checkpoint:**
```bash
# Verify components exist
test -f components/screen-container.tsx && echo "✅ Screen container exists"
test -f components/pdf-export-button.tsx && echo "✅ PDF button exists"
```

---

## PHASE 5: Start Development Server
**Estimated Time:** 5 minutes

### Step 5.1: Start the Dev Server
```bash
# Start development server
pnpm run dev

# This starts both Metro bundler and backend server
# Wait for output like:
# "Metro Bundler started"
# "Backend server running on port 3000"
```

**✅ Verification Checkpoint:**
```bash
# In another terminal, check if servers are running
# Check backend
curl http://localhost:3000/health 2>/dev/null || echo "Backend not ready yet"

# Check Metro
curl http://localhost:8081 2>/dev/null | head -c 50 || echo "Metro not ready yet"

# Both should respond (not error)
```

---

### Step 5.2: View in Browser
```bash
# Open the web preview
# Visit: https://8081-ihehr10xf7m9r0vf8buub-bc6b65f5.sg1.manus.computer
# (URL will be shown in your Manus UI)

# You should see:
# - Research Partner home screen
# - Search box with microphone icon
# - Recent searches section
# - Quick actions (New Search, Saved)
```

**✅ Verification Checkpoint:**
```bash
# Check if you can see:
# ✅ App title: "Research Partner"
# ✅ Search input field
# ✅ Microphone icon
# ✅ Recent searches list
# ✅ Quick action buttons
```

---

## PHASE 6: Test Core Features
**Estimated Time:** 20 minutes

### Step 6.1: Test Search Functionality
**In Browser:**
1. Click on search box
2. Type: "Machine Learning"
3. Press Enter or click search icon
4. Wait for results to load (5-10 seconds)

**✅ Verification Checkpoint:**
```
✅ Search box accepts text input
✅ Results appear after search
✅ Each result shows:
   - Paper title
   - Authors
   - Source (GoogleScholar, arXiv, etc.)
   - Relevance score
   - Abstract preview
```

---

### Step 6.2: Test Paper Detail
**In Browser:**
1. Click on any search result
2. Paper detail screen should open
3. You should see tabs: Overview, Insights, Citations, Actions

**✅ Verification Checkpoint:**
```
✅ Paper detail screen opens
✅ All tabs are visible and clickable
✅ Overview tab shows:
   - Full abstract
   - Keywords
   - Publication details
✅ Insights tab shows JARVIS analysis
✅ Citations tab shows citation count
✅ Actions tab shows Open, Save, Share buttons
```

---

### Step 6.3: Test Save/Collections
**In Browser:**
1. Go to Saved screen (bottom tab)
2. Click "Create New Collection"
3. Enter collection name: "Test Collection"
4. Click Create
5. Go back to search results
6. Click Save on a paper
7. Select your collection

**✅ Verification Checkpoint:**
```
✅ Can create new collection
✅ Collection appears in Saved screen
✅ Can add papers to collection
✅ Papers appear in collection
✅ Can view collection details
```

---

### Step 6.4: Test JARVIS Assistant
**In Browser:**
1. Go to Settings screen (bottom tab)
2. Find "Chat with JARVIS" section
3. Click to expand
4. Type: "What are the latest trends in AI?"
5. Click send button

**✅ Verification Checkpoint:**
```
✅ Chat interface opens
✅ Can type messages
✅ JARVIS responds with analysis
✅ Response includes:
   - Sophisticated greeting
   - Research insights
   - Recommendations
```

---

### Step 6.5: Test Export Functionality
**In Browser:**
1. Go to Saved screen
2. Select a collection
3. Look for Export buttons (BibTeX, RIS, CSV)
4. Click one to download

**✅ Verification Checkpoint:**
```
✅ Export buttons are visible
✅ Clicking export downloads file
✅ File has correct format:
   - BibTeX: .bib extension
   - RIS: .ris extension
   - CSV: .csv extension
✅ File contains paper data
```

---

### Step 6.6: Test PDF Export
**In Browser:**
1. Go to Paper Detail screen
2. Click Actions tab
3. Look for "Export as PDF" button
4. Click to generate and download PDF

**✅ Verification Checkpoint:**
```
✅ PDF export button is visible
✅ PDF downloads successfully
✅ PDF opens and shows:
   - Paper title
   - Authors
   - Abstract
   - Metadata
   - Proper formatting
```

---

## PHASE 7: Test on Mobile (Optional)
**Estimated Time:** 10 minutes

### Step 7.1: Install Expo Go
1. Download "Expo Go" app from App Store (iOS) or Google Play (Android)
2. Open the app

---

### Step 7.2: Scan QR Code
**In Terminal:**
```bash
# Run this command to generate QR code
pnpm run qr

# Or look in dev server output for QR code
# Should show: exps://...
```

**In Expo Go App:**
1. Tap "Scan QR code"
2. Scan the QR code from terminal
3. App loads on your phone

**✅ Verification Checkpoint:**
```
✅ App loads on phone
✅ All screens visible
✅ Search works on mobile
✅ Tap interactions work
✅ No console errors
```

---

## PHASE 8: Build for Production
**Estimated Time:** 30 minutes

### Step 8.1: Build APK (Android)
```bash
# Build for Android
eas build --platform android --non-interactive

# This takes 10-15 minutes
# Watch for build progress
```

**✅ Verification Checkpoint:**
```
✅ Build completes without errors
✅ Download APK file
✅ File size should be 50-100 MB
✅ Filename: research-partner-app-*.apk
```

---

### Step 8.2: Build for iOS (Optional)
```bash
# Build for iOS
eas build --platform ios --non-interactive

# This takes 15-20 minutes
```

**✅ Verification Checkpoint:**
```
✅ Build completes
✅ IPA file generated
✅ Can be installed on iOS device
```

---

## PHASE 9: Deploy to Pen Drive
**Estimated Time:** 10 minutes

### Step 9.1: Prepare Pen Drive
```bash
# Insert pen drive
# Identify it
lsblk

# Mount it
mkdir -p ~/mnt/pendrive
sudo mount /dev/sdX1 ~/mnt/pendrive
# Replace sdX with your device
```

**✅ Verification Checkpoint:**
```bash
# Verify mount
df -h | grep pendrive
# Should show mounted pen drive
```

---

### Step 9.2: Copy Project
```bash
# Copy project to pen drive
rsync -av --exclude='node_modules' --exclude='.git' \
  /home/ubuntu/research-partner-app/ ~/mnt/pendrive/research-partner-app/

# This takes 2-3 minutes
```

**✅ Verification Checkpoint:**
```bash
# Verify copy
ls ~/mnt/pendrive/research-partner-app/
# Should show: app/, server/, package.json, etc.

# Check file count
find ~/mnt/pendrive/research-partner-app -type f | wc -l
# Should show 500+ files
```

---

### Step 9.3: Create Setup Script
```bash
# Create setup script on pen drive
cat > ~/mnt/pendrive/SETUP.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/research-partner-app"
npm install
npm run dev
EOF

chmod +x ~/mnt/pendrive/SETUP.sh
```

**✅ Verification Checkpoint:**
```bash
# Verify script
test -f ~/mnt/pendrive/SETUP.sh && echo "✅ Setup script created"
```

---

### Step 9.4: Unmount Safely
```bash
# Unmount pen drive
sudo umount ~/mnt/pendrive

# Remove pen drive from computer
```

**✅ Verification Checkpoint:**
```bash
# Verify unmounted
df -h | grep -v pendrive
# Pen drive should not appear
```

---

## PHASE 10: Verify on Another Computer
**Estimated Time:** 15 minutes

### Step 10.1: Copy from Pen Drive
```bash
# On target computer, copy from pen drive
cp -r /media/pendrive/research-partner-app ~/

# Navigate to project
cd ~/research-partner-app
```

**✅ Verification Checkpoint:**
```bash
# Verify project copied
ls -la ~/research-partner-app/
# Should show all project files
```

---

### Step 10.2: Install and Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

**✅ Verification Checkpoint:**
```
✅ npm install completes without errors
✅ Dev server starts
✅ No error messages
✅ Can access in browser
✅ All features work
```

---

## TROUBLESHOOTING CHECKLIST

### Issue: "Cannot find module"
```bash
# Solution: Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: "Port 3000 already in use"
```bash
# Solution: Kill the process
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue: "Database connection failed"
```bash
# Solution: Check .env.local
cat .env.local

# Verify DATABASE_URL is set correctly
# For SQLite: file:./dev.db
# For MySQL: mysql://user:pass@localhost/dbname
```

### Issue: "TypeScript errors"
```bash
# Solution: Run type check
pnpm check

# Fix errors shown
# Then restart dev server
```

### Issue: "App not loading in browser"
```bash
# Solution: Check dev server logs
# Look for errors in terminal
# Restart dev server
pnpm run dev
```

---

## FINAL VERIFICATION CHECKLIST

Before considering the app complete, verify:

```
BACKEND:
✅ Server starts without errors
✅ API endpoints respond
✅ Database connects
✅ JARVIS AI responds
✅ PDF generation works

FRONTEND:
✅ Home screen loads
✅ Search works
✅ Results display correctly
✅ Paper detail opens
✅ Collections can be created
✅ Export works (BibTeX, RIS, CSV, PDF)
✅ JARVIS chat responds
✅ Dark mode toggles
✅ All buttons clickable

MOBILE (if testing):
✅ App opens in Expo Go
✅ All screens visible
✅ Touch interactions work
✅ No crashes
✅ Performance acceptable

DEPLOYMENT:
✅ Project copies to pen drive
✅ Setup script works
✅ App runs on different computer
✅ All features functional
```

---

## Success! 🎉

If all checkpoints pass, your AI Research Partner app is:
- ✅ Fully functional
- ✅ Ready for deployment
- ✅ Portable on pen drive
- ✅ Production-ready

**Next Steps:**
1. Test on actual mobile devices
2. Gather user feedback
3. Deploy to app stores
4. Monitor performance
5. Plan future features

---

**Last Updated:** July 2026
**Version:** 1.0.0
**Status:** Complete & Production Ready
