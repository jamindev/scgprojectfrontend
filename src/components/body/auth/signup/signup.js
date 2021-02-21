import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Context } from '../../../../context.js'
import './signup.css';
var jsondata = require('./address.json');

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
            gender: "",
            date_of_birth: "",
            address_1: "",
            address_2: "",
            city: "",
            password_error: "",
            email_exists_msg: "",
            go_to_myaccount: false,
            countries: jsondata,
            states_or_regions: [],
            country: "",
            state_or_region: "",
        }
    }

    static contextType = Context;

    signup = () => {
        const first_name = this.state.name;
        const last_name = this.state.name;
        const email = this.state.email;
        const password = this.state.password;
        const confirm_password = this.state.confirm_password;
        const gender = this.state.gender;
        const date_of_birth = this.state.date_of_birth;
        const address_1 = this.state.address_1;
        const address_2 = this.state.address_2;
        const city = this.state.city;
        const country = this.state.country;
        const state_or_region = this.state.state_or_region;

        if( password !== confirm_password ){
            this.setState({"password_error": "Make sure the passwords match."});
            return;
        }

        let data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            gender: gender,
            date_of_birth: date_of_birth,
            address_1: address_1,
            address_2: address_2,
            city: city,
            country: country,
            state_or_region: state_or_region
        };
            
        fetch(this.context[5], {
            method: 'POST',
            body: JSON.stringify(data),
            //mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(body => (body.response === "posted" ? this.goToDashboard(body.email, body.id) : body.response === "Email is already being used!"? this.setState({ email_exists_msg: body.response }): console.log(JSON.stringify(body))))
        .catch(e => console.log(e));
    }


    goToDashboard = (email, id) => {
        localStorage.setItem("scgproject_stdtkto_active", true);
        localStorage.setItem("scgproject_stdtkto_email", email);
        localStorage.setItem("scgproject_stdtkto_id", id);
        this.context[1](true);
        console.log(email+" was successfully registered");
        //send email
        // fetch(this.context[5]+"/signup_confirmation_email?email="+this.state.email)
        // .then(res => res.json())
        // .then(body => (body.response_msg === "success" ? this.setState({ go_to_myaccount: true}) : body.response_msg === "Email is already being used!"? this.setState({ email_exists_msg: body.response_msg }): console.log("Error!")))
        // .catch(e => console.log(e));
    }

    
    setStateOrRegion = (event) => {
        let country = event.target.value;
        
        let countries = this.state.countries;
        for( let i = 0; i < countries.length; i++ ){
            if( countries[i].name === country ){
                this.setState({ states_or_regions: countries[i].states })
            }
        }
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
                    <form onSubmit={this.signin}>
                        <div className="body_signup_form">
                            <div className="body_signup_form1">
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
                                Gender<br />
                                <select id="gender" onChange={e => {this.setStateOrRegion(e); this.setInput(e)} }>
                                    <option></option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                                Date of Birth<br />
                                <input onChange={this.setInput} type="date" id="date_of_birth" placeholder="Date of Birth" /><br />              
                            </div>
                            
                            <div className="body_signup_form2">
                                Street Address 1<br />
                                <input onChange={this.setInput} type="text" id="address_1" placeholder="Adress 1" /><br />
                                Street Address 2<br />
                                <input onChange={this.setInput} type="text" id="address_2" placeholder="Adress 2" /><br />
                                City<br />
                                <input onChange={this.setInput} type="text" id="city" placeholder="City" /><br />
                                Country<br />
                                <select id="country" onChange={e => {this.setStateOrRegion(e); this.setInput(e)} }>
                                    <option>Country</option>
                                    {this.state.countries.map((elem, index) => (
                                        <option key={index}>{elem.name}</option>
                                    ))}
                                </select>
                                State or Region<br />
                                <select id="state_or_region" onChange={e => {this.setStateOrRegion(e); this.setInput(e)} }>
                                    <option>State or Region</option>
                                    {this.state.states_or_regions.map((elem, index) => (
                                        <option key={index}>{elem.name}</option>
                                    ))}
                                </select>
                                <div className="body_signup_terms">
                                    <div>By signing up you agree to our <Link to="./terms">Terms of Use</Link> and <Link to="./privacy">Privacy Policies</Link></div>
                                </div>
                                <div onClick={this.signup} className="body_signup_btn">
                                    Sign Up
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
    }
}
 
export default Signup;