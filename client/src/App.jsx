import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import UserPage from './pages/UserPage'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles/App.css'
import CreateAccount from './pages/CreateAccount'



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
            <Route path='/create-account' element={<CreateAccount />} />
            <Route path='*' element={<h1>Not Found</h1>} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
