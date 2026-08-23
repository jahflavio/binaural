import React from 'react';

const SequencerGrid = ({ params, setParams }) => {
  return (
    <>
      <label style={{color: 'var(--accent)', marginBottom: '0.8rem', display: 'block'}}>Secuenciador 16 Pasos (Caja de Ritmo)</label>
      <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: '#ff4444' }}>KICK</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
          {params.kick_pattern.map((val, i) => (
            <div 
              key={`kick-${i}`} 
              onClick={() => {
                const newP = [...params.kick_pattern]
                newP[i] = newP[i] === 1 ? 0 : 1
                setParams(p => ({...p, kick_pattern: newP}))
              }}
              style={{
                height: '24px', 
                backgroundColor: val ? '#ff4444' : '#1a1a1a',
                border: i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                borderRadius: '2px',
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>
        
        <span style={{ fontSize: '0.7rem', color: '#ffbb00' }}>SNARE</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
          {params.snare_pattern.map((val, i) => (
            <div 
              key={`snare-${i}`} 
              onClick={() => {
                const newP = [...params.snare_pattern]
                newP[i] = newP[i] === 1 ? 0 : 1
                setParams(p => ({...p, snare_pattern: newP}))
              }}
              style={{
                height: '24px', 
                backgroundColor: val ? '#ffbb00' : '#1a1a1a',
                border: i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                borderRadius: '2px',
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>

        <span style={{ fontSize: '0.7rem', color: '#aaff00' }}>HI-HAT</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
          {params.hihat_pattern.map((val, i) => (
            <div 
              key={`hihat-${i}`} 
              onClick={() => {
                const newP = [...params.hihat_pattern]
                newP[i] = newP[i] === 1 ? 0 : 1
                setParams(p => ({...p, hihat_pattern: newP}))
              }}
              style={{
                height: '24px', 
                backgroundColor: val ? '#aaff00' : '#1a1a1a',
                border: i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                borderRadius: '2px',
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>

        <span style={{ fontSize: '0.7rem', color: '#00ccff' }}>GLITCH</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
          {params.glitch_pattern.map((val, i) => (
            <div 
              key={`glitch-${i}`} 
              onClick={() => {
                const newP = [...params.glitch_pattern]
                newP[i] = newP[i] === 1 ? 0 : 1
                setParams(p => ({...p, glitch_pattern: newP}))
              }}
              style={{
                height: '24px', 
                backgroundColor: val ? '#00ccff' : '#1a1a1a',
                border: i % 4 === 0 ? '1px solid #555' : '1px solid #333',
                borderRadius: '2px',
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SequencerGrid;
