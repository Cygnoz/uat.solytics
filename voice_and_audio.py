import os
import tempfile
import streamlit as st
import sounddevice as sd
from scipy.io.wavfile import write
import speech_recognition as sr
from gtts import gTTS

class VoiceHandler:
    def get_voice_input(self):
        """Capture voice input from the user."""
        duration = 5  # seconds
        fs = 16000  # Sample rate (16kHz)
        st.info("Listening... Speak now!")

        # Record audio from microphone
        audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()  # Wait until the recording is finished

        # Save the recorded audio to a temporary file
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        write(temp_file.name, fs, audio_data)

        # Use speech recognition to transcribe the audio
        try:
            recognizer = sr.Recognizer()
            with sr.AudioFile(temp_file.name) as source:
                audio = recognizer.record(source)
                text = recognizer.recognize_google(audio)
                st.success(f"Recognized voice input: {text}")
                os.remove(temp_file.name)  # Clean up temporary file
                return text
        except Exception as e:
            st.error(f"Error recognizing speech: {str(e)}")
            os.remove(temp_file.name)  # Clean up temporary file
        return ""

    def text_to_speech(self, response_text):
        """Convert text response to speech."""
        # Generate the speech audio
        tts = gTTS(text=response_text, lang='en')
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            temp_file = fp.name
            tts.save(temp_file)
        
        # Use Streamlit's audio player to play the generated audio
        st.audio(temp_file, format="audio/mp3")
        
        # Suggest cleaning up the file after ensuring it's no longer needed
        st.session_state["temp_audio_file"] = temp_file