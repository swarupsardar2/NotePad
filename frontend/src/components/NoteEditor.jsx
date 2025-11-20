import { useState } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#fbbf24', '#f87171', '#60a5fa', '#34d399', '#a78bfa', '#fb923c']

export default function NoteEditor({ note, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [color, setColor] = useState(note?.color || '#fbbf24')

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for your note')
      return
    }
    onSave({ title: title.trim(), content: content.trim(), color })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 25 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-[600px] max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            {note ? 'Edit Note' : 'New Note'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-semibold border-none outline-none mb-4 text-gray-800 placeholder-gray-400"
        />

        <textarea
          placeholder="Start typing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-64 border-none outline-none resize-none text-gray-700 placeholder-gray-400"
        />

        <div className="mt-6">
          <p className="text-sm text-gray-600 mb-3">Choose Color</p>
          <div className="flex gap-3">
            {COLORS.map((c) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setColor(c)}
                className="w-10 h-10 rounded-full shadow-lg cursor-pointer"
                style={{
                  backgroundColor: c,
                  border: color === c ? '3px solid #000' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            Save
          </motion.button>
          
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDelete}
              className="px-6 bg-red-500 text-white py-3 rounded-xl font-semibold shadow-lg"
            >
              Delete
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}