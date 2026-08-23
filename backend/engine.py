import numpy as np
from scipy.io import wavfile
from scipy.signal import resample_poly, butter, lfilter

class BioSyncEngine:
    """
    BioSync-DSP: Sistema de Modulación Sónica y Somática.
    Diseñado para el arrastre cortical y regeneración tisular con estética Raster-Noton.
    """
    def __init__(self, sample_rate=44100, bpm=120):
        self.sample_rate = sample_rate
        self.duration = 0
        self.bpm = bpm
        # Calcular duración de un beat (negra) en segundos y muestras
        self.beat_duration = 60.0 / self.bpm
        self.beat_samples = int(self.sample_rate * self.beat_duration)

    def _generate_time_axis(self, duration):
        self.duration = duration
        return np.linspace(0, duration, int(self.sample_rate * duration), endpoint=False)

    # --- MOTOR 1: FRECUENCIAS Y RESONANCIA BASE ---
    def generate_resonance(self, target_freq=528, duration=60):
        """
        Genera la frecuencia base pura (senoidal) con una leve saturación
        armónica controlada, evitando frecuencias fatigosas.
        """
        t = self._generate_time_axis(duration)
        # Onda base
        wave = np.sin(2 * np.pi * target_freq * t)
        return np.column_stack((wave, wave))

    def generate_brainwave_entrainment(self, carrier=528, beat=6, duration=60, binaural_offset=0):
        """
        Tonos Isocrónicos o Latidos Binaurales.
        Si binaural_offset > 0, genera binaural. Si es 0, genera isocrónico en estéreo.
        """
        t = self._generate_time_axis(duration)
        
        if binaural_offset > 0:
            # Latido Binaural: Diferente frecuencia en cada oído
            left_wave = np.sin(2 * np.pi * carrier * t)
            right_wave = np.sin(2 * np.pi * (carrier + binaural_offset) * t)
            return np.column_stack((left_wave, right_wave))
        else:
            # Tono Isocrónico (ambos oídos igual, pulsante)
            carrier_wave = np.sin(2 * np.pi * carrier * t)
            pulse = (np.sin(2 * np.pi * beat * t) >= 0).astype(float)
            mono_wave = carrier_wave * pulse
            return np.column_stack((mono_wave, mono_wave))

    # --- MOTOR 2: GLITCH / TRANSITORIOS (Estética Raster-Noton) ---
    def generate_glitch_layer(self, duration=60, pattern=[1, 0, 1, 0, 0, 1, 0, 0]):
        """
        Genera micro-glitches usando ráfagas ultra-rápidas de ruido blanco filtrado.
        Sincronizado a una rejilla de semicorcheas (16th notes).
        """
        t = self._generate_time_axis(duration)
        glitch_track = np.zeros_like(t)
        
        sixteenth_note_samples = self.beat_samples // 4
        num_sixteenths = len(t) // sixteenth_note_samples
        
        # Click muy corto (5ms)
        click_length = int(self.sample_rate * 0.005) 
        
        for i in range(num_sixteenths):
            # Si el patrón indica que hay un hit
            if pattern[i % len(pattern)] == 1:
                start = i * sixteenth_note_samples
                end = start + click_length
                if end < len(glitch_track):
                    # Inyectar ruido blanco (click)
                    noise = np.random.normal(0, 1, click_length)
                    # Envolvente abrupta para el click
                    envelope = np.linspace(1, 0, click_length) ** 2
                    glitch_track[start:end] = noise * envelope
                    
        return np.column_stack((glitch_track, glitch_track))

    # --- MOTOR 3: BEATS (Kicks y Percusión Sónica) ---
    def generate_beat_layer(self, duration=60, kick_freq=55.5, pattern=None):
        """
        Bombo basado en síntesis FM/Sub-bass.
        pattern: lista binaria indicando hits en dieciseisavos (ej. [1,0,0,0, 1,0,0,0...])
        """
        if pattern is None:
            pattern = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]
            
        t = self._generate_time_axis(duration)
        beat_track = np.zeros(len(t))
        
        # Sintetizar un kick básico (pitch envelope)
        kick_length = int(self.sample_rate * 0.4) # 400ms kick
        t_kick = np.linspace(0, 0.4, kick_length, endpoint=False)
        # Frecuencia cae exponencialmente (clásico kick analógico)
        freq_env = kick_freq * np.exp(-15 * t_kick)
        # Integrar la frecuencia para obtener la fase
        phase = np.cumsum(freq_env) * 2 * np.pi / self.sample_rate
        kick_wave = np.sin(phase)
        
        # Envolvente de volumen del kick
        amp_env = np.exp(-10 * t_kick)
        kick_audio = kick_wave * amp_env
        
        # Calcular duración de un dieciseisavo
        sixteenth_duration = (60.0 / self.bpm) / 4.0
        sixteenth_samples = int(sixteenth_duration * self.sample_rate)
        num_sixteenths = int(duration / sixteenth_duration)
        
        for i in range(num_sixteenths):
            if pattern[i % len(pattern)] == 1:
                start = i * sixteenth_samples
                end = start + kick_length
                if end < len(beat_track):
                    beat_track[start:end] = kick_audio
                
        return np.column_stack((beat_track, beat_track))

    def generate_snare_layer(self, duration=60, pattern=None):
        if pattern is None:
            pattern = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]
            
        t = self._generate_time_axis(duration)
        track = np.zeros(len(t))
        
        snare_length = int(self.sample_rate * 0.25)
        t_snare = np.linspace(0, 0.25, snare_length, endpoint=False)
        
        # Tone (body)
        freq_env = 250 * np.exp(-20 * t_snare)
        phase = np.cumsum(freq_env) * 2 * np.pi / self.sample_rate
        tone = np.sin(phase) * np.exp(-15 * t_snare)
        
        # Noise (rattle)
        noise = np.random.normal(0, 1, snare_length)
        # Highpass filter for noise
        b, a = butter(2, 0.1, btype='high')
        noise = lfilter(b, a, noise)
        noise_env = np.exp(-10 * t_snare)
        noise = noise * noise_env
        
        snare_audio = (tone * 0.4) + (noise * 0.6)
        
        sixteenth_duration = (60.0 / self.bpm) / 4.0
        sixteenth_samples = int(sixteenth_duration * self.sample_rate)
        num_sixteenths = int(duration / sixteenth_duration)
        
        for i in range(num_sixteenths):
            if pattern[i % len(pattern)] == 1:
                start = i * sixteenth_samples
                end = start + snare_length
                if end < len(track):
                    track[start:end] = snare_audio
                    
        return np.column_stack((track, track))

    def generate_hihat_layer(self, duration=60, pattern=None):
        if pattern is None:
            pattern = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0]
            
        t = self._generate_time_axis(duration)
        track = np.zeros(len(t))
        
        hh_length = int(self.sample_rate * 0.1)
        t_hh = np.linspace(0, 0.1, hh_length, endpoint=False)
        
        # Metallic noise
        noise = np.random.normal(0, 1, hh_length)
        b, a = butter(4, 0.3, btype='high')
        noise = lfilter(b, a, noise)
        
        amp_env = np.exp(-40 * t_hh)
        hh_audio = noise * amp_env
        
        sixteenth_duration = (60.0 / self.bpm) / 4.0
        sixteenth_samples = int(sixteenth_duration * self.sample_rate)
        num_sixteenths = int(duration / sixteenth_duration)
        
        for i in range(num_sixteenths):
            if pattern[i % len(pattern)] == 1:
                start = i * sixteenth_samples
                end = start + hh_length
                if end < len(track):
                    track[start:end] = hh_audio
                    
        return np.column_stack((track, track))

    # --- MOTOR 4: PROCESAMIENTO DE ARCHIVOS (Pitch Shifting) ---
    def process_user_track(self, audio_data, orig_sr, orig_tuning=440, target_tuning=432, duration=None):
        """
        Remuestrea una pista musical (ej. de 440Hz a 432Hz) y la ajusta
        a la duración deseada (truncando o rellenando con ceros).
        """
        # Convertir a mono si es estéreo promediando los canales
        if len(audio_data.shape) > 1:
            audio_data = np.mean(audio_data, axis=1)
            
        # 1. Pitch Shifting (remuestreo polifásico)
        factor = target_tuning / orig_tuning
        new_rate = int(orig_sr / factor)
        
        # Resample a la nueva tasa
        shifted = resample_poly(audio_data, orig_sr, new_rate)
        
        # 2. Resample a la tasa del motor (44100)
        if new_rate != self.sample_rate:
            final_audio = resample_poly(shifted, self.sample_rate, new_rate)
        else:
            final_audio = shifted
            
        # 3. Ajustar duración
        if duration is not None:
            target_samples = int(self.sample_rate * duration)
            if len(final_audio) > target_samples:
                final_audio = final_audio[:target_samples]
            elif len(final_audio) < target_samples:
                pad = np.zeros(target_samples - len(final_audio))
                final_audio = np.concatenate((final_audio, pad))
                
        return np.column_stack((final_audio, final_audio))

    # --- MOTOR 5: TEXTURAS AMBIENTALES ---
    def generate_texture_layer(self, duration=60, texture_type="none", vol=0.5):
        """
        Genera texturas de fondo (Ruido Rosa, Lluvia/Marrón) para ASMR.
        """
        t = self._generate_time_axis(duration)
        if texture_type == "pink":
            # Aproximación de ruido rosa filtrando ruido blanco
            white = np.random.normal(0, 1, len(t))
            b, a = butter(1, 0.05, btype='low') 
            pink = lfilter(b, a, white)
            pink = (pink / np.max(np.abs(pink))) * vol
            return np.column_stack((pink, pink))
        elif texture_type == "rain":
            # Lluvia usando ruido marrón (corte de frecuencias altas más agresivo)
            white = np.random.normal(0, 1, len(t))
            b, a = butter(2, 0.01, btype='low') 
            brown = lfilter(b, a, white)
            brown = (brown / np.max(np.abs(brown))) * vol
            return np.column_stack((brown, brown))
        else:
            return np.zeros((len(t), 2))

    # --- MOTOR DE MEZCLA ---
    def mix_layers(self, freq_layer, glitch_layer, beat_layer, texture_layer=None, user_track=None, freq_vol=0.5, glitch_vol=0.3, beat_vol=0.8, user_vol=0.6):
        """
        Suma las capas y aplica normalización (Limitador de picos)
        para asegurar que no haya distorsión digital al mezclar.
        """
        # Multiplicar cada capa por su volumen
        mixed = (freq_layer * freq_vol) + (glitch_layer * glitch_vol) + (beat_layer * beat_vol)
        
        if texture_layer is not None:
            mixed += texture_layer
            
        if user_track is not None:
            mixed += (user_track * user_vol)
        
        # Soft clipping / Normalización para evitar que pase de -1 a 1
        max_amp = np.max(np.abs(mixed))
        if max_amp > 0.95:
            mixed = (mixed / max_amp) * 0.95
            
        return mixed

    def export_audio(self, filename, data):
        wavfile.write(filename, self.sample_rate, data.astype(np.float32))

if __name__ == "__main__":
    engine = BioSyncEngine(bpm=120)
    print("Iniciando renderizado de prueba de 10 segundos...")
    
    # Capa de Frecuencia (528Hz Isocrónico a 6Hz)
    freq = engine.generate_brainwave_entrainment(carrier=528, beat=6, duration=10)
    
    # Capa de Beats (Kick a 55.5Hz)
    beats = engine.generate_beat_layer(duration=10, kick_freq=55.5)
    
    # Capa Glitch (Patrón polirrítmico minimalista)
    glitch = engine.generate_glitch_layer(duration=10, pattern=[1, 0, 0, 1, 0, 1, 0, 0])
    
    # Mezcla final
    final_audio = engine.mix_layers(freq, glitch, beats, freq_vol=0.4, glitch_vol=0.4, beat_vol=0.8)
    
    engine.export_audio("BioSync_Mix_Test.wav", final_audio)
    print("Audio generado: BioSync_Mix_Test.wav")