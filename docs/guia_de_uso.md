# 🎛️ Manual de Usuario — BioSync DSP v4.0

> **Groovebox Somático + Caja de Ritmos Generativa | Estética Raster-Noton**  
> Plataforma de audio para mecanotransducción, arrastre cortical y performance en vivo.

---

## ⚡ Inicio Rápido

1. Inicia el backend: `uvicorn server:app --port 8080 --reload` (en `/backend`)
2. Inicia el frontend: `npm run dev` (en `/frontend`)
3. Abre el navegador en `http://localhost:5173`
4. Presiona **`ESPACIO`** o haz clic en **`[ GENERAR & PLAY ]`** para comenzar.

---

## 1. ⌨️ Atajos de Teclado

| Tecla | Acción |
|---|---|
| `ESPACIO` | Play / Stop |
| `M` | Mute / Unmute **todas** las pistas a la vez |
| `1` | Toggle mute — Kick |
| `2` | Toggle mute — Snare |
| `3` | Toggle mute — Hi-Hat |
| `4` | Toggle mute — Glitch |
| `5` | Toggle mute — Bass |
| `T` | **Tap Tempo** — marca el pulso con golpes |
| `P` | **Modo Perform** — oculta/muestra el panel de control |
| `R` | Iniciar / Detener Grabación de loop |
| `C` | Disparar **Caos Euclidiano** |

---

## 2. 🎹 Panel Principal de Perillas

Todas las perillas se controlan arrastrando el ratón **hacia arriba** (sube) o **hacia abajo** (baja). Doble clic en cualquier perilla activa el **modo MIDI Learn**.

| Perilla | Rango | Descripción |
|---|---|---|
| **BPM** | 60–180 | Tempo del secuenciador |
| **Frec. Base** | 40–963 Hz | Frecuencia portadora del oscilador |
| **Isocrónico** | 0.5–40 Hz | Frecuencia de pulsación isocrónca |
| **Binaural** | 0–40 Hz | Offset entre oído izquierdo y derecho |
| **Vol Textura** | 0–1 | Volumen de la textura ambiental (ASMR) |
| **Freq Vol** | 0–1 | Volumen del oscilador de frecuencias |
| **Kick Vol** | 0–1 | Volumen del bombo |
| **Glitch Vol** | 0–1 | Volumen de los micro-glitches |
| **Snare Vol** | 0–1 | Volumen del redoblante |
| **HiHat Vol** | 0–1 | Volumen del charles |
| **Bass Vol** | 0–1 | Volumen del bajo sintetizado |

> **Rendimiento:** Las perillas aplican un throttle de 30ms para evitar re-renders excesivos sin perder fluidez táctil.

---

## 3. 🥁 Secuenciador de 16 Pasos

La cuadrícula central es el corazón rítmico de BioSync DSP. Cada fila representa una pista; cada columna es un dieciseisavo de nota.

### Cómo usarlo
- **Click** en un paso — activa / desactiva el hit.
- **Shift + Click** en un paso activo — cambia su **probabilidad**: `100% → 66% → 33%`.  
  La transparencia del paso indica la probabilidad.

### Indicador de Paso Activo *(nuevo en v4)*
Durante la reproducción, **el paso actual se ilumina** con un halo de glow que sigue el color de cada pista:
- 🔴 Kick · 🟡 Snare · 🟢 Hi-Hat · 🔵 Glitch · 🟣 Bass

Esto es el comportamiento de grooveboxes profesionales como Elektron o Akai. La diferencia entre usar una herramienta y **tocar un instrumento**.

### MUTE GLOBAL (fila superior)
Activa pasos en la fila de MUTE GLOBAL para crear silencios programados que afectan a **todas las pistas** simultáneamente.

### 🎲 Caos Euclidiano
El botón **CAOS EUCLIDIANO** (o tecla `C`) aplica algoritmos matemáticos euclidianos para redistribuir los hits de forma polirrítmica en todas las pistas a la vez. Ideal para romper la monotonía en vivo.

---

## 4. 💾 Sistema de Presets *(nuevo en v4)*

El sistema guarda y recupera **toda la configuración** (patrones, volúmenes, efectos, frecuencias) en 5 slots de memoria persistente usando `localStorage`.

