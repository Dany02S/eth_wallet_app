import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { saveAccountToDB } from '../services/fetching';

function CreateAddress() {
    const [saved, setSaved] = useState(false);
    const [balance, setBalance] = useState('');
    const [error, setError] = useState(null);
    const [account, setAccount] = useState({});
    const [accountPassword, setAccountPassword] = useState('');
    const [accountName, setAccountName] = useState('');

    const navigate = useNavigate();
    const web3 = new Web3('http://localhost:7545');
    

    useEffect(() => {
        const account = web3.eth.accounts.create();
        setAccount(account);
    }, []);

    async function getBalance(account) {
        const balance = await web3.eth.getBalance(account.address);
        return web3.utils.fromWei(balance, 'ether')
    }

    async function saveAddress() {
        setBalance(await getBalance(account));
        const response = await saveAccountToDB(account.address, accountName);
        if (response) setError(response.message);
        const encryptedAccount = await web3.eth.accounts.encrypt(account.privateKey, accountPassword);
        localStorage.setItem(account.address, JSON.stringify(encryptedAccount));
        setSaved(true);
    }

    return (
        <div className='form-container'>
            <h1>Create Address</h1>
            <div className='form-div'>Address: {account.address}</div>
            {!saved && <> 
                <input className='form-input' type='password' placeholder='Password' value={accountPassword} onChange={(e) => setAccountPassword(e.target.value)} />
                <input className='form-input' type="text"  placeholder="Name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
            </>}

            {saved ? <>
                <div className='form-success'>Private Key is stored</div>
                {error ? <div className='form-success'>{error}</div> : <></>}
            <div className='form-div'>Balance: {balance} ETH</div></> : <></>}
            {!saved ? <button className='form-button' onClick={() => saveAddress()}>Save</button>
            : <button className='form-button' onClick={() => navigate('/user')}>Done</button>}
            

        </div>
    );
}

export default CreateAddress;