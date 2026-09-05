export class AudioCapture {
  constructor() {
    this.mediaRecorder = null;
    this.stream = null;
    this.audioChunks = [];
    this.isRecording = false;
  }

  async start(onAudioChunk) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      console.log('✅ Microphone access granted');

      const options = { mimeType: 'audio/webm;codecs=opus' };
this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
          console.log('🎵 Audio chunk captured, size:', event.data.size);
          onAudioChunk(event.data);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('🔴 Recorder error:', event.error);
      };

      this.mediaRecorder.start(1000); // Send chunks every 1 second
      console.log('🎤 Recording started');
      return true;

    } catch (err) {
      console.error('❌ Error:', err.name, err.message);
      if (err.name === 'NotAllowedError') {
        alert('Microphone access denied. Please allow microphone.');
      } else if (err.name === 'NotFoundError') {
        alert('No microphone found.');
      }
      return false;
    }
  }

  stop() {
    this.isRecording = false;
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.audioChunks = [];
  }
}