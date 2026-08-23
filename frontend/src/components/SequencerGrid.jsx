import React from 'react';

const SequencerGrid = ({ params, setParams }) => {
  return (
    <>
      <label style={{color: 'var(--accent)', marginBottom: '0.8rem', display: 'block'}}>Secuenciador 16 Pasos (Caja de Ritmo)</label>
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
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#ffbb00', fontWeight: 'bold' }}>SNARE</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_snare: !p.mute_snare}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_snare ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#aaff00', fontWeight: 'bold' }}>HI-HAT</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_hihat: !p.mute_hihat}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_hihat ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#00ccff', fontWeight: 'bold' }}>GLITCH</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_glitch: !p.mute_glitch}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_glitch ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.6rem', color: '#8800ff', fontWeight: 'bold' }}>BASS</span>
          <button 
            onClick={() => setParams(p => ({...p, mute_bass: !p.mute_bass}))}
            style={{ marginTop: '2px', padding: '1px 6px', fontSize: '0.5rem', background: params.mute_bass ? '#ff4444' : '#222', border: '1px solid #444', borderRadius: '3px', cursor: 'pointer', color: '#fff' }}
          >M</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px' }}>
          {params.bass_pattern.map((val, i) => (
            <div 
              key={`bass-${i}`} 
              onClick={() => {
                const newP = [...params.bass_pattern]
                newP[i] = newP[i] === 1 ? 0 : 1
                setParams(p => ({...p, bass_pattern: newP}))
              }}
              style={{
                height: '24px', 
                backgroundColor: val ? '#8800ff' : '#1a1a1a',
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
