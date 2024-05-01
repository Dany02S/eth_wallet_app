import {createContext, useReducer} from 'react';
import PropTypes from 'prop-types';
import {authReducer} from '../context/authReducer';
export const AuthContext = createContext();


AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const AuthProvider = ({children}) => {
    const [authState, dispatch] = useReducer(authReducer, {
        isAuthenticated: false,
        user: null,
        token: null,
    });

    console.log(authState);

    return (
        <AuthContext.Provider value={{authState, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}