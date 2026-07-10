# AI Research Partner - Verification Checklist
## Quick Reference for Testing Each Phase

---

## ✅ PHASE 1: Prerequisites Check
Run this to verify everything is installed:

```bash
echo "=== Checking Prerequisites ==="
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "pnpm: $(pnpm -v)"
echo "Expo: $(expo -v)"
echo "EAS: $(eas -v)"
```

**Expected Output:** All should show version numbers (v18+, v9+, etc.)

---

## ✅ PHASE 2: Project Structure Check
```bash
echo "=== Checking Project Structure ==="
test -d app && echo "✅ app/ directory exists"
test -d server && echo "✅ server/ directory exists"
test -d components && echo "✅ components/ directory exists"
test -f package.json && echo "✅ package.json exists"
test -f tsconfig.json && echo "✅ tsconfig.json exists"
test -d node_modules && echo "✅ node_modules exists"
```

**Expected Output:** All should show ✅

---

## ✅ PHASE 3: Dependencies Check
```bash
echo "=== Checking Key Dependencies ==="
pnpm list | grep -E "react|expo|typescript|trpc|drizzle"
```

**Expected Output:** Should show versions for:
- react (19.x)
- expo (54.x)
- typescript (5.x)
- @trpc/server (11.x)
- drizzle-orm (0.44.x)

---

## ✅ PHASE 4: Backend Services Check
```bash
echo "=== Checking Backend Files ==="
test -f server/_core/index.ts && echo "✅ Server core exists"
test -f server/routers.ts && echo "✅ API routes exist"
test -f server/jarvis-assistant.ts && echo "✅ JARVIS AI exists"
test -f server/pdf-generator.ts && echo "✅ PDF generator exists"
test -f server/export-service.ts && echo "✅ Export service exists"
```

**Expected Output:** All should show ✅

---

## ✅ PHASE 5: Frontend Screens Check
```bash
echo "=== Checking Frontend Screens ==="
test -f app/\(tabs\)/index.tsx && echo "✅ Home screen exists"
test -f app/search.tsx && echo "✅ Search screen exists"
test -f app/paper-detail.tsx && echo "✅ Paper detail screen exists"
test -f app/saved.tsx && echo "✅ Saved collections screen exists"
test -f app/settings.tsx && echo "✅ Settings screen exists"
```

**Expected Output:** All should show ✅

---

## ✅ PHASE 6: Components Check
```bash
echo "=== Checking Components ==="
test -f components/screen-container.tsx && echo "✅ Screen container exists"
test -f components/pdf-export-button.tsx && echo "✅ PDF export button exists"
test -d components/ui && echo "✅ UI components folder exists"
```

**Expected Output:** All should show ✅

---

## ✅ PHASE 7: TypeScript Compilation Check
```bash
echo "=== Checking TypeScript Compilation ==="
pnpm check 2>&1 | tail -3
```

**Expected Output:**
```
Found 0 errors. Watching for file changes.
```

---

## ✅ PHASE 8: Database Check
```bash
echo "=== Checking Database ==="
test -f .env.local && echo "✅ .env.local exists"
cat .env.local | grep DATABASE_URL
test -f dev.db 2>/dev/null && echo "✅ Database file exists" || echo "⚠️ Database will be created on first run"
```

**Expected Output:** Should show DATABASE_URL configuration

---

## ✅ PHASE 9: Dev Server Check
```bash
# Start dev server in one terminal
pnpm run dev

# In another terminal, run these checks:
echo "=== Checking Dev Server ==="
curl -s http://localhost:3000/health | head -c 100 && echo "✅ Backend server running"
curl -s http://localhost:8081 | head -c 100 && echo "✅ Metro bundler running"
```

**Expected Output:** Both should respond (not timeout)

---

## ✅ PHASE 10: Browser Preview Check
1. Open the preview URL from your Manus UI
2. Verify you see:
   - [ ] App title "Research Partner"
   - [ ] Search input field
   - [ ] Microphone icon
   - [ ] "Your Research" section with stats
   - [ ] "Recent Searches" section
   - [ ] "Quick Actions" buttons

---

## ✅ PHASE 11: Search Feature Check
1. Type "Machine Learning" in search box
2. Press Enter
3. Verify:
   - [ ] Results appear within 10 seconds
   - [ ] Each result shows title, authors, source
   - [ ] Relevance score displayed
   - [ ] Abstract preview visible

---

## ✅ PHASE 12: Paper Detail Check
1. Click on any search result
2. Verify tabs appear:
   - [ ] Overview tab (shows abstract, keywords)
   - [ ] Insights tab (shows JARVIS analysis)
   - [ ] Citations tab (shows citation count)
   - [ ] Actions tab (shows buttons)

---

## ✅ PHASE 13: Collections Check
1. Go to "Saved" tab
2. Click "Create New Collection"
3. Enter name: "Test"
4. Click Create
5. Verify:
   - [ ] Collection appears in list
   - [ ] Can click to view collection
   - [ ] Can add papers to collection
   - [ ] Can delete collection

---

## ✅ PHASE 14: JARVIS Assistant Check
1. Go to "Settings" tab
2. Find "Chat with JARVIS"
3. Click to expand
4. Type: "What is machine learning?"
5. Verify:
   - [ ] Chat interface opens
   - [ ] Can type messages
   - [ ] JARVIS responds
   - [ ] Response is relevant and well-formatted

---

## ✅ PHASE 15: Export Check
1. Go to "Saved" tab
2. Select a collection
3. Verify export buttons visible:
   - [ ] BibTeX button
   - [ ] RIS button
   - [ ] CSV button
