# Firestore Migration Guide

## Overview
Your app now uses Cloud Firestore to store all content data. This guide explains how to migrate data from `constants.js` to Firestore.

## Automatic Migration
The app will **automatically migrate** data from `constants.js` to Firestore on first load if Firestore is empty. This happens when you:
1. Run `npm run dev` for the first time
2. The app detects Firestore is empty
3. It automatically copies all data from `constants.js` to Firestore
4. The app then loads data from Firestore

## Manual Migration (If Needed)

### Option 1: Using the Migration Page
1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3000` (or your dev port)
3. In the browser console, type: `window.location.hash = '#migrate'` or add a route
4. Or manually navigate to the migrate page if you've set up routing

### Option 2: Using Browser Console
1. Open your app in the browser
2. Open Developer Console (F12 or Cmd+Option+I)
3. Type one of these commands:

```javascript
// Normal migration (only if Firestore is empty)
migrateToFirestore()

// Force migration (overwrites existing Firestore data)
forceMigrateToFirestore()
```

### Option 3: Programmatic Access
The migration functions are available globally:
- `window.migrateToFirestore()` - Migrates only if Firestore is empty
- `window.forceMigrateToFirestore()` - Forces migration (overwrites existing data)

## What Gets Migrated?

All data from `constants.js`:
- ✅ Courses (`INITIAL_COURSES`)
- ✅ Blog Posts (`INITIAL_BLOG_POSTS`)
- ✅ Team Members (`TEAM`)
- ✅ Testimonials (`TESTIMONIALS`)
- ✅ Settings (`INITIAL_SETTINGS`)
- ✅ Page Content (`INITIAL_PAGE_CONTENT`)
- ✅ Social Feed (`INITIAL_SOCIAL_FEED`)

## After Migration

Once data is in Firestore:
- ✅ All content loads from Firestore (not `constants.js`)
- ✅ Changes made in the Admin panel are saved to Firestore
- ✅ Data persists across app restarts
- ✅ Multiple users/devices see the same data

## Troubleshooting

### App still shows data from constants.js
1. Check browser console for errors
2. Verify Firestore is initialized in Firebase Console
3. Check Firestore security rules allow read/write
4. Try force migration: `forceMigrateToFirestore()`

### Migration fails
1. Check Firebase connection in `firebase/config.js`
2. Verify Firestore is enabled in Firebase Console
3. Check browser console for specific error messages
4. Ensure you're authenticated (for admin operations)

## Firestore Collections Created

The migration creates these collections:
- `courses` - All course data
- `blogPosts` - All blog posts
- `team` - Team members
- `testimonials` - Testimonials
- `settings` - Site settings
- `pageContent` - Page content
- `socialFeed` - Social media feed
- `leads` - Form submissions (created as needed)

## Next Steps

1. **Enable Firestore in Firebase Console:**
   - Go to Firebase Console → Firestore Database
   - Click "Create Database"
   - Choose production or test mode (you can update rules later)

2. **Set up Firestore Security Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read for everyone
       match /{document=**} {
         allow read: if true;
       }
       // Allow write only for authenticated users
       match /{document=**} {
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **Run the migration** using one of the methods above

4. **Verify data in Firebase Console:**
   - Go to Firestore Database
   - Check that collections are created with your data

## Notes

- `constants.js` is still used as a fallback if Firestore fails
- After migration, all new data goes to Firestore
- You can still edit `constants.js` for initial/default values
- The app automatically syncs changes to Firestore when you use the Admin panel

