// Simple Analytics Implementation
const Analytics = {
    storageKey: 'site_analytics',
    
    init() {
        this.loadData();
        this.trackVisit();
        this.setupListeners();
        this.startSessionTimer();
    },

    loadData() {
        this.data = JSON.parse(localStorage.getItem(this.storageKey) || '{"visits":[],"pageViews":{}}');
    },

    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    },

    trackVisit() {
        const visit = {
            timestamp: new Date().toISOString(),
            browser: this.getBrowserInfo(),
            os: this.getOSInfo(),
            screen: `${window.screen.width}x${window.screen.height}`,
            duration: 0,
            pages: [window.location.pathname]
        };
        
        this.data.visits = this.data.visits || [];
        this.data.visits.push(visit);
        this.saveData();
    },

    startSessionTimer() {
        this.sessionStart = new Date();
        window.addEventListener('beforeunload', () => {
            const duration = Math.round((new Date() - this.sessionStart) / 1000);
            if (this.data.visits.length > 0) {
                this.data.visits[this.data.visits.length - 1].duration = duration;
                this.saveData();
            }
        });
    },

    getBrowserInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Edge')) return 'Edge';
        if (ua.includes('Opera')) return 'Opera';
        return 'Other';
    },

    getOSInfo() {
        const ua = navigator.userAgent;
        if (ua.includes('Windows')) return 'Windows';
        if (ua.includes('Mac')) return 'MacOS';
        if (ua.includes('Linux')) return 'Linux';
        if (ua.includes('Android')) return 'Android';
        if (ua.includes('iOS')) return 'iOS';
        return 'Other';
    },

    setupListeners() {
        // Listen for Ctrl+Shift+A to open dashboard
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
                this.showDashboard();
            }
        });

        // Setup dashboard close button
        const closeBtn = document.getElementById('close-analytics');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                document.getElementById('analytics-dashboard').classList.add('hidden');
            });
        }
    },

    showDashboard() {
        const dashboard = document.getElementById('analytics-dashboard');
        if (!dashboard) return;

        this.updateDashboardStats();
        dashboard.classList.remove('hidden');
    },

    updateDashboardStats() {
        // Update total visits
        document.getElementById('total-visits').textContent = this.data.visits.length;

        // Update average duration
        const totalDuration = this.data.visits.reduce((acc, visit) => acc + (visit.duration || 0), 0);
        const avgDuration = Math.round(totalDuration / this.data.visits.length);
        document.getElementById('avg-duration').textContent = `${Math.floor(avgDuration / 60)}m ${avgDuration % 60}s`;

        // Update most viewed page
        const pageViews = this.data.pageViews || {};
        const mostViewed = Object.entries(pageViews).sort((a, b) => b[1] - a[1])[0];
        document.getElementById('most-viewed').textContent = mostViewed ? mostViewed[0] : '-';

        // Update active today
        const today = new Date().toDateString();
        const activeToday = this.data.visits.filter(v => new Date(v.timestamp).toDateString() === today).length;
        document.getElementById('active-today').textContent = activeToday;

        // Update recent visits
        const recentVisitsEl = document.getElementById('recent-visits');
        recentVisitsEl.innerHTML = this.data.visits.slice(-5).reverse().map(visit => `
            <div class="text-sm p-2 bg-accent/5 dark:bg-dark-accent/5 rounded">
                <div class="flex justify-between">
                    <span>${new Date(visit.timestamp).toLocaleString()}</span>
                    <span>${visit.duration}s</span>
                </div>
                <div class="text-xs text-secondary-text dark:text-dark-secondary-text">
                    ${visit.browser} on ${visit.os} (${visit.screen})
                </div>
            </div>
        `).join('');

        // Update device stats
        const deviceStats = document.getElementById('device-stats');
        const browsers = this.getStats('browser');
        const os = this.getStats('os');
        deviceStats.innerHTML = this.renderStats(browsers, 'Browsers') + this.renderStats(os, 'Operating Systems');
    },

    getStats(key) {
        const stats = {};
        this.data.visits.forEach(visit => {
            stats[visit[key]] = (stats[visit[key]] || 0) + 1;
        });
        return stats;
    },

    renderStats(stats, title) {
        const total = Object.values(stats).reduce((a, b) => a + b, 0);
        return `
            <div class="mb-4">
                <h4 class="text-sm font-semibold mb-2">${title}</h4>
                ${Object.entries(stats).map(([key, value]) => {
                    const percentage = Math.round((value / total) * 100);
                    return `
                        <div class="mb-2">
                            <div class="flex justify-between text-xs mb-1">
                                <span>${key}</span>
                                <span>${percentage}%</span>
                            </div>
                            <div class="h-2 bg-secondary-text/10 dark:bg-dark-secondary-text/10 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-accent to-accent-secondary dark:from-dark-accent dark:to-dark-accent-secondary rounded-full" style="width: ${percentage}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
};

// Initialize Analytics when the script loads
document.addEventListener('DOMContentLoaded', () => {
    Analytics.init();
}); 