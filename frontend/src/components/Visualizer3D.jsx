import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Visualizer3D = ({ analyserRef }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    if (canvasRef.current) {
      const parent = canvasRef.current.parentElement
      renderer.setSize(parent.clientWidth, parent.clientHeight)
      canvasRef.current.appendChild(renderer.domElement)
      camera.aspect = parent.clientWidth / parent.clientHeight
      camera.updateProjectionMatrix()
    }
    
    const geometry = new THREE.TorusKnotGeometry(2, 0.6, 128, 32)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    
    const originalPositions = geometry.attributes.position.array.slice()
    
    const draw = () => {
      if (!analyserRef.current || !mesh) {
        requestRef.current = requestAnimationFrame(draw)
        return
      }
      
      const bufferLength = analyserRef.current.frequencyBinCount
      const timeData = new Uint8Array(bufferLength)
      const freqData = new Uint8Array(bufferLength)
      
      analyserRef.current.getByteTimeDomainData(timeData)
      analyserRef.current.getByteFrequencyData(freqData)
      
      let bassEnergy = 0;
      for(let i = 0; i < 20; i++) bassEnergy += freqData[i];
      bassEnergy = bassEnergy / 20;
      
      mesh.rotation.x += 0.002 + (bassEnergy / 10000)
      mesh.rotation.y += 0.003 + (bassEnergy / 10000)
      
      const positions = geometry.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const dataIndex = (i / 3) % bufferLength
        const v = timeData[dataIndex] / 128.0 
        
        const ox = originalPositions[i]
        const oy = originalPositions[i+1]
        const oz = originalPositions[i+2]
        
        const length = Math.sqrt(ox*ox + oy*oy + oz*oz) || 1
        const nx = ox / length
        const ny = oy / length
        const nz = oz / length
        
        const distortion = (v - 1.0) * 1.5 * (bassEnergy / 50 + 1)
        
        positions[i] = ox + nx * distortion
        positions[i+1] = oy + ny * distortion
        positions[i+2] = oz + nz * distortion
      }
      geometry.attributes.position.needsUpdate = true
      
      const hue = (Date.now() / 50) % 360
      material.color.setHSL(hue / 360, 0.8, 0.3 + (bassEnergy / 510))
      
      renderer.render(scene, camera)
      requestRef.current = requestAnimationFrame(draw)
    }
    
    requestRef.current = requestAnimationFrame(draw)
    
    const handleResize = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement
        camera.aspect = parent.clientWidth / parent.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(parent.clientWidth, parent.clientHeight)
      }
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      cancelAnimationFrame(requestRef.current)
      window.removeEventListener('resize', handleResize)
      if (canvasRef.current && renderer.domElement) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        canvasRef.current.removeChild(renderer.domElement)
      }
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [analyserRef])

  return (
    <div 
      className="visualizer-container" 
      ref={canvasRef} 
    />
  );
};

export default Visualizer3D;
