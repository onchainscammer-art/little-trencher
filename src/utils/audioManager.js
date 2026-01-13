/**
 * AudioManager - HTML5 Audio-based background music system
 * Defensive coding: If audio fails, game continues without sound
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.isInitialized = false;
    this.backgroundMusic = null;
    this.musicLoaded = false;
  }

  /**
   * Initialize audio system (must be called after user interaction)
   */
  async init() {
    if (this.isInitialized) return true;

    try {
      // Create audio context for sound effects (coin pickup)
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3; // Overall volume for effects
        this.masterGain.connect(this.audioContext.destination);
      }

      // Load background music using HTML5 Audio
      this.backgroundMusic = new Audio('/traingameaudio.ogg');
      this.backgroundMusic.loop = true; // Infinite loop
      this.backgroundMusic.volume = 0.15; // 15% volume

      // Preload the audio
      try {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.warn('Background music loading timeout');
            resolve(); // Continue anyway
          }, 5000); // 5 second timeout

          this.backgroundMusic.addEventListener('canplaythrough', () => {
            clearTimeout(timeout);
            this.musicLoaded = true;
            resolve();
          }, { once: true });

          this.backgroundMusic.addEventListener('error', (e) => {
            clearTimeout(timeout);
            console.warn('Failed to load background music:', e);
            resolve(); // Resolve anyway to not block game
          }, { once: true });

          this.backgroundMusic.load();
        });
      } catch (error) {
        console.warn('Background music preload failed:', error);
      }

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.warn('Failed to initialize audio:', error);
      return false;
    }
  }

  /**
   * Play coin pickup sound - pleasant "ding"
   * High-pitched sine wave with quick attack/decay
   */
  playCoinSound() {
    if (!this.audioContext || !this.masterGain) return;

    try {
      const now = this.audioContext.currentTime;

      // Create oscillator for coin sound
      const osc = this.audioContext.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now); // Start at 800Hz
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05); // Rise to 1200Hz

      // Create gain envelope (ADSR)
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Attack
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15); // Decay

      // Connect nodes
      osc.connect(gainNode);
      gainNode.connect(this.masterGain);

      // Play and cleanup
      osc.start(now);
      osc.stop(now + 0.2);
      osc.onended = () => {
        osc.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.warn('Failed to play coin sound:', error);
    }
  }

  /**
   * Start background music - plays traingameaudio.ogg
   * Only called after user interaction (start game button)
   */
  startBackgroundMusic() {
    if (!this.backgroundMusic) {
      console.warn('Background music not initialized');
      return;
    }

    try {
      // Reset to beginning
      this.backgroundMusic.currentTime = 0;

      // Play (returns a promise)
      const playPromise = this.backgroundMusic.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Background music started successfully');
          })
          .catch(error => {
            console.warn('Failed to start background music:', error);
          });
      }
    } catch (error) {
      console.warn('Failed to start background music:', error);
    }
  }

  /**
   * Stop background music
   */
  stopBackgroundMusic() {
    if (!this.backgroundMusic) return;

    try {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    } catch (error) {
      console.warn('Failed to stop background music:', error);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopBackgroundMusic();
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {
        // Ignore
      }
    }
    this.isInitialized = false;
  }
}

// Singleton instance
const audioManager = new AudioManager();

export default audioManager;
