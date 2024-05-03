import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/fetching';
import '../styles/Forms.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginError, setLoginError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await loginUser(email, password)
            localStorage.setItem('token', response.token)
            localStorage.setItem('user', response.user)
            navigate('/')
        } catch (error) {
            setLoginError(error.message)
        }
    }
    return (
        <div className='form-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input className='form-input' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                <input className='form-input' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                {loginError && <div className='form-error'>{loginError}</div>}
                <button className='form-button' type='submit'>Login</button>
                {/* Go to login if have an account */}
            </form>
            <p className='nav-text'>Don`t have an account? <span className='nav-link' onClick={() => navigate('/register')}>Register</span></p>
        </div>
    );
}

export default Login;