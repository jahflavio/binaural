# 🎛️ Manual de Usuario Completo — BioSync DSP v4.0

> **Groovebox Somático + Caja de Ritmos Generativa | Estética Raster-Noton**
>
> BioSync DSP es una plataforma de síntesis de audio especializada en **mecanotransducción** (el proceso por el cual el cuerpo convierte energía mecánica en señales eléctricas), **arrastre cortical** (sincronización de ondas cerebrales mediante estímulos auditivos rítmicos) y **performance en vivo**. Combina un motor de síntesis Python en el backend con un secuenciador y mezclador completo en el navegador.

---

## ⚡ Inicio Rápido

```bash
# 1. Servidor backend (Python + FastAPI)
cd backend
uvicorn server:app --port 8080 --reload

# 2. Servidor frontend (React + Vite)
cd frontend
npm run dev

# 3. Abrir en el navegador
http://localhost:5173
```

Una vez cargada la app, presiona **`ESPACIO`** o el botón **`[ GENERAR & PLAY ]`** para iniciar el motor de audio. El browser pedirá permiso para activar el AudioContext — acéptalo.

> **Nota:** El backend debe estar corriendo **antes** de presionar Play, ya que el frontend descarga los samples de percusión (kick, snare, hihat, glitch) en el primer inicio.

---

## 1. ⌨️ Atajos de Teclado Globales

Los atajos funcionan en cualquier momento sin necesidad de hacer clic en nada, siempre que el cursor no esté dentro de un campo de texto.

| Tecla | Acción | Cuándo usarla |
|---|---|---|
| `ESPACIO` | **Play / Stop** | Control principal de reproducción |
| `M` | **Mute / Unmute TODAS** las pistas | Silencio total instantáneo — útil para breaks en vivo |
| `1` | Toggle mute — **Kick** | Quitar/poner el bombo en cualquier momento |
| `2` | Toggle mute — **Snare** | Quitar/poner el redoblante |
| `3` | Toggle mute — **Hi-Hat** | Quitar/poner el charles |
| `4` | Toggle mute — **Glitch** | Quitar/poner los micro-glitches |
| `5` | Toggle mute — **Bass** | Quitar/poner el bajo sintetizado |
| `T` | **Tap Tempo** | Sincronizar el BPM al ritmo de una pista externa o tu pulso |
| `P` | **Modo Perform** | Esconder el panel técnico durante una actuación |
| `R` | **Iniciar / Detener grabación** | Capturar un loop en tiempo real |
| `C` | **Caos Euclidiano** | Regenerar patrones rítmicos matemáticamente |

---

## 2. 🔮 El Oscilador de Frecuencias

El corazón terapéutico de BioSync DSP. El oscilador genera tonos de frecuencia precisa basados en principios de neuroacústica.

### ¿Para qué sirve?
Las frecuencias específicas tienen efectos documentados sobre el sistema nervioso. A través del **arrastre cortical** (brainwave entrainment), el cerebro tiende a sincronizar sus ondas eléctricas con el ritmo del estímulo auditivo. Esto puede inducir estados de meditación, concentración, sueño profundo o activación, dependiendo de la frecuencia elegida.

### Modos de Operación

#### Modo Isocrónico (Offset Binaural = 0)
Cuando la perilla **Binaural** está en 0, el oscilador genera un tono pulsante: la frecuencia portadora se enciende y apaga rítmicamente a la frecuencia isocrónica. **Ambos oídos reciben la misma señal**, por lo que funciona con altavoces o auriculares.

*Ejemplo: Carrier 528 Hz + Isocrónico 8 Hz → el tono de 528 Hz pulsa 8 veces por segundo.*

#### Modo Binaural (Offset Binaural > 0)
Cuando hay un offset binaural, el **oído izquierdo** recibe la frecuencia portadora y el **oído derecho** recibe la portadora + el offset. El cerebro percibe una tercera frecuencia "fantasma" igual a la diferencia. **Requiere auriculares** para funcionar correctamente.

*Ejemplo: Carrier 528 Hz + Offset 6 Hz → oído izq: 528 Hz, oído der: 534 Hz, cerebro percibe: 6 Hz (Theta).*

### Perillas del Oscilador

| Perilla | Rango | Para qué sirve |
|---|---|---|
| **Frec. Base** | 40–963 Hz | Define la frecuencia de la portadora sonora. Elige según el efecto terapéutico deseado. |
| **Isocrónico** | 0.5–40 Hz | Define el ritmo de pulsación (modo isocrónico) o la diferencia de frecuencia percibida (modo binaural). |
| **Binaural** | 0–40 Hz | Desplazamiento de frecuencia entre oído izquierdo y derecho. Ponlo en 0 para modo isocrónico. |
| **Freq Vol** | 0–1 | Volumen del oscilador de frecuencias en la mezcla. Empieza bajo (0.3–0.5) y sube según comodidad. |

