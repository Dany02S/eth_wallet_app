import { useState } from 'react'
import { registerUser } from '../services/fetching'
import '../styles/Forms.css'
import { useNavigate } from 'react-router-dom'
import Switch from '@mui/material/Switch';

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [twoFactor, setTwoFactor] = useState(false)
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;

    const [registrationError, setRegistrationError] = useState('')
    const [success, setSuccess] = useState(false)
    
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (password !== repeatPassword) {
                setRegistrationError('Passwords do not match')
                return
            }
            if (!password.match(passwordRegex)) {
                setRegistrationError('Password len<=5, 1 uppercase, 1 lowercase, 1 number, 1 special character')
                return
            }
            const res = await registerUser(firstName, lastName, email, password, twoFactor)
            localStorage.setItem('user_id', res.user_id)
            setSuccess(true)
            setRegistrationError(res.message)
            setTimeout(() => {
                if (res.two_factor_enabled) {
                    navigate("/twofactor", { state: { twoFactor: res.two_factor_enabled } });
                } else {
                    localStorage.setItem('token', res.token)
                    navigate('/user')
                }
            }, 1000)
        } catch (error) {
            setRegistrationError(error.message)
        }
    }

    return (
        <div className='form-container'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input className='form-input' type='text' placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
                <input className='form-input' type='text' placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} />
                <input className='form-input' type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                <input className='form-input' type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                <input className='form-input' type='password' placeholder='Repeat Password' onChange={(e) => setRepeatPassword(e.target.value)} />
                <div className='form-switch-container'>
                    <p className='nav-text' style={twoFactor ? {color: '#1fae61'} : {color: 'gray'}}>{twoFactor ? '2FA Enabled' : '2FA Disabled'}</p>
                    <Switch className='form-switch' onChange={() => setTwoFactor(!twoFactor)} color='default' />
                </div>
                {registrationError && success === false && <div className='form-error'>{registrationError}</div>}
                {success 
                    ? <div className='form-success'>{registrationError}</div>
                    : <button className='form-button' type='submit'>Register</button>}
            </form>
            <p className='nav-text'>Already have an account? <span className='nav-link' onClick={() => navigate('/login')}>Login</span></p>
        </div>
    )
}

export default Register;