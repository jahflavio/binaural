# 🚶‍♂️ Walkthrough: BioSync DSP V3.0

¡Misión Cumplida! Hemos llevado el prototipo inicial a un verdadero instrumento para tocar en vivo.

## Cambios Implementados

### 1. Secuenciador de 16 Pasos (Frontend + Backend)
- **UI Interactiva:** Se reemplazaron los botones de subdivisión fijos por una cuadrícula HTML nativa de 16 pasos, diferenciada por colores (Rojo para Kick, Cyan para Glitch).
- **Procesamiento de Arreglos (Arrays):** `App.jsx` ahora envía los patrones (`kick_pattern` y `glitch_pattern`) como cadenas CSV.
- **Motor DSP (`engine.py`):** Reescrito `generate_beat_layer` para iterar exactamente sobre el patrón del secuenciador mediante *Time-keeping* y matemáticas continuas, sincronizado a los BPMs elegidos.

### 2. Looper Multipista (Superposición en Vivo)
- **AudioBuffers:** Ahora el botón `[ REC EN VIVO ]` no solo guarda un archivo, sino que lo decodifica y lo inyecta en el estado de React (`layers`).
- **Reproducción Infinita:** Cada capa grabada se asigna a un nuevo `AudioBufferSourceNode` en bucle continuo, sincronizado con el Master, permitiendo mutear o borrar pistas al vuelo.

### 3. MIDI Learn Inteligente
- **Mapeo Dinámico:** Doble clic en cualquier control físico en la pantalla lo pone en estado "Learn" (borde rojo). El siguiente evento MIDI recibido desde la caja Boss o teclado se vincula automáticamente en el `useRef` de mapeo.
- Escala de valores normalizada para soportar cualquier dispositivo MIDI CC o Pads.

### 4. Estética Hardware (Knobs y Raster-Noton)
- **Componente `<Knob />` Personalizado:** Desarrollado desde cero con lógica de arrastre en el eje Y y rotación CSS matemática. Sustituye todos los *sliders* nativos.
- **Visuales Oscuros:** Ajustes en Sombras, *Box-Shadows* y colores neón que dan un aspecto de mesa de mezclas profesional, integrándose perfectamente con el Torus Knot en 3D del visualizador.

### 5. Refactorización a Síntesis en Tiempo Real (Web Audio API)
- **Migración de DSP al Navegador:** Para resolver el problema de latencia y permitir que las perillas controlen el sonido instantáneamente, el tono base (Drone), la modulación de amplitud (Latido Isocrónico) y las texturas (Ruido Rosa y Lluvia) ahora se sintetizan en tiempo real directamente en React utilizando `OscillatorNode`, `GainNode` y `BiquadFilterNode`.
- **Cero Latencia en Perillas:** Los `useEffect` monitorean los cambios de estado de las perillas e inyectan los nuevos valores (`setTargetAtTime`) directamente a los nodos de audio mientras están sonando, eliminando la necesidad de re-generar el archivo desde Python para escuchar cambios en las frecuencias.
- **División de Trabajo Optimizada:** Python (`server.py`) ahora se encarga exclusivamente de las tareas complejas de procesamiento de audio externo (Pitch Shifting a 432Hz) y de renderizar los *one-shots* analógicos para el bombo y glitch de la caja de ritmos.

## 🧪 Próximos Pasos Recomendados (Testing)
1. Inicia el servidor con tu nuevo `start.bat`.
2. Presiona `[ GENERAR & PLAY ]` para arrancar el motor de audio y la caja de ritmos.
3. Mueve la perilla **BPM** y notarás cómo la batería acelera al instante.
4. Mueve las perillas **Frec. Base** o **Isocrónico** y escucharás cómo el tono principal cambia fluidamente, como en un sintetizador real.
5. Cambia entre Texturas (Ruido Rosa/Lluvia) o mutea loops mientras tocas en vivo.

*Consulta la [Guía de Uso](file:///c:/Users/fabia/OneDrive/Documentos/audio/docs/guia_de_uso.md) para detalles sobre el inicio.*
