from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
import io
import scipy.io.wavfile as wavfile
import numpy as np

# Importar el motor que creamos
from engine import BioSyncEngine

app = FastAPI(title="BioSync DSP Server", description="Motor de audio para mecanotransducción y frecuencias somáticas")

# Configurar CORS para permitir peticiones desde el frontend (React/Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permitir todos los dominios temporalmente (cambiar en prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "BioSync DSP API Online. Estética Glitch/Raster-Noton activada."}

@app.get("/generate")
def generate_audio(
    duration: int = 10,
    bpm: int = 120,
    carrier_freq: float = 528.0,
    isochronic_beat: float = 6.0,
    binaural_offset: float = 0.0,
    kick_freq: float = 55.5,
    kick_pattern: str = "1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0",
    glitch_pattern: str = "1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0",
    texture_type: str = "none",
    texture_vol: float = 0.5,
    freq_vol: float = 0.5,
    beat_vol: float = 0.8,
    glitch_vol: float = 0.3
):
    """
    Genera un segmento de audio mezclado con los parámetros solicitados 
    y lo devuelve como un archivo WAV en memoria (Streaming).
    """
    engine = BioSyncEngine(bpm=bpm)
    
    # 1. Capa de Frecuencia
    freq_layer = engine.generate_brainwave_entrainment(
        carrier=carrier_freq, 
        beat=isochronic_beat, 
        duration=duration,
        binaural_offset=binaural_offset
    )
    
    # Parsear patrones (str a list de enteros)
    try:
        kick_arr = [int(x) for x in kick_pattern.split(",")]
    except:
        kick_arr = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
        
    try:
        glitch_arr = [int(x) for x in glitch_pattern.split(",")]
    except:
        glitch_arr = [1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0]
        
    # 2. Capa Beats
    beat_layer = engine.generate_beat_layer(duration=duration, kick_freq=kick_freq, pattern=kick_arr)
    
    # 3. Capa Glitch
    glitch_layer = engine.generate_glitch_layer(duration=duration, pattern=glitch_arr)
    
    # 4. Capa Textura
    texture_layer = engine.generate_texture_layer(duration=duration, texture_type=texture_type, vol=texture_vol)
    
    # 5. Mezclar capas
    mixed_audio = engine.mix_layers(
        freq_layer, glitch_layer, beat_layer, texture_layer=texture_layer,
        freq_vol=freq_vol, glitch_vol=glitch_vol, beat_vol=beat_vol
    )
    
    # Escribir el array a un buffer en memoria en formato WAV (Float32)
    buffer = io.BytesIO()
    wavfile.write(buffer, engine.sample_rate, mixed_audio.astype(np.float32))
    buffer.seek(0)
    
    return Response(content=buffer.read(), media_type="audio/wav")

@app.post("/process")
async def process_audio(
    file: UploadFile = File(...),
    bpm: int = Form(120),
    carrier_freq: float = Form(528.0),
    isochronic_beat: float = Form(6.0),
    binaural_offset: float = Form(0.0),
    kick_freq: float = Form(55.5),
    kick_pattern: str = Form("1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0"),
    glitch_pattern: str = Form("1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0"),
    texture_type: str = Form("none"),
    texture_vol: float = Form(0.5),
    freq_vol: float = Form(0.5),
    beat_vol: float = Form(0.8),
    glitch_vol: float = Form(0.3),
    user_vol: float = Form(0.6)
):
    """
    Recibe un archivo WAV, le aplica pitch-shifting a 432Hz (desde 440Hz),
    genera las capas sintéticas del mismo tamaño y mezcla todo.
    """
    engine = BioSyncEngine(bpm=bpm)
    
    # 1. Leer el archivo WAV subido
    file_bytes = await file.read()
    try:
        orig_sr, audio_data = wavfile.read(io.BytesIO(file_bytes))
    except Exception as e:
        return {"error": "Solo se soportan archivos WAV válidos por ahora."}
        
    # Calcular duración original en segundos
    duration = len(audio_data) / orig_sr
    
    # 2. Procesar el track de usuario (Remuestreo a 432Hz)
    processed_track = engine.process_user_track(
        audio_data, 
        orig_sr=orig_sr, 
        orig_tuning=440, 
        target_tuning=432, 
        duration=duration
    )
    
    # Parsear patrones (str a list de enteros)
    try:
        kick_arr = [int(x) for x in kick_pattern.split(",")]
    except:
        kick_arr = [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]
        
    try:
        glitch_arr = [int(x) for x in glitch_pattern.split(",")]
    except:
        glitch_arr = [1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0]
        
    # 3. Generar las capas sintéticas para acompañar
    freq_layer = engine.generate_brainwave_entrainment(carrier=carrier_freq, beat=isochronic_beat, duration=duration, binaural_offset=binaural_offset)
    beat_layer = engine.generate_beat_layer(duration=duration, kick_freq=kick_freq, pattern=kick_arr)
    glitch_layer = engine.generate_glitch_layer(duration=duration, pattern=glitch_arr)
    texture_layer = engine.generate_texture_layer(duration=duration, texture_type=texture_type, vol=texture_vol)
    
    # 4. Mezclar el track del usuario con las capas sintéticas
    mixed_audio = engine.mix_layers(
        freq_layer, glitch_layer, beat_layer, texture_layer=texture_layer, user_track=processed_track,
        freq_vol=freq_vol, glitch_vol=glitch_vol, beat_vol=beat_vol, user_vol=user_vol
    )
    
    # Convertir a bytes WAV
    final_mix_16 = np.int16(np.clip(mixed_audio, -1.0, 1.0) * 32767.0)
    buffer = io.BytesIO()
    wavfile.write(buffer, engine.sample_rate, final_mix_16)
    buffer.seek(0)
    
    return Response(content=buffer.getvalue(), media_type="audio/wav")

