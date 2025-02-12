import os
import tempfile
import streamlit as st
import sounddevice as sd
from scipy.io.wavfile import write
import speech_recognition as sr
from gtts import gTTS

class VoiceHandler:
    def handle_voice_interaction(self, user_input, bot_name, response_handler):
        """Handle voice input and response"""
        if user_input:
            bot_response = response_handler.get_response(
                user_input, 
                bot_name, 
                st.session_state.get("document_search")
            )
            st.markdown(f"**You:** {user_input}")
            st.markdown(f"**{bot_name}:** {bot_response}")
            
            # Automatically play the response
            self.text_to_speech(bot_response)
            
            return bot_response
        return None

    def get_voice_input(self):
        """Capture voice input from the user."""
        duration = 5  # seconds
        fs = 16000  # Sample rate (16kHz)
        st.info("Listening... Speak now!")

        # Record audio from microphone
        audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()  # Wait until the recording is finished

        recognizer = sr.Recognizer()
        
        try:
            # Create a temporary WAV file in binary mode
            with tempfile.NamedTemporaryFile(mode='wb', suffix='.wav', delete=False) as temp_wav:
                temp_path = temp_wav.name
                write(temp_path, fs, audio_data)
                temp_wav.flush()  # Ensure all data is written
                
            # Now read the file for speech recognition
            with sr.AudioFile(temp_path) as source:
                audio = recognizer.record(source)
            
            # Perform recognition
            text = recognizer.recognize_google(audio)
            st.success(f"Recognized voice input: {text}")
            return text

        except Exception as e:
            st.error(f"Error recognizing speech: {str(e)}")
            return ""
        
        finally:
            # Ensure the file handle is released before trying to delete
            try:
                if 'temp_path' in locals():
                    import time
                    time.sleep(0.1)  # Small delay to ensure file handles are released
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
            except Exception as e:
                st.warning(f"Could not delete temporary file: {str(e)}")

    def text_to_speech(self, response_text):
        """Convert text response to speech and auto-play."""
        # Generate the speech audio
        tts = gTTS(text=response_text, lang='en')
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as fp:
            temp_file = fp.name
            tts.save(temp_file)
        
        # Create a unique key for this audio instance
        audio_key = f"audio_{hash(response_text)}"
        
        # Inject custom HTML with autoplay attribute
        st.markdown(
            f"""
            <audio id="{audio_key}" autoplay>
                <source src="data:audio/mp3;base64,{self._get_audio_base64(temp_file)}" type="audio/mp3">
            </audio>
            <script>
                document.getElementById("{audio_key}").play();
            </script>
            """,
            unsafe_allow_html=True
        )
        
        # Store the temp file path for later cleanup
        st.session_state["temp_audio_file"] = temp_file

    def _get_audio_base64(self, file_path):
        """Convert audio file to base64 string."""
        import base64
        with open(file_path, "rb") as audio_file:
            audio_bytes = audio_file.read()
        return base64.b64encode(audio_bytes).decode() 