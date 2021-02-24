import React, { createContext, useState } from 'react';

export const Context = createContext();

export const Provider = props => { 
    let [signed_in, setSignedin] = useState(localStorage.getItem("scgproject_stdtkto_active") === "true"); 
    let [sets_in_cart, updatecart] = useState(0); 
         
    let data = {
        signed_in: (localStorage.getItem("scgproject_stdtkto_active") === "true"), 
        stay: localStorage.getItem("scgproject_stdtkto_active"),
        id: localStorage.getItem("scgproject_stdtkto_id"),
        email: localStorage.getItem("scgproject_stdtkto_email")            
    };
    
    //let api_endpoint = "";
    let api_endpoint = "http://scgprojectapi-env.eba-tt9fpraf.us-east-1.elasticbeanstalk.com";

    function setSignedIn(status) {
        setSignedin(status);
    }

    function updateCart(sets_in_cart){
        updatecart(sets_in_cart);
    }

    return (
        <Context.Provider value={[
            data.signed_in, 
            setSignedIn, 
            signed_in, 
            updateCart, 
            sets_in_cart,
            api_endpoint]} >
            {props.children}
        </Context.Provider>
    );

}