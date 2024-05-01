import { useState } from 'react'
import { registerUser } from '../services/fetching'
import '../styles/Forms.css'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [registrationError, setRegistrationError] = useState('')
    const navigate = useNavigate()
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await registerUser(firstName, lastName, email, password)
            setSuccess(true)
            setRegistrationError(res.message)
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
                {success ? <div className='form-success'>{registrationError}</div> : null}
                {registrationError && success === false && <div className='form-error'>{registrationError}</div>}
                {success ? <button onClick={() => navigate('/login')} className='form-button' type='button'>Login</button> : <button className='form-button' type='submit'>Register</button>}
            </form>
        </div>
    )
}

export default Register;