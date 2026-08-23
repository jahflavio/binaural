// Implementación del Algoritmo de Bjorklund (Ritmos Euclidianos)
// Distribuye uniformemente "pulses" (golpes) a lo largo de "steps" (pasos).

export function generateEuclidean(pulses, steps) {
  let pattern = Array(steps).fill(0);
  if (pulses <= 0) return pattern;
  if (pulses >= steps) return Array(steps).fill(1);
  
  // Usamos una variación del algoritmo de Bresenham
  let error = steps / 2;
  for (let i = 0; i < steps; i++) {
    error -= pulses;
    if (error < 0) {
      pattern[i] = 1;
      error += steps;
    }
  }
  return pattern;
}

export function generateRandomEuclidean(steps = 16) {
  // Retorna un objeto con patrones aleatorios pero rítmicamente válidos para la batería
  const randomPulses = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    kick_pattern: generateEuclidean(randomPulses(2, 6), steps), // Bombo suele tener 2 a 6 golpes
    snare_pattern: generateEuclidean(randomPulses(1, 4), steps),
    hihat_pattern: generateEuclidean(randomPulses(4, 12), steps),
    glitch_pattern: generateEuclidean(randomPulses(1, 8), steps),
    bass_pattern: generateEuclidean(randomPulses(2, 5), steps)
  };
}
