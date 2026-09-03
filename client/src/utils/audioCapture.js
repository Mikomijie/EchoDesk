export class AudioCapture {
  constructor() {
    this.recognition = null;
    this.stream = null;
    this.isListening = false;
  }

  async start(onTranscript) {
    try {
      // First, request microphone access explicitly
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      console.log('✅ Microphone access granted');

      // Initialize Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert('❌ Speech Recognition not supported. Use Chrome, Edge, or Safari.');
        return false;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.isListening = true;

      let interimText = '';

      this.recognition.onstart = () => {
        console.log('🎤 Speech recognition STARTED - listening now...');
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        interimText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log(`📝 ${event.results[i].isFinal ? 'FINAL' : 'interim'}: ${transcript}`);

          if (event.results[i].isFinal) {
            // Send final result to callback
            onTranscript(transcript, true);
          } else {
            interimText += transcript;
          }
        }
      };

      this.recognition.onerror = (event) => {
        console.error('🔴 Speech error:', event.error);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended, restarting...');
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            console.log('Restart failed, will try again');
          }
        }
      };

      // START LISTENING
      this.recognition.start();
      console.log('🚀 Waiting for speech...');
      return true;

    } catch (err) {
      console.error('❌ Error:', err.name, err.message);
      if (err.name === 'NotAllowedError') {
        alert('Microphone access DENIED. Click allow when browser asks.');
      } else if (err.name === 'NotFoundError') {
        alert('No microphone found. Connect a mic.');
      } else {
        alert('Error: ' + err.message);
      }
      return false;
    }
  }

  stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {
        console.log('Recognition already stopped');
      }
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}