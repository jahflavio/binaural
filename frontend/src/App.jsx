import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import './App.css'

import Knob from './components/Knob'
import SequencerGrid from './components/SequencerGrid'
import Visualizer3D from './components/Visualizer3D'
import { audioBufferToWav } from './utils/wavExporter'

const FREQUENCY_PRESETS = {
  Solfeggio: [
    { name: "174 Hz (Alivio / Base)", freq: 174, lfo: 4, kick: 43.5 },
    { name: "285 Hz (Regeneración)", freq: 285, lfo: 5, kick: 71.25 },
    { name: "396 Hz (Root / Liberación)", freq: 396, lfo: 6, kick: 49.5 },
    { name: "417 Hz (Sacral / Cambio)", freq: 417, lfo: 7, kick: 52.12 },
    { name: "528 Hz (Solar Plexus / Milagros)", freq: 528, lfo: 8, kick: 66 },
    { name: "639 Hz (Heart / Conexión)", freq: 639, lfo: 9, kick: 79.87 },
    { name: "741 Hz (Throat / Intuición)", freq: 741, lfo: 10, kick: 46.31 },
    { name: "852 Hz (Third Eye / Claridad)", freq: 852, lfo: 11, kick: 53.25 },
    { name: "963 Hz (Crown / Divinidad)", freq: 963, lfo: 12, kick: 60.18 },
  ],
  Afinacion: [
    { name: "432 Hz (Naturaleza)", freq: 432, lfo: 8, kick: 54 },
    { name: "440 Hz (Estándar)", freq: 440, lfo: 8, kick: 55 },
  ],
  Somaticas: [
    { name: "40 Hz (Corteza Cerebral)", freq: 40, lfo: 40, kick: 40 },
    { name: "50 Hz (Sistema Muscular)", freq: 50, lfo: 2, kick: 50 },
    { name: "60 Hz (Sistema Esquelético)", freq: 60, lfo: 3, kick: 60 },
    { name: "62 Hz (SNC)", freq: 62, lfo: 4, kick: 62 },
    { name: "70 Hz (Memoria Somática)", freq: 70, lfo: 5, kick: 70 },
    { name: "80 Hz (Nervio Vago)", freq: 80, lfo: 6, kick: 80 },
    { name: "95 Hz (Articulaciones)", freq: 95, lfo: 7, kick: 47.5 },
    { name: "100 Hz (Flujo Linfático)", freq: 100, lfo: 8, kick: 50 },
    { name: "111 Hz (Templo Antiguo / Trance)", freq: 111, lfo: 2, kick: 55.5 },
    { name: "144 Hz (Soberanía Energética)", freq: 144, lfo: 9, kick: 72 },
    { name: "256 Hz (Energía Vital)", freq: 256, lfo: 10, kick: 64 },
  ],
  Brainwaves: [
    { name: "Delta (2 Hz - Sueño Profundo)", freq: 100, lfo: 2, kick: 50 },
    { name: "Theta (6 Hz - Meditación)", freq: 136.1, lfo: 6, kick: 68.05 },
    { name: "Alpha (10 Hz - Calma)", freq: 211.44, lfo: 10, kick: 52.86 },
    { name: "Beta (15 Hz - Enfoque)", freq: 300, lfo: 15, kick: 75 },
    { name: "Gamma (40 Hz - Insight)", freq: 400, lfo: 40, kick: 50 },
  ]
};