---

## 3. 🥁 Secuenciador de 16 Pasos

La cuadrícula rítmica es el motor de performance de BioSync DSP. Programa golpes en una rejilla de 16 dieciseisavos de nota (un compás de 4/4 completo) para cada instrumento.

### Estructura de Filas

| Fila | Instrumento | Color | Sonido |
|---|---|---|---|
| **MUTE GLOBAL** | Control de silencios | Rojo oscuro | No genera sonido — silencia todas las pistas en ese paso |
| **KICK** | Bombo | 🔴 Rojo | Síntesis FM subbajo: frecuencia cae exponencialmente (0.4s) |
| **SNARE** | Redoblante | 🟡 Amarillo | Mezcla de tono (body) + ruido blanco filtrado (rattle, 0.25s) |
| **HI-HAT** | Charles | 🟢 Verde lima | Ruido blanco con decay ultrarrápido (0.1s) — metallic |
| **GLITCH** | Micro-glitch | 🔵 Cyan | Ráfaga de ruido blanco de 5ms — estética Raster-Noton |
| **BASS** | Bajo sintetizado | 🟣 Violeta | Oscilador de onda seno a la mitad de la frecuencia del kick (sub-bass) |

### Cómo Programar Ritmos

**Click normal** en cualquier celda para activar o desactivar ese golpe en ese tiempo.

La división temporal funciona así:
```
Paso:  1   2   3   4 | 5   6   7   8 | 9  10  11  12 | 13  14  15  16
Beat:  [—— Beat 1 ——] [—— Beat 2 ——] [—— Beat 3 ——] [——— Beat 4 ———]
```

**Patrones típicos de ejemplo:**

| Estilo | Kick | Snare | Hi-Hat |
|---|---|---|---|
| Rock básico | `1···1···1···1···` | `····1·······1···` | `··1···1···1···1·` |
| Techno | `1···1···1···1···` | `····1···1···1···` | `1·1·1·1·1·1·1·1·` |
| Hip-hop | `1···1·1····1···` | `····1·········1·` | `1·1·1·1·1·1·1·1·` |

### Probabilidad por Paso (Triggers Condicionales)

**Shift + Click** en un paso **activo** cicla su probabilidad de dispararse:

| Apariencia | Probabilidad | Uso recomendado |
|---|---|---|
| Sólido (100%) | Suena siempre | Golpes fijos de la estructura rítmica |
| Semi-transparente (66%) | Suena 2 de cada 3 veces | Variaciones sutiles — snares y glitches ocasionales |
| Muy transparente (33%) | Suena 1 de cada 3 veces | "Ghost notes" — sensación de variación orgánica |

> **Tip:** Pon el hi-hat en 33% en los pasos 3, 7, 11 y 15 para que el patrón suene diferente en cada vuelta sin cambiar nada manualmente.

### Indicador de Paso Activo 🔴

Durante la reproducción, **una columna entera se ilumina** mostrando qué dieciseisavo está sonando ahora mismo. Cada pista usa su propio color de glow. Esto te permite:
- Ver a simple vista en qué parte del compás estás.
- Editar patrones "al vuelo" sin perder la referencia temporal.
- En modo perform, aunque ocultes el panel, el indicador sigue visible si vuelves al modo normal.

### MUTE GLOBAL por Paso

La fila superior (**MUTE GLOBAL**) silencia todas las pistas en ese paso específico, independientemente de si tienen golpes programados o no.

**Usos:**
- Crear **silencios sincopados** que afectan a toda la mezcla.
- Hacer un "fill" solo con el Kick mientras silencias todo lo demás (activa pasos 2–16 en MUTE GLOBAL).
- Programar silencios abruptos en momentos específicos del compás.

### 🎲 Caos Euclidiano

El algoritmo Euclidiano distribuye matemáticamente N golpes en M pasos de la forma más homogénea posible — el mismo principio que usan los tambores de África Occidental y los ritmos de la música árabe.

**Cómo funciona:** Al pulsar el botón (o tecla `C`), el sistema genera automáticamente nuevos patrones para todas las pistas usando distribución euclidiana con valores aleatorios de densidad. Ningún patrón generado suena "artificial" porque está basado en proporciones matemáticas.

**Cuándo usarlo:** Cuando sientes que el loop se vuelve repetitivo en vivo. El Caos Euclidiano mantiene la coherencia rítmica pero transforma radicalmente la textura.

---

## 4. 🎹 Panel de Perillas (Knobs)

### ¿Cómo funcionan las perillas?
- **Clic y arrastra hacia arriba** → aumenta el valor.
- **Clic y arrastra hacia abajo** → disminuye el valor.
- El valor numérico actual se muestra debajo de cada perilla.
- **Doble clic** → activa el modo **MIDI Learn** (borde rojo). El siguiente evento MIDI recibido queda vinculado a esa perilla permanentemente.

