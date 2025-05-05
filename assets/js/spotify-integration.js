// Spotify API Configuration
const SPOTIFY_CLIENT_ID = '573805aedac64955829435745536cf78';
const SPOTIFY_REDIRECT_URI = 'https://danco-analytics.github.io/Portifolio/';
const SPOTIFY_SCOPES = [
    'streaming',
    'user-read-email',
    'user-read-private',
    'user-read-playback-state',
    'user-modify-playback-state'
].join(' ');

// Playlist IDs for different moods
const PLAYLISTS = {
    focus: '37i9dQZF1DX5trt9i14X7j',    // Deep Focus
    energy: '37i9dQZF1DX8dTWjpijlub',    // High Energy
    chill: '37i9dQZF1DX0jgyAiPl8Af',     // Chill Vibes
    debug: '37i9dQZF1DX5trt9i14X7j'      // Debug Mode (using focus playlist as default)
};

class SpotifyIntegration {
    constructor() {
        this.player = null;
        this.deviceId = null;
        this.isAuthenticated = false;
        this.currentTrack = null;
        this.isPlaying = false;

        // Initialize UI elements
        this.initializeUI();
        this.setupEventListeners();
        this.checkAuthentication();
    }

    initializeUI() {
        // Auth button
        this.authButton = document.getElementById('spotify-auth');
        
        // Player controls
        this.playPauseButton = document.getElementById('play-pause');
        this.prevButton = document.getElementById('prev-track');
        this.nextButton = document.getElementById('next-track');
        this.nowPlayingTitle = document.getElementById('now-playing-title');
        this.nowPlayingArtist = document.getElementById('now-playing-artist');
        this.nowPlayingArt = document.getElementById('now-playing-art');
        
        // Mood buttons
        this.moodButtons = document.querySelectorAll('.mood-btn');
    }

    setupEventListeners() {
        // Auth button click
        if (this.authButton) {
            this.authButton.addEventListener('click', () => this.authenticate());
        }

        // Player control events
        if (this.playPauseButton) {
            this.playPauseButton.addEventListener('click', () => this.togglePlayback());
        }
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.previousTrack());
        }
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextTrack());
        }

        // Mood button events
        this.moodButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mood = e.currentTarget.dataset.mood;
                if (mood && PLAYLISTS[mood]) {
                    this.playPlaylist(PLAYLISTS[mood]);
                    this.showToast(`Playing ${e.currentTarget.textContent.trim()} playlist`);
                }
            });
        });
    }

    authenticate() {
        const state = this.generateRandomString(16);
        localStorage.setItem('spotify_auth_state', state);

        const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
            response_type: 'token',
            client_id: SPOTIFY_CLIENT_ID,
            scope: SPOTIFY_SCOPES,
            redirect_uri: SPOTIFY_REDIRECT_URI,
            state: state
        }).toString();

        window.location = authUrl;
    }

    checkAuthentication() {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        const state = params.get('state');
        const storedState = localStorage.getItem('spotify_auth_state');

        if (accessToken && state === storedState) {
            this.handleAuthSuccess(accessToken);
        }
    }

    async handleAuthSuccess(token) {
        this.accessToken = token;
        this.isAuthenticated = true;
        localStorage.setItem('spotify_access_token', token);

        // Update UI
        if (this.authButton) {
            this.authButton.textContent = 'Connected to Spotify';
            this.authButton.classList.add('bg-green-500');
        }

        // Initialize Spotify Web Playback SDK
        await this.initializePlayer();
    }

    async initializePlayer() {
        if (!this.isAuthenticated) return;

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            this.player = new Spotify.Player({
                name: "Daniel's Portfolio Player",
                getOAuthToken: cb => cb(this.accessToken),
                volume: 0.5
            });

            this.player.addListener('ready', ({ device_id }) => {
                this.deviceId = device_id;
                this.showToast('Spotify player ready');
            });

            this.player.addListener('not_ready', () => {
                this.showToast('Spotify player disconnected');
            });

            this.player.addListener('player_state_changed', state => {
                this.updatePlayerState(state);
            });

            this.player.connect();
        };
    }

    async playPlaylist(playlistId) {
        if (!this.isAuthenticated || !this.deviceId) {
            this.showToast('Please connect to Spotify first');
            return;
        }

        try {
            await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    context_uri: `spotify:playlist:${playlistId}`,
                    position_ms: 0
                })
            });
        } catch (error) {
            this.showToast('Error playing playlist');
            console.error('Error playing playlist:', error);
        }
    }

    updatePlayerState(state) {
        if (!state) return;

        this.isPlaying = !state.paused;
        this.currentTrack = state.track_window.current_track;

        // Update play/pause button
        if (this.playPauseButton) {
            this.playPauseButton.innerHTML = this.isPlaying ? 
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>';
        }

        // Update track info
        if (this.nowPlayingTitle) {
            this.nowPlayingTitle.textContent = this.currentTrack.name;
        }
        if (this.nowPlayingArtist) {
            this.nowPlayingArtist.textContent = this.currentTrack.artists.map(a => a.name).join(', ');
        }
        if (this.nowPlayingArt) {
            this.nowPlayingArt.style.backgroundImage = `url(${this.currentTrack.album.images[0].url})`;
            this.nowPlayingArt.style.backgroundSize = 'cover';
        }
    }

    async togglePlayback() {
        if (!this.player) return;
        await this.player.togglePlay();
    }

    async previousTrack() {
        if (!this.player) return;
        await this.player.previousTrack();
    }

    async nextTrack() {
        if (!this.player) return;
        await this.player.nextTrack();
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg bg-accent dark:bg-dark-accent text-white dark:text-jet-black text-sm font-medium shadow-lg z-50 toast-enter';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    generateRandomString(length) {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from(crypto.getRandomValues(new Uint8Array(length)))
            .map(x => possible[x % possible.length])
            .join('');
    }
}

// Initialize Spotify integration when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.spotifyIntegration = new SpotifyIntegration();
}); 