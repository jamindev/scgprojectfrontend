import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {Context} from '../../../../context.js';

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            passwordsent: false
        }
    }

    static contextType = Context;

    sendPassword = () => {
        const email = this.state.email;

        fetch(this.context[5]+"/sendpassword?email="+email)
        .then(res => res.json())
        .then(body => (body.response_msg === "success" ? this.setState({ passwordsent: true }) : body.response_msg === "invalid credentials" ? this.setState({ signin_error_msg: "This email does not exist in our system!" }): console.log("Error!")))
        .catch(e => console.log(e));
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }


    render() { 
        if( this.state.passwordsent ){
            return (
                <Redirect to={{
                    pathname: "/passwordsent",
                    state: {
                        "email": this.state.email
                    }
                }}
                />
            )
        }else{
            return ( 
                <div className="body_signin">
                    <div className="body_signin_heading">
                        Password Recovery
                    </div>
                    <div className="body_signin_form">
                        <div className="error_msg">
                            { this.state.signin_error_msg }
                        </div>
                        <form onSubmit={this.sendPassword}>
                            Email<br />
                            <input onChange={this.setInput} type="email" id="email" placeholder="example@example.com" /><br />
                            <br />
                            <div onClick={this.sendPassword} className="body_signin_btn">
                                Send Password
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}
 
export default ForgotPassword;