import '../styles/Navbar.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    return (
        <div className='navbar'>
            <h2>Navbar</h2>
            {!localStorage.getItem('token') 
            ?  <div><Link to='/login' className='nav-link'>Login</Link> / <Link to='/register' className='nav-link'>Register</Link></div>
            : <button className='nav-button' onClick={handleLogout}>Logout</button>}
        </div>
    )
}

export default Navbar;