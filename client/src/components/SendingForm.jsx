import { useState } from 'react';
import { Web3 } from 'web3';
import PropTypes from 'prop-types';
import { postTransaction } from '../services/fetching';
import useIndexedDB from '../hooks/useIndexedDB';


const SendingForm = ({ balance, address, transactions, setBalanceChange, balanceChange, dollar }) => {
    const [receiver, setReceiver] = useState('');
    const [password, setPassword] = useState('');
    const [amount, setAmount] = useState(0);
    const [totalTransactionCost, setTotalTransactionCost] = useState(0.00021);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [newReceiver, setNewReceiver] = useState(false);
    const web3 = new Web3(import.meta.env.VITE_WEB3_PROVIDER_URL);
    const { getAccountFromIndexedDB } = useIndexedDB();
    const handleReciever = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setReceiver(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const account = await getAccountFromIndexedDB(address);

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
                gas: 21000,
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
            await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
            .on('transactionHash', (hash) => {
                transactionHash = hash.split('x')[1];
            })
            .on('error', (error) => {
                setError(error.message);
            });

            await postTransaction(transactionHash, amount, address, receiver );

            setSuccess('Transaction was successful!');
            setReceiver('');
            setPassword('');
            setError('');
            setBalanceChange(!balanceChange);
        } catch (error) {
            setError(error.message);
        }
    }

    const handleAmount = (e) => {
        e.preventDefault();
        const value = e.target.value;
        if (isNaN(value)) {
            setError('Amount must be a number!');
            return;
        }
        if (parseFloat(value) + 0.00021 > parseFloat(balance) && parseFloat(value) <= parseFloat(balance)){
            setError('You do not have ETH for paying the transaction cost!');
            return;
        }
        if (parseFloat(value) > parseFloat(balance)) {
            setError('You do not have enough ETH for the transaction!');
            return;
        }
        setAmount(value); 
        !value ? setTotalTransactionCost(0.00021) :
        setTotalTransactionCost(parseFloat(value) + 0.00021);
        setError('');
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='sendings'>

                <div className='sending-parent'>
                    <div className='sending-title'>Sending amount</div>
                    <div className='form-buttons'>
                        <input className='form-input' type="text" placeholder={'Amount'} onChange={(e) => handleAmount(e)} />
                        <div className='form-input' id='dollar-form'>{parseFloat(amount*dollar).toFixed(4)}$</div>
                    </div>
                </div>

                <div className='sending-parent'>
                    <div className='sending-title'>Gas cost included</div>
                    <div className='form-buttons'>
                        <div className='form-input' id='eth-form'>{parseFloat(totalTransactionCost).toFixed(6)} ETH</div>
                        <div className='form-input' id='dollar-form'>{parseFloat(totalTransactionCost*dollar).toFixed(4)}$</div>
                    </div>
                </div>

            </div>

            <input className='form-input' type="password" placeholder='User account password required to sign the transaction with private key' value={password} onChange={(e) => setPassword(e.target.value)} />

            <div className='form-inputs'>
                {!newReceiver ?
                    <select className='form-input' value={receiver} onChange={(e) => handleReciever(e)}>
                        <option value=''>Select receiver from your history</option>
                        {transactions.reverse().map((transaction, index) => (
                            <option key={index} value={transaction}>{transaction}</option>
                        ))}
                    </select>
                    : <input className='form-input' type="text" placeholder='Reciver address' value={receiver} onChange={(e) => handleReciever(e)} />}
                <button type='button' className='form-button' onClick={() => setNewReceiver(!newReceiver)}>{newReceiver ? 'Select from history' : 'Add new receiver'}</button>
            </div>

            {error && <div className='form-error'>{error}</div>}
            {success && <div className='form-success'>{success}</div>}
            
            <button className='form-button' type="submit">Send</button>
        </form>
    );
}

SendingForm.propTypes = {
    balance: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    setBalanceChange: PropTypes.func.isRequired,
    balanceChange: PropTypes.bool.isRequired,
    dollar: PropTypes.number.isRequired,
};

export default SendingForm;