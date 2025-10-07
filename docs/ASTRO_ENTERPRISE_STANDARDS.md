# Astro Enterprise Standards Reference

## 🎯 CRITICAL RULES - NO EXCEPTIONS

### 1. **CODE LENGTH LIMITS**

- **Maximum 250 lines per file** - HARD LIMIT
- **Components should be 50-150 lines** - IDEAL
- **Utilities should be 20-100 lines** - IDEAL

### 2. **SEPARATION OF CONCERNS**

- **Single Responsibility Principle** - One component, one purpose
- **Feature-based organization** - Group related functionality
- **Clear boundaries** - No cross-contamination

### 3. **ISOLATION STANDARDS**

- **Independent components** - No tight coupling
- **Props-based communication** - Clean interfaces
- **Self-contained logic** - No external dependencies

### 4. **MODULARITY REQUIREMENTS**

- **Reusable components** - DRY principle
- **Composable architecture** - Mix and match
- **Clear interfaces** - Well-defined props

## 🔧 CURRENT VIOLATIONS TO FIX

### ❌ **GalleryModal.tsx (411 lines)**

**BREAKDOWN PLAN:**

1. `GalleryModal.tsx` (main container) - ~100 lines
2. `GalleryImage.tsx` (image display) - ~80 lines
3. `GalleryControls.tsx` (navigation controls) - ~60 lines
4. `GalleryDescription.tsx` (description popup) - ~50 lines
5. `GalleryKeyboard.tsx` (keyboard handlers) - ~40 lines

### ❌ **WorkingAudioModal.tsx (338 lines)**

**BREAKDOWN PLAN:**

1. `WorkingAudioModal.tsx` (main container) - ~100 lines
2. `AudioControls.tsx` (play/pause/next/prev) - ~80 lines
3. `TrackList.tsx` (track selection) - ~70 lines
4. `ProgressBar.tsx` (progress and volume) - ~60 lines
5. `AudioInfo.tsx` (track info display) - ~40 lines

## ✅ **VERIFICATION CHECKLIST**

### **Before Proceeding:**

- [ ] All files under 250 lines
- [ ] Components follow single responsibility
- [ ] No tight coupling between components
- [ ] Clear prop interfaces
- [ ] All functionality preserved
- [ ] No breaking changes

### **Testing Requirements:**

- [ ] MP3 player works perfectly
- [ ] Gallery modal functions correctly
- [ ] All animations work
- [ ] Responsive design intact
- [ ] No console errors
- [ ] All interactions functional

## 🚀 **EXECUTION PHASES**

### **Phase 1: GalleryModal Breakdown**

1. Create `GalleryImage.tsx` component
2. Create `GalleryControls.tsx` component
3. Create `GalleryDescription.tsx` component
4. Create `GalleryKeyboard.tsx` component
5. Refactor main `GalleryModal.tsx`

### **Phase 2: WorkingAudioModal Breakdown**

1. Create `AudioControls.tsx` component
2. Create `TrackList.tsx` component
3. Create `ProgressBar.tsx` component
4. Create `AudioInfo.tsx` component
5. Refactor main `WorkingAudioModal.tsx`

### **Phase 3: Verification**

1. Check all file line counts
2. Test all functionality
3. Verify no errors
4. Restart server
5. Test in Chrome

## 📊 **SUCCESS METRICS**

- **All files ≤ 250 lines** ✅
- **Zero functionality loss** ✅
- **No console errors** ✅
- **Perfect user experience** ✅
- **Enterprise-grade architecture** ✅

---

**NO SHORTCUTS - ENTERPRISE STANDARDS ONLY**
