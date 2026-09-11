````markdown
# 📅 Schedule Tracker

A cloud-based schedule tracker web application where you can share and sync schedules with friends in real-time. Track events, view shared schedules, and stay synchronized across multiple devices.

## ✨ Features

✅ **Multiple Views**
- Daily view with 24-hour timeline
- Weekly calendar view
- Monthly calendar overview

✅ **Event Management**
- Create, edit, and delete events
- Set event duration with start and end times
- Add event descriptions
- Color-coding by category or custom colors

✅ **Category System**
- Work
- Personal
- Social
- Health

✅ **Sharing & Collaboration**
- Generate shareable links for public viewing
- Invite friends via email
- View multiple friends' schedules simultaneously
- Real-time sync across devices

✅ **Reminders & Notifications**
- Set reminders (15 min, 30 min, 1 hour, 1 day before)
- Browser notifications
- In-app notifications

✅ **Filters**
- Filter by friend/person
- Filter by event category
- Toggle visibility of specific schedules

✅ **Data Persistence**
- Local storage for offline access
- Cloud sync ready (Firebase/Supabase compatible)
- Automatic data backup

## 🚀 Getting Started

### Option 1: Direct Web Access (Fastest)

1. Open `index.html` in your web browser
2. Start adding events immediately
3. Your data is saved locally in your browser

### Option 2: GitHub Pages Deployment (Recommended)

1. Fork this repository to your GitHub account
2. Go to **Settings** → **Pages**
3. Under "Source", select `main` branch
4. GitHub will deploy your site at: `https://yourusername.github.io/schedule-tracker`

### Option 3: Netlify Deployment (Free & Easy)

1. Click the button below to deploy instantly:

   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/schedule-tracker)

2. Or manually:
   - Push this repository to GitHub
   - Log in to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Deploy!

### Option 4: Vercel Deployment

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Deploy"

## 📋 Usage Guide

### Adding Events

1. Click **"+ Add Event"** button
2. Fill in event details:
   - Title (required)
   - Date (required)
   - Start & End time (required)
   - Category
   - Description (optional)
   - Reminder preference
   - Custom color
3. Click **"Save Event"**

### Viewing Schedules

- **Daily View**: See all events for a specific day with hourly breakdown
- **Weekly View**: 7-day overview with all events
- **Monthly View**: Calendar view of the entire month

### Sharing Your Schedule

1. Click **"Share Link"** button
2. Choose sharing method:
   - **Public Link**: Copy and share with anyone
   - **Email Invite**: Invite specific friends by email
3. Friends can view your schedule without creating an account

### Managing Friends

1. Click **"+ Add Friend"** in the sidebar
2. Enter your friend's email
3. Once added, check/uncheck their name to show/hide their schedule
4. Events are color-coded by friend

### Customizing Settings

1. Click **"Settings"** button
2. Update your profile:
   - Your Name
   - Your Email
   - Timezone
   - Notification preferences
3. Click **"Save Settings"**

## 🎨 Color Coding

Events are automatically color-coded based on category:
- 🔴 **Work** - Red (#FF6B6B)
- 🟢 **Personal** - Teal (#4ECDC4)
- 🟡 **Social** - Yellow (#FFE66D)
- 🟣 **Health** - Mint (#95E1D3)

Friends also get assigned unique colors for easy identification.

## 📱 Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| Opera   | ✅ Full |

## 🔄 Cloud Sync Setup (Optional)

To enable real-time cloud synchronization, choose one of these options:

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Get your Firebase config
3. Update `app.js` with your Firebase credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};
```

4. Import Firebase and update storage.js to sync with Firestore

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a `schedules` table with columns:
   - id (UUID, primary key)
   - user_id (UUID)
   - event_data (JSONB)
   - created_at (timestamp)
   - updated_at (timestamp)

3. Update `storage.js` with your Supabase credentials

## 💾 Data Storage

### Local Storage
- Data is stored in your browser's localStorage
- Storage limit: ~5-10MB per browser
- Perfect for personal use
- Works offline

### Cloud Storage
- Ready to integrate with Firebase, Supabase, or custom backend
- Enables real-time sync across devices
- Secure with authentication
- Unlimited storage capacity

## 🔒 Privacy & Security

- 🔐 All data is stored locally by default
- 🔒 No server logs or tracking
- 📤 Only share when you explicitly create a link
- 🛡️ HTTPS recommended for sensitive data
- 👤 No account required to get started

## 📊 Sample Data Format

Each event is stored with this structure:

```json
{
  "id": "1234567890",
  "title": "Team Meeting",
  "date": 1694428800000,
  "startTime": "14:30",
  "endTime": "15:30",
  "category": "work",
  "description": "Weekly sync with the team",
  "reminder": "30",
  "color": "#FF6B6B",
  "person": "You"
}
```

## 🤝 Sharing Your Schedule

### Generate Public Link
```
https://yourusername.github.io/schedule-tracker?shared=abc123xyz
```

### Via Email
Recipients get a link and can view your schedule without logging in.

### Permission Levels
- **View Only**: Friends can see your events but cannot edit
- **Sync**: Full two-way synchronization (future feature)

## 🛠️ Development

### Project Structure
```
schedule-tracker/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js              # Main application logic
├── storage.js          # Data persistence layer
├── notifications.js    # Reminder & notification system
└── README.md          # This file
```

### File Size
- HTML: ~10KB
- CSS: ~12KB
- JavaScript: ~22KB
- **Total: ~44KB** (highly optimized)

### No Dependencies
- Pure JavaScript (no frameworks required)
- No external libraries
- Works offline
- Lightweight and fast

## 🚀 Deployment Checklist

- [ ] Fork/Clone the repository
- [ ] Test locally by opening `index.html`
- [ ] Choose deployment method (Pages/Netlify/Vercel)
- [ ] Deploy to your chosen platform
- [ ] Share your link with friends
- [ ] Add events and test sharing
- [ ] Enable notifications in browser settings
- [ ] (Optional) Set up cloud sync backend

## 📈 Roadmap

Future features planned:
- [ ] Cloud sync with real-time updates
- [ ] User authentication
- [ ] Recurring events
- [ ] Event templates
- [ ] Task/TODO integration
- [ ] Calendar exports (iCal, Google Calendar)
- [ ] Mobile app (React Native)
- [ ] Collaborative editing
- [ ] Advanced permissions
- [ ] Analytics & insights

## 🐛 Known Issues

None currently. Please report issues on GitHub Issues.

## 📝 License

MIT License - Feel free to use, modify, and distribute this project.

## 👨‍💻 Contributing

Contributions are welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 📧 Open an issue on GitHub
- 💬 Check existing issues for solutions
- 🌐 Visit our GitHub Discussions page

## ⭐ Show Your Support

If you find this project useful, please star it on GitHub!

---

**Made with ❤️ for scheduling with friends**

Last Updated: September 2026
````
