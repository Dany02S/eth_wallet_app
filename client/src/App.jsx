import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserPage from './pages/UserPage'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/App.css'



function App() {

  return (
    <div className='App'>
      <BrowserRouter>
      <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/user' element={<UserPage />} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