function App() {
  const [params, setParams] = useState({
    duration: 15,
    bpm: 120,
    carrier_freq: 528.0,
    isochronic_beat: 6.0,
    binaural_offset: 0.0,
    kick_freq: 55.5,
    kick_pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    glitch_pattern: [1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0],
    snare_pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    hihat_pattern: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
    bass_pattern: [1,0,0,1,0,0,1,0,1,0,0,0,0,0,0,0],
    global_mute_pattern: Array(16).fill(0),
    texture_type: 'none',
    texture_vol: 0.5,
    freq_vol: 0.5,
    beat_vol: 0.8,
    glitch_vol: 0.4,
    snare_vol: 0.6,
    hihat_vol: 0.5,
    bass_vol: 0.8,
    user_vol: 0.6,
    delay_time: 0.3,
    delay_feedback: 0.4,
    delay_mix: 0.0,
    reverb_time: 2.5,
    reverb_mix: 0.0,
    sidechain_amount: 0.0,
    mute_texture: false,
    mute_freq: false,
    mute_beat: false,
    mute_snare: false,
    mute_hihat: false,
    mute_bass: false,
    mute_glitch: false,
    auto_lfo: false,
    midi_slave: false,
    kick_prob: Array(16).fill(1.0),
    snare_prob: Array(16).fill(1.0),
    hihat_prob: Array(16).fill(1.0),
    glitch_prob: Array(16).fill(1.0),
    bass_prob: Array(16).fill(1.0)
  })
  
  const [selectedFile, setSelectedFile] = useState(null)
  
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [layers, setLayers] = useState([])
  const [activeLearnParam, setActiveLearnParam] = useState(null)
  
  const paramsRef = useRef(params)
  useEffect(() => { paramsRef.current = params }, [params])
  
  const audioContextRef = useRef(null)
  const audioBuffers = useRef({ kick: null, glitch: null, snare: null, hihat: null })
  const lastFetchedKickFreq = useRef(null)
  const schedulerState = useRef({ nextNoteTime: 0.0, current16thNote: 0, timerID: null })
  const scheduleNoteRef = useRef(null)
  const isPlayingRef = useRef(false)
  const midiTicksCountRef = useRef(0)
  
  const synthNodesRef = useRef({
    carrierL: null, carrierR: null, lfo: null, carrierGainL: null, carrierGainR: null, lfoGain: null, masterGain: null, sidechainGain: null, textureSource: null, textureGain: null, dcOffset: null, delay: null, delayFeedback: null, delayMix: null, convolver: null, reverbMix: null
  })
  
  const layerSourcesRef = useRef({})
  const midiMapRef = useRef({})
  const midiLearnRef = useRef({ active: false, param: null })
  const setActiveLearnParamRef = useRef(null)
  
  useEffect(() => { setActiveLearnParamRef.current = setActiveLearnParam }, [])
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const filterRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const chaosPadRef = useRef(null)
  const requestRef = useRef(null)
  const isDragging = useRef(false)
  const midiOutputsRef = useRef([])
  const clockIntervalRef = useRef(null)

  // Setup Web MIDI API
  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
    }
    
    function onMIDISuccess(midiAccess) {
      console.log("MIDI Listo. Esperando eventos...")
      const outputs = []
      midiAccess.outputs.forEach(port => outputs.push(port))
      midiOutputsRef.current = outputs
      
      for (let input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage
      }
    }
    
    function onMIDIFailure() {
      console.warn("No se pudo acceder a dispositivos MIDI.")
    }
    
    function getMIDIMessage(message) {
      const command = message.data[0]
      
      // Handle MIDI Clock for Slave Mode
      if (command === 0xF8 && paramsRef.current.midi_slave && isPlayingRef.current) {
        midiTicksCountRef.current++;
        if (midiTicksCountRef.current >= 6) { // 24 PPQN / 4 = 6 ticks por semicorchea
          midiTicksCountRef.current = 0;
          const now = audioContextRef.current ? audioContextRef.current.currentTime : 0;
          if (scheduleNoteRef.current) {
            scheduleNoteRef.current(schedulerState.current.current16thNote, now);
          }
          schedulerState.current.current16thNote = (schedulerState.current.current16thNote + 1) % 16;
        }
        return;
      }
      
      const note = message.data[1]
      const velocity = (message.data.length > 2) ? message.data[2] : 0 
      
      console.log(`MIDI Cmd: ${command}, Note/CC: ${note}, Vel: ${velocity}`)
      
      const id = `${command}-${note}`
      
      // MIDI Learn Logic
      if (midiLearnRef.current.active) {
        midiMapRef.current[id] = midiLearnRef.current.param
        midiLearnRef.current = { active: false, param: null }
        if (setActiveLearnParamRef.current) setActiveLearnParamRef.current(null)
        console.log(`Mapeado MIDI ${id} a ${midiMapRef.current[id]}`)
        return
      }
      
      // Execute Mapped Control
      if (midiMapRef.current[id]) {
        const param = midiMapRef.current[id]
        // Normalize velocity 0-127 to parameter specific bounds
        let val = velocity / 127.0
        // Specific ranges scaling
        if (param === 'bpm') val = 60 + val * 120
        if (param === 'carrier_freq') val = 40 + val * 923
        if (param === 'isochronic_beat') val = 0.5 + val * 39.5
        if (param === 'binaural_offset') val = val * 40
        
        // Use setState with functional update to have latest state
        setParams(p => ({...p, [param]: val}))
      }
    }
  }, [])

  // UseEffect to update MIDI Clock when BPM changes or playback starts/stops (Solo si es Master)
  useEffect(() => {
    if (clockIntervalRef.current) {
      clearInterval(clockIntervalRef.current)
      clockIntervalRef.current = null
    }
    
    if (isPlaying && !params.midi_slave) {
      // 24 PPQN (Pulses Per Quarter Note)
      const intervalMs = 60000 / (params.bpm * 24)
      clockIntervalRef.current = setInterval(() => {
        midiOutputsRef.current.forEach(port => port.send([0xF8])) // MIDI Clock Tick
      }, intervalMs)
    }
    
    return () => {
      if (clockIntervalRef.current) clearInterval(clockIntervalRef.current)
    }
  }, [isPlaying, params.bpm, params.midi_slave])
  
  const handleMidiLearn = (paramName) => {
    midiLearnRef.current = { active: true, param: paramName }
    setActiveLearnParam(paramName)
  }

  // Inicializar Web Audio API y Analyser
  useEffect(() => {
    // Setup Audio Context
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioContextRef.current = new AudioContext()
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 2048
    
    return () => {
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

  // Auto-LFO Logic
  useEffect(() => {
    if (!params.auto_lfo) return;
    
    let animationFrame;
    let startTime = performance.now();
    
    const animate = (time) => {
      const elapsed = (time - startTime) / 1000;
      // Oscillate Binaural Offset between 0 and 15Hz over 20 seconds
      const lfoOffset = (Math.sin(elapsed * Math.PI * 2 / 20) + 1) * 7.5; 
      
      setParams(p => {
        // Only update if it actually changed significantly to avoid spamming re-renders
        if (Math.abs(p.binaural_offset - lfoOffset) > 0.1) {
          return { ...p, binaural_offset: lfoOffset };
        }
        return p;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [params.auto_lfo]);

  const generateImpulseResponse = (ctx, duration, decay) => {
    const length = ctx.sampleRate * duration;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);
    for (let i = 0; i < length; i++) {
      const n = (1 - i / length) ** decay;
      left[i] = (Math.random() * 2 - 1) * n;
      right[i] = (Math.random() * 2 - 1) * n;
    }
    return impulse;
  };

  const createNoiseBuffer = (type) => {
    if (!audioContextRef.current) return null;
    const bufferSize = audioContextRef.current.sampleRate * 5; // 5 seconds
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const output = buffer.getChannelData(0);
    if (type === 'pink') {
      let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
      for (let i = 0; i < bufferSize; i++) {
        let white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'rain') {
       let lastOut = 0;
       for (let i = 0; i < bufferSize; i++) {
         let white = Math.random() * 2 - 1;
         output[i] = (lastOut + (0.02 * white)) / 1.02;
         lastOut = output[i];
         output[i] *= 3.5;
       }
    }
    return buffer;
  }

  // Actualizar parámetros de los osciladores en tiempo real
  useEffect(() => {
    if (!isPlaying) return;
    const nodes = synthNodesRef.current;
    if (nodes.carrierL && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      nodes.carrierL.frequency.setTargetAtTime(params.carrier_freq, now, 0.05);
      nodes.carrierR.frequency.setTargetAtTime(params.carrier_freq + params.binaural_offset, now, 0.05);
      nodes.lfo.frequency.setTargetAtTime(params.isochronic_beat, now, 0.05);
      nodes.masterGain.gain.setTargetAtTime(params.mute_freq ? 0 : params.freq_vol, now, 0.05);
      if (nodes.textureGain) {
        nodes.textureGain.gain.setTargetAtTime(params.mute_texture || params.texture_type === 'none' ? 0 : params.texture_vol, now, 0.05);
      }
      if (nodes.delay) {
        nodes.delay.delayTime.setTargetAtTime(params.delay_time, now, 0.05);
        nodes.delayFeedback.gain.setTargetAtTime(params.delay_feedback, now, 0.05);
        nodes.delayMix.gain.setTargetAtTime(params.delay_mix, now, 0.05);
      }
      if (nodes.reverbMix) {
        nodes.reverbMix.gain.setTargetAtTime(params.reverb_mix, now, 0.05);
      }
    }
  }, [isPlaying, params.carrier_freq, params.binaural_offset, params.isochronic_beat, params.freq_vol, params.texture_vol, params.texture_type, params.mute_freq, params.mute_texture, params.delay_time, params.delay_feedback, params.delay_mix, params.reverb_mix]);

  // Actualizar la fuente de textura si cambia el tipo
  useEffect(() => {
    if (!isPlaying) return;
    const nodes = synthNodesRef.current;
    if (nodes.textureSource) {
      try { nodes.textureSource.stop(); nodes.textureSource.disconnect(); } catch(e){}
      nodes.textureSource = null;
    }
    if (params.texture_type !== 'none' && nodes.textureGain) {
      const noiseBuffer = createNoiseBuffer(params.texture_type);
      if (noiseBuffer) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        source.connect(nodes.textureGain);
        source.start();
        nodes.textureSource = source;
      }
    }
  }, [isPlaying, params.texture_type]);

  const applyPreset = (presetStr) => {
    if (!presetStr) return;
    const preset = JSON.parse(presetStr);
    setParams(p => ({ 
      ...p, 
      carrier_freq: preset.freq, 
      isochronic_beat: preset.lfo, 
      kick_freq: preset.kick 
    }));
  }

  const generateAndPlay = async () => {
    try {
      setIsLoading(true)
      isPlayingRef.current = true
      setIsPlaying(true)
      
      // Send MIDI Start
      midiOutputsRef.current.forEach(port => port.send([0xFA]))

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }
    
      // 1. Fetch One-Shots for the sequencer
      if (!audioBuffers.current.kick || lastFetchedKickFreq.current !== params.kick_freq) {
        const kickRes = await fetch(`http://127.0.0.1:8080/generate/kick?kick_freq=${params.kick_freq}`)
        audioBuffers.current.kick = await audioContextRef.current.decodeAudioData(await kickRes.arrayBuffer())
        lastFetchedKickFreq.current = params.kick_freq
      }
      if (!audioBuffers.current.glitch) {
        const glitchRes = await fetch(`http://127.0.0.1:8080/generate/glitch`)
        audioBuffers.current.glitch = await audioContextRef.current.decodeAudioData(await glitchRes.arrayBuffer())
      }
      if (!audioBuffers.current.snare) {
        const snareRes = await fetch(`http://127.0.0.1:8080/generate/snare`)
        audioBuffers.current.snare = await audioContextRef.current.decodeAudioData(await snareRes.arrayBuffer())
      }
      if (!audioBuffers.current.hihat) {
        const hihatRes = await fetch(`http://127.0.0.1:8080/generate/hihat`)
        audioBuffers.current.hihat = await audioContextRef.current.decodeAudioData(await hihatRes.arrayBuffer())
      }

      // Setup Lowpass Filter for Chaos Pad
      const filter = audioContextRef.current.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 20000 // default open
      filterRef.current = filter

      // Setup Sidechain Node
      const sidechainGain = audioContextRef.current.createGain()
      sidechainGain.gain.value = 1.0
      synthNodesRef.current.sidechainGain = sidechainGain
      
      // Setup Delay Node (Efecto Espacial)
      const delay = audioContextRef.current.createDelay(5.0)
      delay.delayTime.value = params.delay_time
      const delayFeedback = audioContextRef.current.createGain()
      delayFeedback.gain.value = params.delay_feedback
      const delayMix = audioContextRef.current.createGain()
      delayMix.gain.value = params.delay_mix
      
      delay.connect(delayFeedback)
      delayFeedback.connect(delay)
      delay.connect(delayMix)
      
      synthNodesRef.current.delay = delay
      synthNodesRef.current.delayFeedback = delayFeedback
      synthNodesRef.current.delayMix = delayMix

      // Setup Reverb Node (Convolver)
      const convolver = audioContextRef.current.createConvolver()
      convolver.buffer = generateImpulseResponse(audioContextRef.current, params.reverb_time, 2.0)
      const reverbMix = audioContextRef.current.createGain()
      reverbMix.gain.value = params.reverb_mix
      
      convolver.connect(reverbMix)
      
      synthNodesRef.current.convolver = convolver
      synthNodesRef.current.reverbMix = reverbMix

      // Setup 3D Spatial Panner
      const panner = audioContextRef.current.createPanner()
      panner.panningModel = 'HRTF'
      panner.positionX.value = 0
      panner.positionY.value = 0
      panner.positionZ.value = 3

      // 2. Setup Real-time Synth Drone (or external file)
      let externalSource = null;
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        for (const key in params) {
          if (Array.isArray(params[key])) formData.append(key, params[key].join(','))
          else formData.append(key, params[key])
        }
        const response = await fetch(`http://127.0.0.1:8080/process`, { method: 'POST', body: formData })
        const droneBuffer = await audioContextRef.current.decodeAudioData(await response.arrayBuffer())
        externalSource = audioContextRef.current.createBufferSource()
        externalSource.buffer = droneBuffer
        externalSource.loop = true
        externalSource.connect(sidechainGain)
        externalSource.start(0)
        sourceRef.current = externalSource
      } else {
        // Real-Time Web Audio Synth
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        
        const carrierL = ctx.createOscillator();
        const carrierR = ctx.createOscillator();
        const lfo = ctx.createOscillator(); // Isochronic Beat LFO
        
        carrierL.frequency.value = params.carrier_freq;
        carrierR.frequency.value = params.carrier_freq + params.binaural_offset;
        lfo.frequency.value = params.isochronic_beat;
        
        const carrierGainL = ctx.createGain();
        const carrierGainR = ctx.createGain();
        const lfoGain = ctx.createGain();
        
        // AM Modulation mapping LFO (-1 to 1) to (0 to 1) roughly
        lfoGain.gain.value = 0.5;
        // DC offset to keep signal positive
        const dcOffset = ctx.createBufferSource();
        const dcBuffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        dcBuffer.getChannelData(0)[0] = 0.5;
        dcOffset.buffer = dcBuffer;
        dcOffset.loop = true;
        
        const modMergerL = ctx.createGain();
        const modMergerR = ctx.createGain();
        
        dcOffset.connect(modMergerL);
        lfo.connect(lfoGain);
        lfoGain.connect(modMergerL);
        
        dcOffset.connect(modMergerR);
        lfoGain.connect(modMergerR); // LFO applies to both ears if isochronic
        
        // Modulate amplitudes
        modMergerL.connect(carrierGainL.gain);
        modMergerR.connect(carrierGainR.gain);
        
        carrierL.connect(carrierGainL);
        carrierR.connect(carrierGainR);
        
        const merger = ctx.createChannelMerger(2);
        carrierGainL.connect(merger, 0, 0);
        carrierGainR.connect(merger, 0, 1);
        
        const textureGain = ctx.createGain();
        textureGain.gain.value = params.mute_texture || params.texture_type === 'none' ? 0 : params.texture_vol;
        
        const masterGain = ctx.createGain();
        masterGain.gain.value = params.mute_freq ? 0 : params.freq_vol;
        
        merger.connect(masterGain);
        textureGain.connect(masterGain);
        masterGain.connect(sidechainGain);
        
        carrierL.start(now);
        carrierR.start(now);
        lfo.start(now);
        dcOffset.start(now);
        
        synthNodesRef.current = {
          ...synthNodesRef.current,
          carrierL, carrierR, lfo, carrierGainL, carrierGainR, lfoGain, masterGain, sidechainGain, textureGain, dcOffset, merger
        };

        if (params.texture_type !== 'none') {
           const noiseBuffer = createNoiseBuffer(params.texture_type);
           const tSrc = ctx.createBufferSource();
           tSrc.buffer = noiseBuffer;
           tSrc.loop = true;
           tSrc.connect(textureGain);
           tSrc.start(now);
           synthNodesRef.current.textureSource = tSrc;
        }

        sourceRef.current = {
           playbackRate: { setTargetAtTime: () => {} },
           stop: () => {
             try { carrierL.stop(); carrierR.stop(); lfo.stop(); dcOffset.stop(); } catch(e){}
             if (synthNodesRef.current.textureSource) {
               try { synthNodesRef.current.textureSource.stop(); } catch(e){}
             }
           }
        }
      }
      
      // Enrutamiento Final
      sidechainGain.connect(filter)
      filter.connect(delay)
      filter.connect(convolver)
      filter.connect(panner)
      
      delayMix.connect(panner)
      reverbMix.connect(panner)
      
      panner.connect(analyserRef.current)
      analyserRef.current.connect(audioContextRef.current.destination)
      
      const streamDest = audioContextRef.current.createMediaStreamDestination()
      analyserRef.current.connect(streamDest)
      
      const mediaRecorder = new MediaRecorder(streamDest.stream)
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data)
      }
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
        recordedChunksRef.current = []
        try {
          const arrayBuffer = await blob.arrayBuffer()
          const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
          setLayers(prev => [...prev, { id: Date.now(), buffer: audioBuffer, isMuted: false }])
        } catch(e) {
          console.error("Error decoding loop", e)
        }
      }
      mediaRecorderRef.current = mediaRecorder
      
      layers.forEach(layer => {
        if (layer.isMuted) return
        const source = audioContextRef.current.createBufferSource()
        source.buffer = layer.buffer
        source.loop = true
        source.connect(audioContextRef.current.destination)
        source.start(0)
        layerSourcesRef.current[layer.id] = source
      })

      const scheduleNote = (beatNumber, time) => {
        const currentParams = paramsRef.current;
        
        // Mute Global por Paso
        if (currentParams.global_mute_pattern && currentParams.global_mute_pattern[beatNumber] === 1) {
          return;
        }

        if (currentParams.kick_pattern[beatNumber] === 1 && audioBuffers.current.kick && Math.random() <= currentParams.kick_prob[beatNumber]) {
          const src = audioContextRef.current.createBufferSource()
          src.buffer = audioBuffers.current.kick
          const gain = audioContextRef.current.createGain()
          gain.gain.value = currentParams.mute_beat ? 0 : currentParams.beat_vol
          src.connect(gain)
          gain.connect(filter)
          src.start(time)
          
          // Sidechain Ducking
          if (currentParams.sidechain_amount > 0 && synthNodesRef.current.sidechainGain) {
            const duckVal = Math.max(0.1, 1.0 - currentParams.sidechain_amount);
            const scNode = synthNodesRef.current.sidechainGain.gain;
            scNode.cancelScheduledValues(time);
            scNode.setValueAtTime(1.0, time);
            scNode.setTargetAtTime(duckVal, time + 0.01, 0.01);
            scNode.setTargetAtTime(1.0, time + 0.1, 0.15); // Release
          }
        }
        if (currentParams.snare_pattern[beatNumber] === 1 && audioBuffers.current.snare && Math.random() <= currentParams.snare_prob[beatNumber]) {
          const src = audioContextRef.current.createBufferSource()
          src.buffer = audioBuffers.current.snare
          const gain = audioContextRef.current.createGain()
          gain.gain.value = currentParams.mute_snare ? 0 : currentParams.snare_vol
          src.connect(gain)
          if (synthNodesRef.current.sidechainGain) gain.connect(synthNodesRef.current.sidechainGain)
          else gain.connect(filter)
          src.start(time)
        }
        if (currentParams.hihat_pattern[beatNumber] === 1 && audioBuffers.current.hihat && Math.random() <= currentParams.hihat_prob[beatNumber]) {
          const src = audioContextRef.current.createBufferSource()
          src.buffer = audioBuffers.current.hihat
          const gain = audioContextRef.current.createGain()
          gain.gain.value = currentParams.mute_hihat ? 0 : currentParams.hihat_vol
          src.connect(gain)
          if (synthNodesRef.current.sidechainGain) gain.connect(synthNodesRef.current.sidechainGain)
          else gain.connect(filter)
          src.start(time)
        }
        if (currentParams.glitch_pattern[beatNumber] === 1 && audioBuffers.current.glitch && Math.random() <= currentParams.glitch_prob[beatNumber]) {
          const src = audioContextRef.current.createBufferSource()
          src.buffer = audioBuffers.current.glitch
          const gain = audioContextRef.current.createGain()
          gain.gain.value = currentParams.mute_glitch ? 0 : currentParams.glitch_vol
          src.connect(gain)
          if (synthNodesRef.current.sidechainGain) gain.connect(synthNodesRef.current.sidechainGain)
          else gain.connect(filter)
          src.start(time)
        }
        if (currentParams.bass_pattern[beatNumber] === 1 && Math.random() <= currentParams.bass_prob[beatNumber]) {
          const osc = audioContextRef.current.createOscillator()
          const gain = audioContextRef.current.createGain()
          osc.type = 'sine'
          osc.frequency.value = currentParams.kick_freq / 2
          
          gain.gain.setValueAtTime(0, time)
          gain.gain.linearRampToValueAtTime((currentParams.mute_bass ? 0 : currentParams.bass_vol) * 0.8, time + 0.05)
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4)
          
          osc.connect(gain)
          if (synthNodesRef.current.sidechainGain) gain.connect(synthNodesRef.current.sidechainGain)
          else gain.connect(filter)
          osc.start(time)
          osc.stop(time + 0.5)
        }
      }
      
      scheduleNoteRef.current = scheduleNote;

      const nextNote = () => {
        const secondsPerBeat = 60.0 / paramsRef.current.bpm
        schedulerState.current.nextNoteTime += 0.25 * secondsPerBeat
        schedulerState.current.current16thNote = (schedulerState.current.current16thNote + 1) % 16
      }

      const scheduler = () => {
        if (!audioContextRef.current || !sourceRef.current) return 
        if (!paramsRef.current.midi_slave) {
          while (schedulerState.current.nextNoteTime < audioContextRef.current.currentTime + 0.1) {
            scheduleNote(schedulerState.current.current16thNote, schedulerState.current.nextNoteTime)
            nextNote()
          }
        }
        schedulerState.current.timerID = setTimeout(scheduler, 25.0)
      }

      schedulerState.current.current16thNote = 0
      schedulerState.current.nextNoteTime = audioContextRef.current.currentTime + 0.05
      
      setTimeout(scheduler, 0)
      
    } catch (error) {
      console.error('Error generating audio:', error)
      alert("Error al iniciar el motor de audio o conectar con el servidor para percusión.")
    } finally {
      setIsLoading(false)
    }
  }

  const stopAudio = () => {
    setIsPlaying(false)
    isPlayingRef.current = false
    midiTicksCountRef.current = 0
    if (sourceRef.current) {
      if (schedulerState.current.timerID) clearTimeout(schedulerState.current.timerID)
      try { sourceRef.current.stop() } catch(e){}
      sourceRef.current = null;
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
      Object.values(layerSourcesRef.current).forEach(src => {
        try { src.stop(); src.disconnect() } catch(e){}
      })
      layerSourcesRef.current = {}
    }
    
    // Send MIDI Stop
    midiOutputsRef.current.forEach(port => port.send([0xFC]))
  }

  const exportWavStems = () => {
    layers.forEach((layer, index) => {
      const wavBuffer = audioBufferToWav(layer.buffer)
      const blob = new Blob([wavBuffer], { type: 'audio/wav' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `biosync_stem_${index + 1}.wav`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    })
  }

  const handleRecord = () => {
    if (!mediaRecorderRef.current || !isPlaying) return
    
    if (isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    } else {
      recordedChunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  // --- CHAOS PAD LOGIC ---
  const handlePointerDown = (e) => {
    isDragging.current = true
    updateChaosPad(e)
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    updateChaosPad(e)
  }

  const handlePointerUp = () => {
    if (isDragging.current) {
      isDragging.current = false
      resetChaosPad()
    }
  }

  const handlePointerLeave = () => {
    if (isDragging.current) {
      isDragging.current = false
      resetChaosPad()
    }
  }

  const updateChaosPad = (e) => {
    if (!chaosPadRef.current || !sourceRef.current || !filterRef.current || !audioContextRef.current) return
    
    const rect = chaosPadRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    const pitch = 0.5 + (x * 1.0)
    const minFreq = 200
    const maxFreq = 20000
    const freq = minFreq * Math.pow(maxFreq / minFreq, 1 - y)
    
    const now = audioContextRef.current.currentTime
    sourceRef.current.playbackRate.setTargetAtTime(pitch, now, 0.05)
    filterRef.current.frequency.setTargetAtTime(freq, now, 0.05)
  }

  const resetChaosPad = () => {
    if (!sourceRef.current || !filterRef.current || !audioContextRef.current) return
    const now = audioContextRef.current.currentTime
    sourceRef.current.playbackRate.setTargetAtTime(1.0, now, 0.2)
    filterRef.current.frequency.setTargetAtTime(20000, now, 0.2)
  }

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key.toLowerCase()) {
        case ' ': // Space
          e.preventDefault();
          if (isPlayingRef.current) stopAudio(); else generateAndPlay();
          break;
        case 'm':
          setParams(p => {
            const allMuted = p.mute_beat && p.mute_snare && p.mute_hihat && p.mute_glitch && p.mute_bass;
            return {
              ...p, 
              mute_beat: !allMuted, 
              mute_snare: !allMuted, 
              mute_hihat: !allMuted, 
              mute_glitch: !allMuted, 
              mute_bass: !allMuted 
            };
          });
          break;
        case '1': setParams(p => ({...p, mute_beat: !p.mute_beat})); break;
        case '2': setParams(p => ({...p, mute_snare: !p.mute_snare})); break;
        case '3': setParams(p => ({...p, mute_hihat: !p.mute_hihat})); break;
        case '4': setParams(p => ({...p, mute_glitch: !p.mute_glitch})); break;
        case '5': setParams(p => ({...p, mute_bass: !p.mute_bass})); break;
        case 'r':
          const recBtn = document.getElementById('rec-btn');
          const stopRecBtn = document.getElementById('stop-rec-btn');
          if (recBtn && !recBtn.disabled) recBtn.click();
          else if (stopRecBtn && !stopRecBtn.disabled) stopRecBtn.click();
          break;
        case 'c':
          const chaosBtn = document.getElementById('chaos-btn');
          if (chaosBtn) chaosBtn.click();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="mono">BIOSYNC DSP / VISUALIZER</h1>
        <p>Matriz de Resonancia | Estética Glitch (Raster-Noton) | Interfaz Web Audio</p>
      </header>
      
      <main className="main-content">
        <aside className="control-panel mono">
          <div className="control-group" style={{ width: '100%' }}>
            <label style={{color: 'var(--accent)', marginBottom: '0.8rem', display: 'block'}}>Panel Principal de Perillas</label>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Knob label="BPM" value={params.bpm} min={60} max={180} onChange={v => setParams(p => ({...p, bpm: v}))} onMidiLearn={() => handleMidiLearn('bpm')} midiLearnActive={activeLearnParam === 'bpm'} />
              <Knob label="Frec. Base" value={params.carrier_freq} min={40} max={963} onChange={v => setParams(p => ({...p, carrier_freq: v}))} onMidiLearn={() => handleMidiLearn('carrier_freq')} midiLearnActive={activeLearnParam === 'carrier_freq'} />
              <Knob label="Isocrónico" value={params.isochronic_beat} min={0.5} max={40} onChange={v => setParams(p => ({...p, isochronic_beat: v}))} onMidiLearn={() => handleMidiLearn('isochronic_beat')} midiLearnActive={activeLearnParam === 'isochronic_beat'} />
              <Knob label="Binaural" value={params.binaural_offset} min={0} max={40} onChange={v => setParams(p => ({...p, binaural_offset: v}))} onMidiLearn={() => handleMidiLearn('binaural_offset')} midiLearnActive={activeLearnParam === 'binaural_offset'} />
              <div style={{ width: '1px', background: '#333', margin: '0 0.5rem' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Knob label="Vol Textura" value={params.texture_vol} min={0} max={1} onChange={v => setParams(p => ({...p, texture_vol: v}))} onMidiLearn={() => handleMidiLearn('texture_vol')} midiLearnActive={activeLearnParam === 'texture_vol'} />
                <button 
                  onClick={() => setParams(p => ({...p, mute_texture: !p.mute_texture}))}
                  style={{ marginTop: '0.2rem', padding: '2px 8px', fontSize: '0.6rem', background: params.mute_texture ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {params.mute_texture ? 'M' : 'M'}
                </button>
              </div>
              <div style={{ width: '1px', background: '#333', margin: '0 0.5rem' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Knob label="Freq Vol" value={params.freq_vol} min={0} max={1} onChange={v => setParams(p => ({...p, freq_vol: v}))} onMidiLearn={() => handleMidiLearn('freq_vol')} midiLearnActive={activeLearnParam === 'freq_vol'} />
                <button 
                  onClick={() => setParams(p => ({...p, mute_freq: !p.mute_freq}))}
                  style={{ marginTop: '0.2rem', padding: '2px 8px', fontSize: '0.6rem', background: params.mute_freq ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
                >M</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Knob label="Kick Vol" value={params.beat_vol} min={0} max={1} onChange={v => setParams(p => ({...p, beat_vol: v}))} onMidiLearn={() => handleMidiLearn('beat_vol')} midiLearnActive={activeLearnParam === 'beat_vol'} />
                <button 
                  onClick={() => setParams(p => ({...p, mute_beat: !p.mute_beat}))}
                  style={{ marginTop: '0.2rem', padding: '2px 8px', fontSize: '0.6rem', background: params.mute_beat ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
                >M</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Knob label="Glitch Vol" value={params.glitch_vol} min={0} max={1} onChange={v => setParams(p => ({...p, glitch_vol: v}))} onMidiLearn={() => handleMidiLearn('glitch_vol')} midiLearnActive={activeLearnParam === 'glitch_vol'} />
                <button 
                  onClick={() => setParams(p => ({...p, mute_glitch: !p.mute_glitch}))}
                  style={{ marginTop: '0.2rem', padding: '2px 8px', fontSize: '0.6rem', background: params.mute_glitch ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
                >M</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Knob label="Snare Vol" value={params.snare_vol} min={0} max={1} onChange={v => setParams(p => ({...p, snare_vol: v}))} onMidiLearn={() => handleMidiLearn('snare_vol')} midiLearnActive={activeLearnParam === 'snare_vol'} />
                <button 
                  onClick={() => setParams(p => ({...p, mute_snare: !p.mute_snare}))}
                  style={{ marginTop: '0.2rem', padding: '2px 8px', fontSize: '0.6rem', background: params.mute_snare ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
                >M</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Knob label="HiHat Vol" value={params.hihat_vol} min={0} max={1} onChange={v => setParams(p => ({...p, hihat_vol: v}))} onMidiLearn={() => handleMidiLearn('hihat_vol')} midiLearnActive={activeLearnParam === 'hihat_vol'} />
                <button 
                  onClick={() => setParams(p => ({...p, mute_hihat: !p.mute_hihat}))}
                  style={{ marginTop: '0.2rem', padding: '2px 8px', fontSize: '0.6rem', background: params.mute_hihat ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
                >M</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Knob label="Bass Vol" value={params.bass_vol} min={0} max={1} onChange={v => setParams(p => ({...p, bass_vol: v}))} onMidiLearn={() => handleMidiLearn('bass_vol')} midiLearnActive={activeLearnParam === 'bass_vol'} />
                <button 
                  onClick={() => setParams(p => ({...p, mute_bass: !p.mute_bass}))}
                  style={{ marginTop: '0.2rem', padding: '2px 8px', fontSize: '0.6rem', background: params.mute_bass ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer' }}
                >M</button>
              </div>
            </div>
          </div>
          
          <div className="control-group">
            <label style={{color: 'var(--accent)'}}>Rack de Efectos (FX)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
              <Knob label="Delay Time" value={params.delay_time} min={0.01} max={1.5} onChange={v => setParams(p => ({...p, delay_time: v}))} onMidiLearn={() => handleMidiLearn('delay_time')} midiLearnActive={activeLearnParam === 'delay_time'} />
              <Knob label="Feedback" value={params.delay_feedback} min={0} max={0.9} onChange={v => setParams(p => ({...p, delay_feedback: v}))} onMidiLearn={() => handleMidiLearn('delay_feedback')} midiLearnActive={activeLearnParam === 'delay_feedback'} />
              <Knob label="Delay Mix" value={params.delay_mix} min={0} max={1} onChange={v => setParams(p => ({...p, delay_mix: v}))} onMidiLearn={() => handleMidiLearn('delay_mix')} midiLearnActive={activeLearnParam === 'delay_mix'} />
              
              <Knob label="Reverb Time" value={params.reverb_time} min={0.5} max={10.0} onChange={v => {
                setParams(p => ({...p, reverb_time: v}));
                // Regenerar buffer en vivo si cambia mucho
                if (synthNodesRef.current.convolver && audioContextRef.current) {
                  synthNodesRef.current.convolver.buffer = generateImpulseResponse(audioContextRef.current, v, 2.0);
                }
              }} onMidiLearn={() => handleMidiLearn('reverb_time')} midiLearnActive={activeLearnParam === 'reverb_time'} />
              
              <Knob label="Reverb Mix" value={params.reverb_mix} min={0} max={1} onChange={v => setParams(p => ({...p, reverb_mix: v}))} onMidiLearn={() => handleMidiLearn('reverb_mix')} midiLearnActive={activeLearnParam === 'reverb_mix'} />
              <Knob label="Sidechain" value={params.sidechain_amount} min={0} max={1} onChange={v => setParams(p => ({...p, sidechain_amount: v}))} onMidiLearn={() => handleMidiLearn('sidechain_amount')} midiLearnActive={activeLearnParam === 'sidechain_amount'} />
            </div>
          </div>

          <div className="control-group">
            <div style={{ padding: '1rem', background: '#222', borderRadius: '4px', border: '1px solid #444', textAlign: 'center' }}>
              <button 
                onClick={() => setParams(p => ({...p, auto_lfo: !p.auto_lfo}))}
                style={{ 
                  background: params.auto_lfo ? '#ff4444' : '#333', 
                  color: '#fff', 
                  border: '1px solid #555', 
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {params.auto_lfo ? "LFO: ACTIVO" : "AUTO LFO"}
              </button>
              <div style={{ fontSize: '0.65rem', color: '#aaa', marginTop: '0.5rem' }}>Automatiza la perilla Binaural suavemente</div>
            </div>
            
            <div style={{ padding: '1rem', background: '#222', borderRadius: '4px', border: '1px solid #444', textAlign: 'center', marginTop: '1rem' }}>
              <button 
                onClick={() => setParams(p => ({...p, midi_slave: !p.midi_slave}))}
                style={{ 
                  background: params.midi_slave ? '#4444ff' : '#333', 
                  color: '#fff', 
                  border: '1px solid #555', 
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  width: '100%'
                }}
              >
                {params.midi_slave ? "CLOCK: SLAVE (EXT)" : "CLOCK: MASTER (INT)"}
              </button>
              <div style={{ fontSize: '0.65rem', color: '#aaa', marginTop: '0.5rem' }}>Master = Domina Hardware | Slave = Obedece Hardware</div>
            </div>
            
            <div style={{ padding: '1rem', background: '#222', borderRadius: '4px', border: '1px solid #444', marginTop: '1rem' }}>
              <strong style={{color: 'var(--accent)'}}>Atajos de Teclado:</strong><br/>
              - <kbd>ESPACIO</kbd>: Play / Stop<br/>
              - <kbd>1</kbd> a <kbd>5</kbd>: Mutear Pistas (Kick, Snare, Hihat, Glitch, Bass)<br/>
              - <kbd>M</kbd>: Mutear / Desmutear TODAS las pistas<br/>
              - <kbd>R</kbd>: Iniciar / Detener Grabación (Loop)<br/>
              - <kbd>C</kbd>: Disparar Caos Euclidiano
            </div>
            
            <SequencerGrid params={params} setParams={setParams} />
          </div>
          
          <div className="control-group">
            <label style={{color: 'var(--accent)'}}>Textura Ambiental (ASMR)</label>
            <div className="subdivision-buttons" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
              <button className={`preset-btn mono ${params.texture_type === 'none' ? 'active' : ''}`} style={params.texture_type === 'none' ? {borderColor: 'var(--accent)', color: 'var(--accent)'} : {}} onClick={() => setParams(p => ({...p, texture_type: 'none'}))}>Ninguna</button>
              <button className={`preset-btn mono ${params.texture_type === 'pink' ? 'active' : ''}`} style={params.texture_type === 'pink' ? {borderColor: 'var(--accent)', color: 'var(--accent)'} : {}} onClick={() => setParams(p => ({...p, texture_type: 'pink'}))}>Ruido Rosa</button>
              <button className={`preset-btn mono ${params.texture_type === 'rain' ? 'active' : ''}`} style={params.texture_type === 'rain' ? {borderColor: 'var(--accent)', color: 'var(--accent)'} : {}} onClick={() => setParams(p => ({...p, texture_type: 'rain'}))}>Lluvia</button>
            </div>
          </div>
          
          <div className="control-group">
            <label style={{color: 'var(--accent)'}}>Procesar Audio Externo</label>
            <input 
              type="file" 
              accept=".wav" 
              onChange={(e) => setSelectedFile(e.target.files[0])} 
              style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}
            />
          </div>

          {layers.length > 0 && (
            <div className="control-group">
              <label style={{color: 'var(--accent)'}}>Looper Multipista (Capas)</label>
              {layers.map((layer, index) => (
                <div key={layer.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <span style={{flex: 1, fontSize: '0.7rem'}}>Loop {index + 1}</span>
                  <button 
                    className="preset-btn mono"
                    style={{ padding: '0.2rem 0.5rem', minWidth: '30px', borderColor: layer.isMuted ? '#666' : '#00ffcc', color: layer.isMuted ? '#666' : '#00ffcc' }}
                    onClick={() => {
                      setLayers(prev => prev.map(l => l.id === layer.id ? {...l, isMuted: !l.isMuted} : l))
                      if (layerSourcesRef.current[layer.id]) {
                        try { layerSourcesRef.current[layer.id].disconnect() } catch(e){}
                        if (layer.isMuted) layerSourcesRef.current[layer.id].connect(audioContextRef.current.destination)
                      }
                    }}
                  >
                    M
                  </button>
                  <button 
                    className="preset-btn mono"
                    style={{ padding: '0.2rem 0.5rem', minWidth: '30px', borderColor: '#ff4444', color: '#ff4444' }}
                    onClick={() => {
                      setLayers(prev => prev.filter(l => l.id !== layer.id))
                      if (layerSourcesRef.current[layer.id]) {
                        try { layerSourcesRef.current[layer.id].stop(); layerSourcesRef.current[layer.id].disconnect() } catch(e){}
                        delete layerSourcesRef.current[layer.id]
                      }
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
              <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                <button 
                  onClick={exportWavStems}
                  disabled={layers.length === 0}
                  className="action-btn mono"
                  style={{ width: '100%', borderColor: '#00ccff', color: '#00ccff', background: '#00ccff22' }}
                >
                  💾 DESCARGAR STEMS (.WAV)
                </button>
              </div>
            </div>
          )}

          <div className="control-group">
            <label style={{color: 'var(--accent)'}}>Protocolos y Frecuencias (Presets)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
              <select className="preset-btn mono" style={{textAlign: 'left', padding: '0.5rem'}} onChange={(e) => applyPreset(e.target.value)}>
                <option value="">-- Solfeggio --</option>
                {FREQUENCY_PRESETS.Solfeggio.map(p => <option key={p.freq} value={JSON.stringify(p)}>{p.name}</option>)}
              </select>
              <select className="preset-btn mono" style={{textAlign: 'left', padding: '0.5rem'}} onChange={(e) => applyPreset(e.target.value)}>
                <option value="">-- Somáticas --</option>
                {FREQUENCY_PRESETS.Somaticas.map(p => <option key={p.freq} value={JSON.stringify(p)}>{p.name}</option>)}
              </select>
              <select className="preset-btn mono" style={{textAlign: 'left', padding: '0.5rem'}} onChange={(e) => applyPreset(e.target.value)}>
                <option value="">-- Ondas Cerebrales --</option>
                {FREQUENCY_PRESETS.Brainwaves.map(p => <option key={p.freq} value={JSON.stringify(p)}>{p.name}</option>)}
              </select>
              <select className="preset-btn mono" style={{textAlign: 'left', padding: '0.5rem'}} onChange={(e) => applyPreset(e.target.value)}>
                <option value="">-- Afinaciones --</option>
                {FREQUENCY_PRESETS.Afinacion.map(p => <option key={p.freq} value={JSON.stringify(p)}>{p.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="control-group">
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="action-btn mono" 
                onClick={isPlaying ? stopAudio : generateAndPlay}
                disabled={isLoading}
                style={{ flex: 1, padding: '1rem 0' }}
              >
                {isLoading ? "RENDERIZANDO..." : isPlaying ? "[ STOP ]" : "[ GENERAR & PLAY ]"}
              </button>
              <button 
                id="rec-btn"
                className={`preset-btn mono ${isRecording ? 'recording' : ''}`}
                style={{ flex: 1, borderColor: isRecording ? '#ff4444' : '#555', color: isRecording ? '#ff4444' : '#aaa' }}
                onClick={startRecording}
                disabled={!isPlaying || isLoading}
              >
                {isRecording ? '● GRABANDO...' : '● REC EN VIVO [R]'}
              </button>
              <button 
                id="stop-rec-btn"
                className="preset-btn mono"
                style={{ flex: 1 }}
                onClick={stopRecording}
                disabled={!isRecording}
              >
                ■ DETENER [R]
              </button>
            </div>
          </div>
        </aside>
        
        <section className="visualizer-container" style={{ position: 'relative' }}>
          <div className="status-overlay mono">
            {isPlaying ? (isRecording ? "STATUS: LIVE RECORDING" : "STATUS: ANALYZING AUDIO STREAM") : "STATUS: IDLE"}
          </div>
          <div 
            ref={chaosPadRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            style={{ width: '100%', height: '100%', cursor: 'crosshair', touchAction: 'none', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
          ></div>
          <Visualizer3D analyserRef={analyserRef} />
        </section>
      </main>
    </div>
  )
}

export default App
