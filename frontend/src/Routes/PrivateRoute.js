import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEth } from "../contexts/EthContext";
const PrivateRoute = ({ component: Component, ...rest }) => {
    const { state, dispatch } = useEth();

    let isLogged = state.userState && state.userState.isLoggedIn;
    return (
        <Route
            {...rest}
            render={(props) =>
                isLogged ? <Component {...props} /> : <Redirect to="/" />
            }
        />
    );
};

export default PrivateRoute;
