import { useState } from 'react';
import { Web3 } from 'web3';
import PropTypes from 'prop-types';
import { postTransaction } from '../services/fetching';

const SendingForm = ({ balance, address, setBalances, key }) => {
    const [amount, setAmount] = useState(0);
    const [receiver, setReceiver] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const web3 = new Web3("http://localhost:7545");

    const handleAmount = (e) => {
        e.preventDefault();
        const value = e.target.value;
        if (value === '') {
            setAmount(0);
            return;
        }
        if (isNaN(value)) {
            setError('Please enter a valid number!');
            return;
        }
        if (parseFloat(value) > parseFloat(balance)) {
            setError('You do not have enough balance!');
            return;
        }
        setAmount(value);
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const account = JSON.parse(localStorage.getItem(address));
        if (!account) {
            setError('Your account was not found!');
            return;
        }
        try {
            const dencryptedAccount = await web3.eth.accounts.decrypt(account, password);
            const transaction = {
                from: address,
                to: receiver,
                value: web3.utils.toWei(amount.toString(), 'ether'),
                gas: 2000000,
                gasPrice: web3.utils.toWei('10', 'gwei')
            };
            handleTransaction(transaction, dencryptedAccount.privateKey);
        } catch (error) {
            setError(error.message);
            return;
        }
    }

    const handleTransaction = async (transaction, privateKey) => {
        try {
            const signedTransaction = await web3.eth.accounts.signTransaction(transaction, privateKey);
            let transactionHash = '';
            const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction).
            on('transactionHash', (hash) => {
                transactionHash = hash.split('x')[1];
            });
            if (receipt.status === false) {
                setError('Transaction failed!');
                return;
            }
            await postTransaction(transactionHash, amount, address, receiver );
            setSuccess('Transaction was successful!');

            const balance = await web3.eth.getBalance(address);
            const newBalance = web3.utils.fromWei(balance, 'ether');

            setBalances(prev => {
                const newBalances = [...prev];
                newBalances[key] = newBalance;
                return newBalances;
            });

            setReceiver('');
            setPassword('');
            setError('');
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input className='form-input' type="text" placeholder={'Amount, send max ' +  balance} onChange={(e) => handleAmount(e)} />            
            <input className='form-input' type="password" placeholder='Account password required to sign the transaction with private key' value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className='form-input' type="text" placeholder='Reciver address' value={receiver} onChange={(e) => setReceiver(e.target.value)} />

            {error && <div className='form-error'>{error}</div>}
            {success && <div className='form-success'>{success}</div>}
            
            <button className='form-button' type="submit">Send</button>
        </form>
    );
}

SendingForm.propTypes = {
    balance: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    setBalances: PropTypes.func.isRequired,
    key: PropTypes.number.isRequired,
};

export default SendingForm;