### Perillas de Volumen por Pista

Cada pista tiene su perilla de volumen independiente y su botón **M** (mute) asociado. El mute no borra el valor de la perilla — simplemente silencia la señal, permitiendo recuperar el volumen exacto al desmutear.

| Perilla | Rango | Descripción técnica |
|---|---|---|
| **Vol Textura** | 0–1 | Volumen de la textura ambiental generativa (ruido rosa o lluvia) |
| **Freq Vol** | 0–1 | Volumen del oscilador binaural/isocrónico |
| **Kick Vol** | 0–1 | Volumen del sample de bombo sintetizado |
| **Glitch Vol** | 0–1 | Volumen de los micro-clicks de ruido blanco |
| **Snare Vol** | 0–1 | Volumen del sample de redoblante |
| **HiHat Vol** | 0–1 | Volumen del sample de charles |
| **Bass Vol** | 0–1 | Volumen del oscilador de bajo (onda seno sub) |

> **Mezcla recomendada para sesiones de meditación:** Freq Vol 0.4, Kick Vol 0.6, Textura 0.3, todo lo demás en 0.

> **Mezcla recomendada para performance:** Kick Vol 0.8, Bass Vol 0.7, HiHat Vol 0.5, Snare Vol 0.6, Freq Vol 0.3.

### BPM

Controla la velocidad del secuenciador. Afecta a las 5 pistas de percusión y al bajo simultáneamente.

- **60 BPM**: Muy lento — ideal para sesiones de relajación profunda (1 beat por segundo).
- **80–100 BPM**: Meditación activa / Downtempo.
- **120 BPM**: Tempo estándar de electrónica — House, Techno accesible.
- **140–160 BPM**: Techno / Trance rápido.
- **180 BPM**: Máximo — para ritmos intensos o experimentales.

> **Tip:** Usa **Tap Tempo** (`T`) para sincronizar con una pista de referencia externa.

---

## 5. 💾 Sistema de Presets (localStorage)

Los presets guardan **absolutamente todo** tu estado actual: los 16 pasos de cada pista, todos los volúmenes, los efectos, el BPM, la frecuencia base, el offset binaural, el tipo de textura, los valores de probabilidad por paso y los patrones de mute global.

### Cómo guardar un preset

1. Configura tu set exactamente como lo quieres.
2. Haz clic en **`SAVE 1`** (o cualquier slot del 1 al 5).
3. El slot queda guardado — el botón `LOAD` correspondiente se ilumina en cián.

### Cómo cargar un preset

1. Haz clic en **`LOAD 1`** (o el slot que desees).
2. Toda la configuración se restaura instantáneamente.
3. Si el audio está reproduciéndose, los cambios se aplican en el siguiente ciclo del secuenciador.

### Estrategia para sets en vivo

Puedes guardar 5 "escenas" diferentes:
- **Slot 1**: Intro — solo frecuencias + textura, sin percusión.
- **Slot 2**: Groove principal — ritmo completo a volumen normal.
- **Slot 3**: Break — patrón reducido, más ambient.
- **Slot 4**: Drop intenso — todos los instrumentos, BPM máximo, sidechain fuerte.
- **Slot 5**: Outro — fade natural, solo isocrónico.

> **Importante:** Los presets se guardan en el navegador. Si usas otro navegador o modo incógnito, no estarán disponibles. Además, limpiar los datos del navegador los borrará.

---

## 6. 🎵 Tap Tempo

El Tap Tempo calcula el BPM midiendo el tiempo entre tus golpes y calculando el promedio.

### Cómo usarlo

1. Pon una referencia musical (una canción, un loop externo).
2. Presiona `T` o el botón **`TAP TEMPO [T]`** al ritmo del beat.
3. Toca al menos **3–4 veces** para que el promedio sea preciso.
4. El BPM se actualiza en tiempo real con cada tap.
5. El sistema descarta los taps más viejos (guarda los últimos 8) para no acumular error.

### Precisión
- Menos de 4 taps: impreciso — sigue tappeando.
- 4–6 taps: buena precisión (±2 BPM).
- 7–8 taps: alta precisión (±1 BPM).

> **Tip:** Si el BPM resultante parece el doble o la mitad del esperado, estás tappeando en corcheas en lugar de negras (o viceversa). Ajusta dividiendo/multiplicando el BPM por 2 con la perilla.

---

## 7. 📊 VU Meter Espectral

El medidor de nivel en el header muestra **8 barras de colores** que representan el nivel de 8 bandas de frecuencia del audio de salida.

### Interpretación de las barras

Las barras van de **izquierda a derecha: graves → agudos**.

