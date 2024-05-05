import '../styles/AddressCard.css';



const AddressCard = ({ address, balance }) => {
    
    

    return (
        <div className='address-container'>
            <div>
                <div>{address.name}</div>
                <div id='address'>{address.address}</div>
            </div>
            <>{parseFloat(balance).toFixed(6)} ETH</>
            <button className='form-button'>Details</button>
        </div>
    );
};

export default AddressCard;