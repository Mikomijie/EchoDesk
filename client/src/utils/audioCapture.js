export class AudioCapture {
  constructor() {
    this.recognition = null;
    this.stream = null;
    this.isListening = false;
    this.restartTimeout = null;
  }

  async start(onTranscript) {
    try {
      // Request microphone
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      console.log('✅ Microphone access granted');

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('❌ Speech Recognition not supported. Use Chrome, Edge, or Safari.');
        return false;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
      this.isListening = true;

      this.recognition.onstart = () => {
        console.log('🎤 Listening...');
      };

      this.recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            console.log('✅ FINAL:', transcript);
            if (transcript.trim()) {
              onTranscript(transcript, true);
            }
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.error('🔴 Error:', event.error);
      };

      this.recognition.onend = () => {
        console.log('Speech ended');
        if (this.isListening) {
          // Wait 100ms before restarting
          this.restartTimeout = setTimeout(() => {
            try {
              this.recognition.start();
            } catch (e) {
              console.log('Will restart shortly');
            }
          }, 100);
        }
      };

      this.recognition.start();
      return true;

    } catch (err) {
      console.error('❌ Error:', err.name, err.message);
      alert('Microphone error: ' + err.message);
      return false;
    }
  }

  stop() {
    this.isListening = false;
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}