- **Barras 1–2** (extremo izquierdo): Sub-bajos (< 200 Hz) — Kick, Bass, frecuencias somáticas bajas.
- **Barras 3–4**: Medios-graves (200–800 Hz) — Cuerpo del snare, armónicos del kick.
- **Barras 5–6**: Medios-agudos (800 Hz–3 kHz) — Presencia del snare, frecuencias del habla.
- **Barras 7–8** (extremo derecho): Agudos y aire (3–20 kHz) — Hi-hat, glitch, brillo general.

### Colores y niveles

| Color | Significado | Acción recomendada |
|---|---|---|
| 🟢 **Cian** | Nivel saludable (< 50%) | Todo bien — mezcla equilibrada |
| 🟡 **Naranja** | Nivel medio-alto (50–75%) | Atención — puede saturar con más elementos |
| 🔴 **Rojo** | Nivel peligroso (> 75%) | Baja el volumen de alguna pista — riesgo de clipping |

> **Uso práctico:** Si ves las barras de sub-bajos constantemente rojas, baja **Kick Vol** o **Bass Vol**. Si las barras de agudos están siempre apagadas, el HiHat puede estar muteado o su volumen muy bajo.

---

## 8. 🏃 Modo Perform

Diseñado para actuaciones en escenario donde la audiencia no debe ver los detalles técnicos de la interfaz.

### Qué cambia al activarlo

**Desaparece:**
- Todo el panel lateral de control (perillas, secuenciador, efectos, presets).

**Permanece visible:**
- El **visualizador 3D** (Torus Knot) a pantalla completa.
- El **VU Meter** en el header.
- El **botón de salida** `[ EXIT PERFORM ]`.

**Aparece en la barra superior:**
- Botón **`[ PLAY ]`** / **`[ STOP ]`** — para iniciar/detener el audio.
- El **BPM actual** en tiempo real.
- **Botones de mute por pista**: KICK · SNARE · HIHAT · GLITCH · BASS — para silenciar instrumentos individuales con un solo clic durante la actuación.

### Flujo de uso en escenario

1. **Antes del set:** Programa todos tus patrones y guárdalos en presets (slots 1–5).
2. **Durante el soundcheck:** Ajusta volúmenes y efectos.
3. **Al subir al escenario:** Presiona `P` para activar el Modo Perform.
4. **Durante la actuación:** Usa los botones de mute de la barra superior y el teclado para controlar el set.
5. **Al terminar:** Presiona `P` de nuevo para volver al panel completo.

---

## 9. 🎛️ Rack de Efectos (FX)

Los efectos se aplican en tiempo real sobre toda la señal de salida (excepto el kick, que va directo al filtro para evitar que el sidechain se duckee a sí mismo).

### Delay (Eco Digital)

El Delay reproduce la señal con un retraso configurable, creando ecos que se repiten y decaen.

| Perilla | Rango | Descripción |
|---|---|---|
| **Delay Time** | 0.01–1.5 s | Tiempo entre el sonido original y el primer eco. A 120 BPM, 0.25s = eco en tiempo (negra). |
| **Feedback** | 0–0.9 | Cuánto del eco vuelve a entrar al delay, creando repeticiones que se desvanecen. 0 = un solo eco. 0.9 = muchas repeticiones. |
| **Delay Mix** | 0–1 | Proporción de señal procesada en la mezcla. 0 = sin delay. 1 = solo eco. Recomendado: 0.2–0.4. |

**Configuraciones de ejemplo:**

| Efecto | Delay Time | Feedback | Mix |
|---|---|---|---|
| Slap-back (rockabilly) | 0.05 s | 0.1 | 0.3 |
| Eco rítmico en tiempo | 0.25 s | 0.4 | 0.3 |
| Eco espacial largo | 0.5 s | 0.6 | 0.25 |
| Delay infinito (dron) | 1.0 s | 0.85 | 0.4 |

### Reverberación (Reverb)

La reverb simula el sonido de un espacio físico. Se genera con un **convolverNode** usando un impulso algorítmico.

| Perilla | Rango | Descripción |
|---|---|---|
| **Reverb Time** | 0.5–10 s | Duración de la cola de reverberación. 0.5s = habitación pequeña. 5–10s = catedral / espacio exterior. |
| **Reverb Mix** | 0–1 | Proporción de reverb en la mezcla. Empieza en 0.2 y ajusta. Valores muy altos (> 0.6) crean un "baño" de reverb muy denso. |

**Combinaciones útiles:**
- **Meditación**: Reverb Time 4–6s, Mix 0.35 — sensación de espacio sin límites.
- **Techno**: Reverb Time 1–2s, Mix 0.15 — cola corta que da profundidad sin difuminar el ritmo.
- **Ambient**: Reverb Time 8–10s, Mix 0.5 — sonido etéreo y expansivo.

