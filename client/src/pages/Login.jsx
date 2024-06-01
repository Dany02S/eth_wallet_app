import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/fetching';
import '../styles/Forms.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loginError, setLoginError] = useState('')
    const [loginSuccess, setLoginSuccess] = useState('')
    
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await loginUser(email, password)
            // If the login is successful, the user is redirected to the 2FA page and pass the res.user_id
            setLoginSuccess(res.message)
            localStorage.setItem('user_id', res.user_id)
            setTimeout(() => {
                navigate('/twofactor')
            }, 2000)
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
                {loginSuccess ? <div className='form-success'>{loginSuccess}</div>
                : <button className='form-button' type='submit'>Login</button>}
            </form>
            <p className='nav-text'>Don`t have an account? <span className='nav-link' onClick={() => navigate('/register')}>Register</span></p>
        </div>
    );
}

export default Login;