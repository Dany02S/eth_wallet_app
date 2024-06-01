import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../services/fetching';
import '../styles/Forms.css'
import { getingQRCode } from '../services/fetching';

function TwoFactor() {
    const [verificationCode, setVerificationCode] = useState('')
    const [verificationError, setVerificationError] = useState('')
    const [qrCode, setQrCode] = useState('')

    useEffect(() => {
        if (!localStorage.getItem('user_id')) {
            navigate('/login')
        }
        const user_id = localStorage.getItem('user_id')
        getingQRCode(user_id)
        .then(res => {
            setQrCode(res.data_url)
        })
    }, [])
    
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const user_id = localStorage.getItem('user_id')
            const res = await verifyUser(user_id, verificationCode)
            localStorage.setItem('token', res.token)
            navigate('/user')
        } catch (error) {
            setVerificationError(error.message)
        }
    }
    return (
        <div className='form-container'>
            <h1>2FA</h1>
            <p>Scan the QR code</p>
            <img src={qrCode} alt="" />
            <form onSubmit={handleSubmit}>
                <input className='form-input' type='text' placeholder='Verification code' onChange={(e) => setVerificationCode(e.target.value)} />
                {verificationError && <div className='form-error'>{verificationError}</div>}
                <button className='form-button' type='submit'>Verify</button>
            </form>
        </div>
    );
}

export default TwoFactor;