### Sidechain Ducking

La compresión sidechain es el efecto que hace que la mezcla "respire" con el kick — cada vez que el bombo suena, el resto de instrumentos bajan de volumen y luego vuelven.

| Perilla | Rango | Descripción |
|---|---|---|
| **Sidechain** | 0–1 | Intensidad del ducking. 0 = sin efecto. 0.5 = pumping moderado. 1 = sidechain maximal (característica del Techno). |

**Cómo funciona internamente:** Cuando el kick dispara, se programa una curva de volumen que baja rápidamente la señal del bus de sintetizadores (en ~5ms) y luego sube gradualmente (en ~120ms). Este movimiento es el "pump" característico.

**Usos:**
- **0.0** — Sin sidechain. Mezcla estática. Ideal para música ambient.
- **0.3–0.5** — Pumping sutil. El groovebox respira pero no es obvio.
- **0.7–1.0** — Sidechain agresivo. Sonido Techno / House clásico. El sintetizador y la textura "desaparecen" con cada kick.

---

## 10. 🖱️ Chaos Pad (XY Macro)

El Chaos Pad convierte el área del visualizador 3D en un **controlador XY táctil** que actúa como macro sobre dos parámetros críticos simultáneamente.

### Cómo usarlo

1. Con el audio reproduciéndose, haz clic sobre la animación 3D.
2. Mantén el botón apretado y arrastra.
3. Suelta para que los parámetros vuelvan a sus valores originales suavemente.

### ¿Qué controla?

| Eje | Parámetro | Rango | Efecto |
|---|---|---|---|
| **X (horizontal)** | Playback Rate / Pitch | 0.5× – 1.5× | Izquierda = más grave/lento · Derecha = más agudo/rápido |
| **Y (vertical)** | Filtro Pasa-Bajos | 200 Hz – 20 kHz | Arriba = sonido brillante (abierto) · Abajo = sonido oscuro (cerrado) |

> El filtro usa escala logarítmica: los primeros centímetros hacia abajo filtran los agudos rápidamente, pero llegar al mínimo requiere bajar mucho más.

### Técnicas en vivo

- **Filter sweep descend**: Arrastra lentamente desde arriba-centro hacia abajo-centro durante 8 compases para hacer un "buildup" oscureciendo la mezcla.
- **Drop**: Libera el Chaos Pad justo en el compás 1 para el "drop" — todo vuelve a sonar abierto y brillante de golpe.
- **Pitch wobble**: Mueve el eje X rápidamente de izquierda a derecha para un efecto de "wobble" o vibrato sobre el dron de frecuencias.

---

## 11. 🎚️ AUTO LFO

El AUTO LFO automatiza la perilla **Offset Binaural**, oscilándola suavemente entre 0 Hz y 15 Hz en ciclos de 20 segundos usando una función senoidal.

### ¿Para qué sirve?

En sesiones largas de meditación o terapia, mantener un offset binaural fijo puede volverse monótono. El AUTO LFO crea un movimiento continuo y orgánico del offset, lo que:
- Evita la adaptación auditiva (el cerebro deja de "escuchar" estímulos constantes).
- Crea una modulación suave que mantiene al oyente enganchado sin esfuerzo.
- Simula el movimiento natural de frecuencias que ocurre en la naturaleza.

### Cómo activarlo

1. Haz clic en el botón **`[ AUTO LFO ]`**.
2. El botón se ilumina en rojo — el LFO está activo.
3. La perilla Binaural comenzará a moverse automáticamente.
4. Haz clic de nuevo para desactivarlo — la perilla vuelve al control manual.

> **Nota:** El AUTO LFO actualiza el valor con throttle inteligente — solo actualiza si el cambio es mayor a 0.1 Hz, evitando re-renders innecesarios.

---

## 12. 🎤 Sincronización MIDI

BioSync DSP puede comunicarse bidireccionalmente con hardware MIDI externo.

### MIDI Learn (Mapeo de Controles)

Vincula cualquier perilla o control de la app a un potenciómetro o pad de tu hardware MIDI:

1. **Doble clic** en la perilla que deseas controlar — el borde se pone rojo.
2. Mueve el potenciómetro, fader o pad en tu hardware MIDI.
3. El sistema captura el evento y vincula ese control a la perilla automáticamente.
4. El mapeo persiste durante toda la sesión (se pierde al recargar la página).

### Modo Master (reloj interno)

**`[ CLOCK: MASTER (INT) ]`** — BioSync DSP envía pulsos MIDI Clock (0xF8) a 24 PPQN (pulsos por negra) a todos los dispositivos MIDI conectados.

