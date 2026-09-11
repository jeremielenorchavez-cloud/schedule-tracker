// Storage Management - Cloud Sync Support
class CloudStorage {
    constructor() {
        this.syncEnabled = false;
        this.lastSyncTime = null;
        this.pendingChanges = [];
    }

    // Local Storage
    saveLocally(data) {
        try {
            localStorage.setItem('scheduleTrackerData', JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Failed to save locally:', e);
            return false;
        }
    }

    loadLocally() {
        try {
            const data = localStorage.getItem('scheduleTrackerData');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load locally:', e);
            return null;
        }
    }

    // Cloud Sync (Ready for Firebase/Supabase integration)
    async syncToCloud(data) {
        if (!this.syncEnabled) return false;

        try {
            // Placeholder for cloud API call
            // In production, integrate with Firebase, Supabase, or custom backend
            const response = await fetch('/api/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.lastSyncTime = new Date();
                return true;
            }
        } catch (e) {
            console.error('Cloud sync failed:', e);
            this.pendingChanges.push(data);
        }
        return false;
    }

    async syncFromCloud() {
        if (!this.syncEnabled) return null;

        try {
            const response = await fetch('/api/sync');
            if (response.ok) {
                this.lastSyncTime = new Date();
                return await response.json();
            }
        } catch (e) {
            console.error('Cloud fetch failed:', e);
        }
        return null;
    }

    // Offline Queue
    addPendingChange(change) {
        this.pendingChanges.push({
            ...change,
            timestamp: new Date().toISOString()
        });
    }

    async syncPendingChanges() {
        if (this.pendingChanges.length === 0) return;

        for (let change of this.pendingChanges) {
            const success = await this.syncToCloud(change);
            if (success) {
                this.pendingChanges.shift();
            }
        }
    }

    hasPendingChanges() {
        return this.pendingChanges.length > 0;
    }

    getPendingChangesCount() {
        return this.pendingChanges.length;
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudStorage;
}