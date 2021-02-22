import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Context } from '../../../../context.js'
import './signin.css';

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            password: "",
            signin_error_msg: "",
            go_to_myaccount: false
        }
    }


    static contextType = Context;

    componentDidMount = () => {
        fetch(this.context[5]+"?msg=hello")
        .then(res => res.json())
        .then(body => (body ? this.setState({ signin_error_msg: body.message1}) : this.setState({ signin_error_msg: "Wrong username or password!" }) ))
        .catch(e => {
            this.setState({ signin_error_msg: "Wrong username or password!" }) 
            console.log(e);
        });
    }


    signin = () => {
        const email = this.state.email;
        const password = this.state.password;

        fetch(this.context[5]+"/signin.php?signin=true&email="+email+"&password="+password)
        .then(res => res.json())
        .then(body => (body.response === "success" ? this.goToMyAccount(body.email, body.student_id, body.flashcard_sets_bought) : this.setState({ signin_error_msg: "Wrong username or password!" }) ))
        .catch(e => {
            this.setState({ signin_error_msg: "Wrong username or password!" }) 
            console.log(e);
        });
    }


    goToMyAccount = (email, id, flashcard_sets_bought) => {
        localStorage.setItem("flashcards_stdtkto_active", true);
        localStorage.setItem("flashcards_stdtkto_email", email);
        localStorage.setItem("flashcards_stdtkto_id", id);
        localStorage.setItem("flashcards_stdtkto_flashcard_sets_bought", flashcard_sets_bought);
        this.context[1](true);
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