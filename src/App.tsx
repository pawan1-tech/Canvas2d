import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import CanvasEditor from './pages/CanvasEditor'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas/:canvasId" element={<CanvasEditor />} />
      </Routes>
    </BrowserRouter>
  )
}
