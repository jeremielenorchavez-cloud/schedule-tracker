// Schedule Tracker - Main Application Logic
class ScheduleTracker {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'daily';
        this.events = [];
        this.friends = [];
        this.currentUser = null;
        this.editingEventId = null;
        this.categoryColors = {
            work: '#FF6B6B',
            personal: '#4ECDC4',
            social: '#FFE66D',
            health: '#95E1D3'
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupShareLink();
        this.renderCurrentView();
    }

    // Setup Event Listeners
    setupEventListeners() {
        // Tab Navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchView(e.target.dataset.view));
        });

        // Date Navigation
        document.getElementById('prevBtn').addEventListener('click', () => this.previousDate());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextDate());
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());
        document.getElementById('dateInput').addEventListener('change', (e) => {
            this.currentDate = new Date(e.target.value);
            this.renderCurrentView();
        });

        // Action Buttons
        document.getElementById('shareLinkBtn').addEventListener('click', () => this.showShareModal());
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettingsModal());
        document.getElementById('addFriendBtn').addEventListener('click', () => this.showAddFriendModal());

        // Event Form
        document.getElementById('eventForm').addEventListener('submit', (e) => this.saveEvent(e));
        document.getElementById('deleteEventBtn').addEventListener('click', () => this.deleteEvent());

        // Friend Filters
        document.getElementById('friend-self').addEventListener('change', () => this.renderCurrentView());

        // Category Filters
        document.querySelectorAll('#categoryFilter input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.renderCurrentView());
        });

        // Modal Close
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.remove('active');
            });
        });

        // Add Event Button (floating action in daily view)
        document.addEventListener('dblclick', () => this.showEventModal());
    }

    // View Management
    switchView(view) {
        this.currentView = view;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        document.getElementById(view + 'View').classList.add('active');

        this.renderCurrentView();
    }

    renderCurrentView() {
        if (this.currentView === 'daily') {
            this.renderDailyView();
        } else if (this.currentView === 'weekly') {
            this.renderWeeklyView();
        } else if (this.currentView === 'monthly') {
            this.renderMonthlyView();
        }
    }

    // Daily View
    renderDailyView() {
        const container = document.getElementById('dailySchedule');
        container.innerHTML = '';

        const dateStr = this.formatDate(this.currentDate);
        document.getElementById('dateInput').value = dateStr;

        // Create 24-hour timeline
        for (let hour = 0; hour < 24; hour++) {
            const hourDiv = document.createElement('div');
            hourDiv.className = 'daily-hour';

            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.textContent = this.formatTime(hour, 0);

            const eventsSlot = document.createElement('div');
            eventsSlot.className = 'events-slot';

            // Get events for this hour
            const hourEvents = this.getEventsForHour(this.currentDate, hour);
            hourEvents.forEach(event => {
                eventsSlot.appendChild(this.createEventCard(event));
            });

            hourDiv.appendChild(timeSlot);
            hourDiv.appendChild(eventsSlot);
            container.appendChild(hourDiv);
        }

        // Add button to create new event
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary';
        addBtn.textContent = '+ Add Event';
        addBtn.style.margin = '20px 0';
        addBtn.addEventListener('click', () => this.showEventModal());
        container.appendChild(addBtn);
    }

    // Weekly View
    renderWeeklyView() {
        const container = document.getElementById('weeklySchedule');
        container.innerHTML = '';

        const weekStart = this.getWeekStart(this.currentDate);
        const grid = document.createElement('div');
        grid.className = 'weekly-grid';

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(weekStart);
            dayDate.setDate(dayDate.getDate() + i);

            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';

            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.innerHTML = `
                <div>${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayDate.getDay()]}</div>
                <div class="day-date">${dayDate.getDate()}</div>
            `;

            const dayEvents = document.createElement('div');
            dayEvents.className = 'day-events';

            const eventsForDay = this.getEventsForDay(dayDate);
            eventsForDay.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'day-event';
                eventDiv.style.backgroundColor = event.color || this.categoryColors[event.category];
                eventDiv.style.borderLeftColor = event.color || this.categoryColors[event.category];
                eventDiv.innerHTML = `
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">${event.startTime} - ${event.endTime}</div>
                `;
                eventDiv.addEventListener('click', () => this.editEvent(event));
                dayEvents.appendChild(eventDiv);
            });

            dayColumn.appendChild(dayHeader);
            dayColumn.appendChild(dayEvents);
            grid.appendChild(dayColumn);
        }

        container.appendChild(grid);

        // Add button
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary';
        addBtn.textContent = '+ Add Event';
        addBtn.style.margin = '20px 0';
        addBtn.addEventListener('click', () => this.showEventModal());
        container.appendChild(addBtn);
    }

    // Monthly View
    renderMonthlyView() {
        const container = document.getElementById('monthlySchedule');
        container.innerHTML = '';

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Calendar header
        const header = document.createElement('h3');
        header.textContent = `${['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month]} ${year}`;
        header.style.marginBottom = '20px';
        header.style.textAlign = 'center';
        header.style.color = 'var(--primary-color)';
        container.appendChild(header);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        // Day headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-header';
            header.textContent = day;
            grid.appendChild(header);
        });

        // First day of month
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let currentDate = new Date(startDate);

        while (currentDate <= lastDay || currentDate.getDay() !== 0) {
            const day = document.createElement('div');
            day.className = 'calendar-day';

            if (currentDate.getMonth() !== month) {
                day.classList.add('other-month');
            }

            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = currentDate.getDate();

            const dayEvents = document.createElement('div');
            dayEvents.className = 'calendar-day-events';

            const eventsForDay = this.getEventsForDay(currentDate);
            eventsForDay.slice(0, 3).forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'calendar-event';
                eventDiv.style.backgroundColor = event.color || this.categoryColors[event.category];
                eventDiv.style.color = 'white';
                eventDiv.textContent = event.title;
                eventDiv.addEventListener('click', () => this.editEvent(event));
                dayEvents.appendChild(eventDiv);
            });

            if (eventsForDay.length > 3) {
                const moreDiv = document.createElement('div');
                moreDiv.textContent = `+${eventsForDay.length - 3} more`;
                moreDiv.style.fontSize = '11px';
                moreDiv.style.padding = '4px 6px';
                dayEvents.appendChild(moreDiv);
            }

            day.appendChild(dayNumber);
            day.appendChild(dayEvents);
            grid.appendChild(day);

            currentDate.setDate(currentDate.getDate() + 1);
        }

        container.appendChild(grid);
    }

    // Event Management
    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.style.backgroundColor = event.color || this.categoryColors[event.category];
        card.style.borderLeftColor = event.color || this.categoryColors[event.category];
        card.style.color = 'white';

        const info = document.createElement('div');
        info.className = 'event-info';

        const title = document.createElement('div');
        title.className = 'event-title';
        title.textContent = event.title;

        const time = document.createElement('div');
        time.className = 'event-time';
        time.textContent = `${event.startTime} - ${event.endTime}`;

        const person = document.createElement('div');
        person.className = 'event-person';
        person.textContent = event.person || 'You';

        info.appendChild(title);
        info.appendChild(time);
        info.appendChild(person);
        card.appendChild(info);

        card.addEventListener('click', () => this.editEvent(event));

        return card;
    }

    showEventModal(date = null) {
        this.editingEventId = null;
        document.getElementById('modalTitle').textContent = 'Add Event';
        document.getElementById('deleteEventBtn').style.display = 'none';
        document.getElementById('eventForm').reset();

        const dateToUse = date || this.currentDate;
        document.getElementById('eventDate').value = this.formatDate(dateToUse);
        document.getElementById('eventColor').value = '#4A90E2';

        document.getElementById('eventModal').classList.add('active');
    }

    editEvent(event) {
        this.editingEventId = event.id;
        document.getElementById('modalTitle').textContent = 'Edit Event';
        document.getElementById('deleteEventBtn').style.display = 'block';

        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDate').value = this.formatDate(new Date(event.date));
        document.getElementById('eventStartTime').value = event.startTime;
        document.getElementById('eventEndTime').value = event.endTime;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventDescription').value = event.description || '';
        document.getElementById('eventReminder').value = event.reminder || 'none';
        document.getElementById('eventColor').value = event.color || this.categoryColors[event.category];

        document.getElementById('eventModal').classList.add('active');
    }

    saveEvent(e) {
        e.preventDefault();

        const event = {
            id: this.editingEventId || Date.now().toString(),
            title: document.getElementById('eventTitle').value,
            date: new Date(document.getElementById('eventDate').value).getTime(),
            startTime: document.getElementById('eventStartTime').value,
            endTime: document.getElementById('eventEndTime').value,
            category: document.getElementById('eventCategory').value,
            description: document.getElementById('eventDescription').value,
            reminder: document.getElementById('eventReminder').value,
            color: document.getElementById('eventColor').value,
            person: this.currentUser?.name || 'You'
        };

        if (this.editingEventId) {
            const index = this.events.findIndex(e => e.id === this.editingEventId);
            if (index !== -1) {
                this.events[index] = event;
            }
        } else {
            this.events.push(event);
        }

        this.saveData();
        this.renderCurrentView();
        this.closeModal();
        this.showNotification('Event saved successfully!', 'success');
    }

    deleteEvent() {
        if (this.editingEventId) {
            this.events = this.events.filter(e => e.id !== this.editingEventId);
            this.saveData();
            this.renderCurrentView();
            this.closeModal();
            this.showNotification('Event deleted successfully!', 'success');
        }
    }

    // Date Helpers
    previousDate() {
        if (this.currentView === 'daily') {
            this.currentDate.setDate(this.currentDate.getDate() - 1);
        } else if (this.currentView === 'weekly') {
            this.currentDate.setDate(this.currentDate.getDate() - 7);
        } else if (this.currentView === 'monthly') {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        }
        this.renderCurrentView();
    }

    nextDate() {
        if (this.currentView === 'daily') {
            this.currentDate.setDate(this.currentDate.getDate() + 1);
        } else if (this.currentView === 'weekly') {
            this.currentDate.setDate(this.currentDate.getDate() + 7);
        } else if (this.currentView === 'monthly') {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        }
        this.renderCurrentView();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCurrentView();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    formatTime(hour, minute) {
        const h = String(hour).padStart(2, '0');
        const m = String(minute).padStart(2, '0');
        return `${h}:${m}`;
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    getEventsForHour(date, hour) {
        const dateStr = this.formatDate(date);
        return this.events.filter(event => {
            const eventDate = this.formatDate(new Date(event.date));
            const eventHour = parseInt(event.startTime.split(':')[0]);
            return eventDate === dateStr && eventHour === hour && this.isEventVisible(event);
        });
    }

    getEventsForDay(date) {
        const dateStr = this.formatDate(date);
        return this.events.filter(event => {
            const eventDate = this.formatDate(new Date(event.date));
            return eventDate === dateStr && this.isEventVisible(event);
        }).sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    isEventVisible(event) {
        const categoryCheckbox = document.getElementById(`cat-${event.category}`);
        return categoryCheckbox && categoryCheckbox.checked;
    }

    // Modals
    showShareModal() {
        const shareLink = `${window.location.origin}?shared=${this.generateShareCode()}`;
        document.getElementById('shareLink').value = shareLink;
        document.getElementById('shareModal').classList.add('active');
    }

    showSettingsModal() {
        if (this.currentUser) {
            document.getElementById('userName').value = this.currentUser.name || '';
            document.getElementById('userEmail').value = this.currentUser.email || '';
        }
        document.getElementById('settingsModal').classList.add('active');
    }

    showAddFriendModal() {
        const friendEmail = prompt('Enter your friend\'s email:');
        if (friendEmail) {
            if (!this.friends.includes(friendEmail)) {
                this.friends.push(friendEmail);
                this.saveData();
                this.addFriendToUI(friendEmail);
                this.showNotification(`Friend ${friendEmail} added!`, 'success');
            } else {
                this.showNotification('Friend already added!', 'warning');
            }
        }
    }

    addFriendToUI(email) {
        const friendList = document.getElementById('friendList');
        const friendDiv = document.createElement('div');
        friendDiv.className = 'friend-item';

        const color = this.getColorForFriend(email);
        const friendName = email.split('@')[0];

        friendDiv.innerHTML = `
            <input type="checkbox" id="friend-${email}" checked>
            <label for="friend-${email}" style="background-color: ${color};">${friendName}</label>
        `;

        const checkbox = friendDiv.querySelector('input');
        checkbox.addEventListener('change', () => this.renderCurrentView());

        friendList.appendChild(friendDiv);
    }

    getColorForFriend(email) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#A8E6CF'];
        return colors[this.friends.indexOf(email) % colors.length];
    }

    generateShareCode() {
        return Math.random().toString(36).substr(2, 9);
    }

    setupShareLink() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('shared')) {
            this.showNotification('You\'re viewing a shared schedule!', 'info');
        }
    }

    // Notifications
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ',
            warning: '⚠'
        };

        notification.innerHTML = `
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close">×</button>
        `;

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        container.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Data Management
    loadData() {
        const saved = localStorage.getItem('scheduleTrackerData');
        if (saved) {
            const data = JSON.parse(saved);
            this.events = data.events || [];
            this.friends = data.friends || [];
            this.currentUser = data.currentUser || null;
        }
    }

    saveData() {
        const data = {
            events: this.events,
            friends: this.friends,
            currentUser: this.currentUser
        };
        localStorage.setItem('scheduleTrackerData', JSON.stringify(data));
    }
}

// Close Modal Functions
function closeModal() {
    document.getElementById('eventModal').classList.remove('active');
}

function closeShareModal() {
    document.getElementById('shareModal').classList.remove('active');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active');
}

function copyToClipboard() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    document.execCommand('copy');
    
    const tracker = window.tracker;
    if (tracker) {
        tracker.showNotification('Link copied to clipboard!', 'success');
    }
}

function saveSettings() {
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;

    if (!window.tracker) {
        window.tracker = new ScheduleTracker();
    }

    window.tracker.currentUser = {
        name: userName,
        email: userEmail
    };

    window.tracker.saveData();
    window.tracker.showNotification('Settings saved!', 'success');
    closeSettingsModal();
}

function inviteFriend() {
    const email = document.getElementById('friendEmail').value;
    if (email) {
        if (!window.tracker) {
            window.tracker = new ScheduleTracker();
        }
        
        // In a real app, this would send an email invite
        window.tracker.showNotification(`Invite sent to ${email}!`, 'success');
        document.getElementById('friendEmail').value = '';
    }
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
    window.tracker = new ScheduleTracker();
});