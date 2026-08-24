# 🚶‍♂️ Walkthrough — BioSync DSP v4.0

Registro cronológico de todas las implementaciones del proyecto.

---

## ✅ v4.0 — Auditoría v2: Bugs + Performance + Features Pro
*Agosto 2026*

### 🔴 Bugs Corregidos

#### BUG 3 — `server.py`: `bare except:` → `except ValueError`
**Archivo:** [`server.py`](../backend/server.py) · Líneas 146–155

El endpoint `/process` usaba `bare except:` que silenciaba cualquier excepción, incluyendo `MemoryError` o `SystemExit`. Ahora captura únicamente `ValueError` para patrones malformados, dejando que los errores críticos propaguen correctamente.

#### BUG 4 — MIDI Hot-Plug con `onstatechange`
**Archivo:** [`App.jsx`](../frontend/src/App.jsx) · `useEffect` de MIDI

El listener MIDI se configuraba una sola vez al cargar la app. Si el usuario conectaba un dispositivo MIDI después, no se detectaba. Se añadió `midiAccess.onstatechange` que:
- Asigna `onmidimessage` a nuevos inputs conectados.
- Limpia el handler en dispositivos desconectados.
- Actualiza la lista de outputs MIDI disponibles.

---

### 🟡 Mejoras de Rendimiento

#### PERF 2 — Throttle 30ms en `Knob.jsx`
**Archivo:** [`Knob.jsx`](../frontend/src/components/Knob.jsx)

Con 14 perillas activas, arrastrar el mouse podía generar decenas de re-renders de React por segundo, causando temblor visible en la UI. Se añadió un `useRef(lastUpdate)` con throttle de 30ms en `handleMove`: si el evento llega antes de 30ms desde el último update, se descarta. Resultado: movimiento fluido sin renders innecesarios.

---

### 🟢 Features Nuevas

#### IDEA 1 — Indicador de Paso Activo en el Secuenciador
**Archivos:** [`App.jsx`](../frontend/src/App.jsx) + [`SequencerGrid.jsx`](../frontend/src/components/SequencerGrid.jsx)

Implementado con un patrón de doble ref para evitar bloquear el audio thread:
- `currentStepRef` (ref) — escrita en el `scheduleNote` del audio scheduler.
- `currentStep` (state) — sincronizada via un `requestAnimationFrame` separado (`syncStepToUI`).
- `SequencerGrid` recibe `currentStep` como prop y aplica `boxShadow` + `backgroundColor` coloreado por pista al paso activo.
- Se limpia al detener (`setCurrentStep(-1)`).

Colores del glow por pista: Kick (rojo), Snare (amarillo), Hi-Hat (verde lima), Glitch (cyan), Bass (violeta).

#### IDEA 2 — Persistencia de Presets con `localStorage`
**Archivo:** [`App.jsx`](../frontend/src/App.jsx)

5 slots de preset con botones `SAVE 1-5` / `LOAD 1-5`. Guardan y restauran el objeto `params` completo (patrones, volúmenes, efectos, frecuencias). Los botones LOAD se iluminan si el slot tiene datos. Los presets persisten entre sesiones del navegador.

#### IDEA 3 — Tap Tempo
**Archivo:** [`App.jsx`](../frontend/src/App.jsx)

Botón `TAP TEMPO [T]` en el panel + tecla `T`. Promedia los últimos 8 intervalos de tap para calcular el BPM (`60000 / avgMs`). Rango válido: 60–180 BPM. Implementado con `useCallback` para estabilidad en el event listener del teclado.

#### IDEA 4 — VU Meter de 8 Segmentos
**Archivo:** [`App.jsx`](../frontend/src/App.jsx)

8 barras en el header, animadas via `requestAnimationFrame` leyendo `getByteFrequencyData` del `AnalyserNode` existente. Divide el espectro en 8 bins (graves → agudos). Color: cian (< 50%), naranja (50–75%), rojo (> 75%). Se apaga automáticamente al detener.

