import { useRef } from 'react'

const Knob = ({ label, value, min, max, onChange, onMidiLearn, midiLearnActive }) => {
  const startY = useRef(0)
  const startVal = useRef(0)
  const lastUpdate = useRef(0)
  const pct = (value - min) / (max - min)
  const deg = -135 + (pct * 270)

  const handleDown = (e) => {
    startY.current = e.clientY
    startVal.current = value
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', handleUp)
  }

  const handleMove = (e) => {
    const now = Date.now()
    if (now - lastUpdate.current < 30) return
    lastUpdate.current = now

    const deltaY = startY.current - e.clientY
    const deltaVal = (deltaY / 150) * (max - min)
    let newVal = startVal.current + deltaVal
    newVal = Math.max(min, Math.min(max, newVal))
    onChange(newVal)
  }

  const handleUp = () => {
    document.removeEventListener('mousemove', handleMove)
    document.removeEventListener('mouseup', handleUp)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0.5rem 0' }}>
      <div 
        onMouseDown={handleDown}
        onDoubleClick={onMidiLearn}
        style={{
          width: '40px', height: '40px', borderRadius: '50%',
          background: 'linear-gradient(145deg, #2a2a2a, #111)',
          boxShadow: '2px 2px 5px #050505, -2px -2px 5px #222',
          position: 'relative', cursor: 'ns-resize',
          border: midiLearnActive ? '2px solid #ff4444' : '2px solid #333'
        }}
      >
        <div style={{
          position: 'absolute', top: '10%', left: '50%', width: '3px', height: '12px',
          background: '#00ffcc', transformOrigin: '50% 16px',
          transform: `translateX(-50%) rotate(${deg}deg)`
        }} />
      </div>
      <span style={{ fontSize: '0.6rem', marginTop: '0.5rem', color: '#888', textAlign: 'center', maxWidth: '60px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{label}</span>
      <span style={{ fontSize: '0.7rem', color: '#00ffcc', marginTop: '0.2rem' }}>{value.toFixed(2)}</span>
    </div>
  )
}

export default Knob

