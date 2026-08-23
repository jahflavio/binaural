# Ideas Futuras para BioSync

Estas características están planteadas para futuras iteraciones del proyecto:

## 2. Exportación a WAV directamente desde la Web
Permitir que el servidor devuelva el archivo `.wav` procesado como descarga directa. Así, los terapeutas o usuarios pueden llevarse su protocolo personalizado (ej. de 30 minutos) para escucharlo sin conexión. Esto requiere añadir un endpoint en FastAPI de tipo "descarga directa" y un botón en el UI (React).

## 4. Soporte MIDI (Integración de Hardware)
Usar la **Web MIDI API** en el frontend para conectar controladores físicos (ej. Korg NanoKontrol o Akai APC) por USB. Permitirá modificar en tiempo real el volumen de frecuencias, *beats* o variables acústicas girando perillas reales, acercando el sistema a la sensación de un laboratorio analógico.