```
SAVE 1  SAVE 2  SAVE 3  SAVE 4  SAVE 5
LOAD 1  LOAD 2  LOAD 3  LOAD 4  LOAD 5
```

- Los botones **LOAD** aparecen iluminados si ese slot tiene datos guardados.
- Los presets **persisten entre sesiones** — al cerrar y reabrir el navegador, siguen disponibles.
- Guarda diferentes estados de tu set de performance y cámbialos al instante.

---

## 5. 🎵 Tap Tempo *(nuevo en v4)*

Marca el tempo golpeando el botón **`TAP TEMPO [T]`** o presionando la tecla `T` repetidamente al ritmo deseado.

- El sistema promedia hasta los últimos **8 taps** para mayor precisión.
- El BPM resultante se actualiza instantáneamente en todas las perillas y el secuenciador.
- Rango válido: 60–180 BPM.

---

## 6. 📊 VU Meter en Tiempo Real *(nuevo en v4)*

El **medidor de nivel** de 8 barras en la esquina superior derecha del header muestra el espectro de frecuencias en tiempo real usando el `AnalyserNode` de Web Audio API.

| Color | Nivel |
|---|---|
| 🟢 Cian (`#00ffcc`) | Normal (< 50%) |
| 🟡 Naranja (`#ffaa00`) | Medio (50–75%) |
| 🔴 Rojo (`#ff4444`) | Clip / Muy alto (> 75%) |

Las barras representan 8 bandas de frecuencia (de graves a agudos, de izquierda a derecha). Se apaga automáticamente cuando el audio se detiene.

---

## 7. 🏃 Modo Perform *(nuevo en v4)*

El **Modo Perform** es para cuando estás en un escenario y no quieres que la audiencia vea tu panel técnico.

**Activar:** Botón `[ PERFORM ]` en el header, o tecla `P`.

Al activarlo:
- El panel de control lateral **desaparece completamente**.
- El **visualizador 3D** ocupa toda la pantalla.
- En la barra superior aparecen los **controles mínimos de performance**:
  - Botón Play / Stop
  - Tempo en BPM
  - Botones de mute rápido por pista (KICK · SNARE · HIHAT · GLITCH · BASS)
- El VU Meter sigue activo en el header.

**Salir:** Mismo botón `[ EXIT PERFORM ]` o tecla `P` de nuevo.

---

## 8. 🎛️ Rack de Efectos (FX)

| Control | Efecto |
|---|---|
| **Delay Time** | Tiempo del eco (0.01–1.5s) |
| **Feedback** | Cuántas veces se repite el eco (0–90%) |
| **Delay Mix** | Proporción del eco en la mezcla |
| **Reverb Time** | Cola de reverberación (0.5–10s) |
| **Reverb Mix** | Proporción de la reverb en la mezcla |
| **Sidechain** | Ducking del synth cuando suena el kick (Techno / Pumping) |

---

## 9. 🖱️ Chaos Pad (XY Macro)

Haz **clic y arrastra** directamente sobre la animación 3D del centro:

- **Eje X (horizontal):** Controla el pitch / playback rate de la fuente.
- **Eje Y (vertical):** Controla el corte del filtro pasa-bajos global (200Hz–20kHz).

Perfecto para *build-ups*, *drops* y transiciones dramáticas en vivo.

---

## 10. 🎚️ AUTO LFO y Modo MIDI Slave

- **`[ AUTO LFO ]`** — Modula automáticamente la perilla **Offset Binaural** en ciclos suaves de 20 segundos. Actívalo para programas de meditación sin intervención manual.
- **`[ CLOCK: MASTER (INT) ]`** — BioSync DSP dicta el tempo a tu hardware externo via MIDI Clock (24 PPQN).
- **`[ CLOCK: SLAVE (EXT) ]`** — BioSync DSP sigue el tempo de un dispositivo MIDI externo.

> **MIDI Hot-Plug *(nuevo en v4)*:** Los dispositivos MIDI conectados **después de abrir la app** se detectan automáticamente sin necesidad de recargar la página.

---

## 11. 🎙️ Grabación y Looper Multipista

