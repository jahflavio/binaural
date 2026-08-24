# CHANGELOG — BioSync DSP

Todos los cambios notables del proyecto están documentados aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [v4.0] — 2026-08-23

### Bugs Corregidos
- **[backend/server.py]** `bare except:` → `except ValueError` en el endpoint `POST /process`. El handler anterior silenciaba excepciones críticas como `MemoryError` o `SystemExit`.
- **[frontend/App.jsx]** MIDI Hot-Plug: dispositivos MIDI conectados después de cargar la app ahora se detectan automáticamente via `midiAccess.onstatechange`. Antes era necesario recargar la página.

### Rendimiento
- **[frontend/Knob.jsx]** Throttle de 30ms en `handleMove`. Con 14 knobs activos, arrastrar el ratón generaba decenas de re-renders de React por segundo causando UI temblor. Reducido a máximo ~33 updates/seg.

### Nuevas Funciones
- **[frontend/App.jsx + SequencerGrid.jsx]** **Indicador de Paso Activo**: el paso actual del secuenciador se ilumina con un halo coloreado (por pista) durante la reproducción. Implementado con `currentStepRef` + RAF separado para no bloquear el audio thread.
- **[frontend/App.jsx]** **Presets localStorage**: 5 slots de preset (SAVE/LOAD 1–5) que persisten toda la configuración entre sesiones del navegador.
- **[frontend/App.jsx]** **Tap Tempo**: botón `TAP TEMPO [T]` + tecla `T`. Promedia hasta 8 taps para calcular el BPM.
- **[frontend/App.jsx]** **VU Meter**: medidor de 8 barras espectrales en el header, animado via `getByteFrequencyData` del AnalyserNode existente. Colores: cian / naranja / rojo por nivel.
- **[frontend/App.jsx]** **Modo Perform**: tecla `P` o botón `[ PERFORM ]` oculta el panel lateral y muestra controles mínimos (Play/Stop, BPM, mutes) sobre el visualizador 3D a pantalla completa.
- **[frontend/App.jsx]** Atajos de teclado nuevos: `T` (Tap Tempo), `P` (Perform Mode).

---

## [v3.5] — Auditoría v1 (Bugfixes Críticos)

### Bugs Corregidos
- **[backend/server.py]** `generate_snare_layer` con `duration=0.3` producía silencio porque el buffer era más corto que el sample. Aumentado a `duration=0.5`.
- **[backend/server.py]** Todos los endpoints de one-shots ahora usan `_ONESHOT_CACHE`: se generan una vez y se reutilizan. Tiempo de respuesta: 300ms → 5ms.
- **[frontend/Visualizer3D.jsx]** El loop de resume no llamaba al `draw` real. Corregido con `drawRef.current` + `requestAnimationFrame(drawRef.current)`.
- **[backend/server.py]** `bare except:` → `except ValueError` en el endpoint `GET /generate`.
- **[frontend/Visualizer3D.jsx]** Pre-allocación de `Uint8Array` fuera del loop de animación para eliminar presión del Garbage Collector.

---

## [v3.0] — Groovebox Generativo Completo

### Añadido
- Secuenciador de 16 pasos con triggers condicionales (Shift+Click → probabilidad 100/66/33%).
- MUTE GLOBAL por paso en el secuenciador.
- Algoritmo Caos Euclidiano (`generateRandomEuclidean`) para distribución matemática de hits.
- Scheduler de lookahead en JavaScript (no depende del backend para el timing del secuenciador).
- Sidechain ducking del synth con el kick.
- Efecto Delay (tiempo, feedback, mix wet/dry).
- Efecto Reverb por convolución con impulso algorítmico.
- Chaos Pad XY sobre la animación 3D (Filter + Pitch).
- AUTO LFO para modulación automática del offset binaural.
- Modo MIDI Slave (sigue clock externo).
- One-shots precargados y cacheados en el cliente.

---

## [v2.0] — Modularización y Hardware Sync

### Añadido
- Componente `<Knob />` con lógica de arrastre Y-axis y rotación CSS.
- Componente `<SequencerGrid />` con cuadrícula HTML nativa.
- Componente `<Visualizer3D />` — Torus Knot Three.js reactivo al audio.
- Looper multipista: grabación en vivo con `MediaRecorder` → `AudioBuffer` loops.
- Exportación de stems a WAV con codificador PCM nativo (`wavExporter.js`).
- Sincronización MIDI Clock Master (24 PPQN → hardware externo).
- MIDI Learn: doble clic en control → siguiente evento MIDI lo mapea.
- Carga y procesamiento de audio externo WAV (440 Hz → 432 Hz via remuestreo polifásico).

---

## [v1.0] — Prototipo Inicial

### Añadido
- `BioSyncEngine`: síntesis NumPy/SciPy (tonos isocrónicos, latidos binaurales, kicks, glitches, texturas).
- API FastAPI con endpoints `/generate` y `/process`.
- Frontend React básico con controles de frecuencia.
- Visualizador 3D con Three.js (Torus Knot).
- Catálogo de frecuencias terapéuticas (Solfeggio, Somáticas, Ondas Cerebrales).
