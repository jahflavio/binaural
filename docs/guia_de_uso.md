# 🎛️ Guía de Uso - BioSync DSP V3.0

¡Bienvenido a la versión 3.0! Tu aplicación se ha transformado de un simple generador de frecuencias a un **Secuenciador y Looper para directo**. Aquí tienes cómo aprovechar todas las nuevas funciones.

## Cómo iniciar el sistema

### Método Rápido (Recomendado)
Para simplificar el inicio en Windows, simplemente haz doble clic en el archivo `start.bat` que se encuentra en la carpeta principal del proyecto.
Esto abrirá automáticamente dos ventanas (una para el backend de Python y otra para el frontend de React) y las iniciará por ti. 

La aplicación se abrirá en tu navegador en la dirección `http://localhost:5173`.

*(Nota: La primera vez que lo ejecutes o si hay actualizaciones, el frontend y backend descargarán sus dependencias).*

### Método Manual
Si prefieres iniciar el sistema manualmente, necesitas usar dos terminales:

**Terminal 1 (Backend - Motor de Audio):**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn server:app --reload --port 8000
```

**Terminal 2 (Frontend - Interfaz de Usuario):**
```bash
cd frontend
npm install
npm run dev
```

---

## 1. El Secuenciador de 16 Pasos (Caja de Ritmo)
En el panel lateral verás una nueva cuadrícula de 16 botones para **KICK** (Bombo rojo) y **GLITCH** (Ruido cyan).
- **Cómo usarlo**: Haz clic en los pequeños bloques para encenderlos o apagarlos. Representan los 16 tiempos de un compás.
- **Reproducción**: Actualmente, ajustas el patrón y haces clic en `[ GENERAR & PLAY ]`. El motor de Python creará instantáneamente la pista rítmica exacta que dibujaste, con síntesis matemática pura, y comenzará a reproducirla.

## 2. Looper Multipista (Grabación en Capas)
Ideal para crear texturas complejas y tocar encima de ellas en vivo.
- **Grabar un Loop**: Mientras el audio está sonando, haz clic en `[ REC EN VIVO ]`. Se pondrá rojo. Juega con el *Chaos Pad* o cambia las frecuencias.
- **Detener y Añadir Capa**: Vuelve a hacer clic en `[ DETENER ]`. El audio que acabas de grabar se añadirá automáticamente a la lista "Looper Multipista (Capas)" en la parte inferior del panel izquierdo.
- **Reproducción de Capas**: Estas pistas de la lista comenzarán a sonar en bucle por encima de todo. Puedes usar los botones **M** para silenciarlas (Mute) o **X** para borrarlas.

## 3. Asignación MIDI Dinámica (MIDI Learn)
¡Ya no necesitas programar los botones de tu Boss!
- **Modo "Learn"**: Haz **Doble Clic** en cualquier Knob (Perilla giratoria) de la pantalla. Verás que su borde se enciende en **rojo**.
- **Asignar Hardware**: Simplemente mueve un fader, gira una perilla o presiona un pad en tu caja de ritmo Boss o controlador MIDI.
- **¡Listo!**: El borde rojo desaparecerá y ese control físico ahora manejará el volumen, tempo o frecuencia en la pantalla en tiempo real.

## 4. Estética de Estudio y Knobs 3D
Hemos abandonado los "sliders" aburridos.
- Para usar los nuevos Knobs (perillas), simplemente haz clic en ellos, **mantén presionado** y arrastra el ratón hacia **Arriba o Abajo** para girarlos.
- Los volúmenes y frecuencias reaccionarán instantáneamente.

---

### 🚀 Sobre la Fase 5 (Arquitectura en Tiempo Real)
He preparado el backend (`server.py`) creando los nuevos *Endpoints* de *One-Shot* (`/generate/kick`, `/generate/glitch`).
Esto significa que el motor de audio ya está listo para la **siguiente gran evolución**: convertir la interfaz de React en un secuenciador de "Live Coding" sin latencia, donde no tendrás que pulsar "Generar" nunca más, sino que los ritmos cambiarán al instante. 

¡Por ahora, disfruta tu nueva estación de audio, conecta tu Boss, y empieza a grabar tus loops! Mañana que lo pruebes, me cuentas qué tal la experiencia.
