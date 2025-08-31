// Simple browser-based Text-to-Speech service
// In production, this would be replaced with Google Cloud TTS API calls

export class AudioService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices() {
    // Load available voices
    const updateVoices = () => {
      this.voices = this.synthesis.getVoices();
    };

    updateVoices();
    
    // Some browsers load voices asynchronously
    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = updateVoices;
    }
  }

  private getChineseVoice(): SpeechSynthesisVoice | null {
    // Try to find a Chinese voice
    const chineseVoices = this.voices.filter(voice => 
      voice.lang.includes('zh') || 
      voice.name.toLowerCase().includes('chinese') ||
      voice.name.toLowerCase().includes('mandarin')
    );

    if (chineseVoices.length > 0) {
      // Prefer mainland Chinese (zh-CN) if available
      const mandarinVoice = chineseVoices.find(voice => voice.lang === 'zh-CN');
      return mandarinVoice || chineseVoices[0];
    }

    return null;
  }

  async playPronunciation(text: string, pinyin?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to use Chinese voice
        const chineseVoice = this.getChineseVoice();
        if (chineseVoice) {
          utterance.voice = chineseVoice;
          utterance.lang = chineseVoice.lang;
        } else {
          // Fallback to system default with Chinese language code
          utterance.lang = 'zh-CN';
        }

        // Set speech parameters
        utterance.rate = 0.8; // Slightly slower for learning
        utterance.pitch = 1.0;
        utterance.volume = 0.8;

        // Set up event listeners
        utterance.onend = () => resolve();
        utterance.onerror = (event) => {
          console.warn('Speech synthesis error:', event.error);
          // Don't reject, as this is not critical for the app functionality
          resolve();
        };

        // Play the speech
        this.synthesis.speak(utterance);
      } catch (error) {
        console.warn('Text-to-speech not available:', error);
        resolve(); // Don't fail the app if TTS is not available
      }
    });
  }

  // Check if TTS is supported
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  // Get available Chinese voices info for debugging
  getAvailableChineseVoices(): string[] {
    return this.voices
      .filter(voice => 
        voice.lang.includes('zh') || 
        voice.name.toLowerCase().includes('chinese') ||
        voice.name.toLowerCase().includes('mandarin')
      )
      .map(voice => `${voice.name} (${voice.lang})`);
  }
}

export const audioService = new AudioService();