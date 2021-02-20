import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Context } from '../../../../context.js'
import './signup.css';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            email: "",
            password: "",
            confirm_password: "",
            password_error: "",
            email_exists_msg: "",
            go_to_myaccount: false
        }
    }

    static contextType = Context;

    signup = () => {
        const name = this.state.name;
        const email = this.state.email;
        const password = this.state.password;
        const confirm_password = this.state.confirm_password;

        if( password !== confirm_password ){
            this.setState({"password_error": "Make sure the passwords match."});
            return;
        }

        fetch(this.context[5]+"/signup?name="+name+"&email="+email+"&password="+password+"&confirm_password="+confirm_password )
        .then(res => res.json())
        .then(body => (body.response_msg === "posted" ? this.goToMyAccount(body.email, body.id) : body.response_msg === "Email is already being used!"? this.setState({ email_exists_msg: body.response_msg }): console.log("Error!")))
        .catch(e => console.log(e));
    }


    goToMyAccount = (email, id) => {
        localStorage.setItem("flashcards_stdtkto_active", true);
        localStorage.setItem("flashcards_stdtkto_email", email);
        localStorage.setItem("flashcards_stdtkto_id", id);
        localStorage.setItem("flashcards_stdtkto_flashcard_sets_bought", []);
        this.context[1](true);
        //send email
        fetch(this.context[5]+"/signup_confirmation_email?email="+this.state.email)
        .then(res => res.json())
        .then(body => (body.response_msg === "success" ? this.setState({ go_to_myaccount: true}) : body.response_msg === "Email is already being used!"? this.setState({ email_exists_msg: body.response_msg }): console.log("Error!")))
        .catch(e => console.log(e));
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }

    
    render() { 
        if( this.state.go_to_myaccount ){
            return (
                <Redirect to={{
                    pathname: "/myaccount",
                    state: {}
                }} 
                />
            );
        }else{
            return ( 
                <div className="body_signup">
                    <div className="body_signup_heading">
                        Sign up
                    </div>
                    <div className="body_signup_form">
                        <form onSubmit={this.signin}>
                            First Name<br />
                            <input onChange={this.setInput} type="text" id="first_name" placeholder="Alex" /><br />
                            Last Name<br />
                            <input onChange={this.setInput} type="text" id="last_name" placeholder="Tracey" /><br />
                            Email<br />
                            <div className="error_msg">
                            { this.state.email_exists_msg }
                            </div>
                            <input onChange={this.setInput} type="email" id="email" placeholder="example@example.com" /><br />
                            Password<br />
                            <div className="error_msg">
                            { this.state.password_error }
                            </div>
                            <input onChange={this.setInput} type="password" id="password" placeholder="password" /><br />
                            Confirm Password<br />
                            <input onChange={this.setInput} type="password" id="confirm_password" placeholder="password" /><br />
                            Street Address 1<br />
                            <input onChange={this.setInput} type="text" id="address_1" placeholder="Adress 1" /><br />
                            Street Address 2<br />
                            <input onChange={this.setInput} type="text" id="address_2" placeholder="Adress 2" /><br />
                            City<br />
                            <input onChange={this.setInput} type="text" id="city" placeholder="City" /><br />
                            Country<br />
                            <input onChange={this.setInput} type="text" id="country" placeholder="Country" /><br />
                            <div className="body_signup_terms">
                                <div>By signing up you agree to our <Link to="./terms">Terms of Use</Link> and <Link to="./privacy">Privacy Policies</Link></div>
                            </div>
                            <div onClick={this.signup} className="body_signup_btn">
                                Sign Up
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}
 
export default Signup;