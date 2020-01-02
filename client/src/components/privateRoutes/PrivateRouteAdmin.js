import React from "react";
import API from "../../utils/API.js";
import { Route, Redirect } from "react-router-dom";

//composant fonctionnel qui prends en argument des props de la forme { component: Component, ...rest } où ...rest désigne le reste props passées
//on passe les autres props (celles autres que component) dans ...rest
export const PrivateRouteAdmin = ({ component: Component, ...rest }) => (  
  <Route
    {...rest}       
    render={(props) => {
      if (API.isAuth() === false) {
        return <Redirect to="/" />;
      } if (!API.isAdmin()) {
        return <Redirect to="/dashboard" />;
      } else {
        return <Component {...props} />;
      } 
    }
    }   
  />
);

//Route permet les "redirections" côté client