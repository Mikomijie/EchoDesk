import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Landing from './pages/Landing'
import Captions from './pages/Captions'
import Summary from './pages/Summary'
import Lecturer from './pages/Lecturer'
import History from './pages/History'
import Glossary from './pages/Glossary'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/join" element={<Landing />} />
        <Route path="/captions" element={<Captions />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/lecturer" element={<Lecturer />} />
        <Route path="/history" element={<History />} />
        <Route path="/glossary" element={<Glossary />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App