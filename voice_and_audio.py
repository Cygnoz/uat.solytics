import os
import tempfile
from scipy.io.wavfile import write
import sounddevice as sd
from gtts import gTTS
import speech_recognition as sr

def get_voice_input():
    """
    Record voice input and transcribe it to text.

    Returns:
        str: Transcribed text from the voice input.
    """
    try:
        duration = 5  # seconds
        fs = 16000  # 16 kHz
        audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        write(temp_file.name, fs, audio_data)

        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_file.name) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
        os.remove(temp_file.name)
        return text
    except Exception as e:
        return f"Error capturing or transcribing voice input: {e}"

def text_to_speech(response_text):
    """
    Convert text to speech and save as an audio file.

    Args:
        response_text (str): Text to convert into speech.

    Returns:
        str: Filepath to the generated audio file.
    """
    try:
        tts = gTTS(text=response_text, lang='en')
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
        tts.save(temp_file.name)
        return temp_file.name
    except Exception as e:
        return f"Error generating speech: {e}"
