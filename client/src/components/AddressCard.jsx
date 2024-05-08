import PropTypes from 'prop-types';
import '../styles/AddressCard.css';
import { useState } from 'react';
import SendingForm from './SendingForm';

const AddressCard = ({ address, name, balance, setBalances, key, transactions}) => {
    const [sendingForm, setSendingForm] = useState(false);
    return (
        <div className='address-container'>
            <div className='address-card'>
                <div>
                    <div>{name}</div>
                    <div id='address'>{address}</div>
                </div>
                <div>Balance {parseFloat(balance).toFixed(6)} ETH</div>
                <button className='form-button' onClick={() => setSendingForm(!sendingForm)}>Transaction</button>
            </div>
            {sendingForm && <SendingForm address={address} balance={parseFloat(balance).toFixed(6)} setBalances={setBalances} key={key} transactions={transactions} />}
        </div>
    );
};

AddressCard.propTypes = {
    key: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
    setBalances: PropTypes.func.isRequired,
    transactions: PropTypes.array.isRequired
};

export default AddressCard;