- El hardware recibe **MIDI Start** (0xFA) al hacer Play.
- El hardware recibe **MIDI Stop** (0xFC) al detener.
- El tempo del hardware se sincroniza automáticamente con el BPM de BioSync.

**Uso:** Tienes una caja de ritmos Boss y quieres que siga el tempo de BioSync DSP.

### Modo Slave (reloj externo)

**`[ CLOCK: SLAVE (EXT) ]`** — BioSync DSP escucha los pulsos MIDI Clock de un dispositivo externo y ajusta su secuenciador a ese tempo.

**Uso:** Tu DAW (Ableton, Logic) envía clock MIDI y quieres que BioSync DSP sincronice su secuenciador con el proyecto.

### MIDI Hot-Plug

Los dispositivos MIDI conectados **después de abrir la app** se detectan automáticamente. No es necesario recargar la página ni reiniciar nada.

---

## 13. 🎙️ Grabación y Looper Multipista

El looper te permite construir una composición en capas en tiempo real, como un pedal de looping físico pero con la flexibilidad de un DAW.

### Flujo de grabación

```
1. [ GENERAR & PLAY ] → Inicia el motor
2. [ ● REC EN VIVO [R] ] → Comienza a grabar
3. [ ■ DETENER [R] ] → Captura el loop → aparece en el Looper
4. Repite para añadir más capas
```

Cada loop capturado:
- Se decodifica como AudioBuffer estéreo.
- Se reproduce en bucle infinito sincronizado con el motor principal.
- Aparece como una "capa" numerada en la sección **Looper Multipista**.

### Controles del Looper

| Control | Función |
|---|---|
| **M** (mute) | Silencia esa capa sin borrarla — útil para arranges dinámicos |
| **X** (eliminar) | Borra la capa permanentemente de la memoria |
| **💾 DESCARGAR STEMS (.WAV)** | Exporta TODAS las capas a archivos WAV individuales |

### Exportación WAV

El botón **`[ 💾 DESCARGAR STEMS (.WAV) ]`** genera y descarga un archivo `biosync_stem_N.wav` por cada capa grabada, con calidad de estudio (PCM 44100 Hz, 16-bit). Perfectos para importar en Ableton, Logic, Pro Tools o cualquier DAW.

> **Tip creativo:** Graba primero solo las frecuencias binaurales, luego añade el ritmo, luego una capa de textura modificada con el Chaos Pad. Exporta las 3 capas y mezcla en tu DAW con más control.

---

## 14. 🌀 Texturas Ambientales (ASMR)

Las texturas son capas de ruido continuo generadas algorítmicamente que se suman a la mezcla para crear ambientes sonoros envolventes.

### Tipos de textura

#### Ninguna
Sin textura de fondo. La mezcla es puramente las capas de percusión y el oscilador de frecuencias. Ideal cuando la limpieza del sonido es prioritaria.

#### Ruido Rosa
El ruido rosa tiene una distribución de energía que decrece con la frecuencia (-3 dB por octava), lo que lo hace percibido como "plano" por el oído humano. Es la textura más natural — similar al sonido del viento suave, un río lejano o la estática cálida de un vinilo.

**Usos:** Meditación, concentración, enmascaramiento de ruido ambiental, sesiones terapéuticas.

#### Lluvia (Ruido Marrón)
El ruido marrón tiene aún más energía en los graves (-6 dB por octava). Suena profundo, grave y envolvente — como lluvia intensa, cascadas o truenos distantes.

**Usos:** Sueño profundo, relajación intensa, sesiones de Delta (2 Hz) para estimulación de sueño reparador.

### Control de la textura

- **Vol Textura** (perilla): Controla el volumen de la textura en la mezcla. Empieza en 0.2–0.3 y ajusta al gusto.
- **Botón M**: Silencia la textura temporalmente sin perder la configuración de volumen.

---

## 15. 🎵 Catálogo de Frecuencias Terapéuticas

Cuatro grupos de presets que configuran simultáneamente la **Frecuencia Base**, el **Isocrónico** y la **Afinación del Bombo** con valores optimizados para cada propósito.

### Frecuencias Solfeggio

Frecuencias utilizadas en canto gregoriano medieval, asociadas a efectos sobre los chakras y la regeneración celular:

| Frecuencia | Nombre | Chakra | Propiedades documentadas |
|---|---|---|---|
| **174 Hz** | Alivio / Base | Raíz | Reducción del dolor, anclaje |
| **285 Hz** | Regeneración | Sacro | Regeneración de tejidos, curación |
| **396 Hz** | Root / Liberación | Raíz | Liberación de miedos, transformación |
| **417 Hz** | Sacral / Cambio | Sacro | Facilitación del cambio, energía |
| **528 Hz** | Solar / Milagros | Plexo Solar | La más conocida — reparación de ADN en estudios in vitro |
| **639 Hz** | Heart / Conexión | Corazón | Mejora de relaciones, comunicación |
| **741 Hz** | Throat / Intuición | Garganta | Expresión, intuición |
| **852 Hz** | Third Eye / Claridad | Tercer Ojo | Claridad mental, despertar espiritual |
| **963 Hz** | Crown / Divinidad | Corona | Conexión con lo superior, trascendencia |

