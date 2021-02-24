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
        if(localStorage.getItem("scgproject_stdtkto_email") !== null ){
            
        }else{
            this.context[3](0);
        }
    }


    signOut = () => {
        this.context[1](false);
        localStorage.setItem("scgproject_stdtkto_active", false);
        localStorage.setItem("scgproject_stdtkto_id", "");
        localStorage.setItem("scgproject_stdtkto_email", "");  
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
                    <Link to="/" >Sign in</Link>
                    <Link to="/signup" >Sign up</Link>
                </div>
                </div>
            );
        }
    }
}
 
export default Header;