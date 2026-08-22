import os
import certifi
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
os.environ['SSL_CERT_FILE'] = certifi.where()
os.environ['REQUESTS_CA_BUNDLE'] = certifi.where()
import assemblyai as aai
from assemblyai.streaming.v3 import (
    StreamingClient,
    StreamingClientOptions,
    StreamingEvents,
    StreamingParameters,
    TurnEvent,
)
import sounddevice as sd
import requests
import os
import queue
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
SERVER_URL = "http://localhost:3000/broadcast"
SAMPLE_RATE = 16000

full_transcript = ""
audio_queue = queue.Queue()

def send_to_server(text):
    try:
        requests.post(SERVER_URL, json={"text": text})
    except Exception as e:
        print(f"Error sending to server: {e}")

def on_turn(self, event: TurnEvent):
    global full_transcript
    if event.transcript and event.end_of_turn:
        full_transcript += event.transcript + "\n"
        print(full_transcript)
        send_to_server(full_transcript)

def on_error(self, error):
    print(f"Error: {error}")

def audio_callback(indata, frames, time, status):
    if status:
        print(status)
    audio_queue.put(bytes(indata))

def audio_generator():
    while True:
        yield audio_queue.get()

def main():
    print("Connecting to AssemblyAI...")
    client = StreamingClient(
        StreamingClientOptions(
            api_key=API_KEY,
            api_host="streaming.assemblyai.com",
        )
    )

    client.on(StreamingEvents.Turn, on_turn)
    client.on(StreamingEvents.Error, on_error)

    client.connect(
        StreamingParameters(
            sample_rate=SAMPLE_RATE,
            continuous_partials=True,
        )
    )

    print("Listening... Speak now. Press Ctrl+C to stop.")

    with sd.RawInputStream(samplerate=SAMPLE_RATE, blocksize=3200, dtype='int16',
                            channels=1, callback=audio_callback):
        try:
            client.stream(audio_generator())
        finally:
            client.disconnect(terminate=True)

if __name__ == "__main__":
    main()