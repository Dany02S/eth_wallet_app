import { useState } from 'react'
import { registerUser } from '../services/fetching'

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        registerUser(firstName, lastName, email, password)
    }

    return (
        <div className='form-container'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
                <input type='text' placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} />
                <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Register</button>
            </form>
        </div>
    )
}

export default Register;