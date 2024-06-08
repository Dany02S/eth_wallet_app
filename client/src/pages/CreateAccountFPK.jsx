import { useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { restoreAccount } from '../services/fetching';

function CreateAccountFPK() {
    const [saved, setSaved] = useState(false);
    const [balance, setBalance] = useState('');
    const [error, setError] = useState(null);
    const [accountPassword, setAccountPassword] = useState('');
    const [accountKey, setAccountKey] = useState('');

    const navigate = useNavigate();
    const web3 = new Web3(import.meta.env.VITE_WEB3_PROVIDER_URL);

    async function getBalance(account) {
        const balance = await web3.eth.getBalance(account.address);
        return web3.utils.fromWei(balance, 'ether')
    }

    async function saveAddress() {
        try {
            const account = web3.eth.accounts.privateKeyToAccount(accountKey);
            const res = await restoreAccount(accountPassword, account.address);
            console.log(res.message);
            setBalance(await getBalance(account));
            const encryptedAccount = await web3.eth.accounts.encrypt(account.privateKey, accountPassword);
            localStorage.setItem(account.address, JSON.stringify(encryptedAccount));
            setSaved(true);
            setError(account.address);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className='form-container'>
            <h1>Restore Account with Private key</h1>
            {!saved ? <> 
                <input className='form-input' type='password' placeholder='Enter your user account password for authentication' value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} />
                <input className='form-input' type="text"  placeholder="Enter private key" onChange={(e) => setAccountKey(e.target.value)} />
                {error ? <div className='form-error'>{error}</div> : <></>}
                <button className='form-button' onClick={() => saveAddress()}>Save</button>
            </> : <>
                <div className='form-success'>Private Key is stored</div>
                {error ? <div className='form-success'>{error}</div> : <></>}
                <div className='form-div'>Balance: {balance} ETH</div>
                <button className='form-button' onClick={() => navigate('/user')}>Done</button>
            </>}
        </div>
    );
}

export default CreateAccountFPK;