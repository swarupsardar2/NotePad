import { useState } from 'react'
import { RoundedBox, Text } from '@react-three/drei'

export default function NoteCard3D({ note, position, onClick }) {
  const [hovered, setHovered] = useState(false)
  
  const getFontColor = (bgColor) => {
    const darkColors = ['#60a5fa', '#a78bfa', '#f87171']
    return darkColors.includes(bgColor) ? '#ffffff' : '#1a1a1a'
  }

  return (
    <group position={position}>
      <RoundedBox
        args={[2.5, 3, 0.05]}
        radius={0.15}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
        castShadow
      >
        <meshStandardMaterial
          color={note.color || '#fbbf24'}
          roughness={0.2}
          metalness={0.0}
          emissive={hovered ? '#ffffff' : '#000000'}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </RoundedBox>
      
      <Text
        position={[0, 0.8, 0.03]}
        fontSize={0.35}
        color={getFontColor(note.color)}
        maxWidth={2.2}
        textAlign="center"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        {note.title || 'Untitled'}
      </Text>
      
      <Text
        position={[0, -0.2, 0.03]}
        fontSize={0.2}
        color={getFontColor(note.color)}
        maxWidth={2.2}
        textAlign="center"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      >
        {note.content ? (note.content.length > 60 ? note.content.substring(0, 60) + '...' : note.content) : 'No content'}
      </Text>
    </group>
  )
}