import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../../../context.js'
import './signin.css';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            password: "",
            signin_error_msg: "",
            go_to_dashboard: false
        }
    }


    static contextType = Context;

    componentDidMount = () => {
        
    }


    signin = () => {
        const email = this.state.email;
        const password = this.state.password;

        axios.get(this.context[5]+"/signin.php?signin=true&email="+email+"&password="+password)
        .then(body => (body.data.response === "success" ? this.goToDashboard(body.data.email, body.data.id) : this.setState({ signin_error_msg: "Wrong username or password!" }) ))
        .catch(e => console.log(e));
    
    }


    goToDashboard = (email, id) => {
        localStorage.setItem("scgproject_stdtkto_active", true);
        localStorage.setItem("scgproject_stdtkto_email", email);
        localStorage.setItem("scgproject_stdtkto_id", id);
        this.context[1](true);
        this.setState({ go_to_dashboard: true });
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }


    render() { 
        if( this.state.go_to_dashboard ){
            return (
                <Redirect to={{
                    pathname: "/dashboard",
                    state: {}
                }} 
                />
            );
        }else{
        return ( 
            <div className="body_signin">
                <div className="body_signin_heading">
                    Sign In
                </div>
                <div className="body_signin_form">
                    <div className="error_msg">
                        { this.state.signin_error_msg }
                    </div>
                    <form onSubmit={this.signin}>
                        Email<br />
                        <input onChange={this.setInput} type="email" id="email" placeholder="example@example.com" /><br />
                        Password<br />
                        <input onChange={this.setInput} type="password" id="password" placeholder="password" /><br />
                        <br />
                        <div onClick={this.signin} className="body_signin_btn">
                            Sign In
                        </div>
                    </form>
                    <div className="body_signin_other_options">
                        <Link to="./signup">Create Account</Link>
                        <Link to="./forgotpassword">Fotgot Password</Link>        
                    </div>
                </div>
            </div>
        );
        }
    }
}
 
export default Signin;