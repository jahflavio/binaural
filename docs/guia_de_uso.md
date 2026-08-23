# 🎛️ Guía de Uso - BioSync DSP (Fase 6 Completada)

¡Bienvenido a la versión final de tu Sintetizador/Caja de Ritmos Somático! Tu aplicación ahora actúa como un **Secuenciador Real-Time, Master Clock y Looper para directo**. Aquí tienes cómo aprovechar todas las nuevas funciones.

## 1. El Secuenciador de 16 Pasos (Caja de Ritmo)
En el panel lateral verás una cuadrícula de 16 botones para las pistas **KICK**, **SNARE**, **HI-HAT**, **GLITCH** y el nuevo sintetizador **SUB-BASS**.
- **Cómo usarlo**: Haz clic en los pequeños bloques para encenderlos o apagarlos. Representan los 16 tiempos de un compás.
- **Reproducción sin latencia**: A diferencia de versiones anteriores, **los cambios son en tiempo real**. Si agregas un golpe de Kick mientras el audio está sonando, lo escucharás en la siguiente vuelta instantáneamente gracias al planificador nativo de Web Audio API.
- **Botones de Silencio (Mute)**: Al lado de cada nombre de pista y debajo de cada perilla del mezclador verás botones **[ M ]**. Haz clic para mutear (silenciar) una pista al instante sin perder tu nivel de volumen. ¡Perfecto para hacer *drops* en vivo!
- **El Sub-Bajo Automático**: La pista BASS usa síntesis de JavaScript pura y genera frecuencias súper bajas que **siguen automáticamente** la afinación que le des a tu bombo (Kick Freq), pero una octava más abajo.

## 2. Looper Multipista (Grabación en Capas) y Mastering
Ideal para crear texturas complejas y exportarlas para tu DAW.
- **Grabar un Loop**: Mientras el audio está sonando, haz clic en `[ REC EN VIVO ]`. Se pondrá rojo. Toca las perillas y graba automatizaciones manuales.
- **Detener y Añadir Capa**: Vuelve a hacer clic en `[ DETENER ]`. El audio que acabas de grabar se añadirá a la lista de capas.
- **Descargar Stems (.WAV)**: Con el nuevo botón de color neón `[ 💾 DESCARGAR STEMS (.WAV) ]` puedes exportar la mezcla directamente a tu computadora en calidad de estudio PCM 16-bit, lista para arrastrar a Ableton Live o cualquier otro DAW.

## 3. Sincronización MIDI (Master Clock) y Asignación
¡La app ahora domina tu hardware físico!
- **Clock Out**: Al pulsar "GENERAR & PLAY", la aplicación enviará la señal MIDI Start (`0xFA`) y pulsos de reloj constantes (`0xF8` a 24 PPQN) a cualquier caja de ritmos conectada (ej. tu Roland/Boss). Tu hardware seguirá el BPM de la web a la perfección.
- **Modo "Learn"**: Haz **Doble Clic** en cualquier Knob (Perilla giratoria) de la pantalla. Su borde se pondrá rojo. Mueve un fader o perilla en tu controlador MIDI para asignarlo permanentemente a esa función de la interfaz.

## 4. Estética de Estudio y Knobs 3D
- Para usar los nuevos Knobs, haz clic en ellos, **mantén presionado** y arrastra el ratón hacia **Arriba o Abajo** para girarlos. Todos los volúmenes, frecuencias isocrónicas y offsets binaurales reaccionarán instantáneamente.

¡Disfruta tu nueva estación de audio!
