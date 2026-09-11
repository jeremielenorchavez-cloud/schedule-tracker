// Notifications & Reminders System
class NotificationManager {
    constructor() {
        this.reminders = [];
        this.enabledNotifications = true;
        this.checkInterval = 60000; // Check every minute
        this.init();
    }

    init() {
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // Start checking for reminders
        this.startReminderCheck();
    }

    startReminderCheck() {
        setInterval(() => {
            this.checkReminders();
        }, this.checkInterval);
    }

    addReminder(event, minutesBefore) {
        if (!event.reminder || event.reminder === 'none') return;

        const eventTime = new Date(event.date);
        const [hours, minutes] = event.startTime.split(':');
        eventTime.setHours(parseInt(hours), parseInt(minutes), 0);

        const reminderTime = new Date(eventTime.getTime() - minutesBefore * 60000);

        this.reminders.push({
            eventId: event.id,
            eventTitle: event.title,
            reminderTime: reminderTime,
            notified: false
        });
    }

    checkReminders() {
        const now = new Date();

        this.reminders.forEach(reminder => {
            if (!reminder.notified && now >= reminder.reminderTime) {
                this.sendNotification(reminder);
                reminder.notified = true;
            }
        });

        // Clean up old reminders
        this.reminders = this.reminders.filter(r => r.reminderTime > now);
    }

    sendNotification(reminder) {
        if (!this.enabledNotifications) return;

        const title = 'Schedule Reminder';
        const options = {
            body: `Upcoming: ${reminder.eventTitle}`,
            icon: '📅',
            badge: '📅',
            tag: `reminder-${reminder.eventId}`,
            requireInteraction: false
        };

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, options);
        }

        // Also show in-app notification
        if (window.tracker) {
            window.tracker.showNotification(`Reminder: ${reminder.eventTitle}`, 'info');
        }
    }

    toggleNotifications(enabled) {
        this.enabledNotifications = enabled;
    }

    clearReminders() {
        this.reminders = [];
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationManager;
}