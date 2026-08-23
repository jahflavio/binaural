# 🛠️ Fase 5: Refactorización Arquitectónica y Resolución de Auditoría

> [!IMPORTANT]
> **User Review Required**
> Has solicitado corregir los puntos críticos de la auditoría. Para solucionar los problemas de **latencia en vivo** y **consumo de memoria**, debemos realizar un cambio arquitectónico profundo. Por favor, revisa y aprueba este plan antes de proceder con el código.

## 🎯 El Problema Actual
Actualmente, cada vez que cambias un paso en el secuenciador, React le pide a Python que genere toda la pista completa (ej. 15 segundos) y la devuelva. Esto causa que:
1. El servidor consuma mucha RAM procesando arrays enormes de golpe.
2. El audio se tenga que detener y reiniciar para escuchar el nuevo ritmo (rompiendo el flujo en vivo).

## 🚀 La Solución Arquitectónica (Proposed Changes)

### 1. Backend como Sintetizador "One-Shot" (Python)
Vamos a liberar al servidor de generar arreglos rítmicos largos.
- Modificaremos `engine.py` para que genere **Samples Individuales (One-Shots)**: un archivo de audio para un solo *Kick* (0.5s) y otro para un *Glitch* (0.5s).
- Python seguirá generando los audios continuos (Texturas y Frecuencias) en Streaming, resolviendo así el problema de consumo masivo de RAM.

### 2. Secuenciador en Tiempo Real (Frontend Web Audio)
- Desarrollaremos un sistema de *Scheduling* (Programación de Notas) en Javascript basado en el reloj ultra-preciso del navegador (`AudioContext.currentTime`).
- **Cómo funcionará**: Al encender la máquina, React descarga el "golpe de bombo" desde Python. Luego, un ciclo en segundo plano dispara ese golpe exactamente sobre la cuadrícula del secuenciador.
- **Beneficio INMENSO para UX**: Si haces clic en la cuadrícula mientras la música suena, el nuevo ritmo **entrará instantáneamente** en el siguiente pulso, sin tiempos de carga, como una verdadera caja de ritmo hardware (Roland TR-808, Elektron, etc).

### 3. Modularización de Código Limpio
- Actualmente `App.jsx` tiene casi 600 líneas, lo cual es insostenible.
- Se crearán archivos independientes para mejorar el mantenimiento:
  - `src/components/Visualizer3D.jsx`
  - `src/components/SequencerGrid.jsx`
  - `src/components/Knob.jsx`
  - `src/components/ControlPanel.jsx`

## 🧪 Verification Plan
1. Refactorizaremos el frontend separando los componentes.
2. Actualizaremos los endpoints de FastAPI para servir *One-Shots*.
3. Construiremos el "Audio Scheduler" en JS y verificaremos que el ritmo sea perfecto, permitiendo cambiar el patrón de la cuadrícula en pleno directo sin que la música se detenga.
