import { useState } from 'react';
import { Web3 } from 'web3';
import PropTypes from 'prop-types';



const SendingForm = ({ balance, address }) => {
    const [amount, setAmount] = useState(0);
    const [receiver, setReceiver] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const web3 = new Web3("http://localhost:7545");

    const handleAmount = (e) => {
        e.preventDefault();
        setAmount(e.target.value);
        if (parseFloat(e.target.value) > parseFloat(balance) || parseFloat(e.target.value) <= 0) {
            setError('Insufficient funds');
        } else {
            setError('');
        }
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
            console.log(dencryptedAccount);
            const transaction = {
                from: address,
                to: receiver,
                value: web3.utils.toWei(amount.toString(), 'ether')
            };
            try {
                await web3.eth.sendTransaction(transaction, dencryptedAccount.privateKey);
                setError('');
            } catch (error) {
                setError(error.message);
                return;
            }
        } catch (error) {
            setError('Invalid password');
            return;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {/* Accept only numeric values */}
            <input className='form-input'  type="number" placeholder={'Amount, send max ' +  balance} onChange={handleAmount} />
            <input className='form-input' type="password" placeholder='Account password required to sign the transaction with private key' value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className='form-input' type="text" placeholder='Reciver address' value={receiver} onChange={(e) => setReceiver(e.target.value)} />
            {error && <div className='form-error'>{error}</div>}
            <button className='form-button' type="submit">Send</button>
        </form>
    );
}

SendingForm.propTypes = {
    balance: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
};

export default SendingForm;