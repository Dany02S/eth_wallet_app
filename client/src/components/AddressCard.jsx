import PropTypes from 'prop-types';
import '../styles/AddressCard.css';

const AddressCard = ({ address, name, balance }) => {
    return (
        <div className='address-container'>
            <div>
                <div>{name}</div>
                <div id='address'>{address}</div>
            </div>
            <>{parseFloat(balance).toFixed(6)} ETH</>
            <button className='form-button'>Details</button>
        </div>
    );
};

AddressCard.propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
};

export default AddressCard;