import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { saveAccountToDB } from '../services/fetching';
import useIndexedDB from '../hooks/useIndexedDB';

function CreateAccount() {
    const [saved, setSaved] = useState(false);
    const [balance, setBalance] = useState('');
    const [error, setError] = useState(null);
    const [account, setAccount] = useState({});
    const [accountPassword, setAccountPassword] = useState('');
    const [accountName, setAccountName] = useState('');

    const navigate = useNavigate();
    const web3 = new Web3(import.meta.env.VITE_WEB3_PROVIDER_URL);
    const { saveAccountToIndexedDB } = useIndexedDB();
    

    useEffect(() => {
        const account = web3.eth.accounts.create();
        setAccount(account);
    }, []);

    async function getBalance(account) {
        const balance = await web3.eth.getBalance(account.address);
        return web3.utils.fromWei(balance, 'ether')
    }

    async function saveAddress() {
        try {
            setBalance(await getBalance(account));
            await saveAccountToDB(account.address, accountName, accountPassword);
            const encryptedAccount = await web3.eth.accounts.encrypt(account.privateKey, accountPassword);
            await saveAccountToIndexedDB(account.address, encryptedAccount).then(() => {
                console.log('Account saved to indexedDB');
            });
            setSaved(true);
            setError(null);
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className='form-container'>
            <div className='address-command-container'>
                <img src="key.png" className='address-img' title='Reset account' alt="" onClick={() => navigate('/create-account-fpk')} />
            </div>
            <h1>Create Account</h1>
            <div className='form-div'>Address: {account.address}</div>

            {!saved ? <> 
                <input className='form-input' type='password' placeholder='Enter your user account password for authentication' value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} />
                <input className='form-input' type="text"  placeholder="Name of the account" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
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

export default CreateAccount;

