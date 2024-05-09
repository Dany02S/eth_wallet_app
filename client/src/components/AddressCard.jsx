import PropTypes from 'prop-types';
import '../styles/AddressCard.css';
import { useState } from 'react';
import SendingForm from './SendingForm';
import { Web3 } from 'web3';
import { useEffect } from 'react';
import TransactionCard from '../components/TransactionCard';


const AddressCard = ({address, name, transactions, setBalanceChange, balanceChange }) => {
    const [sendingForm, setSendingForm] = useState(false);
    const [transForm, setTransForm] = useState(false);
    const [balance, setBalance] = useState(null);
    const web3 = new Web3("http://localhost:7545");

    useEffect(() => {
        const fetchBalance = async () => {
            const balance = await getBalance();
            setBalance(balance);
        }
        fetchBalance();
    }, [balanceChange]);


    const getBalance = async () => {
        const balance = await web3.eth.getBalance(address);
        return parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(6)
    }

    const transactionsFromAccount = (address) => {
        // Return the other addresses where the receiver_address or sender_address is equal to the address
        const tran =  transactions.filter(transaction => transaction.sender_address === address || transaction.receiver_address === address).map(transaction => {
            if (transaction.sender_address === address) {
                return transaction.receiver_address;
            } else {
                return transaction.sender_address;
            }
        });
        return [...new Set(tran)];
      }

    
        
    return (
        <div className='address-container'>

            <div className='address-card'>
                <div>
                    <div>{name}</div>
                    <div id='address'>{address}</div>
                </div>
                <div>Balance {balance} ETH</div>
                <div className="form-buttons">

                    <button className='form-button' onClick={() => setSendingForm(!sendingForm)}>Send ETH</button>
                    <button className='form-button' onClick={() => setTransForm(!transForm)}>View history</button>
                </div>
            </div>

            {sendingForm && 
            <SendingForm 
                address={address} 
                balance={balance}
                setBalanceChange={setBalanceChange} 
                balanceChange={balanceChange}
                transactions={transactionsFromAccount(address)}
            />}

            {transForm &&
            <div className='transaction-container'>
                {transactions.map((transaction, index) => {
                    if (transaction.sender_address === address || transaction.receiver_address === address) {
                        return (
                            <TransactionCard key={index} transaction={transaction} address={address}/>
                        )
                    }
                })}
            </div>}

            {}
        </div>
    );
};

AddressCard.propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    setBalanceChange: PropTypes.func.isRequired,
    balanceChange: PropTypes.bool.isRequired
};

export default AddressCard;