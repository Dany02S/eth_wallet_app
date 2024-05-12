import '../styles/TransactionCard.css'
import PropTypes from 'prop-types';

function TransactionCard({ transaction, index, address }) {
    function convertDateFormat(dateStr) {
        const date = new Date(dateStr);
    
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month because it's zero-based
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
    
        return `${year}.${month}.${day} ${hours}.${minutes}`;
    }
    return (
        <div key={index} className="transaction-card">
            <div id='date-form'>{convertDateFormat(transaction.created_at)}</div>
            <div className='transaction-info'>
                <p id='sending-form'>Sender: {transaction.sender_address}<br/>  Reciever:{transaction.receiver_address}</p>
                <img src={transaction.sender_address === address ? '/down.png' : '/up.png'} alt='transaction'/>
                <p id='amount-form'>{transaction.amount} ETH</p>
            </div>
        </div>
    )
}

TransactionCard.propTypes = {
    index: PropTypes.number.isRequired,
    transaction: PropTypes.object.isRequired,
    address: PropTypes.string.isRequired,
};

export default TransactionCard;