import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { useNavigate } from 'react-router-dom';
import { saveAddressToDB } from '../services/fetching';

function CreateAddress() {
    const [address, setAddress] = useState('');
    const [saved, setSaved] = useState(false);
    const [balance, setBalance] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const web3 = new Web3('http://localhost:7545');
    

    useEffect(() => {
        const privKey = '0xdb736fd5b489284f84e69aad5adbe5000252616c2fb4948f2045b0bfd5c15945';
        const account = web3.eth.accounts.privateKeyToAccount(privKey)
        setAddress(account.address);
    }, [web3.eth.accounts]);

    async function getBalance(account) {
        const balance = await web3.eth.getBalance(account);
        setBalance(web3.utils.fromWei(balance, 'ether'));
    }

    async function saveAddress() {
        setSaved(true);
        getBalance(address);
        const response = await saveAddressToDB(address);
        if (response) {
            setError(response.message);
        }
        
    }

    return (
        <div className='form-container'>
            <h1>Create Address</h1>
            <div className='form-div'>Address: {address}</div>
            {saved ? <><div className='form-success'>Private Key is stored</div>
            {error ? <div className='form-success'>{error}</div> : <></>}
            <div className='form-div'>Balance: {balance} ETH</div></> : <></>}
            {!saved ? <button className='form-button' onClick={() => saveAddress()}>Save</button>
            : <button className='form-button' onClick={() => navigate('/user')}>Done</button>}
            

        </div>
    );
}

export default CreateAddress;