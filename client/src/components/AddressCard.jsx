import PropTypes from 'prop-types';
import '../styles/AddressCard.css';
import { useState } from 'react';
import SendingForm from './SendingForm';

const AddressCard = ({ address, name, balance }) => {
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
            {sendingForm && <SendingForm address={address} balance={parseFloat(balance).toFixed(6)} />}

        </div>
    );
};

AddressCard.propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
};

export default AddressCard;