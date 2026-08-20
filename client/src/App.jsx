import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Captions from './pages/Captions'
import Summary from './pages/Summary'
import Lecturer from './pages/Lecturer'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/captions" element={<Captions />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/lecturer" element={<Lecturer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App