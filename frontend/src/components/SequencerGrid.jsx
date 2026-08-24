import React from 'react';
import { generateRandomEuclidean } from '../utils/euclidean';

const SequencerGrid = ({ params, setParams, currentStep = -1 }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <label style={{color: 'var(--accent)', display: 'block'}}>Secuenciador 16 Pasos (Caja de Ritmo)</label>
        <button 
          onClick={() => {
            const newPatterns = generateRandomEuclidean(16);
            setParams(p => ({
              ...p,
              kick_pattern: newPatterns.kick_pattern,
              snare_pattern: newPatterns.snare_pattern,
              hihat_pattern: newPatterns.hihat_pattern,
              glitch_pattern: newPatterns.glitch_pattern,
              bass_pattern: newPatterns.bass_pattern
            }));
          }}
          style={{ background: '#331111', color: '#ff4444', border: '1px solid #ff4444', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
          🎲 CAOS EUCLIDIANO
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '50px 1fr', gap: '0.5rem', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.55rem', color: '#ff4444', fontWeight: 'bold', textAlign: 'center' }}>MUTE GLOBAL</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px', paddingBottom: '0.5rem', borderBottom: '1px solid #333' }}>
          {params.global_mute_pattern?.map((val, i) => (
            <div 
              key={`globalmute-${i}`} 
              onClick={() => {
                const newP = [...params.global_mute_pattern]
                newP[i] = newP[i] === 1 ? 0 : 1
                setParams(p => ({...p, global_mute_pattern: newP}))
              }}
              style={{
                height: '16px', 
                backgroundColor: val ? '#ff4444' : '#222',
                border: i % 4 === 0 ? '1px solid #666' : '1px solid #444',
                borderRadius: '2px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.5rem'
              }} 
            >
              {val ? 'M' : ''}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#ff4444', fontWeight: 'bold' }}>KICK</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_beat: !p.mute_beat}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_beat ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
          {params.kick_pattern.map((val, i) => {
            const prob = params.kick_prob ? params.kick_prob[i] : 1.0;
            const isActive = i === currentStep;
            return (
            <div 
              key={`kick-${i}`} 
              onClick={(e) => {
                if (e.shiftKey) {
                  const newProb = [...(params.kick_prob || Array(16).fill(1.0))]
                  newProb[i] = newProb[i] === 1.0 ? 0.66 : newProb[i] === 0.66 ? 0.33 : 1.0
                  setParams(p => ({...p, kick_prob: newProb}))
                } else {
                  const newP = [...params.kick_pattern]
                  newP[i] = newP[i] === 1 ? 0 : 1
                  setParams(p => ({...p, kick_pattern: newP}))
                }
              }}
              style={{
                height: '24px', 
                backgroundColor: val ? '#ff4444' : isActive ? '#2a1a1a' : '#1a1a1a',
                border: isActive ? '1px solid #ff884488' : i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                borderRadius: '2px',
                cursor: 'pointer',
                opacity: val ? prob : 1.0,
                boxShadow: isActive ? '0 0 6px #ff884455' : 'none',
                transition: 'box-shadow 0.05s ease'
              }} 
            />
          )})}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#ffbb00', fontWeight: 'bold' }}>SNARE</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_snare: !p.mute_snare}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_snare ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
              {params.snare_pattern.map((val, i) => {
              const prob = params.snare_prob ? params.snare_prob[i] : 1.0;
              const isActive = i === currentStep;
              return (
              <div 
                key={`snare-${i}`} 
                onClick={(e) => {
                  if (e.shiftKey) {
                    const newProb = [...(params.snare_prob || Array(16).fill(1.0))]
                    newProb[i] = newProb[i] === 1.0 ? 0.66 : newProb[i] === 0.66 ? 0.33 : 1.0
                    setParams(p => ({...p, snare_prob: newProb}))
                  } else {
                    const newP = [...params.snare_pattern]
                    newP[i] = newP[i] === 1 ? 0 : 1
                    setParams(p => ({...p, snare_pattern: newP}))
                  }
                }}
                style={{
                  height: '24px', 
                  backgroundColor: val ? '#ffbb00' : isActive ? '#1a1a0a' : '#1a1a1a',
                  border: isActive ? '1px solid #ffbb0055' : i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  opacity: val ? prob : 1.0,
                  boxShadow: isActive ? '0 0 6px #ffbb0044' : 'none',
                  transition: 'box-shadow 0.05s ease'
                }} 
              />
            )})}
          </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#aaff00', fontWeight: 'bold' }}>HI-HAT</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_hihat: !p.mute_hihat}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_hihat ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
              {params.hihat_pattern.map((val, i) => {
              const prob = params.hihat_prob ? params.hihat_prob[i] : 1.0;
              const isActive = i === currentStep;
              return (
              <div 
                key={`hihat-${i}`} 
                onClick={(e) => {
                  if (e.shiftKey) {
                    const newProb = [...(params.hihat_prob || Array(16).fill(1.0))]
                    newProb[i] = newProb[i] === 1.0 ? 0.66 : newProb[i] === 0.66 ? 0.33 : 1.0
                    setParams(p => ({...p, hihat_prob: newProb}))
                  } else {
                    const newP = [...params.hihat_pattern]
                    newP[i] = newP[i] === 1 ? 0 : 1
                    setParams(p => ({...p, hihat_pattern: newP}))
                  }
                }}
                style={{
                  height: '24px', 
                  backgroundColor: val ? '#aaff00' : isActive ? '#111a0a' : '#1a1a1a',
                  border: isActive ? '1px solid #aaff0055' : i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  opacity: val ? prob : 1.0,
                  boxShadow: isActive ? '0 0 6px #aaff0044' : 'none',
                  transition: 'box-shadow 0.05s ease'
                }} 
              />
            )})}
          </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#00ccff', fontWeight: 'bold' }}>GLITCH</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_glitch: !p.mute_glitch}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_glitch ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
              {params.glitch_pattern.map((val, i) => {
              const prob = params.glitch_prob ? params.glitch_prob[i] : 1.0;
              const isActive = i === currentStep;
              return (
              <div 
                key={`glitch-${i}`} 
                onClick={(e) => {
                  if (e.shiftKey) {
                    const newProb = [...(params.glitch_prob || Array(16).fill(1.0))]
                    newProb[i] = newProb[i] === 1.0 ? 0.66 : newProb[i] === 0.66 ? 0.33 : 1.0
                    setParams(p => ({...p, glitch_prob: newProb}))
                  } else {
                    const newP = [...params.glitch_pattern]
                    newP[i] = newP[i] === 1 ? 0 : 1
                    setParams(p => ({...p, glitch_pattern: newP}))
                  }
                }}
                style={{
                  height: '24px', 
                  backgroundColor: val ? '#00ccff' : isActive ? '#0a1a1a' : '#1a1a1a',
                  border: isActive ? '1px solid #00ccff55' : i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  opacity: val ? prob : 1.0,
                  boxShadow: isActive ? '0 0 6px #00ccff44' : 'none',
                  transition: 'box-shadow 0.05s ease'
                }} 
              />
            )})}
          </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#8800ff', fontWeight: 'bold' }}>BASS</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_bass: !p.mute_bass}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_bass ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
              {params.bass_pattern.map((val, i) => {
              const prob = params.bass_prob ? params.bass_prob[i] : 1.0;
              const isActive = i === currentStep;
              return (
              <div 
                key={`bass-${i}`} 
                onClick={(e) => {
                  if (e.shiftKey) {
                    const newProb = [...(params.bass_prob || Array(16).fill(1.0))]
                    newProb[i] = newProb[i] === 1.0 ? 0.66 : newProb[i] === 0.66 ? 0.33 : 1.0
                    setParams(p => ({...p, bass_prob: newProb}))
                  } else {
                    const newP = [...params.bass_pattern]
                    newP[i] = newP[i] === 1 ? 0 : 1
                    setParams(p => ({...p, bass_pattern: newP}))
                  }
                }}
                style={{
                  height: '24px', 
                  backgroundColor: val ? '#8800ff' : isActive ? '#110a1a' : '#1a1a1a',
                  border: isActive ? '1px solid #8800ff55' : i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  opacity: val ? prob : 1.0,
                  boxShadow: isActive ? '0 0 6px #8800ff44' : 'none',
                  transition: 'box-shadow 0.05s ease'
                }} 
              />
            )})}
          </div>
          
          <div style={{ gridColumn: '1 / -1', marginTop: '10px', fontSize: '0.6rem', color: '#888', textAlign: 'center' }}>
            💡 Tip: <b>Shift + Click</b> en un paso activo para cambiar su probabilidad (100% → 66% → 33%). Transparencia = Menor probabilidad. El <span style={{ color: '#00ffcc' }}>paso activo</span> se ilumina durante la reproducción.
          </div>
      </div>
    </>
  );
};

export default SequencerGrid;
