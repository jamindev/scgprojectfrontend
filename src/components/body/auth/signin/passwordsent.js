import React, { Component } from 'react';
import {Context} from '../../../../context.js';

class PasswordSent extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: ""
        }
    }
    
    static contextType = Context;

    render() { 
        return ( 
            <div className="body_signin">
                <div className="body_signin_heading">Your password was sent to your email!</div>
                <div>Check your email, {this.props.location.state.email}. Your password was sent to you. If you cannot find it in your Inbox, check your Spam/Junk Mail.</div>
            </div>
        );
    }
}
 
export default PasswordSent;