@app.get("/generate/kick")
def generate_kick_oneshot(kick_freq: float = 55.5):
    # Genera solo 1 golpe de bombo (0.5s)
    engine = BioSyncEngine()
    layer = engine.generate_beat_layer(duration=0.5, kick_freq=kick_freq, pattern=[1])
    layer_16 = np.int16(np.clip(layer, -1.0, 1.0) * 32767.0)
    buffer = io.BytesIO()
    wavfile.write(buffer, engine.sample_rate, layer_16)
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="audio/wav")

@app.get("/generate/glitch")
def generate_glitch_oneshot():
    # Genera solo 1 golpe de glitch (0.2s)
    engine = BioSyncEngine()
    layer = engine.generate_glitch_layer(duration=0.2, pattern=[1])
    layer_16 = np.int16(np.clip(layer, -1.0, 1.0) * 32767.0)
    buffer = io.BytesIO()
    wavfile.write(buffer, engine.sample_rate, layer_16)
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="audio/wav")

@app.get("/generate/snare")
def generate_snare_oneshot():
    # Genera solo 1 golpe de snare (0.25s) + padding
    engine = BioSyncEngine()
    layer = engine.generate_snare_layer(duration=0.3, pattern=[1])
    layer_16 = np.int16(np.clip(layer, -1.0, 1.0) * 32767.0)
    buffer = io.BytesIO()
    wavfile.write(buffer, engine.sample_rate, layer_16)
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="audio/wav")

@app.get("/generate/hihat")
def generate_hihat_oneshot():
    # Genera solo 1 golpe de hihat (0.1s) + padding
    engine = BioSyncEngine()
    layer = engine.generate_hihat_layer(duration=0.2, pattern=[1])
    layer_16 = np.int16(np.clip(layer, -1.0, 1.0) * 32767.0)
    buffer = io.BytesIO()
    wavfile.write(buffer, engine.sample_rate, layer_16)
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="audio/wav")

@app.get("/generate/drone")
def generate_drone(
    duration: int = 15,
    carrier_freq: float = 528.0,
    isochronic_beat: float = 6.0,
    binaural_offset: float = 0.0,
    texture_type: str = "none",
    texture_vol: float = 0.5,
    freq_vol: float = 0.5
):
    engine = BioSyncEngine()
    freq_layer = engine.generate_brainwave_entrainment(carrier=carrier_freq, beat=isochronic_beat, duration=duration, binaural_offset=binaural_offset)
    texture_layer = engine.generate_texture_layer(duration=duration, texture_type=texture_type, vol=texture_vol)
    
    final_mix = freq_layer * freq_vol + texture_layer
    final_mix = np.clip(final_mix, -1.0, 1.0)
    final_mix_16 = np.int16(final_mix * 32767.0)
    
    buffer = io.BytesIO()
    wavfile.write(buffer, engine.sample_rate, final_mix_16)
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="audio/wav")
