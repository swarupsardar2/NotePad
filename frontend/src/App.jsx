import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, Text } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import NoteCard3D from './components/NoteCard3D'
import NoteEditor from './components/NoteEditor'

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/notes' 
  : 'http://localhost:5000/api/notes'

function App() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(API_URL)
      setNotes(data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  const createNote = async (noteData) => {
    try {
      await axios.post(API_URL, noteData)
      await fetchNotes()
      setShowEditor(false)
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const updateNote = async (id, noteData) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, noteData)
      setNotes(notes.map(n => n._id === id ? data : n))
      setShowEditor(false)
      setSelectedNote(null)
    } catch (error) {
      console.error('Failed to update note:', error)
    }
  }

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setNotes(notes.filter(n => n._id !== id))
      setSelectedNote(null)
      setShowEditor(false)
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const handleNoteClick = (note) => {
    setSelectedNote(note)
    setShowEditor(true)
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4f46e5" />
        
        {!loading && notes.map((note, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <NoteCard3D
              key={note._id}
              note={note}
              position={[
                (col - 1.5) * 3,
                (1 - row) * 3.5,
                -row * 0.3
              ]}
              onClick={() => handleNoteClick(note)}
            />
          )
        })}
        
        {loading && (
          <Text
            position={[0, 0, 0]}
            fontSize={0.5}
            color="white"
            textAlign="center"
          >
            Loading notes...
          </Text>
        )}
        
        {!loading && notes.length === 0 && (
          <group>
            <Text
              position={[0, 1, 0]}
              fontSize={0.6}
              color="white"
              textAlign="center"
              maxWidth={8}
            >
              Welcome to 3D NotePad!
            </Text>
            <Text
              position={[0, 0, 0]}
              fontSize={0.3}
              color="#ffffff99"
              textAlign="center"
              maxWidth={8}
            >
              Click the + button to create your first note
            </Text>
          </group>
        )}
        
        <Environment preset="sunset" />
      </Canvas>

      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white text-3xl font-bold hover:scale-110 transition-transform z-50"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setSelectedNote(null)
          setShowEditor(true)
        }}
      >
        +
      </motion.button>

      <AnimatePresence>
        {showEditor && (
          <NoteEditor
            note={selectedNote}
            onSave={(data) => selectedNote ? updateNote(selectedNote._id, data) : createNote(data)}
            onDelete={selectedNote ? () => deleteNote(selectedNote._id) : null}
            onClose={() => {
              setShowEditor(false)
              setSelectedNote(null)
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-8 left-8 z-40"
      >
        <h1 className="text-5xl font-bold text-white drop-shadow-2xl">
          3D NotePad
        </h1>
      </motion.div>
    </div>
  )
}

export default App