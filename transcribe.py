import queue
import sys
import json
import sounddevice as sd
import requests
from vosk import Model, KaldiRecognizer

# Path to the model folder
MODEL_PATH = "models/vosk-model-small-en-us-0.15"

# Server endpoint to send text to
SERVER_URL = "http://localhost:3000/broadcast"

q = queue.Queue()

def callback(indata, frames, time, status):
    if status:
        print(status, file=sys.stderr)
    q.put(bytes(indata))

def send_to_server(text):
    try:
        requests.post(SERVER_URL, json={"text": text})
    except Exception as e:
        print(f"Error sending to server: {e}")

def main():
    print("Loading Vosk model...")
    model = Model(MODEL_PATH)
    samplerate = 16000

    with sd.RawInputStream(samplerate=samplerate, blocksize=8000, dtype='int16',
                            channels=1, callback=callback):
        rec = KaldiRecognizer(model, samplerate)
        print("Listening... Speak now. Press Ctrl+C to stop.")

        full_transcript = ""

        while True:
            data = q.get()
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                text = result.get("text", "")
                if text:
                    full_transcript += text + " "
                    print(full_transcript)
                    send_to_server(full_transcript)
            else:
                partial = json.loads(rec.PartialResult())
                # Optional: could send partial results too for lower latency

if __name__ == "__main__":
    main()