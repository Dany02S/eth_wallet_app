import PropTypes from 'prop-types';

const BalanceInfo = ({ user, totalBalance, dollar, navigate }) => {
    
    return (
        <>
            <h1 className="user-data-show">Welcome {user?.first_name} {user?.last_name}</h1>
            <h2 className="user-data-show">{parseFloat(totalBalance).toFixed(6)} ETH</h2>
            <h3 className="user-data-show" id="real-price">{parseFloat(dollar*totalBalance).toFixed(2)}$</h3>
            <div className="form-buttons">
            <button className="form-button" onClick={() => navigate("/create-account")}>Create new account</button>
            </div>
        </>
    );
}

BalanceInfo.propTypes = {
    user: PropTypes.object,
    totalBalance: PropTypes.number,
    dollar: PropTypes.number,
    navigate: PropTypes.func
}


export default BalanceInfo;