1. Inicia la reproducción con `[ GENERAR & PLAY ]`.
2. Presiona `[ ● REC EN VIVO [R] ]` para comenzar a grabar.
3. Presiona `[ ■ DETENER [R] ]` para capturar el loop — aparece en la sección **Looper Multipista**.
4. Cada capa puede silenciarse (M) o eliminarse (X) individualmente.
5. Usa `[ 💾 DESCARGAR STEMS (.WAV) ]` para exportar cada capa a un archivo WAV independiente.

---

## 12. 🌀 Texturas Ambientales (ASMR)

| Tipo | Descripción |
|---|---|
| **Ninguna** | Sin textura de fondo |
| **Ruido Rosa** | Textura suave, ideal para meditación y enfoque |
| **Lluvia** | Ruido marrón de baja frecuencia, relajante |

Controla el volumen con la perilla **Vol Textura** y el botón **M** para silenciar sin perder la configuración.

---

## 13. 🎵 Catálogo de Frecuencias (Presets Terapéuticos)

Cuatro menús desplegables configuran instantáneamente **Frecuencia Base**, **Isocrónico** y **Afinación del Bombo**:

| Grupo | Rango | Uso |
|---|---|---|
| **Solfeggio** | 174–963 Hz | Chakras y regeneración celular |
| **Somáticas** | 40–256 Hz | Tejidos específicos (nervio vago, articulaciones, SNC) |
| **Ondas Cerebrales** | Delta, Theta, Alpha, Beta, Gamma | Estados de consciencia |
| **Afinaciones** | 432 Hz / 440 Hz | Naturaleza vs. estándar |

---

## 14. 📁 Procesar Audio Externo

Carga un archivo `.WAV` propio para que BioSync DSP lo procese:
- Lo remuestrea de **440 Hz → 432 Hz** (pitch shifting por remuestreo polifásico).
- Lo mezcla con todas las capas sintéticas generadas.
- Controla su volumen con la perilla **User Vol**.

---

## 15. 🔌 API REST del Backend

El servidor corre en `http://127.0.0.1:8080`.

| Endpoint | Método | Descripción |
|---|---|---|
| `GET /` | GET | Estado del servidor |
| `GET /generate` | GET | Genera un segmento de audio mezclado (WAV) |
| `GET /generate/kick` | GET | One-shot de bombo (cacheado por frecuencia) |
| `GET /generate/snare` | GET | One-shot de redoblante (cacheado) |
| `GET /generate/hihat` | GET | One-shot de charles (cacheado) |
| `GET /generate/glitch` | GET | One-shot de glitch (cacheado) |
| `GET /generate/drone` | GET | Drone de frecuencias puro (sin percusión) |
| `POST /process` | POST | Procesa y mezcla un WAV externo |

> **Caché de One-Shots:** Los samples de percusión se generan **una sola vez al primer request** y se almacenan en memoria. Las llamadas posteriores devuelven el buffer cacheado (~5ms vs ~300ms). El Kick se cachea por frecuencia, así que cambiar `kick_freq` regenera solo ese sample.

---

## 16. 🏗️ Arquitectura del Sistema

```
BioSync DSP
├── backend/
│   ├── server.py       FastAPI — API REST + caché de one-shots
│   └── engine.py       BioSyncEngine — síntesis DSP en NumPy/SciPy
└── frontend/
    ├── src/
    │   ├── App.jsx                  Aplicación principal (React)
    │   ├── components/
    │   │   ├── Knob.jsx             Perilla con throttle 30ms
    │   │   ├── SequencerGrid.jsx    Cuadrícula 16 pasos + indicador activo
    │   │   └── Visualizer3D.jsx     Torus Knot animado (Three.js)
    │   └── utils/
    │       ├── wavExporter.js       Codificador WAV PCM nativo
    │       └── euclidean.js         Generador de ritmos euclidianos
    └── ...
```

### Flujo de Audio (Web Audio API)
```
Osciladores / BufferSource
    └─→ SidechainGain
        └─→ BiquadFilter (Lowpass — Chaos Pad)
            ├─→ DelayNode → DelayMix
            ├─→ ConvolverNode → ReverbMix
            └─→ PannerNode (HRTF 3D)
                └─→ AnalyserNode → Destination
                                └─→ MediaRecorder (grabación)
```

---

*Manual actualizado para BioSync DSP v4.0 — Agosto 2026*