4. Click each to download
5. Verify:
   - [ ] Files download successfully
   - [ ] Files have correct extensions
   - [ ] Files contain paper data

---

## ✅ PHASE 16: PDF Export Check
1. Go to Paper Detail screen
2. Click "Actions" tab
3. Verify "Export as PDF" button visible
4. Click to export
5. Verify:
   - [ ] PDF downloads
   - [ ] PDF opens in viewer
   - [ ] PDF shows paper details
   - [ ] Formatting looks professional

---

## ✅ PHASE 17: Dark Mode Check
1. Go to Settings tab
2. Find "Dark Mode" toggle
3. Toggle it on/off
4. Verify:
   - [ ] Colors change appropriately
   - [ ] Text remains readable
   - [ ] All screens update
   - [ ] No visual glitches

---

## ✅ PHASE 18: Responsive Design Check
1. Resize browser window to mobile size (375px width)
2. Verify:
   - [ ] Layout adapts to mobile
   - [ ] Text readable on small screen
   - [ ] Buttons easily tappable
   - [ ] No horizontal scrolling

---

## ✅ PHASE 19: Performance Check
1. Open DevTools (F12)
2. Go to Performance tab
3. Do a search
4. Verify:
   - [ ] Search completes in <10 seconds
   - [ ] No console errors
   - [ ] Memory usage reasonable
   - [ ] No performance warnings

---

## ✅ PHASE 20: Build Check
```bash
# Build for Android
eas build --platform android --non-interactive

# Wait for build to complete
# Verify:
# - [ ] Build completes without errors
# - [ ] APK file downloads
# - [ ] File size 50-100 MB
```

---

## ✅ PHASE 21: Pen Drive Deployment Check
```bash
# Copy to pen drive
rsync -av --exclude='node_modules' \
  /home/ubuntu/research-partner-app/ ~/mnt/pendrive/research-partner-app/

# Verify:
# - [ ] Files copied successfully
# - [ ] Project structure intact
# - [ ] No errors during copy
```

---

## ✅ PHASE 22: Verification on New Computer
1. Copy project from pen drive
2. Run setup:
   ```bash
   cd research-partner-app
   npm install
   npm run dev
   ```
3. Verify:
   - [ ] npm install completes
   - [ ] Dev server starts
   - [ ] App loads in browser
   - [ ] All features work

---

## 🎯 Final Success Criteria

Your app is ready when ALL of these are true:

### Backend ✅
- [ ] Server starts without errors
- [ ] API endpoints respond
- [ ] Database connects
- [ ] JARVIS AI responds
- [ ] PDF generation works

### Frontend ✅
- [ ] Home screen loads
- [ ] Search functionality works
- [ ] Results display correctly
- [ ] Paper detail opens
- [ ] Collections work
- [ ] Export works (all formats)
- [ ] JARVIS chat responds
- [ ] Dark mode works
- [ ] All buttons clickable

### Mobile ✅
- [ ] App opens in Expo Go
- [ ] All screens visible
- [ ] Touch interactions work
- [ ] No crashes
- [ ] Performance good

### Deployment ✅
- [ ] Project copies to pen drive
- [ ] Setup script works
- [ ] App runs on different computer
- [ ] All features functional

---

## Quick Test Script

Save this as `test.sh` and run `bash test.sh`:

```bash
#!/bin/bash

echo "🚀 AI Research Partner - Quick Test"
echo "===================================="
echo ""

# Check prerequisites
echo "1️⃣ Checking prerequisites..."
node -v > /dev/null && echo "✅ Node.js installed" || echo "❌ Node.js missing"
pnpm -v > /dev/null && echo "✅ pnpm installed" || echo "❌ pnpm missing"

# Check structure
echo ""
echo "2️⃣ Checking project structure..."
test -d app && echo "✅ app/ exists" || echo "❌ app/ missing"
test -d server && echo "✅ server/ exists" || echo "❌ server/ missing"
test -d components && echo "✅ components/ exists" || echo "❌ components/ missing"

# Check backend
echo ""
echo "3️⃣ Checking backend files..."
test -f server/_core/index.ts && echo "✅ Server core exists" || echo "❌ Server core missing"
test -f server/routers.ts && echo "✅ API routes exist" || echo "❌ API routes missing"
test -f server/jarvis-assistant.ts && echo "✅ JARVIS exists" || echo "❌ JARVIS missing"

# Check frontend
echo ""
echo "4️⃣ Checking frontend screens..."
test -f app/\(tabs\)/index.tsx && echo "✅ Home screen exists" || echo "❌ Home screen missing"
test -f app/search.tsx && echo "✅ Search screen exists" || echo "❌ Search screen missing"
test -f app/paper-detail.tsx && echo "✅ Paper detail exists" || echo "❌ Paper detail missing"

# Check TypeScript
echo ""
echo "5️⃣ Checking TypeScript..."
pnpm check 2>&1 | grep -q "Found 0 errors" && echo "✅ TypeScript OK" || echo "❌ TypeScript errors"

echo ""
echo "===================================="
echo "✅ All checks complete!"
echo ""
echo "Next: Run 'pnpm run dev' to start the app"
```

---

## Support

If any check fails:
1. Read the error message carefully
2. Check the TROUBLESHOOTING section in BUILD_GUIDE.md
3. Verify all prerequisites are installed
4. Restart the dev server
5. Clear cache: `rm -rf node_modules && pnpm install`

**Status:** All systems ready! 🚀