#### IDEA 6 — Modo Perform (Pantalla Limpia para en Vivo)
**Archivo:** [`App.jsx`](../frontend/src/App.jsx)

Estado `performMode` controlado con botón `[ PERFORM ]` en el header + tecla `P`. Al activarse:
- El `<aside>` del panel lateral recibe `display: none`.
- El visualizador 3D ocupa toda la pantalla.
- La barra de status muestra controles mínimos: Play/Stop, BPM, botones de mute por pista.

---

## ✅ v3.0 — Groovebox Generativo Completo
*Fases anteriores*

### 1. Secuenciador de 16 Pasos (Frontend + Backend)
- Cuadrícula interactiva con colores por pista.
- Motor DSP reescrito para time-keeping preciso sincronizado a BPM.
- Triggers condicionales (probabilidad por paso con Shift + Click).

### 2. Looper Multipista
- Grabación en vivo con `MediaRecorder`.
- Cada loop se decodifica como `AudioBuffer` y se reproduce en bucle infinito.
- Mute / delete de capas individuales.
- Exportación a WAV con codificador PCM nativo (`wavExporter.js`).

### 3. MIDI Learn Inteligente
- Doble clic en cualquier control activa modo Learn (borde rojo).
- El siguiente evento MIDI recibido se vincula al parámetro.
- Escala de valores normalizada (0–127 → rango del parámetro).

### 4. Arquitectura de Audio en Tiempo Real
- Scheduler de lookahead en JavaScript (~25ms de anticipación).
- One-shots cargados desde el backend y cacheados en el cliente.
- Grafo de audio: Synth → Sidechain → Filter → Delay / Reverb / Panner → Analyser → Destination.

### 5. Visualizador 3D (Three.js)
- Torus Knot deformado por datos de amplitud y energía de bajos.
- Color HSL animado en tiempo real.
- Pre-allocación de arrays fuera del loop para eliminar presión del GC.
- Pausa/reanuda con `isActive` sin recrear el contexto WebGL.

### 6. Sincronización MIDI Clock
- Modo Master: envía pulsos 0xF8 a 24 PPQN.
- Modo Slave: sigue el clock externo para sincronizar el secuenciador.

### 7. Efectos (FX Rack)
- Delay con feedback y mix wet/dry.
- Reverb por convolución con impulso generado algorítmicamente.
- Sidechain ducking del synth con el kick.
- Chaos Pad XY (Filter + Pitch) sobre la animación 3D.

### 8. Caché de One-Shots en el Backend
- `_ONESHOT_CACHE` en `server.py` — genera cada sample la primera vez y lo reutiliza.
- Tiempo de respuesta: ~300ms (primera vez) → ~5ms (cacheado).
- Kick cacheado por frecuencia para soportar cambios en vivo.

---

## 🔧 Configuración del Entorno

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --port 8080 --reload

# Frontend
cd frontend
npm install
npm run dev
```

---

## 📁 Archivos del Proyecto

| Archivo | Propósito |
|---|---|
| [`backend/server.py`](../backend/server.py) | API REST FastAPI + caché de one-shots |
| [`backend/engine.py`](../backend/engine.py) | Motor DSP (síntesis, mezcla, procesamiento) |
| [`frontend/src/App.jsx`](../frontend/src/App.jsx) | Aplicación principal React |
| [`frontend/src/components/Knob.jsx`](../frontend/src/components/Knob.jsx) | Perilla con throttle |
| [`frontend/src/components/SequencerGrid.jsx`](../frontend/src/components/SequencerGrid.jsx) | Cuadrícula con indicador activo |
| [`frontend/src/components/Visualizer3D.jsx`](../frontend/src/components/Visualizer3D.jsx) | Visualizador Three.js |
| [`frontend/src/utils/wavExporter.js`](../frontend/src/utils/wavExporter.js) | Codificador WAV nativo |
| [`frontend/src/utils/euclidean.js`](../frontend/src/utils/euclidean.js) | Algoritmos de ritmos euclidianos |

---

*Consulta la [Guía de Uso](./guia_de_uso.md) para instrucciones de operación.*
