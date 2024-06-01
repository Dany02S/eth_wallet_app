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
    const [twoFactor, setTwoFactor] = useState(false)

    const [registrationError, setRegistrationError] = useState('')
    const [success, setSuccess] = useState(false)
    
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await registerUser(firstName, lastName, email, password, twoFactor)
            setSuccess(true)
            setRegistrationError(res.message)
            localStorage.setItem('token', res.token)
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
                <Switch className='form-switch' onChange={() => setTwoFactor(!twoFactor)} color='default' />
                {registrationError && success === false && <div className='form-error'>{registrationError}</div>}
                {success 
                    ? <>
                        <div className='form-success'>{registrationError}</div>
                        <button onClick={() => navigate('/create-account')} className='form-button' type='button'>Create Account</button>
                    </> 
                    : <button className='form-button' type='submit'>Register</button>}
            </form>
            <p className='nav-text'>Already have an account? <span className='nav-link' onClick={() => navigate('/login')}>Login</span></p>
        </div>
    )
}

export default Register;