
import '../styles/Navbar.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('user_id')
        navigate('/login')
    }



    return (
        <div className='navbar'>

            <div onClick={() => navigate('/')}>
                <img src="/eth_logo.png" alt="" />
                <h2>ETH Wallet</h2>
            </div>

            {!localStorage.getItem('token') 
            ?  <div><Link to='/login' className='nav-link'>Login</Link>&nbsp;/&nbsp;<Link to='/register' className='nav-link'>Register</Link></div>
            : <div>
                <img src="/account.png" onClick={() => navigate('/user')} alt="" />
                <button className='nav-button' onClick={handleLogout}>Logout</button>
            </div>}

        </div>
    )
}

export default Navbar;