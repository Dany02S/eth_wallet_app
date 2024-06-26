import PropTypes from 'prop-types';
import '../styles/AddressCard.css';
import { useState } from 'react';
import SendingForm from './SendingForm';
import { Web3 } from 'web3';
import { useEffect } from 'react';
import TransactionCard from '../components/TransactionCard';
import TransactionChart from './TransactionChart';
import useIndexedDB from '../hooks/useIndexedDB';


const AddressCard = ({address, name, transactions, setBalanceChange, balanceChange, dollar, web3}) => {
    const [sendingForm, setSendingForm] = useState(false);
    const [transForm, setTransForm] = useState(false);
    const [chartShow, setChartShow] = useState(false);

    const [balance, setBalance] = useState(null);

    const [showPrivateKey, setShowPrivateKey] = useState(false);
    const [privateKeyUnlocked, setPrivateKeyUnlocked] = useState(false)
    const [privateKey, setPrivateKey] = useState('');

    const [password, setPassword] = useState('');

    const { getAccountFromIndexedDB } = useIndexedDB();

    useEffect(() => {
        const fetchBalance = async () => {
            const getBalance = async () => {
                const balance = await web3.eth.getBalance(address);
                return parseFloat(web3.utils.fromWei(balance, 'ether')).toFixed(6)
            }
            const balance = await getBalance();
            setBalance(balance);
        }
        fetchBalance();
    }, [balanceChange]);

    const transactionsFromAccount = (address) => {
        let tran =  transactions.filter(transaction => transaction.sender_address === address || transaction.receiver_address === address).map(transaction => {
            if (transaction.sender_address === address) {
                return transaction.receiver_address;
            } else {
                return transaction.sender_address;
            }
        });
        return [...new Set(tran)];
    }

    const handleGetPrivateKey = async () => {
        const account = await getAccountFromIndexedDB(address);

        if (!account) {
            return;
            }
            try {
            const dencryptedAccount = await web3.eth.accounts.decrypt(account, password);
            const privateKeyInput = document.getElementById('privateKey-input');
            privateKeyInput.value = '';
            setPrivateKey(dencryptedAccount.privateKey);
            setPrivateKeyUnlocked(true);
            setTimeout(() => {
                setPrivateKeyUnlocked(false);
            }, 10000);
        } catch (error) {
            return;
        }
    }



    return (
        <div className='address-container'>
            <div className='address-command-container'>
                <img src="chart.png" className='address-img' alt="" title='Show Transaction chart' onClick={() => {setChartShow(!chartShow); setTransForm(!transForm); setSendingForm(false);}} />
                <img src="key.png" className='address-img' alt="" title='Show Private key' onClick={() => setShowPrivateKey(!showPrivateKey)}/>
            </div>
            
            {!chartShow ? <div className='address-card'>
                <div id='name-container'>
                    <b>{name}</b>
                </div>
                <div>Balance {balance} ETH <span id="date-form">{parseFloat(balance*dollar).toFixed(2)}$</span></div>
                <div id='addresse-container'>
                    <div id='address'>Address: {address}</div>
                    <img className='address-img' src="copy.png" title='Copy Address' alt="" onClick={() => navigator.clipboard.writeText(address)}/>
                </div>
                <div id='private-key-container'>
                    {showPrivateKey ?
                        !privateKeyUnlocked 
                        ? <div className='form-inputs'>
                            <input className='form-input' id='privateKey-input' type="password" placeholder='Enter code to get private key' onChange={(e) => setPassword(e.target.value)}/>
                            <button className='form-button' onClick={handleGetPrivateKey}>Get Private Key</button>
                        </div>
                        : <div id='addresse-container'>
                            <div id='address'>Private key: {privateKey}</div>
                            <img className='address-img' src="copy.png" title='Copy Private Key' alt="" onClick={() => navigator.clipboard.writeText(privateKey)}/>
                        </div>
                        :
                        <></>
                    }
                </div>
                <div className="form-buttons">
                    <button className='form-button' onClick={() => {setSendingForm(!sendingForm); setTransForm(false)}}>Send ETH</button>
                    <button className='form-button' onClick={() => {setTransForm(!transForm); setSendingForm(false)}}>View history</button>
                </div>
            </div>
            : chartShow && <TransactionChart transactions={transactions} balance={balance} address={address} />}

            {sendingForm && <SendingForm 
                address={address} 
                balance={balance}
                setBalanceChange={setBalanceChange} 
                balanceChange={balanceChange}
                transactions={transactionsFromAccount(address)}
                dollar={dollar}
            />}

            {transForm && <div className='transaction-container'>
                {transactionsFromAccount(address).length === 0 && <div>No transactions yet!</div>}
                {transactions.map((transaction, index) => {
                    if (transaction.sender_address === address || transaction.receiver_address === address) {
                        return (
                            <TransactionCard 
                            key={index} 
                            transaction={transaction} 
                            address={address}/>
                        )
                    }
                })}
            </div>}
        </div>
    );
};

AddressCard.propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    transactions: PropTypes.array.isRequired,
    setBalanceChange: PropTypes.func.isRequired,
    balanceChange: PropTypes.bool.isRequired,
    dollar: PropTypes.number,
    web3: PropTypes.instanceOf(Web3).isRequired
};

export default AddressCard