### Frecuencias Somáticas

Diseñadas para resonar con tejidos y sistemas fisiológicos específicos:

| Frecuencia | Sistema | Efecto buscado |
|---|---|---|
| **40 Hz** | Corteza Cerebral | Gamma — estimulación cognitiva, Alzheimer |
| **50 Hz** | Sistema Muscular | Relajación muscular |
| **60 Hz** | Sistema Esquelético | Densidad ósea (investigación preliminar) |
| **62 Hz** | Sistema Nervioso Central | Equilibrio neurológico |
| **70 Hz** | Memoria Somática | Procesamiento de trauma corporal |
| **80 Hz** | Nervio Vago | Regulación del sistema nervioso autónomo |
| **95 Hz** | Articulaciones | Movilidad articular |
| **100 Hz** | Flujo Linfático | Drenaje linfático, inmunidad |
| **111 Hz** | Templo Antiguo | Inducción de estados de trance |
| **144 Hz** | Soberanía Energética | Equilibrio energético general |
| **256 Hz** | Energía Vital | Vitalidad, Do natural (temperamento justo) |

### Ondas Cerebrales (Brainwave Entrainment)

Las ondas cerebrales se agrupan por frecuencia y están asociadas a estados mentales específicos:

| Onda | Frecuencia | Estado mental | Configuración |
|---|---|---|---|
| **Delta** | 0.5–4 Hz | Sueño profundo, regeneración | Carrier 100 Hz, Isoc. 2 Hz |
| **Theta** | 4–8 Hz | Meditación profunda, creatividad, hipnosis | Carrier 136 Hz, Isoc. 6 Hz |
| **Alpha** | 8–13 Hz | Calma consciente, relajación alerta | Carrier 211 Hz, Isoc. 10 Hz |
| **Beta** | 13–30 Hz | Enfoque activo, concentración, resolución de problemas | Carrier 300 Hz, Isoc. 15 Hz |
| **Gamma** | 30–100 Hz | Insight, aprendizaje acelerado, estimulación cognitiva | Carrier 400 Hz, Isoc. 40 Hz |

### Afinaciones

| Frecuencia | Sistema | Diferencia |
|---|---|---|
| **432 Hz** | Afinación natural / Verdi | El La se afina a 432 Hz — más "cálido" y consonante con la naturaleza |
| **440 Hz** | Estándar internacional | El La se afina a 440 Hz — estándar moderno de la industria musical |

---

## 16. 📁 Procesamiento de Audio Externo

Carga tu propio archivo `.WAV` para que BioSync DSP lo procese e integre en la mezcla.

### ¿Qué hace con tu audio?

1. **Pitch Shifting**: Remuestrea el audio de **440 Hz a 432 Hz** usando un algoritmo de resampleo polifásico (`resample_poly` de SciPy). Esto baja el pitch ~31 cents y da al audio un carácter más cálido.
2. **Mezcla**: Combina tu audio procesado con todas las capas sintéticas (frecuencias, percusión, texturas) en una sola señal estéreo.
3. **Normalización**: Aplica limitación suave de picos para evitar distorsión digital.

### Cómo usarlo

1. Haz clic en **`Procesar Audio Externo`** → selecciona tu archivo `.WAV`.
2. El archivo queda listo en memoria.
3. Al presionar **`[ GENERAR & PLAY ]`**, se envía al backend para procesarlo.
4. Escucharás tu audio mezclado con las capas de BioSync.

> **Nota técnica:** El proceso de conversión ocurre en el servidor Python. Archivos muy largos pueden tardar algunos segundos. Formatos soportados: únicamente `.WAV` (no MP3, AAC o FLAC).

---

## 17. 🌐 API REST del Backend

El servidor Python corre en `http://127.0.0.1:8080`. Puedes usarlo directamente desde cualquier cliente HTTP o integrarlo en otros proyectos.

### Endpoints disponibles

#### `GET /`
Estado del servidor.
```json
{"message": "BioSync DSP API Online."}
```

#### `GET /generate`
Genera un segmento completo de audio mezclado y lo devuelve como WAV.

Parámetros principales:
| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `duration` | int | 10 | Duración en segundos |
| `bpm` | int | 120 | Tempo |
| `carrier_freq` | float | 528.0 | Frecuencia portadora (Hz) |
| `isochronic_beat` | float | 6.0 | Frecuencia isocrónica (Hz) |
| `binaural_offset` | float | 0.0 | Offset binaural (Hz) |
| `kick_pattern` | str | "1,0,0,0,..." | Patrón del kick (CSV de 0/1) |
| `texture_type` | str | "none" | "none", "pink", "rain" |

