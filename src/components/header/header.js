import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Context} from '../../context.js';
import './header.css';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            signed_ina: false,
            app: "hello"
        }
    }

    static contextType = Context;

    componentDidMount = () => {
        this.setState({ signed_ina: this.context[2] });
        if(localStorage.getItem("flashcards_stdtkto_email") !== null ){
            if(localStorage.getItem("flashcards_stdtkto_email").length > 0 ){
                this.refreshCart();
            }
        }else{
            this.context[3](0);
        }
    }


    refreshCart = () => {
        let email = localStorage.getItem("flashcards_stdtkto_email");       
        let id = localStorage.getItem("flashcards_stdtkto_id");
        if( !email || !id ){
            email = id = "";
        }
        fetch(this.context[5]+"/sets_id_cart?email="+email+"&id="+id)
        .then(res => res.json())
        .then(body => (body ? (body.response_msg === "posted" ? this.setCart(body) : console.log( "could not refresh cart" )): console.log("returned null "+body)))
        .catch(e => console.log(e));
    }

    setCart = (sets) => {
        localStorage.setItem("flashcards_stdtkto_sets_in_cart", JSON.stringify(sets.returned_sets[0].cart));
        if( sets.returned_sets[0].cart ){
            this.context[3](sets.returned_sets[0].cart.length);
        }else{
            this.context[3](0);
        }
    }


    signOut = () => {
        this.context[1](false);
        localStorage.setItem("flashcards_stdtkto_active", false);
        localStorage.setItem("flashcards_stdtkto_id", "");
        localStorage.setItem("flashcards_stdtkto_email", "");  
        localStorage.setItem("flashcards_stdtkto_flashcard_sets_bought", []);
        localStorage.setItem("flashcards_stdtkto_sets_in_cart", 0);
        this.setState({ signed_ina: false });     
        window.location.href = "/";
    }


    render() { 
        if( this.context[2] ){
            return ( 
                <div className="header_container">
                <div className="header_left">
                    <Link to="/">
                        SCG Project
                    </Link>
                </div>
                <div className="header_middle">       
                    
                </div>
                <div className="header_right">
                    <div className="header_myaccount"><Link to="/dashboard" >Dashboard</Link></div>
                    <div onClick={this.signOut} className="header_signout">Sign out</div>
                </div>
                </div>
            );
        }else{
            return ( 
                <div className="header_container">
                <div className="header_left">
                    <Link to="/">
                        SCG Project
                    </Link>
                </div>
                <div className="header_middle">

                </div>
                <div className="header_right">
                    <Link to="/signin" >Sign in</Link>
                    <Link to="/signup" >Sign up</Link>
                </div>
                </div>
            );
        }
    }
}
 
export default Header;