#### `GET /generate/kick?kick_freq=55.5`
One-shot de bombo cacheado. El kick es la única frecuencia parametrizable — cacheada por `kick_freq`.

#### `GET /generate/snare` · `GET /generate/hihat` · `GET /generate/glitch`
One-shots de percusión cacheados. Se generan una vez al primer request y se reusan para todas las peticiones siguientes (~5ms de latencia vs ~300ms sin caché).

#### `GET /generate/drone`
Genera solo el dron de frecuencias (sin percusión ni beats). Útil para generar archivos de meditación puros.

#### `POST /process`
Recibe un archivo WAV multipart, lo procesa (440→432 Hz) y lo mezcla con las capas sintéticas.

---

## 18. 🏗️ Arquitectura del Sistema

### Estructura de archivos

```
audio/
├── backend/
│   ├── server.py         API REST (FastAPI) + sistema de caché
│   ├── engine.py         Motor DSP: síntesis, mezcla, procesamiento
│   └── requirements.txt  fastapi, uvicorn, numpy, scipy
├── frontend/
│   └── src/
│       ├── App.jsx              Aplicación principal (~1200 líneas)
│       ├── components/
│       │   ├── Knob.jsx         Perilla con throttle 30ms
│       │   ├── SequencerGrid.jsx  Cuadrícula 16 pasos + indicador activo
│       │   └── Visualizer3D.jsx   Torus Knot Three.js
│       └── utils/
│           ├── wavExporter.js   Codificador WAV PCM nativo (sin deps)
│           └── euclidean.js     Algoritmo de distribución euclidiana
└── docs/
    ├── guia_de_uso.md    ← Este archivo
    ├── walkthrough.md    Historial técnico de implementaciones
    └── CHANGELOG.md      Registro de versiones
```

### Grafo de Audio (Web Audio API)

```
┌─────────────────────────────────┐
│   FUENTES DE AUDIO              │
│  Osciladores L/R (Binaural)     │
│  BufferSource (Textura)         │
│  BufferSource (Audio Externo)   │
└──────────────┬──────────────────┘
               │
        ┌──────▼──────┐
        │ SidechainGain│  ← El kick aplica ducking aquí
        └──────┬───────┘
               │
        ┌──────▼──────────┐
        │ BiquadFilter    │  ← Chaos Pad controla este filtro
        │ (Lowpass)       │
        └──┬──────────┬───┘
           │          │
    ┌──────▼──┐  ┌────▼──────┐
    │ DelayNode│  │ Convolver │
    │ +Feedback│  │ (Reverb)  │
    └──────┬───┘  └────┬──────┘
    DelayMix     ReverbMix
           │          │
        ┌──▼──────────▼──┐
        │  PannerNode    │  ← Audio 3D espacial (HRTF)
        │  (HRTF 3D)     │
        └───────┬─────────┘
                │
        ┌───────▼─────────┐
        │   AnalyserNode   │  ← VU Meter + Visualizer3D leen aquí
        └──┬──────────┬────┘
           │          │
    Destination   MediaStream
    (altavoces)   (Grabación)

PERCUSIÓN (One-Shots — bypass del sidechain):
  Kick → Filter → (misma cadena desde BiquadFilter)
  Snare/HiHat/Glitch/Bass → SidechainGain
```

---

## 19. 🔧 Solución de Problemas

| Problema | Causa probable | Solución |
|---|---|---|
| No hay sonido al pulsar Play | Backend no iniciado | Inicia `uvicorn server:app --port 8080 --reload` en `/backend` |
| El kick suena pero no la frecuencia | Freq Vol en 0 o Mute activado | Sube Freq Vol y verifica el botón M de Freq |
| Las perillas se mueven muy bruscas | Throttle normal de 30ms | No es un bug — es el comportamiento esperado |
| El VU Meter no se mueve | Audio detenido o sin señal | Inicia la reproducción; si persiste, recarga la página |
| Los presets LOAD no están iluminados | No hay presets guardados en ese slot | Configura y guarda con SAVE primero |
| El Tap Tempo da BPM muy diferente al esperado | Estás tapeando en otra subdivisión | Tapea en el beat principal (negras), no en corcheas |
| El MIDI no responde | Permisos del navegador | Acepta el permiso de acceso MIDI que pide el browser |
| La app carga pero el audio hace ruido | AudioContext suspendido | Haz clic en cualquier parte de la página para activarlo |

---

*BioSync DSP v4.0 — Manual actualizado Agosto 2026*  
*Fabián Flores — Diseño UX/Multimedia + Desarrollo Web*
